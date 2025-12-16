# Documentation API - Cabinet Médical Backend

## Base URL
```
http://localhost:8080
```

## Authentification

Toutes les requêtes (sauf `/api/auth/login`) nécessitent un token JWT dans le header:
```
Authorization: Bearer <token>
```

---

## Endpoints d'Authentification

### POST /api/auth/login
Connexion d'un utilisateur.

**Request Body:**
```json
{
  "login": "admin",
  "pwd": "password"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "login": "admin",
  "role": "ADMINISTRATEUR",
  "userId": 1,
  "cabinetId": 1,
  "nom": "Admin",
  "prenom": "System"
}
```

---

## Endpoints Secrétaire

### GET /api/secretaire/patients
Récupérer la liste des patients d'un cabinet.

**Query Parameters:**
- `cabinetId` (required): ID du cabinet

**Response 200:**
```json
[
  {
    "id": 1,
    "cin": "AB123456",
    "nom": "Alami",
    "prenom": "Mohamed",
    "dateNaissance": "1990-01-15",
    "sexe": "M",
    "numTel": "0612345678",
    "typemutuelle": "CNSS"
  }
]
```

### GET /api/secretaire/patients/{id}
Récupérer un patient par ID.

### GET /api/secretaire/patients/cin/{cin}
Récupérer un patient par CIN.

### GET /api/secretaire/patients/search
Rechercher des patients.

**Query Parameters:**
- `cabinetId` (required): ID du cabinet
- `search` (required): Terme de recherche

### POST /api/secretaire/patients
Créer un nouveau patient.

**Request Body:**
```json
{
  "cin": "CD789012",
  "nom": "Bennani",
  "prenom": "Fatima",
  "dateNaissance": "1985-05-20",
  "sexe": "F",
  "numTel": "0623456789",
  "typemutuelle": "CNOPS"
}
```

**Query Parameters:**
- `cabinetId` (required): ID du cabinet

### PUT /api/secretaire/patients/{id}
Modifier un patient.

### DELETE /api/secretaire/patients/{id}
Supprimer un patient.

---

### GET /api/secretaire/rendez-vous
Récupérer la liste des rendez-vous.

**Query Parameters:**
- `cabinetId` (required): ID du cabinet

**Response 200:**
```json
[
  {
    "idRendezVous": 1,
    "dateRdv": "2025-01-15",
    "heureRdv": "10:30:00",
    "motif": "Consultation",
    "statut": "CONFIRME",
    "notes": "Première visite",
    "patient": { ... },
    "medecin": { ... }
  }
]
```

### POST /api/secretaire/rendez-vous
Créer un nouveau rendez-vous.

**Request Body:**
```json
{
  "dateRdv": "2025-01-20",
  "heureRdv": "14:00:00",
  "motif": "Contrôle",
  "notes": "Rappel par SMS"
}
```

**Query Parameters:**
- `patientId` (required): ID du patient
- `medecinId` (required): ID du médecin
- `cabinetId` (required): ID du cabinet

### PUT /api/secretaire/rendez-vous/{id}
Modifier un rendez-vous.

### PUT /api/secretaire/rendez-vous/{id}/statut
Changer le statut d'un rendez-vous.

**Query Parameters:**
- `statut` (required): CONFIRME, ANNULE, EN_ATTENTE, TERMINE

### DELETE /api/secretaire/rendez-vous/{id}
Supprimer un rendez-vous.

---

### GET /api/secretaire/factures
Récupérer la liste des factures.

**Query Parameters:**
- `cabinetId` (required): ID du cabinet

**Response 200:**
```json
[
  {
    "idFacture": 1,
    "montant": 300.00,
    "modePaiement": "ESPECES",
    "statut": "PAYEE",
    "dateCreation": "2025-01-15T10:30:00",
    "patient": { ... }
  }
]
```

### POST /api/secretaire/factures
Créer une nouvelle facture.

**Request Body:**
```json
{
  "montant": 250.00,
  "modePaiement": "CARTE"
}
```

**Query Parameters:**
- `patientId` (required): ID du patient
- `cabinetId` (required): ID du cabinet
- `consultationId` (optional): ID de la consultation

### PUT /api/secretaire/factures/{id}/statut
Marquer une facture comme payée.

