# 📐 Guide Détaillé : Créer le Diagramme dans Draw.io

## 🌐 Étape 1 : Accéder à Draw.io

1. Ouvrez votre navigateur
2. Allez sur : **https://app.diagrams.net/**
3. Choisissez "Create New Diagram"
4. Donnez un nom : "Cabinet Medical - Diagramme de Classe"
5. Choisissez "Blank Diagram"

---

## 🔧 Étape 2 : Activer les Formes UML

1. Cliquez sur **"More Shapes"** (en bas à gauche)
2. Dans la recherche, tapez "UML"
3. Cochez les options suivantes :
   - ✅ **UML Class**
   - ✅ **UML General**
   - ✅ **UML Relationships** (si disponible)
4. Cliquez sur **"Apply"**

---

## 🎨 Étape 3 : Organiser l'Espace de Travail

Divisez votre canvas en sections :

```
┌─────────────────────────────────────────────────┐
│  ENUMS (haut)                                   │
├─────────────────────────────────────────────────┤
│  ENTITIES (gauche)  │  SERVICES (milieu)       │
│                     │  CONTROLLERS (droite)     │
├─────────────────────────────────────────────────┤
│  REPOSITORIES (bas)  │  DTOs (bas droite)      │
└─────────────────────────────────────────────────┘
```

---

## 📦 Étape 4 : Créer les ENUMS (5 classes)

### 4.1 Créer un Enum
1. Glissez une **"Class"** depuis la palette UML
2. Double-cliquez pour éditer
3. Nom : `Role`
4. Dans les propriétés (panneau de droite), ajoutez le stéréotype : `<<enumeration>>`
5. Ajoutez les valeurs dans la section "Attributes" :
   ```
   MEDECIN
   SECRETAIRE
   ADMINISTRATEUR
   ```

**Répétez pour :**
- `StatutRendezVous` (CONFIRME, ANNULE, EN_ATTENTE, TERMINE)
- `StatutFacture` (PAYEE, NON_PAYEE, PARTIELLEMENT_PAYEE)
- `ModePaiement` (ESPECES, CARTE, ASSURANCE)
- `TypeConsultation` (CONSULTATION, CONTROLE)

**Style :** Couleur de fond légère (violet clair recommandé)

---

## 🏗️ Étape 5 : Créer les ENTITIES (8 classes)

### 5.1 Cabinet
1. Glissez une **"Class"**
2. Nom : `Cabinet`
3. Stéréotype : `<<entity>>`
4. **Attributes (section supérieure)** :
   ```
   - id: Long
   - logo: String
   - nom: String
   - specialite: String
   - adresse: String
   - tel: String
   - actif: Boolean
   ```
5. Pas de méthodes

