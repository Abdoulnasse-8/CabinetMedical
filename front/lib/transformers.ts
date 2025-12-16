// Transformers to convert backend data format to frontend format

import type { Patient, RendezVous, Facture, DossierMedical, Consultation } from "@/types"

// Backend Patient format: { id, cin, nom, prenom, dateNaissance (LocalDate), sexe, numTel, typemutuelle, ... }
// Frontend Patient format: { id, cin, nom, prenom, dateNaissance (string), sexe, telephone, typeMutuelle, ... }
export function transformPatient(backendPatient: any): Patient {
  return {
    id: backendPatient.id,
    cin: backendPatient.cin,
    nom: backendPatient.nom,
    prenom: backendPatient.prenom,
    dateNaissance: backendPatient.dateNaissance || "",
    sexe: backendPatient.sexe as "M" | "F",
    telephone: backendPatient.numTel || backendPatient.telephone || "",
    email: backendPatient.email,
    adresse: backendPatient.adresse,
    typeMutuelle: backendPatient.typemutuelle || backendPatient.typeMutuelle,
    numeroMutuelle: backendPatient.numeroMutuelle,
    profession: backendPatient.profession,
    antecedents: backendPatient.antecedents,
    allergies: backendPatient.allergies,
    cabinetId: backendPatient.cabinet?.id || backendPatient.cabinetId,
    createdAt: backendPatient.createdAt || new Date().toISOString(),
    updatedAt: backendPatient.updatedAt || new Date().toISOString(),
  }
}

// Backend RendezVous format: { idRendezVous, dateRdv (LocalDate), heureRdv (LocalTime), statut, ... }
// Frontend RendezVous format: { id, dateHeure (ISO string), statut, ... }
export function transformRendezVous(backendRdv: any): RendezVous {
  // Combine dateRdv and heureRdv into ISO string
  let dateHeure = ""
  if (backendRdv.dateRdv && backendRdv.heureRdv) {
    const date = new Date(`${backendRdv.dateRdv}T${backendRdv.heureRdv}`)
    dateHeure = date.toISOString()
  } else if (backendRdv.dateHeure) {
    dateHeure = backendRdv.dateHeure
  }

  return {
    id: backendRdv.idRendezVous || backendRdv.id,
    patientId: backendRdv.patient?.id || backendRdv.patientId,
    medecinId: backendRdv.medecin?.id || backendRdv.medecinId,
    cabinetId: backendRdv.cabinet?.id || backendRdv.cabinetId,
    patient: backendRdv.patient ? transformPatient(backendRdv.patient) : undefined,
    medecin: backendRdv.medecin,
    dateHeure,
    motif: backendRdv.motif,
    notes: backendRdv.notes,
    statut: backendRdv.statut as RendezVous["statut"],
    createdAt: backendRdv.createdAt || new Date().toISOString(),
  }
}

// Backend Facture format: { idFacture, montant (BigDecimal), dateCreation (LocalDateTime), statut: PAYEE|NON_PAYEE|PARTIELLEMENT_PAYEE, ... }
// Frontend Facture format: { id, montant (number), dateFacture (ISO string), statut: EN_ATTENTE|PAYEE|ANNULEE, ... }
export function transformFacture(backendFacture: any): Facture {
  // Map backend statuts to frontend statuts
  const statutMap: Record<string, Facture["statut"]> = {
    PAYEE: "PAYEE",
    NON_PAYEE: "EN_ATTENTE",
    PARTIELLEMENT_PAYEE: "EN_ATTENTE",
  }

  return {
    id: backendFacture.idFacture || backendFacture.id,
    patientId: backendFacture.patient?.id || backendFacture.patientId,
    patient: backendFacture.patient ? transformPatient(backendFacture.patient) : undefined,
    consultationId: backendFacture.consultation?.id || backendFacture.consultationId,
    montant: typeof backendFacture.montant === "number" ? backendFacture.montant : Number(backendFacture.montant),
    modePaiement: backendFacture.modePaiement as Facture["modePaiement"],
    statut: statutMap[backendFacture.statut] || "EN_ATTENTE",
    dateFacture: backendFacture.dateCreation || backendFacture.dateFacture || new Date().toISOString(),
    notes: backendFacture.notes,
    cabinetId: backendFacture.cabinet?.id || backendFacture.cabinetId,
  }
}

