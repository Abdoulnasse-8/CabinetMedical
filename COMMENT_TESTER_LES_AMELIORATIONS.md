# 🧪 Comment Tester les Améliorations - Guide Pratique

## 🚀 Démarrage Rapide

### 1. Démarrer les Services

**Ouvrez 2 terminaux :**

#### Terminal 1 - Backend
```bash
cd JEEproject
mvn spring-boot:run
```
**Attendez :** `Started CabinetMedicalApplication` (peut prendre 1-2 minutes)

#### Terminal 2 - Frontend
```bash
cd front
npm run dev
```
**Attendez :** `ready started server on 0.0.0.0:3000`

### 2. Accéder à l'Application

Ouvrez votre navigateur : **http://localhost:3000**

---

## 📝 Tests des Améliorations

## ✅ AMÉLIORATION 1 : Ordonnances Séparées (Médicaments vs Examens)

### Ce qui a changé :
- Avant : 1 seul bouton "Imprimer" qui affichait tout
- Maintenant : 2 boutons séparés selon le contenu

### Comment tester :

#### Étape 1 : Se connecter comme Médecin
1. Page de login : http://localhost:3000/login
2. Login : `medecin1`
3. Password : `password`
4. ✅ Vous arrivez sur le dashboard médecin

#### Étape 2 : Accéder à un patient
1. Dans la barre de recherche, tapez un nom de patient (ex: "Dupont")
2. Cliquez sur le patient dans les résultats
3. ✅ La page du patient s'ouvre avec 3 onglets

#### Étape 3 : Créer une consultation avec traitement ET examens
1. Cliquez sur l'onglet **"Nouvelle Consultation"**
2. Remplissez le formulaire :

   **Traitement (pour ordonnance médicaments) :**
   ```
   Tapez dans "Rechercher un médicament" : "Paracétamol"
   Sélectionnez le médicament dans la liste
   OU écrivez manuellement :
   Paracétamol 500mg : 1 comprimé 3 fois par jour pendant 7 jours
   Ibuprofène 400mg : 1 comprimé matin et soir si douleur
   ```

   **Examens Complémentaires (pour ordonnance examens) :**
   ```
   Bilan sanguin complet
   Radiographie du thorax
   ECG (Électrocardiogramme)
   ```

   **Autres champs :**
   - Type : Consultation
   - Examen Clinique : Température 37°C, Tension normale
   - Diagnostic : Infection respiratoire légère
   - Observations : Repos recommandé

3. Cliquez sur **"Enregistrer la consultation"**
4. ✅ La consultation est créée, vous êtes redirigé vers "Historique"

#### Étape 4 : Vérifier les 2 boutons séparés
1. Dans l'onglet **"Historique"**
2. Trouvez la consultation que vous venez de créer
3. **Vérifiez :**
   - ✅ **2 boutons distincts** apparaissent à droite :
     - **"Ordonnance Médicaments"** (si traitement présent)
     - **"Ordonnance Examens"** (si examens présents)

#### Étape 5 : Tester l'impression Ordonnance Médicaments
1. Cliquez sur **"Ordonnance Médicaments"**
2. Une fenêtre modale s'ouvre
3. **Vérifiez le contenu :**
   - ✅ Titre : "ORDONNANCE MÉDICALE"
   - ✅ Nom du médecin en haut
   - ✅ Informations du patient
   - ✅ Section "PRESCRIPTION MÉDICAMENTEUSE" avec uniquement le traitement
   - ✅ **Signature automatique** en bas à droite
4. Cliquez sur **"Imprimer l'ordonnance médicaments"**
5. ✅ Une nouvelle fenêtre s'ouvre
6. ✅ Seuls les médicaments sont affichés (pas les examens)

#### Étape 6 : Tester l'impression Ordonnance Examens
1. Fermez la fenêtre précédente
2. Cliquez sur **"Ordonnance Examens"**
3. Une fenêtre modale s'ouvre
4. **Vérifiez le contenu :**
   - ✅ Titre : "ORDONNANCE D'EXAMENS COMPLÉMENTAIRES"
   - ✅ Nom du médecin
   - ✅ Informations du patient
   - ✅ Diagnostic (si présent)
   - ✅ Section "EXAMENS COMPLÉMENTAIRES PRESCRITS" avec uniquement les examens
   - ✅ **Signature automatique** en bas
