# 🚀 Comment Lancer le Backend - Guide Complet

## 📋 Prérequis AVANT de Lancer

### 1. Vérifier que MySQL est Démarré ✅

**Windows:**
- Ouvrir **Services** (Win + R → `services.msc`)
- Chercher **MySQL80** ou **MySQL**
- Vérifier que le statut est **En cours d'exécution**
- Si arrêté: Clic droit → **Démarrer**

**Ou via ligne de commande:**
```bash
# Vérifier si MySQL tourne
net start | findstr MySQL
```

### 2. Vérifier la Configuration MySQL

Ouvrir `src/main/resources/application.properties` et vérifier:

```properties
spring.datasource.username=root
spring.datasource.password=VOTRE_MOT_DE_PASSE_MYSQL
```

⚠️ **Important**: Remplacer `VOTRE_MOT_DE_PASSE_MYSQL` par votre vrai mot de passe MySQL!

---

## 🎯 Méthode 1: Lancer avec IntelliJ Ultimate (Recommandé)

### Étape 1: Ouvrir le Projet

1. **Lancer IntelliJ IDEA Ultimate**
2. **File → Open** (ou `Ctrl+O`)
3. Sélectionner le dossier `C:\Users\aicha\Downloads\JEEproject`
4. Cliquer **OK**
5. ⏳ Attendre que Maven télécharge les dépendances (2-5 minutes)

### Étape 2: Vérifier la Configuration Java

1. **File → Project Structure** (ou `Ctrl+Alt+Shift+S`)
2. **Project Settings → Project**
3. Vérifier que **SDK** = **Java 17** (ou supérieur)
   - Si pas disponible: **Add SDK → Download JDK → Version 17**
4. Cliquer **OK**

### Étape 3: Configurer MySQL (si pas déjà fait)

1. Ouvrir `src/main/resources/application.properties`
2. Modifier la ligne:
```properties
spring.datasource.password=1234
```
   (Remplacer `1234` par votre mot de passe MySQL)

### Étape 4: Lancer l'Application 🚀

**Option A: Via la Classe Main (Plus Simple)**

1. Ouvrir le fichier: `src/main/java/com/cabinetmedical/CabinetMedicalApplication.java`
2. Vous verrez une icône ▶️ verte à côté de la classe
3. **Clic droit** sur la classe → **Run 'CabinetMedicalApplication'**
   - Ou simplement cliquer sur l'icône ▶️
   - Ou appuyer sur `Shift+F10`

**Option B: Via le Menu Run**

1. **Run → Run 'CabinetMedicalApplication'**
   - Ou `Shift+F10`

**Option C: Via Maven**

1. Ouvrir le panneau **Maven** (à droite, ou `View → Tool Windows → Maven`)
2. **cabinet-medical-backend → Lifecycle**
3. Double-cliquer sur **spring-boot:run**

### Étape 5: Vérifier que ça Fonctionne ✅

Dans la **console** en bas de IntelliJ, vous devriez voir:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

... (logs de démarrage) ...

