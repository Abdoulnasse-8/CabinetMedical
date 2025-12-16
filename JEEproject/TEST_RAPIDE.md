# ⚡ Test Rapide - Vérification Backend en 5 Minutes

## ✅ Vérification Préalable

Avant de tester, assurez-vous que:
- [x] Le build a réussi (pas d'erreurs de compilation)
- [x] MySQL est démarré
- [x] Le backend est lancé dans IntelliJ
- [x] Vous voyez dans la console: `Started CabinetMedicalApplication`

## 🧪 Test Minimal avec Postman

### 1. Importer la Collection (1 minute)

1. Ouvrir Postman
2. **Import** → Sélectionner `Postman_Collection.json`
3. Créer un environnement avec `baseUrl = http://localhost:8080`

### 2. Test de Base (2 minutes)

#### Test 1: Login
```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "login": "admin",
  "pwd": "password"
}
```

✅ **Résultat attendu**: Code 200, token retourné

#### Test 2: Liste des Cabinets (avec token)
```
GET http://localhost:8080/api/admin/cabinets
Header: Authorization: Bearer <token>
```

✅ **Résultat attendu**: Code 200, liste des cabinets

#### Test 3: Liste des Médicaments
```
GET http://localhost:8080/api/admin/medicaments
Header: Authorization: Bearer <token>
```

✅ **Résultat attendu**: Code 200, liste des médicaments (Paracétamol, etc.)

### 3. Test Flux Complet (2 minutes)

#### Créer un Patient
```
POST http://localhost:8080/api/secretaire/patients?cabinetId=1
Header: Authorization: Bearer <token>
Body:
{
  "cin": "AB123456",
  "nom": "Test",
  "prenom": "Patient",
  "dateNaissance": "1990-01-01",
  "sexe": "M",
  "numTel": "0612345678",
  "typemutuelle": "CNSS"
}
```

✅ **Résultat attendu**: Code 201, patient créé avec ID

#### Créer un Rendez-vous
```
POST http://localhost:8080/api/secretaire/rendez-vous?patientId=<ID_PATIENT>&medecinId=2&cabinetId=1
Header: Authorization: Bearer <token>
Body:
{
  "dateRdv": "2025-01-25",
  "heureRdv": "10:00:00",
  "motif": "Consultation",
  "notes": "Test"
}
```

✅ **Résultat attendu**: Code 201, rendez-vous créé

## ✅ Si Tous les Tests Passent

**🎉 Félicitations! Votre backend est fonctionnel!**

- ✅ Authentification JWT fonctionne
- ✅ Base de données connectée
- ✅ Endpoints REST fonctionnent
- ✅ Sécurité par rôle fonctionne
- ✅ CRUD opérationnel

## 🐛 Si Erreurs

### Erreur de Connexion MySQL
```
Vérifier:
1. MySQL est démarré
2. Mot de passe dans application.properties est correct
3. Base de données existe (créée automatiquement normalement)
```

### Erreur 401 Unauthorized
```
Solution: Se reconnecter avec POST /api/auth/login
```

### Erreur 500 Internal Server Error
```
Vérifier les logs dans IntelliJ pour voir l'erreur exacte
```

## 📚 Tests Complets

Pour des tests complets, voir **GUIDE_TEST_POSTMAN.md**

---

**Temps total: ~5 minutes** ⏱️


