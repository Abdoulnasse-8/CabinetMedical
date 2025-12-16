package com.cabinetmedical.repository;

import com.cabinetmedical.entity.Facture;
import com.cabinetmedical.enums.StatutFacture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByPatientId(Long patientId);
    List<Facture> findByCabinetId(Long cabinetId);
    List<Facture> findByStatut(StatutFacture statut);
}


