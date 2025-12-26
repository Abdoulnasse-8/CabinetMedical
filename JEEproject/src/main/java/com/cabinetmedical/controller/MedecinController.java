
package com.cabinetmedical.controller;

import com.cabinetmedical.entity.Consultation;
import com.cabinetmedical.entity.DossierMedical;
import com.cabinetmedical.entity.Patient;
import com.cabinetmedical.service.ConsultationService;
import com.cabinetmedical.service.DashboardService;
import com.cabinetmedical.service.DossierMedicalService;
import com.cabinetmedical.service.PatientService;
import com.cabinetmedical.service.RendezVousService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medecin")
@CrossOrigin(origins = "*")
public class MedecinController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private ConsultationService consultationService;

    @Autowired
    private DossierMedicalService dossierMedicalService;

    @Autowired
    private RendezVousService rendezVousService;

    @Autowired
    private DashboardService dashboardService;

    // Recherche de patients
    @GetMapping("/patients/search")
    public ResponseEntity<List<Patient>> searchPatients(
            @RequestParam Long cabinetId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, name = "q") String q,
            @RequestParam(required = false, name = "query") String query
    ) {
        // ✅ Accepte plusieurs noms de paramètre côté front (search / q / query)
        String term = (search != null && !search.isBlank()) ? search
                : (q != null && !q.isBlank()) ? q
                : (query != null && !query.isBlank()) ? query
                : null;

        if (term == null || term.isBlank()) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(patientService.searchPatients(cabinetId, term.trim()));
    }

    @GetMapping("/patients/cin/{cin}")
    public ResponseEntity<Patient> getPatientByCin(@PathVariable String cin) {
        return ResponseEntity.ok(patientService.getPatientByCin(cin));
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    // Dossier médical
    @GetMapping("/patients/{patientId}/dossier")
    public ResponseEntity<DossierMedical> getDossierMedical(@PathVariable Long patientId) {
        return ResponseEntity.ok(dossierMedicalService.getDossierByPatientId(patientId));
    }

    @PutMapping("/patients/{patientId}/dossier")
    public ResponseEntity<DossierMedical> updateDossierMedical(
            @PathVariable Long patientId,
            @RequestBody DossierMedical dossier) {
        return ResponseEntity.ok(dossierMedicalService.updateDossierMedical(patientId, dossier));
    }

    // Consultations
    @GetMapping("/patients/{patientId}/consultations")
    public ResponseEntity<List<Consultation>> getConsultationsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(consultationService.getConsultationsByPatient(patientId));
    }

    @GetMapping("/consultations/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        return ResponseEntity.ok(consultationService.getConsultationById(id));
    }

    @PostMapping("/consultations")
    public ResponseEntity<Consultation> createConsultation(
            @RequestBody Consultation consultation,
            @RequestParam Long patientId,
            @RequestParam Long medecinId,
            @RequestParam(required = false) Long rendezVousId) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(consultationService.createConsultation(consultation, patientId, medecinId, rendezVousId));
    }

    @PutMapping("/consultations/{id}")
    public ResponseEntity<Consultation> updateConsultation(
            @PathVariable Long id,
            @RequestBody Consultation consultation) {
        return ResponseEntity.ok(consultationService.updateConsultation(id, consultation));
    }

    // Rendez-vous du jour
    @GetMapping("/rendez-vous/aujourdhui")
    public ResponseEntity<List<com.cabinetmedical.entity.RendezVous>> getTodayRendezVous(
            @RequestParam Long medecinId) {
        return ResponseEntity.ok(rendezVousService.getTodayRendezVousByMedecin(medecinId));
    }

    // Dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(
            @RequestParam Long cabinetId,
            @RequestParam Long medecinId) {
        return ResponseEntity.ok(dashboardService.getDashboardData(cabinetId, medecinId));
    }
}
