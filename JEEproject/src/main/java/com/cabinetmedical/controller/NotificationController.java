package com.cabinetmedical.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
public ResponseEntity<Map<String, Object>> getTodayRendezVous(Authentication auth) {
    String login = auth.getName();

    Utilisateur u = utilisateurRepository.findByLogin(login)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    if (u.getRole() != Role.MEDECIN) {
        throw new RuntimeException("Accès réservé au médecin");
    }

    Long medecinId = u.getId();
    List<RendezVous> rdvs = rendezVousService.getTodayRendezVousByMedecin(medecinId);

    Map<String, Object> res = new HashMap<>();
    res.put("count", rdvs.size());
    res.put("rendezVous", rdvs);
    return ResponseEntity.ok(res);
}/* 
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
    @GetMapping("/summary")
public ResponseEntity<Map<String, Object>> summary(Authentication auth) {

    String login = auth.getName();
    Utilisateur u = utilisateurRepository.findByLogin(login)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

    Map<String, Object> res = new HashMap<>();
    res.put("role", u.getRole().name());

    if (u.getRole() == Role.MEDECIN) {
        Long medecinId = u.getId();
        List<RendezVous> rdvs = rendezVousService.getTodayRendezVousByMedecin(medecinId);

        res.put("count", rdvs.size());
        res.put("rendezVous", rdvs);

        RendezVous prochain = rdvs.stream()
                .filter(r -> r.getStatut() == StatutRendezVous.EN_ATTENTE || r.getStatut() == StatutRendezVous.CONFIRME)
                .findFirst()
                .orElse(null);

        res.put("patientLabel", prochain != null && prochain.getPatient() != null
                ? prochain.getPatient().getPrenom() + " " + prochain.getPatient().getNom()
                : "Aucun");

        return ResponseEntity.ok(res);
    }

    if (u.getRole() == Role.SECRETAIRE) {
        if (u.getCabinet() == null) throw new RuntimeException("Cabinet manquant");
        Long cabinetId = u.getCabinet().getId();

        // ✅ il faut cette méthode (voir étape 2)
        List<RendezVous> rdvs = rendezVousService.getTodayRendezVousByCabinet(cabinetId);

        long enAttente = rdvs.stream().filter(r -> r.getStatut() == StatutRendezVous.EN_ATTENTE).count();

        res.put("count", rdvs.size());
        res.put("enAttente", enAttente);
        res.put("rendezVous", rdvs);

        return ResponseEntity.ok(res);
    }

    res.put("count", 0);
    res.put("rendezVous", List.of());
    return ResponseEntity.ok(res);
}

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


