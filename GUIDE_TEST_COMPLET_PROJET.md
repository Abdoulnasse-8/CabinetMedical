# 🧪 Guide de Test Complet - Cabinet Médical

## 📋 Table des Matières

1. [Prérequis et Configuration](#prérequis)
2. [Tests d'Authentification](#authentification)
3. [Tests Secrétaire](#secrétaire)
4. [Tests Médecin](#médecin)
5. [Tests Administrateur](#administrateur)
6. [Tests des Nouvelles Fonctionnalités](#nouvelles-fonctionnalités)
7. [Checklist Finale](#checklist-finale)

---

## 🔧 Prérequis et Configuration {#prérequis}

### 1. Démarrage des Services

#### Backend
```bash
cd JEEproject
mvn spring-boot:run
```
**Vérification :** Attendez `Started CabinetMedicalApplication` sur le port 8080

#### Frontend
```bash
cd front
npm install  # Seulement la première fois
npm run dev
```
**Vérification :** Attendez `ready started server on 0.0.0.0:3000`

#### Base de Données
- MySQL doit être démarré
- Base de données : `cabinet_medical`
- Port : 3306

### 2. Comptes de Test

Tous les comptes ont le mot de passe : **`password`**

- **Administrateur** : `admin` / `password`
- **Médecin** : `medecin1` / `password`
- **Secrétaire** : `secretaire1` / `password`

---

## 🔐 Tests d'Authentification {#authentification}

### TEST AUTH 1 : Connexion

1. **Accéder à la page de connexion**
   - Ouvrez : http://localhost:3000/login
   - ✅ La page de connexion s'affiche

2. **Se connecter comme médecin**
   - Login : `medecin1`
   - Password : `password`
   - Cliquez sur "Se connecter"
   - ✅ Redirection vers le dashboard médecin

3. **Se connecter comme secrétaire**
   - Déconnectez-vous
   - Login : `secretaire1`
   - Password : `password`
   - ✅ Redirection vers le dashboard secrétaire

4. **Se connecter comme administrateur**
   - Déconnectez-vous
   - Login : `admin`
   - Password : `password`
   - ✅ Redirection vers le dashboard admin

### TEST AUTH 2 : Gestion des Sessions

1. **Token JWT**
   - ✅ Le token est stocké dans localStorage
   - ✅ Le token est envoyé dans les en-têtes des requêtes

2. **Déconnexion**
   - Cliquez sur "Déconnexion"
   - ✅ Redirection vers /login
   - ✅ Token supprimé du localStorage

---

## 👩‍💼 Tests Secrétaire {#secrétaire}

### TEST SEC 1 : Gestion des Patients

#### Créer un Patient

1. Allez dans "Patients"
2. Cliquez sur "Nouveau Patient"
3. Remplissez le formulaire :
   ```
   CIN: AB123456
   Nom: Dupont
   Prénom: Jean
   Date de naissance: 15/05/1990
   Sexe: Masculin
   Téléphone: 0612345678
   Type mutuelle: CNSS
   ```
4. Cliquez sur "Enregistrer"
5. ✅ Le patient apparaît dans la liste

#### Rechercher un Patient

1. Dans la barre de recherche, tapez : "Dupont"
2. ✅ Les résultats s'affichent en temps réel
3. Testez avec le CIN : "AB123456"
4. ✅ La recherche fonctionne par nom et CIN

#### Modifier un Patient

1. Cliquez sur "Modifier" sur un patient
2. Modifiez le téléphone
3. Cliquez sur "Enregistrer"
4. ✅ Les modifications sont sauvegardées

#### Envoyer Patient au Médecin

1. Cliquez sur "Envoyer au médecin" (icône d'envoi)
2. ✅ Le patient est envoyé au médecin

### TEST SEC 2 : Gestion des Rendez-vous

#### Créer un Rendez-vous

1. Allez dans "Rendez-vous"
2. Cliquez sur "Nouveau Rendez-vous"
3. Remplissez :
   ```
   Patient: [Sélectionner un patient]
   Médecin: [Sélectionner un médecin]
   Date: [Date future]
   Heure: [Heure disponible]
   Motif: Consultation générale
   ```
4. Cliquez sur "Enregistrer"
5. ✅ Le rendez-vous apparaît dans la liste

#### Modifier un Rendez-vous

1. Cliquez sur "Modifier" sur un rendez-vous
2. Changez l'heure
3. ✅ Les modifications sont sauvegardées

#### Annuler un Rendez-vous

1. Cliquez sur le menu (⋮) d'un rendez-vous
2. Sélectionnez "Annuler"
3. ✅ Le statut passe à "Annulé"

### TEST SEC 3 : Gestion des Factures

#### Créer une Facture

1. Allez dans "Factures"
2. Cliquez sur "Nouvelle Facture"
3. Remplissez :
   ```
   Patient: [Sélectionner]
   Montant: 500
   Mode de paiement: Espèces
   Notes: Consultation du jour
   ```
4. Cliquez sur "Enregistrer"
5. ✅ La facture apparaît dans la liste

#### Imprimer une Facture ⭐ NOUVEAU

1. Cliquez sur l'icône d'impression (🖨️) sur une facture
2. ✅ Une fenêtre modale s'ouvre avec la facture formatée
3. Vérifiez :
   - ✅ Informations du cabinet (logo, nom, adresse)
   - ✅ Informations du patient
   - ✅ Détails de la facture
   - ✅ Montant formaté en DH
4. Cliquez sur "Imprimer la facture"
5. ✅ La fenêtre d'impression s'ouvre
6. ✅ Le format est professionnel et adapté à l'impression

#### Marquer Facture comme Payée

1. Cliquez sur le menu (⋮) d'une facture
2. Sélectionnez "Marquer payée"
3. ✅ Le statut passe à "Payée" (badge vert)

---

## 👨‍⚕️ Tests Médecin {#médecin}

### TEST MED 1 : Recherche de Patients

1. Allez dans le Dashboard médecin
2. Dans la barre de recherche, tapez un nom de patient
3. ✅ Les résultats s'affichent
4. Testez avec un CIN
5. ✅ La recherche fonctionne par nom et CIN

### TEST MED 2 : Consultation du Dossier Médical

1. Sélectionnez un patient dans les résultats de recherche
2. Cliquez pour accéder au dossier
3. ✅ La page du patient s'ouvre avec 3 onglets :
   - Dossier Médical
   - Historique
   - Nouvelle Consultation

#### Remplir le Dossier Médical ⭐ AMÉLIORÉ

1. Dans l'onglet "Dossier Médical"
2. Cliquez sur "Modifier"
3. Remplissez tous les champs :
   ```
   Antécédents Médicaux: Diabète type 2
   Antécédents Chirurgicaux: Appendicectomie 2010
   Allergies: Pénicilline
   Traitement en Cours: Metformine 500mg
   Habitudes: Non fumeur
   Documents Médicaux: Bilan sanguin du 15/01/2025
   ```
4. Cliquez sur "Enregistrer"
5. ✅ Les données sont sauvegardées
6. Rechargez la page
7. ✅ Les données persistent

### TEST MED 3 : Créer une Consultation

1. Dans l'onglet "Nouvelle Consultation"
2. Remplissez :
   ```
   Type: Consultation
   Examen Clinique: Température 37°C, Tension normale
   Examen Supplémentaire: Bilan sanguin, Radiographie thorax
   Diagnostic: Infection respiratoire légère
   Traitement: [Utiliser l'autocomplétion des médicaments]
   Observations: Repos recommandé
   ```
3. **Utiliser l'autocomplétion des médicaments :**
   - Tapez dans "Rechercher un médicament"
   - ✅ Les résultats s'affichent
   - Sélectionnez des médicaments
   - ✅ Ils sont ajoutés à la prescription
4. Cliquez sur "Enregistrer la consultation"
5. ✅ La consultation est créée
6. ✅ Vous êtes redirigé vers l'onglet "Historique"

### TEST MED 4 : Impression des Ordonnances ⭐ NOUVEAU

#### Ordonnance Médicaments

1. Dans l'onglet "Historique"
2. Trouvez une consultation avec traitement
3. Cliquez sur **"Ordonnance Médicaments"**
4. ✅ Une fenêtre modale s'ouvre
5. Vérifiez :
   - ✅ Titre : "ORDONNANCE MÉDICALE"
   - ✅ Informations du médecin et patient
   - ✅ Section "PRESCRIPTION MÉDICAMENTEUSE" avec le traitement
   - ✅ Signature automatique en bas
6. Cliquez sur "Imprimer l'ordonnance médicaments"
7. ✅ La fenêtre d'impression s'ouvre
8. ✅ Seul le traitement est affiché

#### Ordonnance Examens

1. Dans l'onglet "Historique"
2. Trouvez une consultation avec examens complémentaires
3. Cliquez sur **"Ordonnance Examens"**
4. ✅ Une fenêtre modale s'ouvre
5. Vérifiez :
   - ✅ Titre : "ORDONNANCE D'EXAMENS COMPLÉMENTAIRES"
   - ✅ Section "EXAMENS COMPLÉMENTAIRES PRESCRITS"
   - ✅ Diagnostic affiché (si présent)
   - ✅ Signature automatique
6. Cliquez sur "Imprimer l'ordonnance examens"
7. ✅ La fenêtre d'impression s'ouvre
8. ✅ Seuls les examens sont affichés

#### Cas Limites

1. **Consultation avec traitement seulement**
   - ✅ Seul le bouton "Ordonnance Médicaments" apparaît

2. **Consultation avec examens seulement**
   - ✅ Seul le bouton "Ordonnance Examens" apparaît

3. **Consultation sans traitement ni examens**
   - ✅ Aucun bouton d'ordonnance n'apparaît

### TEST MED 5 : Dashboard Médecin

1. Allez dans le Dashboard
2. Vérifiez les statistiques :
   - ✅ Nombre de patients aujourd'hui
   - ✅ Nombre de consultations
   - ✅ Rendez-vous du jour
3. Vérifiez les rendez-vous :
   - ✅ Liste des rendez-vous du jour
   - ✅ Statuts colorés (Confirmé, En attente, etc.)
4. Vérifiez le patient en cours :
   - ✅ Informations du patient actuellement en consultation

### TEST MED 6 : Notifications

1. Vérifiez la cloche de notifications
2. ✅ Les notifications s'affichent :
   - Rendez-vous du jour
   - Patient en cours (pour médecin)
   - Rendez-vous en attente (pour secrétaire)

---

## 👨‍💼 Tests Administrateur {#administrateur}

### TEST ADMIN 1 : Gestion des Cabinets

#### Créer un Cabinet

1. Allez dans "Cabinets"
2. Cliquez sur "Nouveau Cabinet"
3. Remplissez :
   ```
   Nom: Cabinet Médical Test
   Spécialité: Généraliste
   Adresse: 123 Rue Test
   Téléphone: 0612345678
   Logo: [Optionnel - URL d'image]
   ```
4. Cliquez sur "Enregistrer"
5. ✅ Le cabinet apparaît dans la liste

#### Activer/Désactiver un Cabinet

1. Cliquez sur "Activer/Désactiver" sur un cabinet
2. ✅ Le statut change
3. ✅ L'icône change (actif/inactif)

#### Créer un Utilisateur pour un Cabinet

1. Sélectionnez un cabinet
2. Créez un utilisateur :
   ```
   Login: nouveauuser
   Nom: Nouveau
   Prénom: User
   Rôle: Médecin
   Téléphone: 0611111111
   ```
3. ✅ L'utilisateur est créé et associé au cabinet

### TEST ADMIN 2 : Gestion des Médicaments

#### Ajouter un Médicament

1. Allez dans "Médicaments"
2. Cliquez sur "Nouveau Médicament"
3. Remplissez :
   ```
   Nom: Paracétamol
   Dosage: 500mg
   Forme: Comprimé
   Description: Antalgique et antipyrétique
   ```
4. Cliquez sur "Enregistrer"
5. ✅ Le médicament apparaît dans la liste

#### Rechercher un Médicament

1. Utilisez la barre de recherche
2. Tapez "Paracétamol"
3. ✅ Les résultats s'affichent
4. ✅ La recherche fonctionne (utilisée pour l'autocomplétion dans les consultations)

#### Import en Lot

1. Utilisez la fonctionnalité d'import en lot
2. ✅ Plusieurs médicaments peuvent être ajoutés en une fois

---

## ⭐ Tests des Nouvelles Fonctionnalités {#nouvelles-fonctionnalités}

### TEST NOUV 1 : Ordonnances Séparées (Médecin)

**Scénario complet :**

1. **Créer une consultation avec traitement ET examens**
   ```
   Traitement: Paracétamol 500mg x3/jour
   Examens: Bilan sanguin, Radiographie
   ```

2. **Vérifier les boutons**
   - ✅ 2 boutons distincts apparaissent
   - ✅ "Ordonnance Médicaments"
   - ✅ "Ordonnance Examens"

3. **Tester l'impression médicaments**
   - ✅ Contenu : uniquement le traitement
   - ✅ Signature automatique
   - ✅ Format professionnel

4. **Tester l'impression examens**
   - ✅ Contenu : uniquement les examens
   - ✅ Diagnostic affiché
   - ✅ Signature automatique

### TEST NOUV 2 : Signature Automatique

1. **Vérifier sur Ordonnance Médicaments**
   - ✅ Nom du médecin affiché
   - ✅ Signature (texte ou image) affichée
   - ✅ "Signature et cachet du médecin" présent

2. **Vérifier sur Ordonnance Examens**
   - ✅ Même vérifications

3. **Vérifier que la signature est automatique**
   - ✅ Pas besoin de saisir manuellement
   - ✅ La signature du compte médecin est utilisée

### TEST NOUV 3 : Dossier Médical Complet

1. **Vérifier tous les champs modifiables**
   - ✅ Antécédents Médicaux
   - ✅ Antécédents Chirurgicaux
   - ✅ Allergies
   - ✅ Traitement en Cours
   - ✅ Habitudes
   - ✅ Documents Médicaux

2. **Tester la sauvegarde**
   - ✅ Données persistantes après rechargement
   - ✅ Modification fonctionnelle
   - ✅ Annulation fonctionnelle

### TEST NOUV 4 : Impression Factures (Secrétaire)

1. **Créer une facture**
2. **Imprimer la facture**
3. **Vérifier le contenu :**
   - ✅ Logo et informations du cabinet
   - ✅ Informations complètes du patient
   - ✅ Détails de facturation (date, mode, statut)
   - ✅ Montant formaté en DH
   - ✅ Design professionnel

4. **Tester l'impression**
   - ✅ Format adapté à l'impression
   - ✅ Toutes les informations visibles

---

## ✅ Checklist Finale {#checklist-finale}

### Fonctionnalités Core

#### Secrétaire
- [ ] Création, modification, suppression de patients
- [ ] Recherche de patients (nom, CIN)
- [ ] Envoi patient au médecin
- [ ] Création, modification, annulation de rendez-vous
- [ ] Création, modification de factures
- [ ] Impression de factures ⭐
- [ ] Validation du paiement

#### Médecin
- [ ] Recherche de patients (nom, CIN)
- [ ] Consultation du dossier médical
- [ ] Modification du dossier médical ⭐
- [ ] Création de consultations
- [ ] Autocomplétion des médicaments
- [ ] Impression ordonnance médicaments ⭐
- [ ] Impression ordonnance examens ⭐
- [ ] Signature automatique ⭐
- [ ] Consultation du dashboard
- [ ] Gestion des rendez-vous

#### Administrateur
- [ ] Création, modification, suppression de cabinets
- [ ] Activation/désactivation de cabinets
- [ ] Création d'utilisateurs
- [ ] Gestion des médicaments
- [ ] Recherche de médicaments

### Nouvelles Fonctionnalités ⭐

- [ ] Séparation des 2 types d'ordonnances
- [ ] Signature automatique sur ordonnances
- [ ] Dossier médical complet et modifiable
- [ ] Impression professionnelle des factures

### Authentification et Sécurité

- [ ] Connexion avec les 3 rôles
- [ ] Protection des routes par rôle
- [ ] Gestion des tokens JWT
- [ ] Déconnexion fonctionnelle

### Interface et UX

- [ ] Design cohérent sur toutes les pages
- [ ] Messages d'erreur clairs
- [ ] Messages de succès
- [ ] Loading states appropriés
- [ ] Responsive design (mobile/tablette)

---

## 🐛 Tests de Cas Limites

### Test 1 : Données Manquantes

1. **Tenter de créer un patient sans CIN**
   - ✅ Message d'erreur affiché

2. **Tenter de créer un rendez-vous sans patient**
   - ✅ Message d'erreur affiché

### Test 2 : Recherches Vides

1. **Recherche patient avec champ vide**
   - ✅ Aucun résultat ou liste complète

2. **Recherche médicament sans résultat**
   - ✅ Message "Aucun résultat"

### Test 3 : Impressions

1. **Impression ordonnance sans traitement**
   - ✅ Message "Aucun traitement prescrit"

2. **Impression ordonnance sans examens**
   - ✅ Message "Aucun examen prescrit"

3. **Impression facture sans cabinet configuré**
   - ✅ Fonctionne sans logo si non configuré

---

## 📊 Résultats Attendus

### Taux de Réussite Minimum : 95%

**Tous les tests doivent passer pour :**
- ✅ Authentification et sécurité
- ✅ CRUD des entités principales
- ✅ Nouvelles fonctionnalités implémentées

**Acceptable si < 5% d'échecs sur :**
- Cas limites non critiques
- Améliorations UX mineures

---

## 📝 Notes de Test

### Comptes de Test Recommandés

Pour des tests complets, créez :
- 3-5 patients avec différents profils
- 5-10 rendez-vous avec différents statuts
- 3-5 consultations avec/sans traitement/examens
- 3-5 factures avec différents statuts

### Temps Estimé

- **Tests complets :** 2-3 heures
- **Tests rapides :** 30-45 minutes

---

## 🎯 Validation Finale

Le projet est **VALIDÉ** si :

✅ Toutes les fonctionnalités du cahier des charges fonctionnent
✅ Les nouvelles fonctionnalités (ordonnances séparées, factures) fonctionnent
✅ L'interface est complète pour tous les rôles
✅ La sécurité est en place (authentification JWT)
✅ Les impressions fonctionnent correctement

---

**Bon test ! 🚀**

Pour toute question ou problème, consultez :
- `GUIDE_TEST_PRIORITES_HAUTES.md` - Tests des ordonnances
- `GUIDE_TEST_IMPRESSION_FACTURES.md` - Tests des factures
- `README.md` - Documentation générale



