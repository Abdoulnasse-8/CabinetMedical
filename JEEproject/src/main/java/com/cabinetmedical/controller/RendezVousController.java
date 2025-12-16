package com.cabinetmedical.controller;

import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.enums.StatutRendezVous;
import com.cabinetmedical.service.RendezVousService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secretaire/rendez-vous")
@CrossOrigin(origins = "*")
public class RendezVousController {

    @Autowired
    private RendezVousService rendezVousService;

    @GetMapping
    public ResponseEntity<List<RendezVous>> getAllRendezVous(@RequestParam Long cabinetId) {
        return ResponseEntity.ok(rendezVousService.getAllRendezVous(cabinetId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<RendezVous>> getRendezVousByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(rendezVousService.getRendezVousByPatient(patientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RendezVous> getRendezVousById(@PathVariable Long id) {
        return ResponseEntity.ok(rendezVousService.getRendezVousById(id));
    }

    @PostMapping
    public ResponseEntity<RendezVous> createRendezVous(
            @RequestBody RendezVous rendezVous,
            @RequestParam Long patientId,
            @RequestParam Long medecinId,
            @RequestParam Long cabinetId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rendezVousService.createRendezVous(rendezVous, patientId, medecinId, cabinetId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendezVous> updateRendezVous(
            @PathVariable Long id,
            @RequestBody RendezVous rendezVous) {
        return ResponseEntity.ok(rendezVousService.updateRendezVous(id, rendezVous));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<RendezVous> updateStatutRendezVous(
            @PathVariable Long id,
            @RequestParam StatutRendezVous statut) {
        return ResponseEntity.ok(rendezVousService.updateStatutRendezVous(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        rendezVousService.deleteRendezVous(id);
        return ResponseEntity.noContent().build();
    }
}


