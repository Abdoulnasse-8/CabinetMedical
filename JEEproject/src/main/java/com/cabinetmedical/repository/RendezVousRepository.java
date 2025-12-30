package com.cabinetmedical.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.enums.StatutRendezVous;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByPatientId(Long patientId);
    List<RendezVous> findByMedecinId(Long medecinId);
    List<RendezVous> findByCabinetId(Long cabinetId);
    List<RendezVous> findByDateRdvAndMedecinId(LocalDate date, Long medecinId);
    List<RendezVous> findByStatut(StatutRendezVous statut);
  @Query("""
  select r from RendezVous r
  join fetch r.patient p
  join fetch r.medecin m
  where r.cabinet.id = :cabinetId
  and r.dateRdv = :today
""")
List<RendezVous> findTodayByCabinet(@Param("cabinetId") Long cabinetId, @Param("today") LocalDate today);


    @Query("SELECT r FROM RendezVous r WHERE r.dateRdv = :date AND r.medecin.id = :medecinId " +
           "AND r.heureRdv = :heure AND r.statut != 'ANNULE'")
    List<RendezVous> findConflictingRendezVous(@Param("date") LocalDate date,
                                                @Param("heure") LocalTime heure,
                                                @Param("medecinId") Long medecinId);

  @Query("""
SELECT r FROM RendezVous r
LEFT JOIN FETCH r.patient
LEFT JOIN FETCH r.medecin
LEFT JOIN FETCH r.cabinet
WHERE r.dateRdv = :date
AND r.medecin.id = :medecinId
AND r.statut IN (com.cabinetmedical.enums.StatutRendezVous.EN_ATTENTE,
                 com.cabinetmedical.enums.StatutRendezVous.CONFIRME)
ORDER BY r.heureRdv
""")
List<RendezVous> findTodayRendezVousByMedecin(@Param("date") LocalDate date,
                                             @Param("medecinId") Long medecinId);;
       @Query("""
       select r from RendezVous r
       join fetch r.patient
       where r.cabinet.id = :cabinetId
       order by r.dateRdv desc, r.heureRdv desc
       """)
       List<RendezVous> findByCabinetIdWithPatient(@Param("cabinetId") Long cabinetId);
@Query("""
  select r from RendezVous r
  join fetch r.patient
  join fetch r.medecin
  join fetch r.cabinet
  where r.cabinet.id = :cabinetId
  order by r.dateRdv desc, r.heureRdv desc
""")
List<RendezVous> findByCabinetIdWithDetails(@Param("cabinetId") Long cabinetId);
@Query("""
  select r from RendezVous r
  join fetch r.patient
  join fetch r.medecin
  join fetch r.cabinet
  where r.dateRdv = :date
    and r.medecin.id = :medecinId
    and r.statut in ('EN_ATTENTE','CONFIRME')
  order by r.heureRdv
""")
List<RendezVous> findTodayRendezVousByMedecinWithDetails(@Param("date") LocalDate date,
                                                         @Param("medecinId") Long medecinId);
}


