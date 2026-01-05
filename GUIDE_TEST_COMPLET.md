# Guide Complet pour Tester Backend + Frontend

## 📋 Prérequis

### 1. Vérifier les outils installés

```bash
# Vérifier Java (version 17+)
java -version

# Vérifier Maven
mvn -version

# Vérifier Node.js (version 18+)
node -version

# Vérifier npm
npm -version

# Vérifier MySQL (optionnel, pour vérifier la connexion)
mysql --version
```

### 2. Installer les outils manquants

- **Java 17+** : [Télécharger OpenJDK 17](https://adoptium.net/)
- **Maven** : [Télécharger Maven](https://maven.apache.org/download.cgi)
- **Node.js 18+** : [Télécharger Node.js](https://nodejs.org/)
- **MySQL 8.0+** : [Télécharger MySQL](https://dev.mysql.com/downloads/mysql/)

---

## 🗄️ Étape 1 : Configuration de la Base de Données

### 1.1 Démarrer MySQL

```bash
# Windows (si MySQL est installé comme service, il démarre automatiquement)
# Sinon, démarrer MySQL depuis les services Windows

# Linux/Mac
sudo systemctl start mysql
# ou
brew services start mysql
```

### 1.2 Créer la base de données (optionnel)

Le backend crée automatiquement la base si elle n'existe pas grâce à `createDatabaseIfNotExist=true`.

Si vous voulez créer manuellement :

```sql
CREATE DATABASE IF NOT EXISTS cabinet_medical;
```

### 1.3 Vérifier les identifiants MySQL

Modifiez `JEEproject/src/main/resources/application.properties` si nécessaire :

```properties
spring.datasource.username=root
spring.datasource.password=1234  # Changez selon votre configuration
```

---

## 🔧 Étape 2 : Installation et Lancement du Backend

### 2.1 Ouvrir un terminal dans le dossier du backend

```bash
cd JEEproject
```

### 2.2 Compiler le projet (première fois)

```bash
mvn clean install
```

### 2.3 Lancer le backend

```bash
mvn spring-boot:run
```

**OU** si vous utilisez IntelliJ IDEA 
- Ouvrir `CabinetMedicalApplication.java`
- Clic droit → Run

### 2.4 Vérifier que le backend fonctionne

Ouvrir dans le navigateur ou avec curl :

```bash
# Test simple (devrait retourner une erreur 401 car pas de token, mais confirme que le serveur répond)
curl http://localhost:8080/api/auth/login

# Ou tester avec Postman
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "login": "admin",
  "pwd": "password"
}
```

**✅ Le backend est prêt quand vous voyez :**
```
Started CabinetMedicalApplication in X.XXX seconds
```

---

## 🎨 Étape 3 : Installation et Lancement du Frontend

### 3.1 Ouvrir un NOUVEAU terminal dans le dossier du frontend

```bash
cd front
```

### 3.2 Installer les dépendances

```bash
npm install
```

**Note :** Si vous avez `pnpm-lock.yaml`, vous pouvez utiliser `pnpm` :

```bash
# Installer pnpm si nécessaire
npm install -g pnpm

# Puis installer les dépendances
pnpm install
```

### 3.3 Vérifier la configuration

Le fichier `front/lib/api.ts` doit pointer vers :
```typescript
const API_BASE_URL = "http://localhost:8080"
```

### 3.4 Lancer le frontend en mode développement

```bash
npm run dev
```

**OU** avec pnpm :
```bash
pnpm dev
```

### 3.5 Vérifier que le frontend fonctionne

Ouvrir dans le navigateur :
```
http://localhost:3000
```

**✅ Le frontend est prêt quand vous voyez :**
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

---

## 🧪 Étape 4 : Test Complet de l'Application

### 4.1 Test de Connexion

1. Ouvrir `http://localhost:3000` dans le navigateur
2. Vous devriez être redirigé vers `/login`
3. Tester avec les comptes par défaut :

#### Compte Administrateur
```
Login: admin
Password: password
```
→ Devrait rediriger vers `/admin/dashboard`

#### Compte Médecin
```
Login: medecin1
Password: medecin1
```
→ Devrait rediriger vers `/medecin/dashboard`

#### Compte Secrétaire
```
Login: secretaire1
Password: password
```
→ Devrait rediriger vers `/secretaire/dashboard`

### 4.2 Test des Fonctionnalités par Rôle

#### En tant que Secrétaire :
- [ ] Voir la liste des patients
- [ ] Créer un nouveau patient
- [ ] Rechercher un patient
- [ ] Créer un rendez-vous
- [ ] Voir les factures

#### En tant que Médecin :
- [ ] Voir le dashboard avec les statistiques
- [ ] Voir les rendez-vous du jour
- [ ] Rechercher un patient
- [ ] Consulter un dossier médical
- [ ] Créer une consultation

#### En tant qu'Administrateur :
- [ ] Voir la liste des cabinets
- [ ] Créer/modifier un cabinet
- [ ] Gérer les médicaments

---

## 🐛 Résolution des Problèmes Courants

### Problème 1 : Le backend ne démarre pas

**Erreur :** `Port 8080 already in use`
```bash
# Windows : Trouver et tuer le processus
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8080 | xargs kill -9
```

**Erreur :** `Cannot connect to MySQL`
- Vérifier que MySQL est démarré
- Vérifier les identifiants dans `application.properties`
- Vérifier que MySQL écoute sur le port 3306

### Problème 2 : Le frontend ne démarre pas

**Erreur :** `Port 3000 already in use`
```bash
# Changer le port dans package.json ou utiliser :
npm run dev -- -p 3001
```

**Erreur :** `Module not found` après `npm install`
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Problème 3 : Erreur CORS

Si vous voyez des erreurs CORS dans la console du navigateur :
- Vérifier que le backend est bien lancé sur le port 8080
- Vérifier que `cors.allowed-origins` dans `application.properties` inclut `http://localhost:3000`

### Problème 4 : Erreur 401 (Non autorisé)

- Vérifier que le token est bien stocké dans `localStorage`
- Ouvrir la console du navigateur (F12) → Application → Local Storage
- Vérifier qu'il y a une clé `token`

### Problème 5 : Les données ne s'affichent pas

- Ouvrir la console du navigateur (F12) → Console
- Vérifier les erreurs réseau dans l'onglet Network
- Vérifier que le backend répond bien aux requêtes

---

## 📊 Vérification Rapide avec les Outils de Développement

### Console Navigateur (F12)

1. **Onglet Console** : Vérifier les erreurs JavaScript
2. **Onglet Network** : Vérifier les requêtes API
   - Les requêtes vers `http://localhost:8080/api/*` doivent retourner 200 ou 201
   - Si vous voyez des 401, le token n'est pas envoyé correctement
   - Si vous voyez des 404, l'endpoint n'existe pas

3. **Onglet Application** → **Local Storage** :
   - Doit contenir `token` et `user` après connexion

### Test avec Postman/curl

```bash
# 1. Se connecter
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login":"admin","pwd":"password"}'

# 2. Copier le token de la réponse

# 3. Tester un endpoint protégé
curl http://localhost:8080/api/admin/cabinets \
  -H "Authorization: Bearer <VOTRE_TOKEN>"
```

---

## ✅ Checklist de Vérification

### Backend
- [ ] MySQL est démarré
- [ ] Base de données `cabinet_medical` existe
- [ ] Backend compile sans erreur (`mvn clean install`)
- [ ] Backend démarre sur `http://localhost:8080`
- [ ] Test de login fonctionne (retourne un token)

### Frontend
- [ ] `npm install` exécuté sans erreur
- [ ] Frontend démarre sur `http://localhost:3000`
- [ ] Page de login s'affiche
- [ ] Connexion fonctionne
- [ ] Redirection selon le rôle fonctionne

### Intégration
- [ ] Les données du dashboard s'affichent
- [ ] Les listes (patients, rendez-vous, etc.) se chargent
- [ ] Les formulaires fonctionnent (création/modification)
- [ ] Pas d'erreurs CORS dans la console
- [ ] Les transformations de données fonctionnent (voir `lib/transformers.ts`)

---

## 🚀 Commandes Rapides (Résumé)

### Terminal 1 - Backend
```bash
cd JEEproject
mvn spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd front
npm install  # Seulement la première fois
npm run dev
```

### Ouvrir dans le navigateur
```
http://localhost:3000
```

---

## 📝 Notes Importantes

1. **Les deux serveurs doivent tourner en même temps** :
   - Backend sur le port 8080
   - Frontend sur le port 3000

2. **Les comptes par défaut** sont créés automatiquement au démarrage du backend (voir `data.sql`)

3. **En cas de problème**, vérifier :
   - Les logs du backend dans le terminal
   - La console du navigateur (F12)
   - Les requêtes réseau dans l'onglet Network

4. **Pour arrêter les serveurs** :
   - Backend : `Ctrl+C` dans le terminal
   - Frontend : `Ctrl+C` dans le terminal

---

Bon test ! 🎉

