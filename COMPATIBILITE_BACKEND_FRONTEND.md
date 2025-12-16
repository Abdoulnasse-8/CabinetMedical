# Rapport de Compatibilité Backend-Frontend

## Résumé
Ce document liste les incompatibilités identifiées entre le backend Java Spring Boot (`JEEproject`) et le frontend Next.js (`front`) créé avec v0, ainsi que les corrections apportées.

## ✅ Corrections Apportées

### 1. Authentification (Login)
**Problème:**
- Backend retourne: `{ token, login, role, userId, cabinetId, nom, prenom }`
- Frontend attendait: `{ token, user }` où `user` est un objet complet

**Solution:**
- Ajout d'une transformation dans `api.login()` pour convertir la réponse backend en format frontend
- Le transformer crée un objet `user` avec tous les champs nécessaires

### 2. Patient
**Problème:**
- Backend utilise: `numTel`, `typemutuelle`, `dateNaissance` (LocalDate)
- Frontend attend: `telephone`, `typeMutuelle`, `dateNaissance` (string ISO)

**Solution:**
- Création de `transformPatient()` et `transformPatientToBackend()` dans `lib/transformers.ts`
- Transformation automatique lors des appels API

### 3. Rendez-vous
**Problème:**
- Backend utilise: `idRendezVous`, `dateRdv` (LocalDate), `heureRdv` (LocalTime)
- Frontend attend: `id`, `dateHeure` (string ISO combinée)

**Solution:**
- Création de `transformRendezVous()` et `transformRendezVousToBackend()`
- Combinaison de `dateRdv` et `heureRdv` en une seule string ISO
- Séparation lors de l'envoi au backend

### 4. Facture
**Problème:**
- Backend utilise: `idFacture`, `dateCreation` (LocalDateTime), statuts: `PAYEE`, `NON_PAYEE`, `PARTIELLEMENT_PAYEE`
- Frontend attend: `id`, `dateFacture` (string ISO), statuts: `EN_ATTENTE`, `PAYEE`, `ANNULEE`

**Solution:**
- Création de `transformFacture()` et `transformFactureToBackend()`
- Mapping des statuts: `NON_PAYEE` → `EN_ATTENTE`, `PARTIELLEMENT_PAYEE` → `EN_ATTENTE`
- Conversion de `dateCreation` en `dateFacture`

### 5. Dossier Médical
**Problème:**
- Backend utilise: `idDossier`, `antMedicaux`, `antChirug`, `traitement`, `habitudes`
- Frontend attend: `id`, `antecedentsMedicaux`, `antecedentsChirurgicaux`, `traitementEnCours`, `habitudes`

**Solution:**
- Création de `transformDossierMedical()` et `transformDossierMedicalToBackend()`
- Mapping des noms de champs lors de la transformation

### 6. Consultation
**Problème:**
- Backend utilise: `idConsultation`, `dateConsultation` (LocalDate)
- Frontend attend: `id`, `dateConsultation` (string ISO)

**Solution:**
- Création de `transformConsultation()`
- Conversion automatique des dates

### 7. Endpoints avec Query Parameters
**Problème:**
- Le backend attend certains paramètres en query params (ex: `patientId`, `medecinId`, `cabinetId` pour créer un rendez-vous)
- Le frontend envoyait tout dans le body

**Solution:**
- Modification des méthodes `createRendezVous()`, `createFacture()`, `createConsultation()` pour extraire les IDs et les mettre en query params
- Le reste des données est envoyé dans le body

## 📋 Fichiers Modifiés

1. **`front/lib/api.ts`**
   - Ajout de transformations pour toutes les méthodes API
   - Correction de la méthode `login()` pour transformer la réponse
   - Extraction des query params pour les endpoints POST

2. **`front/lib/transformers.ts`** (nouveau fichier)
   - Fonctions de transformation backend → frontend
   - Fonctions de transformation frontend → backend
   - Gestion des différences de noms de champs
   - Mapping des enums/statuts

## ⚠️ Points d'Attention Restants

### 1. Endpoint manquant
- Le frontend appelle `/api/secretaire/patients/{id}/envoyer?medecinId=X` mais cet endpoint n'existe pas dans le backend
- **Action requise:** Implémenter cet endpoint ou retirer l'appel dans le frontend

### 2. Dashboard Stats
- Le backend retourne un `Map<String, Object>` pour le dashboard
- Vérifier que tous les champs attendus par le frontend sont présents:
  - `totalPatients` ✅
  - `totalConsultations` ✅
  - `rendezVousAujourdhui` ✅
  - `consultationsAujourdhui` (à vérifier)

### 3. Types de données
- Certains champs optionnels peuvent être `null` côté backend mais `undefined` côté frontend
- Les transformers gèrent cela, mais des tests sont recommandés

### 4. Dates
- Le backend utilise `LocalDate` et `LocalTime` séparés
- Le frontend utilise des strings ISO
- Les transformers gèrent la conversion, mais attention aux timezones

## 🧪 Tests Recommandés

1. **Authentification**
   - [ ] Login avec chaque rôle (ADMINISTRATEUR, MEDECIN, SECRETAIRE)
   - [ ] Vérifier que le token est stocké correctement
   - [ ] Vérifier la redirection selon le rôle

2. **Patients**
   - [ ] Créer un patient
   - [ ] Modifier un patient
   - [ ] Rechercher des patients
   - [ ] Vérifier que les champs sont correctement mappés

3. **Rendez-vous**
   - [ ] Créer un rendez-vous
   - [ ] Modifier un rendez-vous
   - [ ] Changer le statut
   - [ ] Vérifier que les dates/heures sont correctement formatées

4. **Factures**
   - [ ] Créer une facture
   - [ ] Modifier le statut
   - [ ] Vérifier le mapping des statuts

5. **Dossier Médical**
   - [ ] Récupérer un dossier
   - [ ] Modifier un dossier
   - [ ] Vérifier que tous les champs sont mappés

## 📝 Notes Techniques

- Les transformers utilisent `any` pour les types backend car les entités Java sont sérialisées en JSON sans types TypeScript
- Les transformations sont faites côté client pour éviter de modifier le backend
- Si le backend change, il faudra mettre à jour les transformers en conséquence

## 🔄 Prochaines Étapes

1. Tester l'intégration complète entre frontend et backend
2. Vérifier tous les endpoints avec Postman/curl
3. Implémenter l'endpoint manquant `/api/secretaire/patients/{id}/envoyer`
4. Ajouter la gestion d'erreurs pour les cas de transformation échouée
5. Ajouter des logs pour déboguer les transformations si nécessaire

