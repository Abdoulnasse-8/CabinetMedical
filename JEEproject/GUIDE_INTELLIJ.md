# Guide IntelliJ Ultimate - Projet Cabinet Médical

## 🚀 Configuration Initiale

### Étape 1: Ouvrir le Projet dans IntelliJ

1. **Lancer IntelliJ IDEA Ultimate**
2. **File → Open** (ou `Ctrl+O` / `Cmd+O`)
3. Sélectionner le dossier `JEEproject`
4. IntelliJ détectera automatiquement que c'est un projet Maven

### Étape 2: Attendre l'Indexation

- IntelliJ va automatiquement:
  - Détecter le fichier `pom.xml`
  - Télécharger les dépendances Maven
  - Indexer le code
- ⏳ Cela peut prendre 2-5 minutes la première fois
- Vérifier la barre de progression en bas à droite

### Étape 3: Configurer le JDK

1. **File → Project Structure** (ou `Ctrl+Alt+Shift+S`)
2. **Project Settings → Project**
3. **SDK**: Sélectionner **Java 17** (ou supérieur)
   - Si pas disponible: **Add SDK → Download JDK → Version 17**
4. **Language level**: **17 - Sealed types, always-strict floating-point semantics**
5. Cliquer **OK**

### Étape 4: Configurer Maven

1. **File → Settings** (ou `Ctrl+Alt+S`)
2. **Build, Execution, Deployment → Build Tools → Maven**
3. Vérifier:
   - **Maven home directory**: Chemin vers Maven installé
   - **User settings file**: Généralement `~/.m2/settings.xml`
   - **Local repository**: Généralement `~/.m2/repository`
4. **Maven → Importing**:
   - ✅ **Import Maven projects automatically**
   - ✅ **Automatically download**: Sources, Documentation
5. Cliquer **OK**

---

## 🔧 Configuration de la Base de Données

### Option 1: Via IntelliJ Database Tool (Recommandé)

1. **View → Tool Windows → Database** (ou `Alt+1` puis onglet Database)
2. Cliquer **+ → Data Source → MySQL**
3. Configurer:
   - **Host**: `localhost`
   - **Port**: `3306`
   - **Database**: `cabinet_medical`
   - **User**: `root` (ou votre utilisateur MySQL)
   - **Password**: Votre mot de passe MySQL
4. Cliquer **Test Connection**
   - Si erreur: Télécharger le driver MySQL si demandé
5. Cliquer **OK**

### Option 2: Créer la Base de Données

Dans l'onglet Database:
1. Clic droit sur la connexion → **New → Query Console**
2. Exécuter:
```sql
CREATE DATABASE IF NOT EXISTS cabinet_medical;
USE cabinet_medical;
```

---

## ⚙️ Configuration application.properties

1. Ouvrir `src/main/resources/application.properties`
2. Modifier les paramètres de connexion:
```properties
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE
```

---

## ▶️ Lancer l'Application

### Méthode 1: Via la Classe Main

1. Ouvrir `src/main/java/com/cabinetmedical/CabinetMedicalApplication.java`
2. Clic droit sur la classe → **Run 'CabinetMedicalApplication'**
   - Ou cliquer sur l'icône ▶️ verte à côté de la classe
   - Ou `Shift+F10`

### Méthode 2: Via Maven

1. Ouvrir le panneau **Maven** (à droite, ou `View → Tool Windows → Maven`)
2. **cabinet-medical-backend → Lifecycle**
3. Double-cliquer sur **spring-boot:run**

### Vérifier le Démarrage

Dans la console, vous devriez voir:
```
Started CabinetMedicalApplication in X.XXX seconds
```

---

## 🐛 Débogage (Debug)

### Lancer en Mode Debug

1. Clic droit sur `CabinetMedicalApplication.java`
2. **Debug 'CabinetMedicalApplication'**
   - Ou `Shift+F9`
   - Ou cliquer sur l'icône 🐛 verte

### Points d'Arrêt (Breakpoints)

