package com.cabinetmedical.service;

import com.cabinetmedical.entity.Consultation;
import com.cabinetmedical.entity.Facture;
import com.cabinetmedical.entity.Patient;
import com.cabinetmedical.entity.RendezVous;
import com.cabinetmedical.enums.StatutFacture;
import com.cabinetmedical.enums.StatutRendezVous;
import com.cabinetmedical.repository.ConsultationRepository;
import com.cabinetmedical.repository.FactureRepository;
import com.cabinetmedical.repository.PatientRepository;
import com.cabinetmedical.repository.RendezVousRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private ConsultationRepository consultationRepository;

    @Autowired
    private FactureRepository factureRepository;

    public Map<String, Object> getDashboardData(Long cabinetId, Long medecinId) {
        Map<String, Object> dashboard = new HashMap<>();

        // Statistiques générales
        long totalPatients = patientRepository.findByCabinetId(cabinetId).size();
        long totalRendezVous = rendezVousRepository.findByCabinetId(cabinetId).size();
        long totalConsultations = consultationRepository.findByMedecinId(medecinId).size();

        // Rendez-vous du jour
        long rendezVousAujourdhui = rendezVousRepository
                .findTodayRendezVousByMedecin(LocalDate.now(), medecinId).size();

        // Rendez-vous confirmés
        long rendezVousConfirmes = rendezVousRepository
                .findByCabinetId(cabinetId)
                .stream()
                .filter(r -> r.getStatut() == StatutRendezVous.CONFIRME)
                .count();

        // Factures
        long totalFactures = factureRepository.findByCabinetId(cabinetId).size();
        long facturesPayees = factureRepository.findByCabinetId(cabinetId)
                .stream()
                .filter(f -> f.getStatut() == StatutFacture.PAYEE)
                .count();

        BigDecimal revenusTotal = factureRepository.findByCabinetId(cabinetId)
                .stream()
                .filter(f -> f.getStatut() == StatutFacture.PAYEE)
                .map(Facture::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dashboard.put("totalPatients", totalPatients);
        dashboard.put("totalRendezVous", totalRendezVous);
        dashboard.put("totalConsultations", totalConsultations);
        dashboard.put("rendezVousAujourdhui", rendezVousAujourdhui);
        dashboard.put("rendezVousConfirmes", rendezVousConfirmes);
        dashboard.put("totalFactures", totalFactures);
        dashboard.put("facturesPayees", facturesPayees);
        dashboard.put("revenusTotal", revenusTotal);

        return dashboard;
    }
}


