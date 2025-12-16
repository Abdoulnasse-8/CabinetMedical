package com.cabinetmedical.service;

import com.cabinetmedical.entity.Cabinet;
import com.cabinetmedical.entity.Consultation;
import com.cabinetmedical.entity.Facture;
import com.cabinetmedical.entity.Patient;
import com.cabinetmedical.enums.ModePaiement;
import com.cabinetmedical.enums.StatutFacture;
import com.cabinetmedical.repository.CabinetRepository;
import com.cabinetmedical.repository.ConsultationRepository;
import com.cabinetmedical.repository.FactureRepository;
import com.cabinetmedical.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FactureService {

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private CabinetRepository cabinetRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    public List<Facture> getAllFactures(Long cabinetId) {
        return factureRepository.findByCabinetId(cabinetId);
    }

    public List<Facture> getFacturesByPatient(Long patientId) {
        return factureRepository.findByPatientId(patientId);
    }

    public Facture getFactureById(Long id) {
        return factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));
    }

    @Transactional
    public Facture createFacture(Facture facture, Long patientId, Long cabinetId, Long consultationId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        Cabinet cabinet = cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));

        facture.setPatient(patient);
        facture.setCabinet(cabinet);
        facture.setDateCreation(LocalDateTime.now());
        facture.setStatut(StatutFacture.NON_PAYEE);

        if (consultationId != null) {
            Consultation consultation = consultationRepository.findById(consultationId)
                    .orElseThrow(() -> new RuntimeException("Consultation non trouvée"));
            facture.setConsultation(consultation);
        }

        return factureRepository.save(facture);
    }

    public Facture updateStatutFacture(Long id, StatutFacture statut) {
        Facture facture = getFactureById(id);
        facture.setStatut(statut);
        return factureRepository.save(facture);
    }

    public Facture updateFacture(Long id, Facture factureDetails) {
        Facture facture = getFactureById(id);
        facture.setMontant(factureDetails.getMontant());
        facture.setModePaiement(factureDetails.getModePaiement());
        facture.setStatut(factureDetails.getStatut());
        return factureRepository.save(facture);
    }

    public void deleteFacture(Long id) {
        factureRepository.deleteById(id);
    }
}


