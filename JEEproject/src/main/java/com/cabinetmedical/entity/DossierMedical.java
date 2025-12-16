package com.cabinetmedical.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "dossiers_medicaux")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DossierMedical {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDossier;

    @Column(name = "ant_medicaux", columnDefinition = "TEXT")
    private String antMedicaux;

    @Column(name = "ant_chirug", columnDefinition = "TEXT")
    private String antChirug;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "traitement", columnDefinition = "TEXT")
    private String traitement;

    @Column(name = "habitudes", columnDefinition = "TEXT")
    private String habitudes;

    @Column(name = "documents_medicaux", columnDefinition = "TEXT")
    private String documentsMedicaux;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    @OneToMany(mappedBy = "dossierMedical", cascade = CascadeType.ALL)
    private List<Consultation> historiqueConsultations;
}


