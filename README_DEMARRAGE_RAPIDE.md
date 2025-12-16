# 🚀 Démarrage Rapide

## Pour Windows (Fichiers .bat)

### Option 1 : Utiliser les scripts automatiques

1. **Installer les dépendances du frontend** (une seule fois) :
   ```
   Double-cliquer sur: installer-frontend.bat
   ```

2. **Démarrer le backend** (Terminal 1) :
   ```
   Double-cliquer sur: demarrer-backend.bat
   ```
   Attendre que vous voyiez : `Started CabinetMedicalApplication`

3. **Démarrer le frontend** (Terminal 2) :
   ```
   Double-cliquer sur: demarrer-frontend.bat
   ```
   Attendre que vous voyiez : `ready started server on 0.0.0.0:3000`

4. **Ouvrir dans le navigateur** :
   ```
   http://localhost:3000
   ```

### Option 2 : Commandes manuelles

#### Terminal 1 - Backend
```bash
cd JEEproject
mvn spring-boot:run
```

#### Terminal 2 - Frontend
```bash
cd front
npm install        # Seulement la première fois
npm run dev
```

---

## 🔐 Comptes de Test

Tous les comptes ont le mot de passe : **`password`**

- **Administrateur** : `admin` / `password`
- **Médecin** : `medecin1` / `password`
- **Secrétaire** : `secretaire1` / `password`

---

## ⚠️ Prérequis

- ✅ Java 17+ installé
- ✅ Maven installé
- ✅ Node.js 18+ installé
- ✅ MySQL démarré (port 3306)
- ✅ Base de données configurée (voir `application.properties`)

---

## 🐛 Problèmes Courants

### Le backend ne démarre pas
- Vérifier que MySQL est démarré
- Vérifier les identifiants MySQL dans `JEEproject/src/main/resources/application.properties`
- Vérifier que le port 8080 n'est pas utilisé

### Le frontend ne démarre pas
- Exécuter `npm install` dans le dossier `front`
- Vérifier que le port 3000 n'est pas utilisé
- Supprimer `node_modules` et `package-lock.json` puis réinstaller

### Erreur CORS
- Vérifier que le backend est bien lancé sur le port 8080
- Vérifier que `cors.allowed-origins` dans `application.properties` inclut `http://localhost:3000`

---

Pour plus de détails, voir `GUIDE_TEST_COMPLET.md`


