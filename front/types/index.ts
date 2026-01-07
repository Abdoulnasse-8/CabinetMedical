// User and Authentication Types
export type UserRole = "ADMINISTRATEUR" | "MEDECIN" | "SECRETAIRE"

export interface User {
  id: number
  login: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  role: UserRole
  cabinetId?: number
  signature?: string
  specialite?: string
  actif: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginCredentials {
  login: string
  pwd: string
}

// Patient Types
export interface Patient {
  id: number
  cin: string
  nom: string
  prenom: string
  dateNaissance: string
  sexe: "M" | "F"
  telephone: string
  email?: string
  adresse?: string
  typeMutuelle?: string
  numeroMutuelle?: string
  profession?: string
  antecedents?: string
  allergies?: string
  cabinetId: number
  createdAt: string
  updatedAt: string
}

// Medical Record Types
export interface DossierMedical {
  id: number
  patientId: number
  antMedicaux?: string
  antChirug?: string
  allergies?: string
  traitement?: string
  habitudes?: string
  documentsMedicaux?: string
  dateCreation?: string
}

// Consultation Types
export interface Consultation {
  id: number
  patientId: number
  medecinId: number
  dateConsultation: string
  type: "CONSULTATION" | "CONTROLE"
  examenClinique?: string
  examenSupplementaire?: string
  diagnostic?: string
  traitement?: string
  observations?: string
  createdAt: string
}

// Appointment Types
export type RendezVousStatut = "EN_ATTENTE" | "CONFIRME" | "ANNULE" | "TERMINE"

export interface RendezVous {
  id: number
  patientId: number
  medecinId: number
  cabinetId: number
  patient?: Patient
  medecin?: User
  dateHeure: string
  motif?: string
  notes?: string
  statut: RendezVousStatut
  createdAt: string
}

// Invoice Types
export type FactureStatut = "EN_ATTENTE" | "PAYEE" | "ANNULEE"
export type ModePaiement = "ESPECES" | "CARTE" | "CHEQUE" | "VIREMENT"

export interface Facture {
  id: number
  patientId: number
  patient?: Patient
  consultationId?: number
  montant: number
  modePaiement?: ModePaiement
  statut: FactureStatut
  dateFacture: string
  notes?: string
  cabinetId: number
}

// Cabinet Types
export interface Cabinet {
  id: number
  nom: string
  adresse: string
  telephone: string
  email?: string
  logo?: string
  specialite?: string
  actif: boolean
  createdAt: string
}

// Medication Types
export interface Medicament {
  id: number
  nom: string
  forme?: string
  dosage?: string
  description?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalPatients: number
  totalConsultations: number
  rendezVousAujourdhui: number
  consultationsAujourdhui: number
}