Started CabinetMedicalApplication in X.XXX seconds
```

✅ **Si vous voyez "Started CabinetMedicalApplication"** → **C'est bon! Le backend tourne!**

### Étape 6: Tester que le Backend Répond

Ouvrir votre navigateur et aller sur:
```
http://localhost:8080/api/auth/login
```

Vous devriez voir une erreur (c'est normal, c'est une requête GET sur un endpoint POST), mais ça confirme que le serveur répond!

**Ou tester avec Postman:**
```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "login": "admin",
  "pwd": "password"
}
```

---

## 🖥️ Méthode 2: Lancer via Ligne de Commande

### Étape 1: Ouvrir un Terminal

**Dans IntelliJ:**
- **View → Tool Windows → Terminal** (ou `Alt+F12`)

**Ou Windows PowerShell:**
- Ouvrir PowerShell
- Naviguer vers le projet:
```powershell
cd C:\Users\aicha\Downloads\JEEproject
```

### Étape 2: Compiler le Projet

```bash
mvn clean install
```

⏳ Cela peut prendre 2-3 minutes la première fois

### Étape 3: Lancer l'Application

```bash
mvn spring-boot:run
```

### Étape 4: Vérifier

Vous devriez voir les mêmes logs que dans IntelliJ, avec:
```
Started CabinetMedicalApplication in X.XXX seconds
```

---

## 🐛 Résolution de Problèmes

### ❌ Erreur: "Port 8080 already in use"

**Solution:**
1. Arrêter l'application qui utilise le port 8080
2. Ou changer le port dans `application.properties`:
```properties
server.port=8081
```

### ❌ Erreur: "Cannot connect to MySQL"

**Vérifications:**
1. ✅ MySQL est démarré? (Voir Prérequis)
2. ✅ Le mot de passe dans `application.properties` est correct?
3. ✅ MySQL écoute sur le port 3306?

**Tester la connexion MySQL:**
```bash
mysql -u root -p
```
(Si ça fonctionne, MySQL est OK)

### ❌ Erreur: "Cannot find symbol" ou erreurs de compilation

**Solution:**
1. **File → Invalidate Caches / Restart**
2. Sélectionner **Invalidate and Restart**
3. Attendre la réindexation

### ❌ Erreur: "Java 17 not found"

**Solution:**
1. **File → Project Structure → Project**
2. **SDK**: Cliquer sur **New...**
3. **Download JDK → Version 17**
4. Cliquer **OK**

### ❌ L'application démarre mais plante immédiatement

**Vérifier les logs** dans la console IntelliJ pour voir l'erreur exacte.

**Erreurs communes:**
- Base de données non accessible → Vérifier MySQL
- Port déjà utilisé → Changer le port
- Erreur de configuration → Vérifier `application.properties`

---

## ✅ Checklist de Démarrage

Avant de lancer, vérifier:

- [ ] MySQL est démarré
- [ ] Le mot de passe MySQL est correct dans `application.properties`
- [ ] Java 17 est configuré dans IntelliJ
- [ ] Maven a téléchargé les dépendances (pas d'erreurs rouges)
- [ ] Le projet compile sans erreurs

---

## 🎯 Après le Démarrage

Une fois que vous voyez `Started CabinetMedicalApplication`, le backend est **prêt**!

### Prochaines Étapes:

1. **Tester avec Postman** (voir `TEST_RAPIDE.md`)
2. **Tester les endpoints** (voir `GUIDE_TEST_POSTMAN.md`)
3. **Générer le frontend** avec V0 (voir `V0_PROMPT.md`)

---

## 📝 Commandes Utiles

### Arrêter l'Application

**Dans IntelliJ:**
- Cliquer sur le bouton rouge ⏹️ dans la console
- Ou `Ctrl+F2`

**Dans Terminal:**
- `Ctrl+C`

### Redémarrer l'Application

**Dans IntelliJ:**
- Bouton vert ▶️ (relance automatiquement)
- Ou `Shift+F10`

### Voir les Logs

Les logs apparaissent dans la **console** en bas de IntelliJ.

Pour voir plus de détails, modifier `application.properties`:
```properties
spring.jpa.show-sql=true  # Affiche les requêtes SQL
```

---

## 💡 Astuces

1. **Mode Debug**: Clic droit → **Debug 'CabinetMedicalApplication'** pour déboguer
2. **Hot Reload**: Modifier le code, IntelliJ recharge automatiquement (avec DevTools)
3. **Logs Colorés**: Les logs sont colorés dans IntelliJ pour faciliter la lecture
4. **Arrêter/Relancer**: Facile avec les boutons dans IntelliJ

---

## 🎉 Résumé Rapide

1. ✅ Vérifier MySQL démarré
2. ✅ Configurer le mot de passe MySQL dans `application.properties`
3. ✅ Ouvrir `CabinetMedicalApplication.java`
4. ✅ Clic droit → **Run 'CabinetMedicalApplication'**
5. ✅ Vérifier: `Started CabinetMedicalApplication` dans la console
6. ✅ Tester: `POST http://localhost:8080/api/auth/login`

**C'est tout! 🚀**

---

**Besoin d'aide?** Consultez `GUIDE_INTELLIJ.md` pour plus de détails sur IntelliJ.


