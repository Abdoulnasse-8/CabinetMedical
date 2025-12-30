package com.cabinetmedical.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cabinetmedical.entity.Cabinet;
import com.cabinetmedical.entity.Patient;
import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.enums.Role;
import com.cabinetmedical.enums.StatutRendezVous;
import com.cabinetmedical.repository.CabinetRepository;
import com.cabinetmedical.repository.PatientRepository;
import com.cabinetmedical.repository.RendezVousRepository;
import com.cabinetmedical.repository.UtilisateurRepository;

@Service
public class RendezVousService {

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private CabinetRepository cabinetRepository;



    public List<RendezVous> getRendezVousByPatient(Long patientId) {
        return rendezVousRepository.findByPatientId(patientId);
    }

    public List<RendezVous> getRendezVousByMedecin(Long medecinId) {
        return rendezVousRepository.findByMedecinId(medecinId);
    }
public List<RendezVous> getTodayRendezVousByMedecin(Long medecinId) {
    return rendezVousRepository.findTodayRendezVousByMedecinWithDetails(LocalDate.now(), medecinId);
}


public List<RendezVous> getAllRendezVous(Long cabinetId) {
    return rendezVousRepository.findByCabinetIdWithDetails(cabinetId);
}


    public RendezVous getRendezVousById(Long id) {
        return rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));
    }

    @Transactional
    public RendezVous createRendezVous(RendezVous rendezVous, Long patientId, Long medecinId, Long cabinetId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        Utilisateur medecin = utilisateurRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé"));
       if (medecin.getRole() != Role.MEDECIN) { // adapte selon ton enum Role
    throw new RuntimeException("L'utilisateur sélectionné n'est pas un médecin");
}

if (medecin.getCabinet() == null || !medecin.getCabinet().getId().equals(cabinetId)) {
    throw new RuntimeException("Le médecin n'appartient pas à ce cabinet");
} 
        Cabinet cabinet = cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));

        // Vérifier les conflits
        List<RendezVous> conflicts = rendezVousRepository.findConflictingRendezVous(
                rendezVous.getDateRdv(),
                rendezVous.getHeureRdv(),
                medecinId
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Le médecin a déjà un rendez-vous à cette heure");
        }

        rendezVous.setPatient(patient);
        rendezVous.setMedecin(medecin);
        rendezVous.setCabinet(cabinet);
        rendezVous.setStatut(StatutRendezVous.EN_ATTENTE);

        return rendezVousRepository.save(rendezVous);
    }

    public RendezVous updateRendezVous(Long id, RendezVous rendezVousDetails) {
        RendezVous rendezVous = getRendezVousById(id);
        rendezVous.setDateRdv(rendezVousDetails.getDateRdv());
        rendezVous.setHeureRdv(rendezVousDetails.getHeureRdv());
        rendezVous.setMotif(rendezVousDetails.getMotif());
        rendezVous.setNotes(rendezVousDetails.getNotes());
        return rendezVousRepository.save(rendezVous);
    }

    public RendezVous updateStatutRendezVous(Long id, StatutRendezVous statut) {
        RendezVous rendezVous = getRendezVousById(id);
        rendezVous.setStatut(statut);
        return rendezVousRepository.save(rendezVous);
    }

    public void deleteRendezVous(Long id) {
        rendezVousRepository.deleteById(id);
    }
    public List<RendezVous> getTodayRendezVousByCabinet(Long cabinetId) {
    return rendezVousRepository.findTodayByCabinet(cabinetId, LocalDate.now());
}

}


