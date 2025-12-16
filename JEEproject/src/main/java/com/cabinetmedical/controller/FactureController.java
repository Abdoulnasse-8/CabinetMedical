package com.cabinetmedical.controller;

import com.cabinetmedical.entity.Facture;
import com.cabinetmedical.enums.StatutFacture;
import com.cabinetmedical.service.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secretaire/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @GetMapping
    public ResponseEntity<List<Facture>> getAllFactures(@RequestParam Long cabinetId) {
        return ResponseEntity.ok(factureService.getAllFactures(cabinetId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Facture>> getFacturesByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(factureService.getFacturesByPatient(patientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable Long id) {
        return ResponseEntity.ok(factureService.getFactureById(id));
    }

    @PostMapping
    public ResponseEntity<Facture> createFacture(
            @RequestBody Facture facture,
            @RequestParam Long patientId,
            @RequestParam Long cabinetId,
            @RequestParam(required = false) Long consultationId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(factureService.createFacture(facture, patientId, cabinetId, consultationId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facture> updateFacture(
            @PathVariable Long id,
            @RequestBody Facture facture) {
        return ResponseEntity.ok(factureService.updateFacture(id, facture));
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<Facture> updateStatutFacture(
            @PathVariable Long id,
            @RequestParam StatutFacture statut) {
        return ResponseEntity.ok(factureService.updateStatutFacture(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
        return ResponseEntity.noContent().build();
    }
}


