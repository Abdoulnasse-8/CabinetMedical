package com.cabinetmedical.repository;

import com.cabinetmedical.entity.Patient;
import com.fasterxml.jackson.annotation.JsonIgnore;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    @JsonIgnore
    Optional<Patient> findByCin(String cin);
    @JsonIgnore
    List<Patient> findByCabinetId(Long cabinetId);
    
    @JsonIgnore
    @Query("SELECT p FROM Patient p WHERE p.cabinet.id = :cabinetId AND " +
           "(LOWER(p.nom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.prenom) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "p.cin LIKE CONCAT('%', :search, '%'))")
    List<Patient> searchPatients(@Param("cabinetId") Long cabinetId, @Param("search") String search);
}


