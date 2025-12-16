package com.cabinetmedical.config;

import com.cabinetmedical.entity.Cabinet;
import com.cabinetmedical.entity.Medicament;
import com.cabinetmedical.entity.Utilisateur;
import com.cabinetmedical.enums.Role;
import com.cabinetmedical.repository.CabinetRepository;
import com.cabinetmedical.repository.MedicamentRepository;
import com.cabinetmedical.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CabinetRepository cabinetRepository;

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private MedicamentRepository medicamentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Vérifier si les données existent déjà
        if (cabinetRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        // Créer un cabinet
        Cabinet cabinet = new Cabinet();
        cabinet.setNom("Cabinet Médical Central");
        cabinet.setSpecialite("Généraliste");
        cabinet.setAdresse("123 Rue Principale, Casablanca");
        cabinet.setTel("0522123456");
        cabinet.setActif(true);
        cabinet = cabinetRepository.save(cabinet);

        // Créer un administrateur
        Utilisateur admin = new Utilisateur();
        admin.setLogin("admin");
        admin.setPwd(passwordEncoder.encode("password"));
        admin.setNom("Admin");
        admin.setPrenom("System");
        admin.setNumTel("0612345678");
        admin.setRole(Role.ADMINISTRATEUR);
        admin.setCabinet(cabinet);
        utilisateurRepository.save(admin);

        // Créer un médecin
        Utilisateur medecin = new Utilisateur();
        medecin.setLogin("medecin1");
        medecin.setPwd(passwordEncoder.encode("password"));
        medecin.setNom("Bennani");
        medecin.setPrenom("Ahmed");
        medecin.setNumTel("0612345679");
        medecin.setRole(Role.MEDECIN);
        medecin.setCabinet(cabinet);
        medecin.setSignature("Dr. A. Bennani");
        utilisateurRepository.save(medecin);

        // Créer une secrétaire
        Utilisateur secretaire = new Utilisateur();
        secretaire.setLogin("secretaire1");
        secretaire.setPwd(passwordEncoder.encode("password"));
        secretaire.setNom("Alaoui");
        secretaire.setPrenom("Fatima");
        secretaire.setNumTel("0612345680");
        secretaire.setRole(Role.SECRETAIRE);
        secretaire.setCabinet(cabinet);
        utilisateurRepository.save(secretaire);

        // Créer des médicaments
        List<Medicament> medicaments = Arrays.asList(
                createMedicament("Paracétamol", "500mg", "Comprimé", "Antalgique et antipyrétique"),
                createMedicament("Amoxicilline", "500mg", "Gélule", "Antibiotique à large spectre"),
                createMedicament("Ibuprofène", "400mg", "Comprimé", "Anti-inflammatoire non stéroïdien"),
                createMedicament("Aspirine", "100mg", "Comprimé", "Antalgique et antiagrégant plaquettaire"),
                createMedicament("Oméprazole", "20mg", "Gélule", "Inhibiteur de la pompe à protons"),
                createMedicament("Doliprane", "1000mg", "Comprimé", "Paracétamol"),
                createMedicament("Augmentin", "1g", "Comprimé", "Amoxicilline + Acide clavulanique"),
                createMedicament("Voltarene", "50mg", "Comprimé", "Diclofénac"),
                createMedicament("Dafalgan", "500mg", "Comprimé", "Paracétamol"),
                createMedicament("Clamoxyl", "500mg", "Gélule", "Amoxicilline")
        );
        medicamentRepository.saveAll(medicaments);
    }

    private Medicament createMedicament(String nom, String dosage, String forme, String description) {
        Medicament medicament = new Medicament();
        medicament.setNom(nom);
        medicament.setDosage(dosage);
        medicament.setForme(forme);
        medicament.setDescription(description);
        return medicament;
    }
}


