package com.cabinetmedical.repository;

import com.cabinetmedical.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatientId(Long patientId);
    List<Consultation> findByMedecinId(Long medecinId);

    @Query("SELECT c FROM Consultation c WHERE c.dossierMedical.idDossier = :dossierMedicalId")
    List<Consultation> findByDossierMedicalId(@Param("dossierMedicalId") Long dossierMedicalId);

    @Query("SELECT c FROM Consultation c WHERE c.patient.id = :patientId ORDER BY c.dateConsultation DESC")
    List<Consultation> findHistoriqueByPatientId(@Param("patientId") Long patientId);
}