1. Cliquer dans la marge gauche (à côté du numéro de ligne)
2. Un point rouge apparaît
3. Quand l'exécution atteint ce point, elle s'arrête
4. Utiliser les boutons de debug:
   - **F8**: Step Over (ligne suivante)
   - **F7**: Step Into (entrer dans la méthode)
   - **F9**: Resume (continuer)
   - **Shift+F8**: Step Out (sortir de la méthode)

---

## 📝 Fonctionnalités Utiles d'IntelliJ

### 1. Auto-complétion et Suggestions

- IntelliJ suggère automatiquement le code
- `Ctrl+Space`: Forcer l'auto-complétion
- `Ctrl+Shift+Space`: Suggestions intelligentes

### 2. Refactoring

- **Renommer**: `Shift+F6`
- **Extraire méthode**: `Ctrl+Alt+M`
- **Extraire variable**: `Ctrl+Alt+V`
- **Inline**: `Ctrl+Alt+N`

### 3. Navigation

- **Aller à la déclaration**: `Ctrl+B` (ou `Ctrl+Click`)
- **Rechercher dans tout le projet**: `Ctrl+Shift+F`
- **Rechercher une classe**: `Ctrl+N`
- **Rechercher un fichier**: `Ctrl+Shift+N`
- **Rechercher un symbole**: `Ctrl+Alt+Shift+N`

### 4. Génération de Code

- **Générer getters/setters**: `Alt+Insert` → Getters and Setters
- **Générer constructeur**: `Alt+Insert` → Constructor
- **Générer toString/equals/hashCode**: `Alt+Insert` → toString/equals/hashCode
- **Surround with**: `Ctrl+Alt+T` (try-catch, if, etc.)

### 5. Vérification du Code

- **Analyser le code**: `Alt+Shift+I` ou **Code → Inspect Code**
- Les erreurs sont soulignées en rouge
- Les warnings en jaune
- Passer la souris pour voir les détails

### 6. Terminal Intégré

- **View → Tool Windows → Terminal** (ou `Alt+F12`)
- Terminal intégré dans IntelliJ
- Utile pour les commandes Maven: `mvn clean install`

---

## 🧪 Tester l'API avec IntelliJ HTTP Client

IntelliJ Ultimate inclut un client HTTP intégré!

### Créer un Fichier de Requêtes HTTP

1. **File → New → HTTP Request**
2. Nommer: `api-requests.http`
3. Ajouter vos requêtes:

```http
### Variables
@baseUrl = http://localhost:8080
@token =

### Login
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "login": "admin",
  "pwd": "password"
}

> {%
    client.global.set("token", response.body.token);
%}

### Get All Patients (nécessite token)
GET {{baseUrl}}/api/secretaire/patients?cabinetId=1
Authorization: Bearer {{token}}

### Create Patient
POST {{baseUrl}}/api/secretaire/patients?cabinetId=1
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "cin": "CD789012",
  "nom": "Bennani",
  "prenom": "Fatima",
  "dateNaissance": "1985-05-20",
  "sexe": "F",
  "numTel": "0623456789",
  "typemutuelle": "CNOPS"
}

### Get Dashboard Medecin
GET {{baseUrl}}/api/medecin/dashboard?cabinetId=1&medecinId=2
Authorization: Bearer {{token}}
```

4. Cliquer sur ▶️ à côté de chaque requête pour l'exécuter

---

## 🔍 Utiliser la Base de Données dans IntelliJ

### Visualiser les Tables

1. **View → Tool Windows → Database**
2. Développer votre connexion → **cabinet_medical**
3. Voir toutes les tables créées automatiquement par Hibernate

### Exécuter des Requêtes SQL

1. Clic droit sur une table → **Jump to Query Console**
2. Ou **New → Query Console**
3. Écrire votre SQL:
```sql
SELECT * FROM patients;
SELECT * FROM utilisateurs;
SELECT * FROM rendez_vous;
```

### Modifier les Données

1. Double-cliquer sur une table
2. Modifier directement dans la grille
3. Sauvegarder avec `Ctrl+S`

---

## 🎨 Plugins Recommandés

### Déjà Inclus dans Ultimate

