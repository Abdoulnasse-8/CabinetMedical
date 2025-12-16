package com.cabinetmedical.service;

import com.cabinetmedical.entity.Medicament;
import com.cabinetmedical.repository.MedicamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicamentService {

    @Autowired
    private MedicamentRepository medicamentRepository;

    public List<Medicament> getAllMedicaments() {
        return medicamentRepository.findAll();
    }

    public List<Medicament> searchMedicaments(String search) {
        return medicamentRepository.searchByNom(search);
    }

    public Medicament getMedicamentById(Long id) {
        return medicamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Médicament non trouvé"));
    }

    public Medicament createMedicament(Medicament medicament) {
        return medicamentRepository.save(medicament);
    }

    public List<Medicament> createMedicaments(List<Medicament> medicaments) {
        return medicamentRepository.saveAll(medicaments);
    }

    public Medicament updateMedicament(Long id, Medicament medicamentDetails) {
        Medicament medicament = getMedicamentById(id);
        medicament.setNom(medicamentDetails.getNom());
        medicament.setDosage(medicamentDetails.getDosage());
        medicament.setForme(medicamentDetails.getForme());
        medicament.setDescription(medicamentDetails.getDescription());
        return medicamentRepository.save(medicament);
    }

    public void deleteMedicament(Long id) {
        medicamentRepository.deleteById(id);
    }
}


