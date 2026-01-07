# 📋 Guide de Test - Gestion des Logos

## ✅ Fonctionnalités Implémentées

1. **Upload de logo** dans le formulaire de création/modification de cabinet
2. **Affichage du logo** dans le dashboard (sidebar)
3. **Affichage du logo** dans les ordonnances médicaments
4. **Affichage du logo** dans les ordonnances examens
5. **Affichage du logo** dans les factures (déjà existant)

---

## 🧪 Tests à Effectuer

### Test 1 : Upload de Logo lors de la Création de Cabinet

**Prérequis :**
- Être connecté en tant qu'administrateur
- Avoir une image prête (JPG, PNG, GIF - max 2MB)

**Étapes :**
1. Aller dans la section **Administration → Cabinets**
2. Cliquer sur **"Créer un nouveau cabinet"** ou **"Modifier"** un cabinet existant
3. Remplir les champs obligatoires (Nom, Adresse, Téléphone)
4. Dans le champ **"Logo du cabinet"** :
   - Cliquer sur **"Choisir un logo"**
   - Sélectionner une image
   - Vérifier que l'aperçu s'affiche immédiatement (image de 24x24)
5. Vérifier le message d'aide : "Formats acceptés : JPG, PNG, GIF (max 2MB)"
6. Cliquer sur **"Créer le cabinet"** ou **"Mettre à jour"**

**Résultat attendu :**
- ✅ L'aperçu du logo s'affiche dans le formulaire
- ✅ Le logo est sauvegardé avec le cabinet
- ✅ Un bouton **X** apparaît pour supprimer l'aperçu
- ✅ Si l'image dépasse 2MB, un message d'erreur s'affiche
- ✅ Si le fichier n'est pas une image, un message d'erreur s'affiche

---

### Test 2 : Modification/Suppression de Logo

**Étapes :**
1. Ouvrir le formulaire d'un cabinet existant avec logo
2. Vérifier que le logo actuel s'affiche en aperçu
3. **Test de remplacement :**
   - Cliquer sur **"Changer le logo"**
   - Sélectionner une nouvelle image
   - Vérifier que le nouvel aperçu remplace l'ancien
4. **Test de suppression :**
   - Cliquer sur le bouton **X** sur l'aperçu
   - Vérifier que l'aperçu disparaît
   - Enregistrer le cabinet

**Résultat attendu :**
- ✅ Le logo peut être remplacé facilement
- ✅ Le logo peut être supprimé (aperçu disparaît)
- ✅ Après sauvegarde, le logo est mis à jour ou supprimé selon le cas

---

### Test 3 : Affichage du Logo dans le Dashboard

**Prérequis :**
- Avoir un cabinet avec un logo défini
- Être connecté avec un utilisateur de ce cabinet

**Étapes :**
1. Se connecter (Médecin, Secrétaire, ou Administrateur)
2. Observer la **sidebar gauche** (ou menu mobile)
3. Vérifier la section **"Brand"** en haut

**Résultat attendu :**
- ✅ Si le cabinet a un logo : le logo s'affiche (image 40x40px, arrondie)
- ✅ Si le cabinet n'a pas de logo : l'icône cœur (Heart) s'affiche par défaut
- ✅ Le nom du cabinet s'affiche (pas "Noble Finance")
- ✅ Le sous-titre "Gestion médicale" s'affiche
- ✅ Fonctionne aussi sur mobile (dans le menu hamburger)

---

### Test 4 : Affichage du Logo dans les Ordonnances Médicaments

**Prérequis :**
- Avoir un cabinet avec logo
- Être connecté en tant que médecin
- Avoir une consultation avec traitement prescrit

**Étapes :**
1. Aller dans **"Patients"** → Sélectionner un patient
2. Aller dans l'onglet **"Historique des Consultations"**
3. Trouver une consultation avec traitement
4. Cliquer sur **"Ordonnance Médicaments"**
5. Observer l'en-tête de l'ordonnance

**Résultat attendu :**
- ✅ Le logo du cabinet s'affiche en haut à droite de l'en-tête
- ✅ Le nom du cabinet s'affiche sous le titre "ORDONNANCE MÉDICALE"
- ✅ Le logo est visible lors de l'impression
- ✅ Le logo est bien dimensionné (hauteur max 80px)

---

### Test 5 : Affichage du Logo dans les Ordonnances Examens

**Prérequis :**
- Avoir un cabinet avec logo
- Être connecté en tant que médecin
- Avoir une consultation avec examens complémentaires

