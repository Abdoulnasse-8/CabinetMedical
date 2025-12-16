-- Script d'initialisation des données de test

-- Insertion d'un cabinet
INSERT INTO cabinets (nom, specialite, adresse, tel, actif) VALUES
('Cabinet Médical Central', 'Généraliste', '123 Rue Principale, Casablanca', '0522123456', true);

-- Insertion d'un administrateur
INSERT INTO utilisateurs (login, pwd, nom, prenom, num_tel, role, cabinet_id) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJLW', 'Admin', 'System', '0612345678', 'ADMINISTRATEUR', 1);

-- Insertion d'un médecin
INSERT INTO utilisateurs (login, pwd, nom, prenom, num_tel, role, cabinet_id) VALUES
('medecin1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJLW', 'Bennani', 'Ahmed', '0612345679', 'MEDECIN', 1);

-- Insertion d'une secrétaire
INSERT INTO utilisateurs (login, pwd, nom, prenom, num_tel, role, cabinet_id) VALUES
('secretaire1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8pJLW', 'Alaoui', 'Fatima', '0612345680', 'SECRETAIRE', 1);

-- Insertion de quelques médicaments
INSERT INTO medicaments (nom, dosage, forme, description) VALUES
('Paracétamol', '500mg', 'Comprimé', 'Antalgique et antipyrétique'),
('Amoxicilline', '500mg', 'Gélule', 'Antibiotique à large spectre'),
('Ibuprofène', '400mg', 'Comprimé', 'Anti-inflammatoire non stéroïdien'),
('Aspirine', '100mg', 'Comprimé', 'Antalgique et antiagrégant plaquettaire'),
('Oméprazole', '20mg', 'Gélule', 'Inhibiteur de la pompe à protons');

-- Note: Le mot de passe par défaut pour tous les utilisateurs est "password"
-- Il est encodé avec BCrypt


