# Système de Gestion de Cabinet Médical - Backend

## Description
Backend développé en Java Spring Boot pour la gestion complète d'un cabinet médical. Le système permet de gérer les patients, les rendez-vous, les consultations, les dossiers médicaux, la facturation, et les utilisateurs (médecins, secrétaires, administrateurs).

## Technologies Utilisées
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** avec JWT
- **Spring Data JPA**
- **MySQL** (ou PostgreSQL)
- **Maven**

## Structure du Projet

```
src/
├── main/
│   ├── java/com/cabinetmedical/
│   │   ├── config/          # Configuration (Security, CORS)
│   │   ├── controller/      # Controllers REST
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # Entités JPA
│   │   ├── enums/           # Énumérations
│   │   ├── repository/      # Repositories JPA
│   │   ├── security/        # Configuration sécurité JWT
│   │   └── service/         # Services métier
│   └── resources/
│       ├── application.properties
│       ├── data.sql         # Données de test
│       └── schema.sql       # Schéma de base de données
```

## Installation et Configuration

### Prérequis
- Java 17 ou supérieur
- Maven 3.6+
- MySQL 8.0+ (ou PostgreSQL)
- IDE (IntelliJ IDEA Ultimate recommandé, Eclipse, VS Code)

### Démarrage Rapide avec IntelliJ Ultimate

1. **Ouvrir le projet**
   - File → Open → Sélectionner le dossier `JEEproject`
   - IntelliJ détectera automatiquement le projet Maven

2. **Configurer le JDK**
   - File → Project Structure → Project
   - Sélectionner **Java 17** comme SDK

3. **Configurer la base de données**
   - Modifier `src/main/resources/application.properties` avec vos identifiants MySQL
   - Ou utiliser l'outil Database intégré (View → Tool Windows → Database)

4. **Lancer l'application**
   - Ouvrir `CabinetMedicalApplication.java`
   - Clic droit → Run 'CabinetMedicalApplication'
   - Ou utiliser le bouton ▶️ vert

📖 **Guide complet IntelliJ**: Voir [GUIDE_INTELLIJ.md](GUIDE_INTELLIJ.md)

### Installation via Ligne de Commande

1. **Cloner le projet**
```bash
git clone <repository-url>
cd JEEproject
```

2. **Configurer la base de données**
   - Créer une base de données MySQL nommée `cabinet_medical`
   - Modifier `src/main/resources/application.properties` avec vos identifiants :
```properties
spring.datasource.username=votre_username
spring.datasource.password=votre_password
```

3. **Compiler le projet**
```bash
mvn clean install
```

4. **Lancer l'application**
```bash
mvn spring-boot:run
```

L'application sera accessible sur `http://localhost:8080`

## Comptes par défaut

Les comptes suivants sont créés automatiquement (mot de passe: `password`) :
- **Administrateur**: `admin` / `password`
- **Médecin**: `medecin1` / `password`
- **Secrétaire**: `secretaire1` / `password`

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion

### Secrétaire
- `GET /api/secretaire/patients` - Liste des patients
- `POST /api/secretaire/patients` - Créer un patient
- `GET /api/secretaire/patients/search` - Rechercher un patient
- `GET /api/secretaire/rendez-vous` - Liste des rendez-vous
- `POST /api/secretaire/rendez-vous` - Créer un rendez-vous
- `GET /api/secretaire/factures` - Liste des factures
- `POST /api/secretaire/factures` - Créer une facture

### Médecin
- `GET /api/medecin/patients/search` - Rechercher un patient
- `GET /api/medecin/patients/{id}/dossier` - Consulter le dossier médical
- `POST /api/medecin/consultations` - Créer une consultation
- `GET /api/medecin/rendez-vous/aujourdhui` - Rendez-vous du jour
- `GET /api/medecin/dashboard` - Dashboard du médecin

### Administrateur
- `GET /api/admin/cabinets` - Liste des cabinets
- `POST /api/admin/cabinets` - Créer un cabinet
- `POST /api/admin/medicaments` - Ajouter un médicament
- `POST /api/admin/medicaments/batch` - Ajouter plusieurs médicaments

### Notifications
- `GET /api/notifications/rendez-vous/aujourdhui` - Rendez-vous du jour
- `GET /api/notifications/patient-en-cours` - Patient en cours

## Sécurité

L'application utilise JWT (JSON Web Tokens) pour l'authentification. Après la connexion, inclure le token dans le header :
```
Authorization: Bearer <token>
```

## Base de Données

Les tables sont créées automatiquement par Hibernate au démarrage. Les données de test sont insérées via `data.sql`.

## Déploiement

Pour déployer l'application en production :
1. Modifier `application.properties` pour la base de données de production
2. Configurer les variables d'environnement pour les secrets JWT
3. Compiler le projet : `mvn clean package`
4. Exécuter le JAR : `java -jar target/cabinet-medical-backend-1.0.0.jar`

## Auteur
Développé pour le projet de gestion de cabinet médical - JEE Project

