package com.cabinetmedical.service;

import com.cabinetmedical.entity.DossierMedical;
import com.cabinetmedical.entity.Patient;
import com.cabinetmedical.repository.DossierMedicalRepository;
import com.cabinetmedical.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DossierMedicalService {

    @Autowired
    private DossierMedicalRepository dossierMedicalRepository;

    @Autowired
    private PatientRepository patientRepository;

    public DossierMedical getDossierByPatientId(Long patientId) {
        return dossierMedicalRepository.findByPatientId(patientId)
                .orElseThrow(() -> new RuntimeException("Dossier médical non trouvé"));
    }

    public DossierMedical updateDossierMedical(Long patientId, DossierMedical dossierDetails) {
        DossierMedical dossier = getDossierByPatientId(patientId);
        dossier.setAntMedicaux(dossierDetails.getAntMedicaux());
        dossier.setAntChirug(dossierDetails.getAntChirug());
        dossier.setAllergies(dossierDetails.getAllergies());
        dossier.setTraitement(dossierDetails.getTraitement());
        dossier.setHabitudes(dossierDetails.getHabitudes());
        dossier.setDocumentsMedicaux(dossierDetails.getDocumentsMedicaux());
        return dossierMedicalRepository.save(dossier);
    }
}