5. Cliquez sur **"Imprimer l'ordonnance examens"**
6. ✅ Une nouvelle fenêtre s'ouvre
7. ✅ Seuls les examens sont affichés (pas les médicaments)

### ✅ Résultat Attendu :
- ✅ 2 boutons séparés selon le contenu
- ✅ Chaque ordonnance contient uniquement son type de contenu
- ✅ Signature automatique sur les deux types

---

## ✅ AMÉLIORATION 2 : Signature Automatique

### Ce qui a changé :
- La signature du médecin s'affiche automatiquement sur toutes les ordonnances

### Comment tester :

#### Test 1 : Vérifier la signature sur ordonnance médicaments
1. Imprimez une ordonnance médicaments (voir étape 5 ci-dessus)
2. **Regardez en bas à droite :**
   - ✅ Section "Signature"
   - ✅ "Dr. [Prénom] [Nom]" affiché automatiquement
   - ✅ Si le médecin a une signature configurée, elle apparaît
   - ✅ Texte "Signature et cachet du médecin"

#### Test 2 : Vérifier la signature sur ordonnance examens
1. Imprimez une ordonnance examens
2. ✅ Même vérifications que ci-dessus

#### Test 3 : Vérifier que c'est automatique
1. Créez plusieurs consultations
2. Imprimez les ordonnances
3. ✅ La signature est toujours présente, pas besoin de la saisir manuellement

### ✅ Résultat Attendu :
- ✅ Signature présente sur toutes les ordonnances
- ✅ Nom du médecin affiché automatiquement
- ✅ Pas de saisie manuelle nécessaire

---

## ✅ AMÉLIORATION 3 : Dossier Médical Complet et Modifiable

### Ce qui a changé :
- Tous les champs du dossier médical sont maintenant modifiables
- Les noms de champs correspondent au backend

### Comment tester :

#### Étape 1 : Accéder au dossier médical
1. Connectez-vous comme médecin
2. Sélectionnez un patient
3. Cliquez sur l'onglet **"Dossier Médical"**

#### Étape 2 : Vérifier les champs disponibles
Vous devriez voir ces champs :
- ✅ **Antécédents Médicaux**
- ✅ **Antécédents Chirurgicaux**
- ✅ **Allergies**
- ✅ **Traitement en Cours**
- ✅ **Habitudes** (tabac, alimentation, sommeil, etc.)
- ✅ **Documents Médicaux** (analyses, radios, bilans, etc.)

#### Étape 3 : Modifier le dossier
1. Cliquez sur le bouton **"Modifier"** (en haut à droite)
2. **Remplissez les champs :**
   ```
   Antécédents Médicaux : Diabète type 2, Hypertension artérielle
   Antécédents Chirurgicaux : Appendicectomie en 2010
   Allergies : Pénicilline, Pollen
   Traitement en Cours : Metformine 500mg 2x/jour, Amlodipine 5mg/jour
   Habitudes : Non fumeur, Alimentation équilibrée, Sport 3x/semaine
   Documents Médicaux : Bilan sanguin du 15/01/2025, ECG normal, Radio thorax normale
   ```
3. Cliquez sur **"Enregistrer"**
4. ✅ Un message de succès s'affiche : "Le dossier médical a été mis à jour"
5. ✅ Les champs passent en mode lecture

#### Étape 4 : Vérifier la persistance
1. Rechargez la page (F5)
2. Vérifiez que les données sont toujours présentes
3. ✅ Toutes les données que vous avez saisies sont sauvegardées

#### Étape 5 : Tester l'annulation
1. Cliquez sur "Modifier"
2. Changez quelques valeurs
3. Cliquez sur "Annuler"
4. ✅ Les modifications ne sont pas sauvegardées
5. ✅ Les valeurs originales sont restaurées

### ✅ Résultat Attendu :
- ✅ Tous les champs sont modifiables
- ✅ Sauvegarde fonctionnelle
- ✅ Données persistantes après rechargement
- ✅ Annulation fonctionne

---

## ✅ AMÉLIORATION 4 : Impression Professionnelle des Factures

### Ce qui a changé :
- Nouveau composant d'impression avec design professionnel
- Informations complètes du cabinet et du patient

### Comment tester :