**Étapes :**
1. Aller dans **"Patients"** → Sélectionner un patient
2. Aller dans l'onglet **"Historique des Consultations"**
3. Trouver une consultation avec examens complémentaires
4. Cliquer sur **"Ordonnance Examens"**
5. Observer l'en-tête de l'ordonnance

**Résultat attendu :**
- ✅ Le logo du cabinet s'affiche en haut à droite de l'en-tête
- ✅ Le nom du cabinet s'affiche sous le titre "ORDONNANCE D'EXAMENS COMPLÉMENTAIRES"
- ✅ Le logo est visible lors de l'impression
- ✅ Le logo est bien dimensionné (hauteur max 80px)

---

### Test 6 : Affichage du Logo dans les Factures

**Prérequis :**
- Avoir un cabinet avec logo
- Être connecté en tant que secrétaire

**Étapes :**
1. Aller dans **"Factures"**
2. Sélectionner une facture
3. Cliquer sur l'icône **Imprimer** (Printer)
4. Observer l'en-tête de la facture

**Résultat attendu :**
- ✅ Le logo s'affiche en haut à droite (déjà fonctionnel)
- ✅ Le logo est visible lors de l'impression

---

## 🔍 Tests de Validation

### Validation des Formats de Fichier

Testez avec différents formats :
- ✅ **JPG** : doit fonctionner
- ✅ **PNG** : doit fonctionner
- ✅ **GIF** : doit fonctionner
- ❌ **PDF** : doit être refusé
- ❌ **TXT** : doit être refusé

### Validation de la Taille

Testez avec différentes tailles :
- ✅ **< 500KB** : doit fonctionner
- ✅ **1MB** : doit fonctionner
- ✅ **2MB** : doit fonctionner
- ❌ **> 2MB** : doit afficher une erreur

### Test de Performance

1. **Chargement du logo dans le dashboard :**
   - Le logo doit se charger rapidement après connexion
   - Pas de flash ou de chargement visible

2. **Conversion base64 :**
   - Les images doivent se convertir rapidement en base64
   - L'aperçu doit s'afficher instantanément

---

## 🐛 Cas de Test Limites

### Test 1 : Cabinet sans Logo
- Créer un cabinet sans logo
- Vérifier que l'icône par défaut s'affiche partout

### Test 2 : Image Très Petite
- Uploader une image très petite (ex: 50x50px)
- Vérifier qu'elle s'affiche correctement sans pixelisation

### Test 3 : Image Très Grande
- Uploader une image très grande (ex: 4000x4000px)
- Vérifier qu'elle se redimensionne correctement

### Test 4 : Plusieurs Utilisateurs du Même Cabinet
- Connecter plusieurs utilisateurs du même cabinet
- Vérifier qu'ils voient tous le même logo

### Test 5 : Changement de Logo en Temps Réel
- Ouvrir le dashboard sur un onglet
- Dans un autre onglet, modifier le logo du cabinet
- Vérifier si le logo se met à jour automatiquement (nécessite rafraîchissement)

---

## ✅ Checklist Complète

- [ ] Upload de logo fonctionne
- [ ] Aperçu du logo s'affiche dans le formulaire
- [ ] Remplacement de logo fonctionne
- [ ] Suppression de logo fonctionne
- [ ] Validation des formats de fichier
- [ ] Validation de la taille (2MB max)
- [ ] Logo affiché dans le dashboard (desktop)
- [ ] Logo affiché dans le dashboard (mobile)
- [ ] Logo affiché dans les ordonnances médicaments
- [ ] Logo affiché dans les ordonnances examens
- [ ] Logo affiché dans les factures
- [ ] Logo visible lors de l'impression
- [ ] Icône par défaut s'affiche si pas de logo
- [ ] Nom du cabinet s'affiche correctement

---

## 🚨 Problèmes Connus / À Noter

1. **Chargement asynchrone :** Le logo se charge après la connexion, il peut y avoir un léger délai.

2. **Mise à jour en temps réel :** Si le logo est modifié, il faut rafraîchir la page pour voir le changement dans le dashboard.

3. **Stockage base64 :** Les logos sont stockés en base64 dans la base de données. Pour des logos très lourds, cela peut ralentir les requêtes.

---

## 📝 Notes Supplémentaires

- Les logos sont convertis en base64 côté frontend avant l'envoi au backend
- Le backend stocke directement la chaîne base64 dans le champ `logo` de la table `cabinets`
- Les logos sont affichés avec `object-contain` pour préserver les proportions
- Les tailles d'affichage varient selon le contexte :
  - Dashboard : 40x40px
  - Ordonnances : 80x80px (max)
  - Factures : 120x120px (max)

---

**Date de création :** Aujourd'hui
**Version :** 1.0