**Query Parameters:**
- `statut` (required): PAYEE, NON_PAYEE, PARTIELLEMENT_PAYEE

---

## Endpoints Médecin

### GET /api/medecin/patients/search
Rechercher des patients.

**Query Parameters:**
- `cabinetId` (required): ID du cabinet
- `search` (required): Terme de recherche

### GET /api/medecin/patients/{id}
Récupérer un patient par ID.

### GET /api/medecin/patients/cin/{cin}
Récupérer un patient par CIN.

### GET /api/medecin/patients/{patientId}/dossier
Récupérer le dossier médical d'un patient.

**Response 200:**
```json
{
  "idDossier": 1,
  "antMedicaux": "Hypertension",
  "antChirug": "Appendicectomie 2010",
  "allergies": "Pénicilline",
  "traitement": "Aspirine 100mg/jour",
  "habitudes": "Non fumeur",
  "documentsMedicaux": "analyses_2025.pdf",
  "dateCreation": "2025-01-10T08:00:00",
  "historiqueConsultations": [ ... ]
}
```

### PUT /api/medecin/patients/{patientId}/dossier
Mettre à jour le dossier médical.

**Request Body:**
```json
{
  "antMedicaux": "Hypertension, Diabète",
  "antChirug": "Appendicectomie 2010",
  "allergies": "Pénicilline, Aspirine",
  "traitement": "Métformine 500mg x2/jour",
  "habitudes": "Non fumeur, Sport régulier"
}
```

### GET /api/medecin/patients/{patientId}/consultations
Récupérer l'historique des consultations d'un patient.

**Response 200:**
```json
[
  {
    "idConsultation": 1,
    "type": "CONSULTATION",
    "dateConsultation": "2025-01-15",
    "examenClinique": "TA: 130/80, FC: 72 bpm",
    "examenSupplementaire": "Bilan sanguin demandé",
    "diagnostic": "Hypertension artérielle",
    "traitement": "Amlodipine 5mg/jour",
    "observations": "Contrôle dans 1 mois"
  }
]
```

### POST /api/medecin/consultations
Créer une nouvelle consultation.

**Request Body:**
```json
{
  "type": "CONSULTATION",
  "examenClinique": "TA: 120/75, FC: 68 bpm",
  "examenSupplementaire": "Aucun",
  "diagnostic": "État de santé normal",
  "traitement": "Paracétamol 500mg si douleur",
  "observations": "Patient en bonne santé"
}
```

**Query Parameters:**
- `patientId` (required): ID du patient
- `medecinId` (required): ID du médecin
- `rendezVousId` (optional): ID du rendez-vous associé

### PUT /api/medecin/consultations/{id}
Modifier une consultation.

### GET /api/medecin/rendez-vous/aujourdhui
Récupérer les rendez-vous du jour pour un médecin.

**Query Parameters:**
- `medecinId` (required): ID du médecin

### GET /api/medecin/dashboard
Récupérer les données du dashboard médecin.

**Query Parameters:**
- `cabinetId` (required): ID du cabinet
- `medecinId` (required): ID du médecin

**Response 200:**
```json
{
  "totalPatients": 150,
  "totalRendezVous": 45,
  "totalConsultations": 320,
  "rendezVousAujourdhui": 8,
  "rendezVousConfirmes": 6,
  "totalFactures": 280,
  "facturesPayees": 250,
  "revenusTotal": 75000.00
}
```

---

## Endpoints Administrateur

### GET /api/admin/cabinets
Récupérer tous les cabinets.

### GET /api/admin/cabinets/actifs
Récupérer les cabinets actifs.

### GET /api/admin/cabinets/{id}
Récupérer un cabinet par ID.

### POST /api/admin/cabinets
Créer un nouveau cabinet.

**Request Body:**
```json
{
  "nom": "Cabinet Ophtalmologique",
  "specialite": "Ophtalmologue",
  "adresse": "456 Avenue Mohammed V, Rabat",
  "tel": "0537123456",
  "logo": "base64_encoded_image_or_url"
}
```

### PUT /api/admin/cabinets/{id}
Modifier un cabinet.

### PUT /api/admin/cabinets/{id}/toggle
Activer/Désactiver un cabinet.

### DELETE /api/admin/cabinets/{id}
Supprimer un cabinet.

