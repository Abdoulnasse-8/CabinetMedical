
package com.cabinetmedical.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "dossiers_medicaux")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = {"patient","historiqueConsultations"})
public class DossierMedical {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
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

    // Casse la boucle JSON
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    @JsonIgnore
    private Patient patient;

    @OneToMany(mappedBy = "dossierMedical", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Consultation> historiqueConsultations;
}
