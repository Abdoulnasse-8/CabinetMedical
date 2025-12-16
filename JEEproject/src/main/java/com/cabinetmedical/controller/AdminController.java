package com.cabinetmedical.controller;

import com.cabinetmedical.entity.Cabinet;
import com.cabinetmedical.entity.Medicament;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.service.CabinetService;
import com.cabinetmedical.service.MedicamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private CabinetService cabinetService;

    @Autowired
    private MedicamentService medicamentService;

    // Gestion des cabinets
    @GetMapping("/cabinets")
    public ResponseEntity<List<Cabinet>> getAllCabinets() {
        return ResponseEntity.ok(cabinetService.getAllCabinets());
    }

    @GetMapping("/cabinets/actifs")
    public ResponseEntity<List<Cabinet>> getActiveCabinets() {
        return ResponseEntity.ok(cabinetService.getActiveCabinets());
    }

    @GetMapping("/cabinets/{id}")
    public ResponseEntity<Cabinet> getCabinetById(@PathVariable Long id) {
        return ResponseEntity.ok(cabinetService.getCabinetById(id));
    }

    @PostMapping("/cabinets")
    public ResponseEntity<Cabinet> createCabinet(@RequestBody Cabinet cabinet) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cabinetService.createCabinet(cabinet));
    }

    @PutMapping("/cabinets/{id}")
    public ResponseEntity<Cabinet> updateCabinet(
            @PathVariable Long id,
            @RequestBody Cabinet cabinet) {
        return ResponseEntity.ok(cabinetService.updateCabinet(id, cabinet));
    }

    @PutMapping("/cabinets/{id}/toggle")
    public ResponseEntity<Cabinet> toggleCabinetStatus(@PathVariable Long id) {
        return ResponseEntity.ok(cabinetService.toggleCabinetStatus(id));
    }

    @DeleteMapping("/cabinets/{id}")
    public ResponseEntity<Void> deleteCabinet(@PathVariable Long id) {
        cabinetService.deleteCabinet(id);
        return ResponseEntity.noContent().build();
    }

    // Gestion des utilisateurs pour un cabinet
    @PostMapping("/cabinets/{cabinetId}/utilisateurs")
    public ResponseEntity<Utilisateur> createUtilisateur(
            @PathVariable Long cabinetId,
            @RequestBody Utilisateur utilisateur) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(cabinetService.createUtilisateurForCabinet(cabinetId, utilisateur));
    }

    @GetMapping("/cabinets/{cabinetId}/utilisateurs")
    public ResponseEntity<List<Utilisateur>> getUtilisateursByCabinet(@PathVariable Long cabinetId) {
        return ResponseEntity.ok(cabinetService.getUtilisateursByCabinet(cabinetId));
    }

    // Gestion des médicaments
    @GetMapping("/medicaments")
    public ResponseEntity<List<Medicament>> getAllMedicaments() {
        return ResponseEntity.ok(medicamentService.getAllMedicaments());
    }

    @GetMapping("/medicaments/search")
    public ResponseEntity<List<Medicament>> searchMedicaments(@RequestParam String search) {
        return ResponseEntity.ok(medicamentService.searchMedicaments(search));
    }

    @GetMapping("/medicaments/{id}")
    public ResponseEntity<Medicament> getMedicamentById(@PathVariable Long id) {
        return ResponseEntity.ok(medicamentService.getMedicamentById(id));
    }

    @PostMapping("/medicaments")
    public ResponseEntity<Medicament> createMedicament(@RequestBody Medicament medicament) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicamentService.createMedicament(medicament));
    }

    @PostMapping("/medicaments/batch")
    public ResponseEntity<List<Medicament>> createMedicaments(@RequestBody List<Medicament> medicaments) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(medicamentService.createMedicaments(medicaments));
    }

    @PutMapping("/medicaments/{id}")
    public ResponseEntity<Medicament> updateMedicament(
            @PathVariable Long id,
            @RequestBody Medicament medicament) {
        return ResponseEntity.ok(medicamentService.updateMedicament(id, medicament));
    }

    @DeleteMapping("/medicaments/{id}")
    public ResponseEntity<Void> deleteMedicament(@PathVariable Long id) {
        medicamentService.deleteMedicament(id);
        return ResponseEntity.noContent().build();
    }
}


