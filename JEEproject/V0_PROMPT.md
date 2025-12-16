# Prompt pour V0 by Vercel - Frontend Cabinet Médical

## Description du Projet
Créer une application web moderne de gestion de cabinet médical avec React/Next.js. L'application doit permettre la gestion des patients, rendez-vous, consultations, dossiers médicaux, facturation, et inclure un système d'authentification avec différents rôles (Médecin, Secrétaire, Administrateur).

## Architecture Backend
- **Base URL**: `http://localhost:8080`
- **Authentification**: JWT (JSON Web Tokens)
- **Format des réponses**: JSON

## Pages et Fonctionnalités Requises

### 1. Page de Connexion (`/login`)
- Formulaire de connexion avec champs `login` et `pwd`
- POST vers `/api/auth/login`
- Stocker le token JWT dans localStorage
- Rediriger selon le rôle :
  - ADMINISTRATEUR → `/admin/dashboard`
  - MEDECIN → `/medecin/dashboard`
  - SECRETAIRE → `/secretaire/dashboard`

### 2. Dashboard Médecin (`/medecin/dashboard`)
**Fonctionnalités:**
- Afficher les statistiques (GET `/api/medecin/dashboard?cabinetId=X&medecinId=Y`)
- Liste des rendez-vous du jour (GET `/api/medecin/rendez-vous/aujourdhui?medecinId=Y`)
- Notification du patient en cours (GET `/api/notifications/patient-en-cours?medecinId=Y`)
- Recherche de patients (GET `/api/medecin/patients/search?cabinetId=X&search=terme`)
- Bouton pour consulter le dossier médical d'un patient

**Composants:**
- Cards de statistiques (patients totaux, consultations, rendez-vous du jour)
- Tableau des rendez-vous du jour avec statut
- Barre de recherche de patients
- Notification toast pour le patient en cours

### 3. Page Consultation Patient (`/medecin/patient/:id`)
**Fonctionnalités:**
- Afficher les informations du patient (GET `/api/medecin/patients/{id}`)
- Afficher le dossier médical (GET `/api/medecin/patients/{id}/dossier`)
- Historique des consultations (GET `/api/medecin/patients/{id}/consultations`)
- Formulaire pour créer une consultation (POST `/api/medecin/consultations`)
- Formulaire pour mettre à jour le dossier médical (PUT `/api/medecin/patients/{id}/dossier`)

**Composants:**
- Informations patient (nom, prénom, CIN, date de naissance, etc.)
- Onglets: Dossier Médical, Historique Consultations, Nouvelle Consultation
- Formulaire consultation avec:
  - Type (consultation/contrôle)
  - Examen clinique (textarea)
  - Examen supplémentaire (textarea)
  - Diagnostic (textarea)
  - Traitement (textarea avec autocomplétion médicaments)
  - Observations (textarea)
- Bouton pour imprimer l'ordonnance (format PDF ou impression navigateur)

### 4. Dashboard Secrétaire (`/secretaire/dashboard`)
**Fonctionnalités:**
- Liste des patients (GET `/api/secretaire/patients?cabinetId=X`)
- Recherche de patients par CIN ou nom (GET `/api/secretaire/patients/search?cabinetId=X&search=terme`)
- Liste des rendez-vous (GET `/api/secretaire/rendez-vous?cabinetId=X`)
- Liste des factures (GET `/api/secretaire/factures?cabinetId=X`)

**Composants:**
- Onglets: Patients, Rendez-vous, Factures
- Tableau avec actions (modifier, supprimer)
- Formulaire modal pour créer/modifier patient
- Formulaire modal pour créer/modifier rendez-vous
- Formulaire modal pour créer/modifier facture

### 5. Page Gestion Patients (`/secretaire/patients`)
**Fonctionnalités:**
- Liste complète des patients avec pagination
- Recherche par CIN ou nom
- Créer un nouveau patient (POST `/api/secretaire/patients?cabinetId=X`)
- Modifier un patient (PUT `/api/secretaire/patients/{id}`)
- Supprimer un patient (DELETE `/api/secretaire/patients/{id}`)
- Bouton "Envoyer au médecin" qui met le patient en cours

**Composants:**
- Tableau avec colonnes: CIN, Nom, Prénom, Téléphone, Type Mutuelle
- Modal formulaire patient avec tous les champs
- Bouton d'action pour chaque ligne

### 6. Page Gestion Rendez-vous (`/secretaire/rendez-vous`)
**Fonctionnalités:**
- Liste des rendez-vous avec filtres (date, statut)
- Créer un rendez-vous (POST `/api/secretaire/rendez-vous`)
- Modifier un rendez-vous (PUT `/api/secretaire/rendez-vous/{id}`)
- Changer le statut (PUT `/api/secretaire/rendez-vous/{id}/statut?statut=CONFIRME`)
- Annuler un rendez-vous

