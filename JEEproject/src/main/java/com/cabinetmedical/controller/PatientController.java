
package com.cabinetmedical.controller;

import com.cabinetmedical.entity.Patient;
import com.cabinetmedical.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/secretaire/patients")
@CrossOrigin(origins = "*")
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients(@RequestParam Long cabinetId) {
        return ResponseEntity.ok(patientService.getAllPatients(cabinetId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/cin/{cin}")
    public ResponseEntity<Patient> getPatientByCin(@PathVariable String cin) {
        return ResponseEntity.ok(patientService.getPatientByCin(cin));
    }

    // ✅ CORRIGÉ: accepte search / q / query et gère vide => []
    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(
            @RequestParam Long cabinetId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false, name = "query") String query
    ) {
        String term = (search != null && !search.isBlank()) ? search
                : (q != null && !q.isBlank()) ? q
                : (query != null && !query.isBlank()) ? query
                : null;

        if (term == null || term.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(patientService.searchPatients(cabinetId, term.trim()));
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(
            @RequestBody Patient patient,
            @RequestParam Long cabinetId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createPatient(patient, cabinetId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
