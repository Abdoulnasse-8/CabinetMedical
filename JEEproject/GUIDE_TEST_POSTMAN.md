# 🧪 Guide de Test avec Postman

## 📥 Importer la Collection Postman

1. **Ouvrir Postman**
2. **Import** (bouton en haut à gauche)
3. **Upload Files** → Sélectionner `Postman_Collection.json`
4. La collection "Cabinet Medical API" apparaît dans votre workspace

## ⚙️ Configuration de l'Environnement

### Créer un Environnement

1. Cliquer sur **Environments** (à gauche)
2. **+** pour créer un nouvel environnement
3. Nommer: `Cabinet Medical Local`
4. Ajouter les variables:

| Variable | Valeur Initiale | Description |
|---------|----------------|-------------|
| `baseUrl` | `http://localhost:8080` | URL du backend |
| `token` | (vide) | Token JWT (rempli automatiquement après login) |
| `cabinetId` | `1` | ID du cabinet par défaut |
| `medecinId` | `2` | ID du médecin par défaut |
| `patientId` | (vide) | ID du patient (à remplir manuellement) |
| `rendezVousId` | (vide) | ID du rendez-vous (à remplir manuellement) |
| `factureId` | (vide) | ID de la facture (à remplir manuellement) |

5. **Save** et sélectionner cet environnement en haut à droite

## 🚀 Ordre de Test Recommandé

### Étape 1: Démarrer le Backend

Dans IntelliJ:
```
Run → Run 'CabinetMedicalApplication'
```

Vérifier dans la console:
```
Started CabinetMedicalApplication in X.XXX seconds
```

### Étape 2: Authentification

1. **1. Authentification → Login - Admin**
   - Cliquer **Send**
   - ✅ Vérifier le code de réponse: **200 OK**
   - ✅ Le token est automatiquement sauvegardé dans la variable `token`
   - ✅ Vérifier que `cabinetId` et `userId` sont sauvegardés

2. **Tester avec Médecin et Secrétaire** aussi

### Étape 3: Tester les Endpoints Secrétaire

#### Patients
1. **2. Secrétaire - Patients → Liste des Patients**
   - ✅ Doit retourner une liste (peut être vide au début)

2. **2. Secrétaire - Patients → Créer Patient**
   - ✅ Code 201 Created
   - ✅ Copier l'`id` du patient retourné
   - ✅ Mettre à jour la variable `patientId` dans l'environnement

3. **2. Secrétaire - Patients → Rechercher Patient**
   - ✅ Tester avec différents termes de recherche

#### Rendez-vous
1. **3. Secrétaire - Rendez-vous → Créer Rendez-vous**
   - ⚠️ Remplir `patientId` et `medecinId` dans l'URL
   - ✅ Code 201 Created
   - ✅ Copier l'`idRendezVous` retourné
   - ✅ Mettre à jour `rendezVousId` dans l'environnement

2. **3. Secrétaire - Rendez-vous → Confirmer Rendez-vous**
   - ✅ Code 200 OK
   - ✅ Vérifier que le statut est maintenant "CONFIRME"

#### Factures
1. **4. Secrétaire - Factures → Créer Facture**
   - ⚠️ Remplir `patientId` dans l'URL
   - ✅ Code 201 Created
   - ✅ Copier l'`idFacture` retourné
   - ✅ Mettre à jour `factureId` dans l'environnement

2. **4. Secrétaire - Factures → Marquer Facture Payée**
   - ✅ Code 200 OK
   - ✅ Vérifier que le statut est "PAYEE"

### Étape 4: Tester les Endpoints Médecin

1. **Se connecter en tant que Médecin**
   - **1. Authentification → Login - Médecin**
   - ✅ Le token est mis à jour automatiquement

2. **5. Médecin - Patients → Rechercher Patient**
   - ✅ Tester la recherche

3. **5. Médecin - Patients → Get Dossier Médical**
   - ⚠️ Remplir `patientId` dans l'URL
   - ✅ Code 200 OK
   - ✅ Vérifier les données du dossier

4. **5. Médecin - Patients → Mettre à jour Dossier Médical**
   - ⚠️ Remplir `patientId` dans l'URL
   - ✅ Code 200 OK

5. **6. Médecin - Consultations → Créer Consultation**
   - ⚠️ Remplir `patientId` et `medecinId` dans l'URL
   - ✅ Code 201 Created
   - ✅ Vérifier que la consultation est créée

6. **7. Médecin - Dashboard → Dashboard Médecin**
   - ⚠️ Remplir `cabinetId` et `medecinId` dans l'URL
   - ✅ Code 200 OK
   - ✅ Vérifier les statistiques retournées

### Étape 5: Tester les Endpoints Administrateur

