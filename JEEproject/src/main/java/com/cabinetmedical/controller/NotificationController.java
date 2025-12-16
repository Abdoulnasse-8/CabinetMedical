package com.cabinetmedical.controller;

import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.service.RendezVousService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    }
}