**Style :** Bleu clair (#E3F2FD)

### 5.2 Utilisateur
1. Créez une classe `Utilisateur`
2. **Attributes** :
   ```
   - id: Long
   - login: String {unique}
   - pwd: String
   - nom: String
   - prenom: String
   - numTel: String
   - signature: String
   - role: Role
   ```
3. Pas de méthodes (les relations sont dans le diagramme)

**Style :** Bleu clair (#E3F2FD)

### 5.3 Patient
**Attributes :**
```
- id: Long
- cin: String {unique}
- nom: String
- prenom: String
- dateNaissance: LocalDate
- sexe: String
- numTel: String
- typemutuelle: String
```

### 5.4 RendezVous
**Attributes :**
```
- idRendezVous: Long
- dateRdv: LocalDate
- heureRdv: LocalTime
- motif: String
- statut: StatutRendezVous
- notes: String
```

### 5.5 Consultation
**Attributes :**
```
- idConsultation: Long
- type: TypeConsultation
- dateConsultation: LocalDate
- examenClinique: String
- examenSupplementaire: String
- diagnostic: String
- traitement: String
- observations: String
```

### 5.6 Facture
**Attributes :**
```
- idFacture: Long
- montant: BigDecimal
- modePaiement: ModePaiement
- statut: StatutFacture
- dateCreation: LocalDateTime
```

### 5.7 DossierMedical
**Attributes :**
```
- idDossier: Long
- antMedicaux: String
- antChirug: String
- allergies: String
- traitement: String
- habitudes: String
- documentsMedicaux: String
- dateCreation: LocalDateTime
```

### 5.8 Medicament
**Attributes :**
```
- id: Long
- nom: String {unique}
- dosage: String
- forme: String
- description: String
```

---

## 🔗 Étape 6 : Créer les RELATIONS entre Entities

### 6.1 Utiliser les flèches UML
1. Dans la palette, sélectionnez les **flèches d'association**
2. Glissez depuis une classe vers une autre

### 6.2 Relations à créer :

#### Relations ManyToOne (flèche simple) :
- `Utilisateur` → `Cabinet` (label: "cabinet", cardinalité: * → 1)
- `Patient` → `Cabinet` (label: "cabinet", cardinalité: * → 1)
- `RendezVous` → `Patient` (label: "patient", cardinalité: * → 1)
- `RendezVous` → `Utilisateur` (label: "medecin", cardinalité: * → 1)
- `RendezVous` → `Cabinet` (label: "cabinet", cardinalité: * → 1)
- `Consultation` → `Utilisateur` (label: "medecin", cardinalité: * → 1)
- `Consultation` → `Patient` (label: "patient", cardinalité: * → 1)
- `Consultation` → `DossierMedical` (label: "dossierMedical", cardinalité: * → 1)
- `Facture` → `Patient` (label: "patient", cardinalité: * → 1)
- `Facture` → `Cabinet` (label: "cabinet", cardinalité: * → 1)

#### Relations OneToOne (flèche avec "1" aux deux extrémités) :
- `Patient` ↔ `DossierMedical` (bidirectionnel, label: "dossierMedical")
- `RendezVous` ↔ `Consultation` (bidirectionnel, label: "consultation")
- `Facture` → `Consultation` (label: "consultation", cardinalité: 1 → 0..1)

#### Relations OneToMany (flèche avec "1" → "*") :
- `Utilisateur` → `Consultation` (label: "consultations", cardinalité: 1 → *)
- `Utilisateur` → `RendezVous` (label: "rendezVous", cardinalité: 1 → *)
- `Patient` → `RendezVous` (label: "rendezVous", cardinalité: 1 → *)
- `Patient` → `Facture` (label: "factures", cardinalité: 1 → *)
- `DossierMedical` → `Consultation` (label: "historiqueConsultations", cardinalité: 1 → *)

#### Relations vers Enums (flèche pointillée) :
- `Utilisateur` ..> `Role` (dependency)
- `RendezVous` ..> `StatutRendezVous` (dependency)
- `Facture` ..> `ModePaiement` (dependency)
- `Facture` ..> `StatutFacture` (dependency)
- `Consultation` ..> `TypeConsultation` (dependency)

---

## 📋 Étape 7 : Créer les DTOs (4 classes)

1. Créez 4 classes dans une section séparée (en haut à droite)
2. **Stéréotype :** `<<DTO>>`
3. **Style :** Vert clair (#E8F5E9)

### 7.1 AuthRequest
**Attributes :**
```
+ login: String
+ pwd: String
```

### 7.2 AuthResponse
**Attributes :**
```
+ token: String
+ login: String
+ role: String
+ userId: Long
+ cabinetId: Long
+ nom: String
+ prenom: String
```

### 7.3 UserMeDto
**Attributes :**
```
+ id: Long
+ login: String
+ nom: String
+ prenom: String
+ role: String
+ cabinetId: Long
```

### 7.4 UpdateProfileRequest
**Attributes :**
```
+ nom: String
+ prenom: String
```

---

## 🔌 Étape 8 : Créer les REPOSITORIES (8 interfaces)

1. Créez 8 interfaces
2. **Stéréotype :** `<<interface>>` ou `<<repository>>`
3. **Style :** Jaune clair (#FFF9C4)
4. Placez-les en bas du diagramme

### Repositories à créer :
- `UtilisateurRepository`
- `PatientRepository`
- `CabinetRepository`
- `RendezVousRepository`
- `ConsultationRepository`
- `FactureRepository`
- `DossierMedicalRepository`
- `MedicamentRepository`

### Relations Repository → Entity :
- Chaque Repository est relié à son Entity correspondante avec une flèche pointillée (dependency)

### Créer JpaRepository (interface générique) :
- Créez une interface `JpaRepository<T, ID>` (style gris)
- Les Repositories héritent de cette interface (flèche triangulaire)

---

## 🎯 Étape 9 : Créer les SERVICES (10 classes)

1. Créez 10 classes au milieu du diagramme
2. **Stéréotype :** `<<service>>`
3. **Style :** Orange clair (#FFE0B2)

### Services :
- `AuthService` (avec méthodes : `authenticate()`)
- `PatientService`
- `RendezVousService`
- `ConsultationService`
- `FactureService`
- `MedicamentService`
- `CabinetService`
- `DossierMedicalService`
- `DashboardService`
- `CustomUserDetailsService`

### Relations Service → Repository :
- Chaque Service est relié à son Repository avec une flèche pointillée (dependency)

---

## 🌐 Étape 10 : Créer les CONTROLLERS (9 classes)

1. Créez 9 classes en haut à droite
2. **Stéréotype :** `<<controller>>`
3. **Style :** Rose clair (#FCE4EC)

### Controllers :
- `AuthController` (méthode : `login()`)
- `PatientController`
- `RendezVousController`
- `MedecinController`
- `FactureController`
- `MedicamentController`
- `AdminController`
- `UserController`
- `NotificationController`

### Relations Controller → Service :
- Chaque Controller est relié à son Service avec une flèche pointillée (dependency)

### Relations Controller → DTO :
- `AuthController` → `AuthRequest` (flèche pointillée)
- `AuthController` → `AuthResponse` (flèche pointillée)

---

## 🔒 Étape 11 : Créer les classes SECURITY (3 classes)

1. Créez 3 classes dans une section séparée
2. **Stéréotype :** `<<security>>`
3. **Style :** Rouge clair (#FFCDD2)

### Classes :
- `JwtUtil` (méthodes : `generateToken()`, `validateToken()`, etc.)
- `JwtRequestFilter`
- `CustomUserDetailsService` (déjà créé dans Services, juste relier)

### Relations :
- `JwtRequestFilter` → `JwtUtil` (dependency)
- `JwtRequestFilter` → `CustomUserDetailsService` (dependency)
- `AuthService` → `JwtUtil` (dependency)

---

## ⚙️ Étape 12 : Créer les classes CONFIG (4 classes)

1. Créez 4 classes
2. **Stéréotype :** `<<configuration>>`
3. **Style :** Gris clair (#F5F5F5)

### Classes :
- `SecurityConfig` (méthodes : `filterChain()`, `passwordEncoder()`, etc.)
- `JacksonConfig`
- `DataInitializer`
- `CabinetMedicalApplication`

### Relations :
- `SecurityConfig` → `JwtRequestFilter` (dependency)

---

## ✨ Étape 13 : Finaliser et Styliser

### 13.1 Ajouter des Groupes (optionnel)
- Groupez les Entities ensemble
- Groupez les Services ensemble
- Groupez les Controllers ensemble

### 13.2 Aligner et Organiser
- Utilisez l'outil "Align" pour aligner les classes
- Espacez uniformément

### 13.3 Ajouter un Titre
- Ajoutez une zone de texte en haut : "Cabinet Médical - Diagramme de Classe Complet"

### 13.4 Ajouter une Légende
- Créez une légende en bas à droite expliquant les couleurs :
  - Bleu = Entities
  - Vert = DTOs
  - Jaune = Repositories
  - Orange = Services
  - Rose = Controllers
  - Rouge = Security
  - Gris = Config
  - Violet = Enums

---

## 💾 Étape 14 : Sauvegarder et Exporter

1. **Sauvegarder dans Draw.io :**
   - Fichier → Enregistrer sous → Choisir (Device, Google Drive, etc.)

2. **Exporter :**
   - Fichier → Exporter en tant que → PNG (haute résolution)
   - OU → SVG (pour édition future)
   - OU → PDF (pour documentation)

---

## 🎉 C'est terminé !

Votre diagramme de classe complet est maintenant créé dans Draw.io et vous pouvez le modifier visuellement à tout moment !

---

**Astuce :** Si vous voulez partager le diagramme, vous pouvez :
- Exporter en PNG et partager l'image
- Sauvegarder dans Google Drive et partager le lien
- Exporter en XML et l'importer dans Lucidchart (si nécessaire)