1. **Se connecter en tant qu'Admin**
   - **1. Authentification → Login - Admin**

2. **8. Administrateur - Cabinets → Liste Cabinets**
   - ✅ Doit retourner au moins le cabinet créé au démarrage

3. **8. Administrateur - Cabinets → Créer Cabinet**
   - ✅ Code 201 Created

4. **9. Administrateur - Médicaments → Liste Médicaments**
   - ✅ Doit retourner les médicaments créés au démarrage (Paracétamol, etc.)

5. **9. Administrateur - Médicaments → Rechercher Médicament**
   - ✅ Tester avec "Paracétamol"

## ✅ Checklist de Vérification

### Authentification
- [ ] Login Admin fonctionne
- [ ] Login Médecin fonctionne
- [ ] Login Secrétaire fonctionne
- [ ] Token est sauvegardé automatiquement
- [ ] Requêtes avec token fonctionnent
- [ ] Requêtes sans token retournent 401

### Secrétaire
- [ ] Créer un patient
- [ ] Lister les patients
- [ ] Rechercher un patient
- [ ] Créer un rendez-vous
- [ ] Confirmer un rendez-vous
- [ ] Créer une facture
- [ ] Marquer facture comme payée

### Médecin
- [ ] Rechercher un patient
- [ ] Consulter le dossier médical
- [ ] Mettre à jour le dossier médical
- [ ] Créer une consultation
- [ ] Voir l'historique des consultations
- [ ] Voir le dashboard
- [ ] Voir les rendez-vous du jour

### Administrateur
- [ ] Lister les cabinets
- [ ] Créer un cabinet
- [ ] Activer/Désactiver un cabinet
- [ ] Lister les médicaments
- [ ] Rechercher un médicament
- [ ] Ajouter un médicament

### Notifications
- [ ] Rendez-vous du jour
- [ ] Patient en cours

## 🐛 Résolution de Problèmes

### Erreur 401 Unauthorized
- **Cause**: Token manquant ou expiré
- **Solution**: Se reconnecter avec "Login - Admin"

### Erreur 403 Forbidden
- **Cause**: Mauvais rôle pour cet endpoint
- **Solution**: Se connecter avec le bon compte (Admin, Médecin, ou Secrétaire)

### Erreur 500 Internal Server Error
- **Cause**: Erreur serveur (vérifier les logs dans IntelliJ)
- **Solution**:
  - Vérifier que MySQL est démarré
  - Vérifier les logs dans la console IntelliJ
  - Vérifier que la base de données existe

### Variable non définie
- **Cause**: Variable manquante dans l'environnement
- **Solution**: Remplir manuellement les variables `patientId`, `rendezVousId`, etc.

### Erreur de connexion
- **Cause**: Backend non démarré
- **Solution**: Vérifier que l'application tourne sur `http://localhost:8080`

## 📊 Tests Avancés

### Test de Flux Complet

1. **Créer un patient** (Secrétaire)
2. **Créer un rendez-vous** pour ce patient (Secrétaire)
3. **Confirmer le rendez-vous** (Secrétaire)
4. **Se connecter en tant que Médecin**
5. **Consulter le dossier médical** du patient
6. **Créer une consultation** pour ce rendez-vous
7. **Créer une facture** pour cette consultation (Secrétaire)
8. **Marquer la facture comme payée** (Secrétaire)

### Test de Validation

1. **Créer un patient avec CIN existant** → Doit retourner erreur
2. **Créer un rendez-vous avec conflit d'heure** → Doit retourner erreur
3. **Accéder à un endpoint sans token** → Doit retourner 401
4. **Accéder à un endpoint avec mauvais rôle** → Doit retourner 403

## 💡 Astuces Postman

1. **Tests automatiques**: Les scripts dans les requêtes sauvegardent automatiquement le token
2. **Variables**: Utiliser `{{variable}}` dans les URLs et body
3. **Environnements**: Créer différents environnements (Local, Dev, Prod)
4. **Collections**: Organiser les requêtes par dossiers
5. **Pre-request Scripts**: Ajouter des scripts avant chaque requête si nécessaire

## 📝 Notes Importantes

- ⚠️ **Toujours se connecter d'abord** avant de tester les autres endpoints
- ⚠️ **Remplir les IDs manquants** (`patientId`, `rendezVousId`, etc.) dans les variables d'environnement
- ⚠️ **Vérifier les logs IntelliJ** en cas d'erreur pour voir les détails
- ✅ **Le token expire après 24h** (86400000 ms), se reconnecter si nécessaire

---

**Bon test! 🚀**

Si tous les tests passent, votre backend est **100% fonctionnel** et prêt pour le frontend!