#### Étape 1 : Se connecter comme Secrétaire
1. Page de login : http://localhost:3000/login
2. Login : `secretaire1`
3. Password : `password`
4. ✅ Vous arrivez sur le dashboard secrétaire

#### Étape 2 : Accéder aux Factures
1. Cliquez sur **"Factures"** dans le menu
2. ✅ La liste des factures s'affiche

#### Étape 3 : Créer une facture (si nécessaire)
1. Cliquez sur **"Nouvelle Facture"**
2. Remplissez :
   ```
   Patient : [Sélectionnez un patient]
   Montant : 500
   Mode de paiement : Espèces
   Notes : Consultation du jour
   ```
3. Cliquez sur **"Enregistrer"**
4. ✅ La facture est créée

#### Étape 4 : Imprimer une facture
1. Dans la liste des factures, trouvez une facture
2. Cliquez sur l'**icône d'impression** (🖨️) à droite
3. ✅ Une fenêtre modale s'ouvre avec la facture formatée

#### Étape 5 : Vérifier le contenu de la facture
**En haut à droite (Cabinet) :**
- ✅ Logo du cabinet (si configuré)
- ✅ Nom du cabinet
- ✅ Spécialité (si présente)
- ✅ Adresse
- ✅ Téléphone

**En haut à gauche :**
- ✅ "FACTURE" en grand
- ✅ Numéro de facture : "N° [numéro]"

**Milieu gauche (Facturé à) :**
- ✅ Nom et prénom du patient
- ✅ Date de naissance
- ✅ Téléphone
- ✅ CIN

**Milieu droit (Informations de facturation) :**
- ✅ Date de la facture
- ✅ Mode de paiement
- ✅ Statut avec badge coloré (Payée = vert, En attente = jaune, Annulée = rouge)

**Tableau :**
- ✅ Description (Consultation médicale ou notes)
- ✅ Montant en DH

**Bas :**
- ✅ Total TTC en grand
- ✅ Montant formaté : "500.00 DH"

**Footer :**
- ✅ "Merci de votre confiance"
- ✅ Date de génération

#### Étape 6 : Tester l'impression
1. Dans la fenêtre modale, cliquez sur **"Imprimer la facture"**
2. ✅ Une nouvelle fenêtre s'ouvre avec la facture
3. ✅ Le format est adapté à l'impression papier
4. Faites Ctrl+P pour voir l'aperçu d'impression
5. ✅ Tout est bien formaté pour l'impression A4

### ✅ Résultat Attendu :
- ✅ Design professionnel
- ✅ Toutes les informations présentes
- ✅ Format adapté à l'impression
- ✅ Badge de statut coloré

---

## 🔍 Tests de Cas Limites

### Test 1 : Consultation avec traitement seulement
1. Créez une consultation avec traitement mais SANS examens
2. ✅ Seul le bouton "Ordonnance Médicaments" apparaît
3. ✅ Le bouton "Ordonnance Examens" n'apparaît pas

### Test 2 : Consultation avec examens seulement
1. Créez une consultation avec examens mais SANS traitement
2. ✅ Seul le bouton "Ordonnance Examens" apparaît
3. ✅ Le bouton "Ordonnance Médicaments" n'apparaît pas

### Test 3 : Consultation sans rien
1. Créez une consultation sans traitement ni examens
2. ✅ Aucun bouton d'ordonnance n'apparaît

### Test 4 : Facture sans cabinet configuré
1. Si le cabinet n'a pas de logo ou d'adresse
2. ✅ La facture s'affiche quand même (sans ces informations)

---

## ✅ Checklist de Validation

### Ordonnances
- [ ] 2 boutons séparés apparaissent correctement
- [ ] Ordonnance médicaments affiche uniquement le traitement
- [ ] Ordonnance examens affiche uniquement les examens
- [ ] Signature automatique présente sur les deux types
- [ ] Impression fonctionne correctement

### Dossier Médical
- [ ] Tous les champs sont modifiables
- [ ] Sauvegarde fonctionne
- [ ] Données persistent après rechargement
- [ ] Annulation fonctionne

### Factures
- [ ] Le bouton d'impression est visible
- [ ] La fenêtre modale s'ouvre correctement
- [ ] Toutes les informations sont présentes
- [ ] Le design est professionnel
- [ ] L'impression fonctionne

---

## 🐛 Problèmes Courants et Solutions

### Problème 1 : Les boutons d'ordonnance n'apparaissent pas