### POST /api/admin/cabinets/{cabinetId}/utilisateurs
Créer un utilisateur pour un cabinet.

**Request Body:**
```json
{
  "login": "medecin2",
  "pwd": "password123",
  "nom": "Khalil",
  "prenom": "Sara",
  "numTel": "0611111111",
  "role": "MEDECIN",
  "signature": "Dr. S. Khalil"
}
```

### GET /api/admin/cabinets/{cabinetId}/utilisateurs
Récupérer les utilisateurs d'un cabinet.

---

### GET /api/admin/medicaments
Récupérer tous les médicaments.

### GET /api/admin/medicaments/search
Rechercher des médicaments.

**Query Parameters:**
- `search` (required): Terme de recherche

**Response 200:**
```json
[
  {
    "id": 1,
    "nom": "Paracétamol",
    "dosage": "500mg",
    "forme": "Comprimé",
    "description": "Antalgique et antipyrétique"
  }
]
```

### POST /api/admin/medicaments
Créer un médicament.

**Request Body:**
```json
{
  "nom": "Ibuprofène",
  "dosage": "400mg",
  "forme": "Comprimé",
  "description": "Anti-inflammatoire"
}
```

### POST /api/admin/medicaments/batch
Créer plusieurs médicaments en une fois.

**Request Body:**
```json
[
  {
    "nom": "Médicament 1",
    "dosage": "100mg",
    "forme": "Gélule",
    "description": "Description 1"
  },
  {
    "nom": "Médicament 2",
    "dosage": "200mg",
    "forme": "Comprimé",
    "description": "Description 2"
  }
]
```

### PUT /api/admin/medicaments/{id}
Modifier un médicament.

### DELETE /api/admin/medicaments/{id}
Supprimer un médicament.

---

## Endpoints Publics (Médicaments)

### GET /api/medicaments/search
Rechercher des médicaments (pour autocomplétion).

**Query Parameters:**
- `search` (required): Terme de recherche

---

## Endpoints Notifications

### GET /api/notifications/rendez-vous/aujourdhui
Récupérer les rendez-vous du jour pour notifications.

**Query Parameters:**
- `medecinId` (required): ID du médecin

**Response 200:**
```json
{
  "count": 5,
  "rendezVous": [ ... ]
}
```

### GET /api/notifications/patient-en-cours
Récupérer le patient en cours pour un médecin.

**Query Parameters:**
- `medecinId` (required): ID du médecin

**Response 200:**
```json
{
  "patientEnCours": {
    "id": 1,
    "cin": "AB123456",
    "nom": "Alami",
    "prenom": "Mohamed",
    ...
  },
  "rendezVous": {
    "idRendezVous": 1,
    "dateRdv": "2025-01-15",
    "heureRdv": "10:30:00",
    ...
  }
}
```

---

## Codes de Statut HTTP

- `200 OK`: Requête réussie
- `201 Created`: Ressource créée avec succès
- `204 No Content`: Suppression réussie
- `400 Bad Request`: Requête invalide
- `401 Unauthorized`: Non authentifié
- `403 Forbidden`: Accès interdit (mauvais rôle)
- `404 Not Found`: Ressource non trouvée
- `500 Internal Server Error`: Erreur serveur

## Format des Erreurs

```json
{
  "error": "Message d'erreur descriptif"
}
```

## Exemples d'Utilisation

### Exemple: Créer un patient et un rendez-vous

```bash
# 1. Se connecter
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"secretaire1","pwd":"password"}' | jq -r '.token')

# 2. Créer un patient
curl -X POST "http://localhost:8080/api/secretaire/patients?cabinetId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cin": "CD789012",
    "nom": "Bennani",
    "prenom": "Fatima",
    "dateNaissance": "1985-05-20",
    "sexe": "F",
    "numTel": "0623456789",
    "typemutuelle": "CNOPS"
  }'

# 3. Créer un rendez-vous
curl -X POST "http://localhost:8080/api/secretaire/rendez-vous?patientId=1&medecinId=2&cabinetId=1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "dateRdv": "2025-01-20",
    "heureRdv": "14:00:00",
    "motif": "Consultation",
    "notes": "Première visite"
  }'
```

---

**Note**: Cette documentation peut être testée avec Postman, Insomnia, ou curl.

