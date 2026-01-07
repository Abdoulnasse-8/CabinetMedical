# 🧪 Guide de Test - Impression des Factures

## ✅ Ce qui a été fait

### Impression des Factures (SECRÉTAIRE)
- ✅ Créé `facture-print.tsx` - Composant d'impression professionnel
- ✅ Modifié `factures-tab.tsx` pour utiliser le nouveau composant
- ✅ Design professionnel avec informations complètes :
  - Logo et informations du cabinet
  - Informations complètes du patient
  - Détails de la consultation (si liée)
  - Montant, mode de paiement, statut
  - Format adapté à l'impression

---

## 🧪 Comment tester

### Prérequis

1. **Démarrer le backend :**
   ```bash
   cd JEEproject
   mvn spring-boot:run
   ```
   Attendez que vous voyiez : `Started CabinetMedicalApplication`

2. **Démarrer le frontend :**
   ```bash
   cd front
   npm run dev
   ```
   Attendez que vous voyiez : `ready started server on 0.0.0.0:3000`

3. **Accéder à l'application :**
   - Ouvrez votre navigateur : http://localhost:3000
   - Connectez-vous en tant que **secrétaire**

---

## 📋 Tests à effectuer

### TEST 1 : Afficher le composant d'impression

#### Étape 1 : Accéder aux factures

1. Connectez-vous comme secrétaire
2. Allez dans l'onglet **"Factures"** (ou dans le menu secrétaire)
3. Vous devriez voir la liste des factures

#### Étape 2 : Ouvrir l'impression

1. Trouvez une facture dans la liste
2. Cliquez sur l'icône **Imprimante** (🖨️) à droite de la facture
3. Une fenêtre modale s'ouvre avec :
   - ✅ Titre "Facture #[numéro]"
   - ✅ Informations du cabinet (si configuré)
   - ✅ Informations du patient
   - ✅ Détails de la facture

### TEST 2 : Vérifier les informations affichées

#### Informations du Cabinet

1. Dans la fenêtre d'impression, vérifiez en haut à droite :
   - ✅ Logo du cabinet (si présent)
   - ✅ Nom du cabinet
   - ✅ Spécialité (si présente)
   - ✅ Adresse (si présente)
   - ✅ Téléphone (si présent)

#### Informations du Patient

1. Dans la section "Facturé à", vérifiez :
   - ✅ Nom et prénom du patient
   - ✅ Date de naissance (si présente)
   - ✅ Téléphone (si présent)
   - ✅ CIN (si présent)

#### Informations de Facturation

1. Dans la section "Informations de facturation", vérifiez :
   - ✅ Date de la facture (format français)
   - ✅ Mode de paiement (Espèces, Carte, etc.)
   - ✅ Statut (avec badge coloré : Payée, En attente, Annulée)

#### Détails de la Facture

1. Dans le tableau, vérifiez :
   - ✅ Description (consultation médicale ou notes)
   - ✅ Montant en DH

#### Total

1. Vérifiez le total en bas :
   - ✅ "Total TTC" affiché en grand
   - ✅ Montant correctement formaté avec 2 décimales
   - ✅ "DH" comme unité

### TEST 3 : Tester l'impression

#### Étape 1 : Imprimer la facture

1. Dans la fenêtre d'impression
2. Cliquez sur le bouton **"Imprimer la facture"**
3. Vérifiez :
   - ✅ Une nouvelle fenêtre s'ouvre
   - ✅ Le contenu est bien formaté pour l'impression
   - ✅ Le format est professionnel

#### Étape 2 : Vérifier le format d'impression

1. Dans la fenêtre d'impression, faites Ctrl+P (ou Cmd+P sur Mac)
2. Vérifiez l'aperçu :
   - ✅ Toutes les informations sont visibles
   - ✅ Le design est adapté à l'impression
   - ✅ Les couleurs sont préservées (si impression couleur)
   - ✅ Le format est A4 standard

### TEST 4 : Tester différents statuts

#### Test 4.1 : Facture Payée

1. Trouvez ou créez une facture avec statut "Payée"
2. Ouvrez l'impression
3. Vérifiez :
   - ✅ Badge vert "Payée"

#### Test 4.2 : Facture En Attente

1. Trouvez ou créez une facture avec statut "En attente"
2. Ouvrez l'impression
3. Vérifiez :
   - ✅ Badge jaune "En attente"

