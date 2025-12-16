package com.cabinetmedical.entity;

import com.cabinetmedical.enums.TypeConsultation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "consultations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsultation;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TypeConsultation type;

    @Column(name = "date_consultation", nullable = false)
    private LocalDate dateConsultation;

    @Column(name = "examen_clinique", columnDefinition = "TEXT")
    private String examenClinique;

    @Column(name = "examen_supplementaire", columnDefinition = "TEXT")
    private String examenSupplementaire;

    @Column(name = "diagnostic", columnDefinition = "TEXT")
    private String diagnostic;

    @Column(name = "traitement", columnDefinition = "TEXT")
    private String traitement;

    @Column(name = "observations", columnDefinition = "TEXT")
    private String observations;

    @ManyToOne
    @JoinColumn(name = "medecin_id", nullable = false)
    private Utilisateur medecin;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "dossier_medical_id")
    private DossierMedical dossierMedical;

    @OneToOne
    @JoinColumn(name = "rendez_vous_id")
    private RendezVous rendezVous;
}


