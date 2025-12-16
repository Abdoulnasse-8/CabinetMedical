package com.cabinetmedical.repository;

import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.enums.StatutRendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByPatientId(Long patientId);
    List<RendezVous> findByMedecinId(Long medecinId);
    List<RendezVous> findByCabinetId(Long cabinetId);
    List<RendezVous> findByDateRdvAndMedecinId(LocalDate date, Long medecinId);
    List<RendezVous> findByStatut(StatutRendezVous statut);

    @Query("SELECT r FROM RendezVous r WHERE r.dateRdv = :date AND r.medecin.id = :medecinId " +
           "AND r.heureRdv = :heure AND r.statut != 'ANNULE'")
    List<RendezVous> findConflictingRendezVous(@Param("date") LocalDate date,
                                                @Param("heure") LocalTime heure,
                                                @Param("medecinId") Long medecinId);

    @Query("SELECT r FROM RendezVous r WHERE r.dateRdv = :date AND r.medecin.id = :medecinId " +
           "AND r.statut = 'CONFIRME' ORDER BY r.heureRdv")
    List<RendezVous> findTodayRendezVousByMedecin(@Param("date") LocalDate date,
                                                   @Param("medecinId") Long medecinId);
}