#### Test 4.3 : Facture Annulée

1. Trouvez ou créez une facture avec statut "Annulée"
2. Ouvrez l'impression
3. Vérifiez :
   - ✅ Badge rouge "Annulée"

### TEST 5 : Tester avec/sans consultation liée

#### Test 5.1 : Facture avec consultation

1. Trouvez une facture liée à une consultation
2. Ouvrez l'impression
3. Vérifiez :
   - ✅ Description : "Consultation médicale"
   - ✅ Notes de la facture affichées (si présentes)

#### Test 5.2 : Facture sans consultation

1. Trouvez une facture non liée à une consultation
2. Ouvrez l'impression
3. Vérifiez :
   - ✅ Description : Notes de la facture ou "Services médicaux"
   - ✅ Le montant est correctement affiché

### TEST 6 : Tester avec différents modes de paiement

1. Testez avec chaque mode de paiement :
   - ✅ Espèces
   - ✅ Carte bancaire
   - ✅ Chèque
   - ✅ Virement bancaire
   - ✅ Assurance

2. Vérifiez que le label est correctement traduit

---

## ✅ Checklist de validation

### Fonctionnalités d'impression
- [ ] Le bouton d'impression est visible sur chaque facture
- [ ] La fenêtre modale s'ouvre correctement
- [ ] Toutes les informations sont affichées
- [ ] Le design est professionnel
- [ ] L'impression fonctionne correctement

### Informations affichées
- [ ] Informations du cabinet (logo, nom, adresse, tel)
- [ ] Informations complètes du patient
- [ ] Date de facturation correcte
- [ ] Mode de paiement correctement traduit
- [ ] Statut avec badge coloré
- [ ] Montant correctement formaté

### Format et design
- [ ] Le format est adapté à l'impression
- [ ] Les couleurs sont appropriées
- [ ] La mise en page est professionnelle
- [ ] Le footer avec date de génération est présent

---

## 🐛 Résolution de problèmes

### Problème 1 : Le composant d'impression ne s'affiche pas

**Solution :**
- Vérifiez que le backend est bien démarré
- Vérifiez dans la console du navigateur (F12) s'il y a des erreurs
- Vérifiez que `user.cabinetId` est bien défini

### Problème 2 : Les informations du cabinet ne s'affichent pas

**Solution :**
- Vérifiez que le cabinet est bien configuré
- Vérifiez que l'API `getCabinets()` fonctionne
- Vérifiez dans la console du navigateur (F12 → Network) si la requête est envoyée

### Problème 3 : L'impression ne fonctionne pas

**Solution :**
- Vérifiez que les popups ne sont pas bloquées dans votre navigateur
- Essayez un autre navigateur
- Vérifiez que JavaScript est activé

### Problème 4 : Le format d'impression n'est pas correct

**Solution :**
- Vérifiez les styles CSS dans le composant
- Utilisez l'aperçu d'impression du navigateur (Ctrl+P)
- Ajustez les marges si nécessaire

---

## 📸 Captures d'écran attendues

### Vue Facture Imprimable
```
┌─────────────────────────────────────────┐
│ FACTURE                      N° 123     │
│                                         │
│ [Logo]          Cabinet Médical         │
│                 Adresse...              │
│                 Tél: ...                │
├─────────────────────────────────────────┤
│ Facturé à    │ Informations            │
│ Patient      │ Date: ...               │
│ CIN: ...     │ Mode: Espèces           │
│              │ Statut: [Badge]         │
├─────────────────────────────────────────┤
│ Description         │ Montant           │
│ Consultation        │ 500.00 DH         │
├─────────────────────────────────────────┤
│                    Total TTC:           │
│                    500.00 DH            │
└─────────────────────────────────────────┘
```

---

## 🎯 Critères de succès

✅ **Le test est réussi si :**
1. Le composant d'impression s'affiche correctement
2. Toutes les informations sont présentes et correctes
3. Le design est professionnel
4. L'impression fonctionne sans erreur
5. Le format est adapté à l'impression papier

---

## 📝 Notes importantes

- La facture est imprimable via la fenêtre d'impression du navigateur
- Les informations du cabinet sont chargées automatiquement
- Le format est optimisé pour l'impression A4
- Les badges de statut sont colorés pour une meilleure visibilité

---

**Bon test ! 🚀**



