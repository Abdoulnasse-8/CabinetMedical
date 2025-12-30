package com.cabinetmedical.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.security.core.Authentication;
import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.enums.Role;
import com.cabinetmedical.enums.StatutRendezVous;
import com.cabinetmedical.repository.UtilisateurRepository;
import com.cabinetmedical.service.RendezVousService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private RendezVousService rendezVousService;

    @GetMapping("/rendez-vous/aujourdhui")
    public ResponseEntity<Map<String, Object>> getTodayRendezVous(@RequestParam Long medecinId) {
        List<RendezVous> rendezVous = rendezVousService.getTodayRendezVousByMedecin(medecinId);
        Map<String, Object> response = new HashMap<>();
        response.put("count", rendezVous.size());
        response.put("rendezVous", rendezVous);
        return ResponseEntity.ok(response);
    }
/* 
    @GetMapping("/patient-en-cours")
    public ResponseEntity<Map<String, Object>> getPatientEnCours(@RequestParam Long medecinId) {
        List<RendezVous> rendezVous = rendezVousService.getTodayRendezVousByMedecin(medecinId);
        Map<String, Object> response = new HashMap<>();

        RendezVous prochainRendezVous = rendezVous.stream()
                .filter(r -> r.getStatut() == com.cabinetmedical.enums.StatutRendezVous.CONFIRME)
                .findFirst()
                .orElse(null);

        if (prochainRendezVous != null) {
            response.put("patientEnCours", prochainRendezVous.getPatient());
            response.put("rendezVous", prochainRendezVous);
        } else {
            response.put("patientEnCours", null);
            response.put("rendezVous", null);
        }

        return ResponseEntity.ok(response);
    } */
    @Autowired private UtilisateurRepository utilisateurRepository;

    @GetMapping("/patient-en-cours")
    public ResponseEntity<Map<String, Object>> getPatientEnCours(Authentication auth) {

        String login = auth.getName(); // login du user connecté via JWT

        Utilisateur u = utilisateurRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (u.getRole() != Role.MEDECIN) {
            throw new RuntimeException("Accès réservé au médecin");
        }

        Long medecinId = u.getId();

        List<RendezVous> rdvs = rendezVousService.getTodayRendezVousByMedecin(medecinId);

        RendezVous prochain = rdvs.stream()
                .filter(r -> r.getStatut() == StatutRendezVous.CONFIRME)
                .findFirst()
                .orElse(null);

        Map<String, Object> res = new HashMap<>();
        res.put("patientEnCours", prochain != null ? prochain.getPatient() : null);
        res.put("rendezVous", prochain);

        return ResponseEntity.ok(res);
    }
}