**Cause :** La consultation n'a pas de traitement ou d'examens

**Solution :**
- Vérifiez que la consultation a bien un traitement (pour médicaments)
- Vérifiez que la consultation a bien des examens (pour examens)
- Si besoin, modifiez la consultation pour ajouter du contenu

---

### Problème 2 : La signature ne s'affiche pas

**Cause :** Le compte médecin n'a pas de signature configurée

**Solution :**
- C'est normal si pas de signature configurée
- Le nom du médecin s'affiche quand même
- Pour ajouter une signature, configurez-la dans le profil du médecin

---

### Problème 3 : Le dossier médical ne se sauvegarde pas

**Causes possibles :**
- Backend non démarré
- Erreur de connexion

**Solution :**
1. Vérifiez que le backend est bien démarré (port 8080)
2. Ouvrez la console du navigateur (F12)
3. Allez dans l'onglet "Network"
4. Essayez de sauvegarder et regardez si la requête est envoyée
5. Si erreur, vérifiez les logs du backend

---

### Problème 4 : L'impression ne fonctionne pas

**Causes possibles :**
- Popups bloquées dans le navigateur
- JavaScript désactivé

**Solution :**
- Autorisez les popups pour localhost:3000
- Activez JavaScript dans votre navigateur
- Essayez un autre navigateur (Chrome, Firefox, Edge)

---

## 📸 À Quoi Ça Doit Ressembler

### Ordonnance Médicaments
```
┌─────────────────────────────────────┐
│      ORDONNANCE MÉDICALE            │
│                                     │
│ Dr. [Prénom] [Nom]                  │
│ [Spécialité]                        │
│                                     │
│ Patient: [Nom Prénom]               │
│ Né(e) le: [Date]                    │
│                                     │
│ PRESCRIPTION MÉDICAMENTEUSE         │
│ ─────────────────────────────────── │
│ Paracétamol 500mg : ...             │
│ Ibuprofène 400mg : ...              │
│                                     │
│                          Signature  │
│                          Dr. [Nom]  │
│                          [Signature]│
└─────────────────────────────────────┘
```

### Ordonnance Examens
```
┌─────────────────────────────────────┐
│ ORDONNANCE D'EXAMENS                │
│ COMPLÉMENTAIRES                     │
│                                     │
│ Dr. [Prénom] [Nom]                  │
│ [Spécialité]                        │
│                                     │
│ Patient: [Nom Prénom]               │
│                                     │
│ Diagnostic: [Diagnostic]            │
│                                     │
│ EXAMENS COMPLÉMENTAIRES PRESCRITS   │
│ ─────────────────────────────────── │
│ Bilan sanguin complet               │
│ Radiographie du thorax              │
│ ECG                                 │
│                                     │
│                          Signature  │
│                          Dr. [Nom]  │
└─────────────────────────────────────┘
```

### Facture
```
┌─────────────────────────────────────┐
│ FACTURE          N° 123             │
│                                     │
│ [Logo]        Cabinet Médical       │
│              Adresse...             │
│              Tél: ...               │
│                                     │
│ Facturé à    │ Informations        │
│ Patient      │ Date: ...           │
│              │ Mode: Espèces        │
│              │ Statut: [Badge]      │
│                                     │
│ Description         │ Montant       │
│ Consultation        │ 500.00 DH     │
│                                     │
│                    Total TTC:       │
│                    500.00 DH        │
└─────────────────────────────────────┘
```

---

## ⏱️ Temps Estimé pour Tester

- **Test rapide :** 15-20 minutes
  - Tester les 4 améliorations rapidement

- **Test complet :** 45-60 minutes
  - Tester tous les cas limites
  - Vérifier tous les détails
  - Tester plusieurs scénarios

---

## ✅ Validation Finale

**Les améliorations sont validées si :**

✅ Les 2 types d'ordonnances sont séparés et fonctionnent
✅ La signature est automatique sur toutes les ordonnances
✅ Le dossier médical peut être complètement rempli et sauvegardé
✅ Les factures peuvent être imprimées avec un design professionnel

---

**Bon test ! 🚀**

Si vous rencontrez des problèmes, vérifiez :
1. Que le backend et frontend sont bien démarrés
2. La console du navigateur (F12) pour les erreurs
3. Les logs du backend pour les erreurs serveur