**Composants:**
- Calendrier/Tableau des rendez-vous
- Modal formulaire rendez-vous avec:
  - Sélection patient (autocomplete)
  - Sélection médecin (dropdown)
  - Date et heure (datepicker et timepicker)
  - Motif
  - Notes
- Badges de statut (Confirmé, Annulé, En attente, Terminé)

### 7. Page Gestion Factures (`/secretaire/factures`)
**Fonctionnalités:**
- Liste des factures (GET `/api/secretaire/factures?cabinetId=X`)
- Créer une facture (POST `/api/secretaire/factures`)
- Marquer comme payée (PUT `/api/secretaire/factures/{id}/statut?statut=PAYEE`)
- Imprimer une facture (format PDF)

**Composants:**
- Tableau factures avec colonnes: ID, Patient, Montant, Mode Paiement, Statut, Date
- Modal formulaire facture
- Bouton impression facture

### 8. Dashboard Administrateur (`/admin/dashboard`)
**Fonctionnalités:**
- Liste des cabinets (GET `/api/admin/cabinets`)
- Créer/modifier/supprimer un cabinet
- Activer/Désactiver un cabinet (PUT `/api/admin/cabinets/{id}/toggle`)
- Gérer les médicaments (GET `/api/admin/medicaments`)
- Ajouter médicaments en batch (POST `/api/admin/medicaments/batch`)

**Composants:**
- Onglets: Cabinets, Médicaments, Utilisateurs
- Tableaux avec actions CRUD
- Formulaire cabinet avec logo upload
- Formulaire médicament avec autocomplétion

## Design et UI/UX

### Style Général
- Design moderne et professionnel
- Palette de couleurs médicales (bleu/blanc/vert)
- Typographie claire et lisible
- Responsive design (mobile-friendly)
- Animations douces pour les transitions

### Composants UI à Utiliser
- **Shadcn/ui** ou **Material-UI** ou **Ant Design**
- Cards pour les statistiques
- Tables avec pagination et tri
- Modals pour les formulaires
- Toast notifications pour les feedbacks
- Loading states pour les requêtes
- Form validation avec messages d'erreur

### Thème de Couleurs Suggéré
- Primaire: #2563eb (Bleu médical)
- Secondaire: #10b981 (Vert)
- Danger: #ef4444 (Rouge)
- Warning: #f59e0b (Orange)
- Background: #f9fafb (Gris clair)
- Text: #111827 (Gris foncé)

## Gestion d'État
- Utiliser **React Context** ou **Zustand** pour:
  - Authentification (token, utilisateur connecté)
  - Cabinet ID actuel
  - Patient en cours (pour le médecin)

## Intégration API

### Configuration Axios
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Exemple de Requête
```javascript
// Login
const login = async (login, pwd) => {
  const response = await api.post('/api/auth/login', { login, pwd });
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};
```

## Fonctionnalités Spéciales

### 1. Autocomplétion Médicaments
- Utiliser GET `/api/medicaments/search?search=terme`
- Afficher dropdown avec résultats
- Permettre sélection multiple pour les ordonnances

### 2. Impression Ordonnance
- Créer un composant d'ordonnance formatée
- Deux types: Médicaments et Examens supplémentaires
- Signature automatique du médecin (utiliser le champ signature de l'utilisateur)
- Bouton "Imprimer" qui ouvre la fenêtre d'impression

### 3. Notifications Temps Réel
- Polling toutes les 30 secondes pour les rendez-vous du jour
- Notification toast quand un nouveau patient est en cours
- Badge avec nombre de rendez-vous en attente

### 4. Recherche Avancée
- Recherche par CIN (exacte)
- Recherche par nom/prénom (partielle, insensible à la casse)
- Résultats en temps réel pendant la saisie

## Routes Requises

```
/login
/medecin/dashboard
/medecin/patient/:id
/secretaire/dashboard
/secretaire/patients
/secretaire/rendez-vous
/secretaire/factures
/admin/dashboard
/admin/cabinets
/admin/medicaments
```

## Protection des Routes
- Vérifier le token JWT pour chaque route protégée
- Rediriger vers `/login` si non authentifié
- Vérifier le rôle pour accéder aux routes spécifiques

## Gestion des Erreurs
- Afficher des messages d'erreur clairs
- Gérer les erreurs 401 (non autorisé) → rediriger vers login
- Gérer les erreurs 403 (interdit) → afficher message
- Gérer les erreurs réseau → afficher message de connexion

## Performance
- Lazy loading des routes
- Pagination pour les grandes listes
- Debounce pour les recherches
- Cache des données fréquemment utilisées

## Tests à Prévoir
- Tester l'authentification
- Tester la création/modification de patient
- Tester la création de consultation
- Tester l'impression d'ordonnance
- Tester les notifications

---

**Note**: Ce prompt est conçu pour être utilisé avec V0 by Vercel. Adapter selon les besoins spécifiques et les préférences de design.