// Backend DossierMedical format: { idDossier, antMedicaux, antChirug, allergies, traitement, habitudes, ... }
// Frontend DossierMedical format: { id, antecedentsMedicaux, antecedentsChirurgicaux, allergies, traitementEnCours, habitudes, ... }
export function transformDossierMedical(backendDossier: any): DossierMedical {
  return {
    id: backendDossier.idDossier || backendDossier.id,
    patientId: backendDossier.patient?.id || backendDossier.patientId,
    groupeSanguin: backendDossier.groupeSanguin,
    allergies: backendDossier.allergies,
    antecedentsMedicaux: backendDossier.antMedicaux || backendDossier.antecedentsMedicaux,
    antecedentsChirurgicaux: backendDossier.antChirug || backendDossier.antecedentsChirurgicaux,
    antecedentsFamiliaux: backendDossier.antecedentsFamiliaux,
    traitementEnCours: backendDossier.traitement || backendDossier.traitementEnCours,
    habitudes: backendDossier.habitudes,
    notes: backendDossier.notes || backendDossier.documentsMedicaux,
  }
}

// Backend Consultation format: { idConsultation, dateConsultation (LocalDate), ... }
// Frontend Consultation format: { id, dateConsultation (ISO string), ... }
export function transformConsultation(backendConsultation: any): Consultation {
  return {
    id: backendConsultation.idConsultation || backendConsultation.id,
    patientId: backendConsultation.patient?.id || backendConsultation.patientId,
    medecinId: backendConsultation.medecin?.id || backendConsultation.medecinId,
    dateConsultation:
      backendConsultation.dateConsultation || new Date(backendConsultation.dateConsultation).toISOString(),
    type: backendConsultation.type as Consultation["type"],
    examenClinique: backendConsultation.examenClinique,
    examenSupplementaire: backendConsultation.examenSupplementaire,
    diagnostic: backendConsultation.diagnostic,
    traitement: backendConsultation.traitement,
    observations: backendConsultation.observations,
    createdAt: backendConsultation.createdAt || new Date().toISOString(),
  }
}

// Transform patient data for sending to backend (frontend -> backend)
export function transformPatientToBackend(patient: Partial<Patient>): any {
  return {
    cin: patient.cin,
    nom: patient.nom,
    prenom: patient.prenom,
    dateNaissance: patient.dateNaissance,
    sexe: patient.sexe,
    numTel: patient.telephone,
    typemutuelle: patient.typeMutuelle,
    email: patient.email,
    adresse: patient.adresse,
  }
}

// Transform rendez-vous data for sending to backend
export function transformRendezVousToBackend(rdv: Partial<RendezVous>): any {
  const dateHeure = rdv.dateHeure ? new Date(rdv.dateHeure) : new Date()
  return {
    dateRdv: dateHeure.toISOString().split("T")[0],
    heureRdv: dateHeure.toTimeString().slice(0, 8), // HH:mm:ss format
    motif: rdv.motif,
    notes: rdv.notes,
    statut: rdv.statut,
  }
}

// Transform facture data for sending to backend
export function transformFactureToBackend(facture: Partial<Facture>): any {
  return {
    montant: facture.montant,
    modePaiement: facture.modePaiement,
    statut: facture.statut === "EN_ATTENTE" ? "NON_PAYEE" : facture.statut === "ANNULEE" ? "NON_PAYEE" : facture.statut,
  }
}

// Transform dossier médical data for sending to backend
export function transformDossierMedicalToBackend(dossier: Partial<DossierMedical>): any {
  return {
    antMedicaux: dossier.antecedentsMedicaux,
    antChirug: dossier.antecedentsChirurgicaux,
    allergies: dossier.allergies,
    traitement: dossier.traitementEnCours,
    habitudes: dossier.habitudes,
  }
}

