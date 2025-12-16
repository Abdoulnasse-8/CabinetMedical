package com.cabinetmedical.controller;

import com.cabinetmedical.entity.Medicament;
import com.cabinetmedical.service.MedicamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicaments")
@CrossOrigin(origins = "*")
public class MedicamentController {

    @Autowired
    private MedicamentService medicamentService;

    @GetMapping("/search")
    public ResponseEntity<List<Medicament>> searchMedicaments(@RequestParam String search) {
        return ResponseEntity.ok(medicamentService.searchMedicaments(search));
    }

    @GetMapping
    public ResponseEntity<List<Medicament>> getAllMedicaments() {
        return ResponseEntity.ok(medicamentService.getAllMedicaments());
    }
}


