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

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erreur serveur" }))
      throw new Error(error.message || "Erreur serveur")
    }

    return response.json()
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

  async getRendezVousAujourdhui(medecinId: number) {
    const data = await this.request<any[]>(`/api/medecin/rendez-vous/aujourdhui?medecinId=${medecinId}`)
    return data.map(transformRendezVous)
  }

  async getPatientEnCours(medecinId: number) {
    const data = await this.request<{ patientEnCours: any | null }>(
      `/api/notifications/patient-en-cours?medecinId=${medecinId}`,
    )
    return data.patientEnCours ? transformPatient(data.patientEnCours) : null
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
    const { patientId, medecinId, cabinetId, ...rdvData } = data as any
    const backendData = transformRendezVousToBackend(rdvData)
    const queryParams = new URLSearchParams()
    if (patientId) queryParams.append("patientId", patientId.toString())
    if (medecinId) queryParams.append("medecinId", medecinId.toString())
    if (cabinetId) queryParams.append("cabinetId", cabinetId.toString())

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
    return this.request<import("@/types").Cabinet[]>("/api/admin/cabinets")
  }

  async createCabinet(data: Partial<import("@/types").Cabinet>) {
    return this.request<import("@/types").Cabinet>("/api/admin/cabinets", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCabinet(id: number, data: Partial<import("@/types").Cabinet>) {
    return this.request<import("@/types").Cabinet>(`/api/admin/cabinets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async toggleCabinet(id: number) {
    return this.request<import("@/types").Cabinet>(`/api/admin/cabinets/${id}/toggle`, {
      method: "PUT",
    })
  }

  async deleteCabinet(id: number) {
    return this.request<void>(`/api/admin/cabinets/${id}`, { method: "DELETE" })
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
}

export const api = new ApiClient()
