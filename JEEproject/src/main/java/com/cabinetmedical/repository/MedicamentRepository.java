package com.cabinetmedical.repository;

import com.cabinetmedical.entity.Medicament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicamentRepository extends JpaRepository<Medicament, Long> {
    @Query("SELECT m FROM Medicament m WHERE LOWER(m.nom) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Medicament> searchByNom(@Param("search") String search);
}