- ✅ **Database Tools**: Gestion de bases de données
- ✅ **HTTP Client**: Tester les APIs
- ✅ **Spring Boot**: Support Spring Boot

### Plugins Utiles à Installer

1. **File → Settings → Plugins**
2. Rechercher et installer:
   - **Lombok**: Support pour Lombok (déjà utilisé dans le projet)
   - **Spring Assistant**: Aide pour Spring
   - **RESTful Tool**: Outils pour REST APIs

---

## 🛠️ Résolution de Problèmes Courants

### Problème: "Cannot resolve symbol"

**Solution:**
1. **File → Invalidate Caches / Restart**
2. Sélectionner **Invalidate and Restart**
3. Attendre la réindexation

### Problème: Maven ne télécharge pas les dépendances

**Solution:**
1. **View → Tool Windows → Maven**
2. Clic droit sur le projet → **Reload Project**
3. Ou **File → Settings → Maven → Repositories**
4. Sélectionner le repository → **Update**

### Problème: Erreur de compilation Lombok

**Solution:**
1. **File → Settings → Plugins**
2. Rechercher **Lombok**
3. Installer si pas installé
4. **File → Settings → Build → Compiler → Annotation Processors**
5. ✅ **Enable annotation processing**

### Problème: Port 8080 déjà utilisé

**Solution:**
1. Trouver le processus: **Run → Edit Configurations**
2. Modifier **Application → CabinetMedicalApplication**
3. **VM options**: `-Dserver.port=8081`
4. Ou modifier dans `application.properties`

---

## 📚 Structure du Projet dans IntelliJ

### Vue Project (Alt+1)

```
JEEproject
├── .idea/              (Configuration IntelliJ - ne pas modifier)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/cabinetmedical/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── entity/
│   │   │       ├── repository/
│   │   │       ├── service/
│   │   │       └── security/
│   │   └── resources/
│   │       └── application.properties
│   └── test/           (Tests unitaires - à créer)
└── pom.xml
```

### Navigation Rapide

- **Ctrl+E**: Fichiers récemment ouverts
- **Ctrl+Shift+E**: Fichiers récemment modifiés
- **Alt+1**: Basculer Project View
- **Alt+2**: Basculer Favorites
- **Alt+4**: Basculer Run (console)
- **Alt+5**: Basculer Debug
- **Alt+6**: Basculer TODO
- **Alt+7**: Basculer Structure (méthodes de la classe)

---

## 🎯 Workflow Recommandé

### 1. Ouvrir le Projet
- File → Open → Sélectionner `JEEproject`

### 2. Configurer
- Vérifier JDK 17
- Configurer la base de données
- Modifier `application.properties`

### 3. Lancer
- Run `CabinetMedicalApplication`
- Vérifier les logs dans la console

### 4. Développer
- Utiliser l'auto-complétion
- Naviguer avec `Ctrl+B`
- Refactoriser avec `Shift+F6`

### 5. Tester
- Utiliser HTTP Client intégré
- Ou Postman
- Vérifier la base de données

### 6. Déboguer
- Mettre des breakpoints
- Lancer en mode Debug
- Inspecter les variables

---

## 💡 Astuces Pro

1. **Live Templates**: `Ctrl+J` pour voir les templates (sout, psvm, etc.)
2. **Multi-cursor**: `Alt+Click` pour plusieurs curseurs
3. **Recherche partout**: `Double Shift` pour rechercher partout
4. **Recent Locations**: `Ctrl+Shift+E` pour voir les modifications récentes
5. **Bookmarks**: `F11` pour marquer une ligne, `Shift+F11` pour voir tous les bookmarks
6. **Compare Files**: `Ctrl+D` pour comparer deux fichiers
7. **Local History**: Voir l'historique local des modifications

---

## 🚀 Prochaines Étapes

1. ✅ Importer le projet dans IntelliJ
2. ✅ Configurer la base de données
3. ✅ Lancer l'application
4. ✅ Tester avec HTTP Client
5. 📝 Commencer à développer le frontend avec V0
6. 🔗 Intégrer frontend et backend

---

**Bon développement avec IntelliJ Ultimate! 🎉**

