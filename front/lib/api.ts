import {
  transformPatient,
  transformRendezVous,
  transformFacture,
  transformDossierMedical,
  transformConsultation,
  transformPatientToBackend,
  transformRendezVousToBackend,
  transformFactureToBackend,
  transformDossierMedicalToBackend,
} from "./transformers"

const API_BASE_URL = "http://localhost:8080"

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }


  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }
      throw new Error("Non autorisé")
    }

    if (response.status === 403) {
      throw new Error("Accès interdit")
    }

    const contentType = response.headers.get("content-type") || ""
    const text = await response.text()
    if (response.status === 204 || text.trim() === "") {
  return undefined as unknown as T
}

    if (!response.ok) {
      let message = "Erreur serveur"
      if (contentType.includes("application/json")) {
        try {
          const obj = JSON.parse(text)
          message = obj?.message || obj?.error || message
        } catch {}
      } else if (text) {
        message = text.slice(0, 400)
      }
      throw new Error(message)
    }

    if (!contentType.includes("application/json")) {
      throw new Error(`Réponse non-JSON (${contentType}): ${text.slice(0, 200)}`)
    }

    try {
      return JSON.parse(text) as T
    } catch {
      throw new Error(`JSON invalide: ${text.slice(0, 200)}`)
    }
  }
  // Auth
  async login(login: string, pwd: string) {
    const response = await this.request<{
      token: string
      login: string
      role: string
      userId: number
      cabinetId: number | null
      nom: string
      prenom: string
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ login, pwd }),
    })

    // Transform backend response to frontend format
    return {
      token: response.token,
      user: {
        id: response.userId,
        login: response.login,
        nom: response.nom,
        prenom: response.prenom,
        email: "", // Backend doesn't return email
        role: response.role as import("@/types").UserRole,
        cabinetId: response.cabinetId || undefined,
        actif: true,
      },
    }
  }

  // Doctor endpoints
  async getMedecinDashboard(cabinetId: number, medecinId: number) {
    return this.request<import("@/types").DashboardStats>(
      `/api/medecin/dashboard?cabinetId=${cabinetId}&medecinId=${medecinId}`,
    )
  }

  async getRendezVousAujourdhui() {
    const data = await this.request<any[]>(`/api/medecin/rendez-vous/aujourdhui`)
    return data.map(transformRendezVous)
  }

  async getPatientEnCours(medecinId: number) {
    try {
      // L'endpoint utilise maintenant Authentication, pas besoin de medecinId en paramètre
      const data = await this.request<{ patientEnCours: any | null; rendezVous: any | null }>(
        `/api/notifications/patient-en-cours`,
      )
      return data.patientEnCours ? transformPatient(data.patientEnCours) : null
    } catch (error) {
      console.error("Error getting patient en cours:", error)
      return null
    }
  }

  async searchPatientsMedecin(cabinetId: number, search: string) {
    const data = await this.request<any[]>(
      `/api/medecin/patients/search?cabinetId=${cabinetId}&search=${encodeURIComponent(search)}`,
    )
    return data.map(transformPatient)
  }

  async getPatient(id: number) {
    const data = await this.request<any>(`/api/medecin/patients/${id}`)
    return transformPatient(data)
  }

  async getDossierMedical(patientId: number) {
    const data = await this.request<any>(`/api/medecin/patients/${patientId}/dossier`)
    return transformDossierMedical(data)
  }

  async updateDossierMedical(patientId: number, data: Partial<import("@/types").DossierMedical>) {
    const backendData = transformDossierMedicalToBackend(data)
    const response = await this.request<any>(`/api/medecin/patients/${patientId}/dossier`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })
    return transformDossierMedical(response)
  }

  async getConsultationsPatient(patientId: number) {
    const data = await this.request<any[]>(`/api/medecin/patients/${patientId}/consultations`)
    return data.map(transformConsultation)
  }

  async createConsultation(data: Partial<import("@/types").Consultation>) {
    // Backend expects patientId, medecinId, rendezVousId as query params
    const { patientId, medecinId, rendezVousId, ...consultationData } = data as any
    const queryParams = new URLSearchParams()
    if (patientId) queryParams.append("patientId", patientId.toString())
    if (medecinId) queryParams.append("medecinId", medecinId.toString())
    if (rendezVousId) queryParams.append("rendezVousId", rendezVousId.toString())

    const response = await this.request<any>(`/api/medecin/consultations?${queryParams.toString()}`, {
      method: "POST",
      body: JSON.stringify(consultationData),
    })
    return transformConsultation(response)
  }

  // Secretary endpoints
  async getPatients(cabinetId: number) {
    const data = await this.request<any[]>(`/api/secretaire/patients?cabinetId=${cabinetId}`)
    return data.map(transformPatient)
  }

  async searchPatientsSecretaire(cabinetId: number, search: string) {
    const data = await this.request<any[]>(
      `/api/secretaire/patients/search?cabinetId=${cabinetId}&search=${encodeURIComponent(search)}`,
    )
    return data.map(transformPatient)
  }

  async createPatient(cabinetId: number, data: Partial<import("@/types").Patient>) {
    const backendData = transformPatientToBackend(data)
    const response = await this.request<any>(`/api/secretaire/patients?cabinetId=${cabinetId}`, {
      method: "POST",
      body: JSON.stringify(backendData),
    })
    return transformPatient(response)
  }

  async updatePatient(id: number, data: Partial<import("@/types").Patient>) {
    const backendData = transformPatientToBackend(data)
    const response = await this.request<any>(`/api/secretaire/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })
    return transformPatient(response)
  }

  async deletePatient(id: number) {
    return this.request<void>(`/api/secretaire/patients/${id}`, { method: "DELETE" })
  }

  async sendPatientToMedecin(patientId: number, medecinId: number) {
    return this.request<void>(`/api/secretaire/patients/${patientId}/envoyer?medecinId=${medecinId}`, {
      method: "POST",
    })
  }

  async getRendezVous(cabinetId: number) {
    const data = await this.request<any[]>(`/api/secretaire/rendez-vous?cabinetId=${cabinetId}`)
    return data.map(transformRendezVous)
  }

  async createRendezVous(data: Partial<import("@/types").RendezVous>) {
    // Backend expects patientId, medecinId, cabinetId as query params

    const isDefined = (v: any) => v !== undefined && v !== null && v !== ""

    const { patientId, medecinId, cabinetId, ...rdvData } = data as any
    const backendData = transformRendezVousToBackend(rdvData)
    const queryParams = new URLSearchParams()

    if (isDefined(patientId)) queryParams.append("patientId", String(patientId))
    if (isDefined(medecinId)) queryParams.append("medecinId", String(medecinId))
    if (isDefined(cabinetId)) queryParams.append("cabinetId", String(cabinetId))
    if (!isDefined(patientId) || !isDefined(medecinId) || !isDefined(cabinetId)) {
        throw new Error("patientId / medecinId / cabinetId manquant")
      }
    const response = await this.request<any>(`/api/secretaire/rendez-vous?${queryParams.toString()}`, {
      method: "POST",
      body: JSON.stringify(backendData),
    })
    return transformRendezVous(response)
  }

  async updateRendezVous(id: number, data: Partial<import("@/types").RendezVous>) {
    const backendData = transformRendezVousToBackend(data)
    const response = await this.request<any>(`/api/secretaire/rendez-vous/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })
    return transformRendezVous(response)
  }

  async updateRendezVousStatut(id: number, statut: import("@/types").RendezVousStatut) {
    const response = await this.request<any>(`/api/secretaire/rendez-vous/${id}/statut?statut=${statut}`, {
      method: "PUT",
    })
    return transformRendezVous(response)
  }

  async getFactures(cabinetId: number) {
    const data = await this.request<any[]>(`/api/secretaire/factures?cabinetId=${cabinetId}`)
    return data.map(transformFacture)
  }

  async createFacture(data: Partial<import("@/types").Facture>) {
    // Backend expects patientId, cabinetId, consultationId as query params
    const { patientId, cabinetId, consultationId, ...factureData } = data as any
    const backendData = transformFactureToBackend(factureData)
    const queryParams = new URLSearchParams()
    if (patientId) queryParams.append("patientId", patientId.toString())
    if (cabinetId) queryParams.append("cabinetId", cabinetId.toString())
    if (consultationId) queryParams.append("consultationId", consultationId.toString())

    const response = await this.request<any>(`/api/secretaire/factures?${queryParams.toString()}`, {
      method: "POST",
      body: JSON.stringify(backendData),
    })
    return transformFacture(response)
  }

  async updateFactureStatut(id: number, statut: import("@/types").FactureStatut) {
    // Map frontend statut to backend statut
    const backendStatut = statut === "EN_ATTENTE" ? "NON_PAYEE" : statut === "ANNULEE" ? "NON_PAYEE" : statut
    const response = await this.request<any>(`/api/secretaire/factures/${id}/statut?statut=${backendStatut}`, {
      method: "PUT",
    })
    return transformFacture(response)
  }

  // Admin endpoints
  async getCabinets() {
    const cabinets = await this.request<any[]>("/api/admin/cabinets")
    // Transformer tel -> telephone pour le frontend
    return cabinets.map((cab) => ({
      ...cab,
      telephone: cab.tel || cab.telephone || "",
    }))
  }

  async createCabinet(data: Partial<import("@/types").Cabinet>) {
    // Transformer telephone -> tel pour le backend
    const backendData: any = { ...data }
    if (backendData.telephone) {
      backendData.tel = backendData.telephone
      delete backendData.telephone
    }
    const response = await this.request<any>("/api/admin/cabinets", {
      method: "POST",
      body: JSON.stringify(backendData),
    })
    // Transformer la réponse
    return {
      ...response,
      telephone: response.tel || response.telephone || "",
    }
  }

  async updateCabinet(id: number, data: Partial<import("@/types").Cabinet>) {
    // Transformer telephone -> tel pour le backend
    const backendData: any = { ...data }
    if (backendData.telephone) {
      backendData.tel = backendData.telephone
      delete backendData.telephone
    }
    const response = await this.request<any>(`/api/admin/cabinets/${id}`, {
      method: "PUT",
      body: JSON.stringify(backendData),
    })
    // Transformer la réponse
    return {
      ...response,
      telephone: response.tel || response.telephone || "",
    }
  }

  async toggleCabinet(id: number) {
    return this.request<import("@/types").Cabinet>(`/api/admin/cabinets/${id}/toggle`, {
      method: "PUT",
    })
  }

  async deleteCabinet(id: number) {
    return this.request<void>(`/api/admin/cabinets/${id}`, { method: "DELETE" })
  }

  // Récupérer son propre cabinet (pour médecins et secrétaires)
  async getMyCabinet() {
    try {
      const response = await this.request<any>("/api/users/me/cabinet")
      if (!response) return null
      return {
        ...response,
        telephone: response.tel || response.telephone || "",
        logo: response.logo || null,
        nom: response.nom || "",
      }
    } catch (error) {
      console.error("Error getting my cabinet:", error)
      return null
    }
  }

  // Gestion des utilisateurs
  async getUtilisateursByCabinet(cabinetId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/cabinets/${cabinetId}/utilisateurs`, {
        headers: {
          "Content-Type": "application/json",
          ...(this.getToken() ? { Authorization: `Bearer ${this.getToken()}` } : {}),
        },
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || "Erreur lors de la récupération des utilisateurs")
      }

      const text = await response.text()
      if (!text || text.trim() === "") {
        return []
      }

      // Parser le JSON en gérant les cas où le cabinet complet est retourné
      let users: any[]
      try {
        users = JSON.parse(text)
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError, "Text length:", text.length)
        // Si le JSON est trop gros, essayer de parser en excluant le logo
        throw new Error("Réponse trop volumineuse. Veuillez redémarrer le backend.")
      }

      // Transformer les données backend vers format frontend
      return users.map((u: any) => ({
        id: u.id,
        login: u.login,
        nom: u.nom,
        prenom: u.prenom,
        email: "", // Pas de champ email dans Utilisateur
        telephone: u.numTel || "",
        role: u.role as import("@/types").UserRole,
        cabinetId: u.cabinetId || u.cabinet?.id || cabinetId,
        signature: u.signature || "",
        actif: true, // Par défaut actif (pas de champ actif dans Utilisateur)
      }))
    } catch (error: any) {
      console.error("Error fetching utilisateurs:", error)
      throw error
    }
  }

  async createUtilisateur(cabinetId: number, data: Partial<import("@/types").User>) {
    // Validation : le mot de passe est obligatoire pour la création
    if (!data.pwd || typeof data.pwd !== 'string' || data.pwd.trim().length === 0) {
      throw new Error("Le mot de passe est obligatoire")
    }

    const password = data.pwd.trim()

    const response = await this.request<any>(`/api/admin/cabinets/${cabinetId}/utilisateurs`, {
      method: "POST",
      body: JSON.stringify({
        login: data.login,
        pwd: password,
        nom: data.nom,
        prenom: data.prenom,
        numTel: data.telephone || "",
        role: data.role,
        signature: data.signature || "",
      }),
    })
    return {
      ...response,
      telephone: response.numTel || "",
      cabinetId: cabinetId,
    }
  }

  async updateUtilisateur(cabinetId: number, userId: number, data: Partial<import("@/types").User>) {
    const response = await this.request<any>(`/api/admin/cabinets/${cabinetId}/utilisateurs/${userId}`, {
      method: "PUT",
      body: JSON.stringify({
        nom: data.nom,
        prenom: data.prenom,
        numTel: data.telephone || "",
        role: data.role,
        signature: data.signature || "",
        pwd: data.pwd || undefined, // Ne pas envoyer si vide
      }),
    })
    return {
      ...response,
      telephone: response.numTel || "",
      cabinetId: cabinetId,
    }
  }

  async deleteUtilisateur(cabinetId: number, userId: number) {
    return this.request<void>(`/api/admin/cabinets/${cabinetId}/utilisateurs/${userId}`, {
      method: "DELETE",
    })
  }

  async getMedicaments() {
    return this.request<import("@/types").Medicament[]>("/api/admin/medicaments")
  }

  async searchMedicaments(search: string) {
    // Backend has both /api/medicaments/search (public) and /api/admin/medicaments/search
    // Using public endpoint for search
    return this.request<import("@/types").Medicament[]>(`/api/medicaments/search?search=${encodeURIComponent(search)}`)
  }

  async createMedicamentsBatch(medicaments: Partial<import("@/types").Medicament>[]) {
    return this.request<import("@/types").Medicament[]>("/api/admin/medicaments/batch", {
      method: "POST",
      body: JSON.stringify(medicaments),
    })
  }
  async getMyProfile() {
  return this.request<any>(`/api/users/me`)
}

async updateMyProfile(data: { nom: string; prenom: string }) {
  return this.request<any>(`/api/users/me`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

async getNotifToday() {
  return this.request<{ count: number; rendezVous: any[] }>(`/api/notifications/rendez-vous/aujourdhui`)
}
async getNotificationsSummary() {
  return this.request<any>(`/api/notifications/summary`)
}
async getNotifPatientEnCours() {
  return this.request<{ patientEnCours: any | null; rendezVous: any | null }>(`/api/notifications/patient-en-cours`)
}}

export const api = new ApiClient()
