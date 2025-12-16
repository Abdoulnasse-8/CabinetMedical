package com.cabinetmedical.service;

import com.cabinetmedical.entity.Consultation;
import com.cabinetmedical.entity.DossierMedical;
import com.cabinetmedical.entity.Patient;
import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.repository.ConsultationRepository;
import com.cabinetmedical.repository.DossierMedicalRepository;
import com.cabinetmedical.repository.PatientRepository;
import com.cabinetmedical.repository.RendezVousRepository;
import com.cabinetmedical.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ConsultationService {

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private DossierMedicalRepository dossierMedicalRepository;

    @Autowired
    private RendezVousRepository rendezVousRepository;

    public List<Consultation> getConsultationsByPatient(Long patientId) {
        return consultationRepository.findHistoriqueByPatientId(patientId);
    }

    public List<Consultation> getConsultationsByMedecin(Long medecinId) {
        return consultationRepository.findByMedecinId(medecinId);
    }

    public Consultation getConsultationById(Long id) {
        return consultationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
    }

    @Transactional
    public Consultation createConsultation(Consultation consultation, Long patientId, Long medecinId, Long rendezVousId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        Utilisateur medecin = utilisateurRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));

        DossierMedical dossier = dossierMedicalRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Dossier médical non trouvé"));

        consultation.setPatient(patient);
        consultation.setMedecin(medecin);
        consultation.setDossierMedical(dossier);
        consultation.setDateConsultation(LocalDate.now());

        if (rendezVousId != null) {
            RendezVous rendezVous = rendezVousRepository.findById(rendezVousId)
                    .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
            consultation.setRendezVous(rendezVous);
            rendezVous.setStatut(com.cabinetmedical.enums.StatutRendezVous.TERMINE);
            rendezVousRepository.save(rendezVous);
        }

        Consultation savedConsultation = consultationRepository.save(consultation);
        return savedConsultation;
    }

    public Consultation updateConsultation(Long id, Consultation consultationDetails) {
        Consultation consultation = getConsultationById(id);
        consultation.setType(consultationDetails.getType());
        consultation.setExamenClinique(consultationDetails.getExamenClinique());
        consultation.setExamenSupplementaire(consultationDetails.getExamenSupplementaire());
        consultation.setDiagnostic(consultationDetails.getDiagnostic());
        consultation.setTraitement(consultationDetails.getTraitement());
        consultation.setObservations(consultationDetails.getObservations());
        return consultationRepository.save(consultation);
    }

    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }
}


