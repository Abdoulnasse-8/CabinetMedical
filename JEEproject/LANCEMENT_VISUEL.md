# 🎬 Guide Visuel - Lancer le Backend (Pas à Pas)

## 📸 Étapes Visuelles avec IntelliJ

### Étape 1: Vérifier MySQL ⚠️

**Avant de lancer, MySQL DOIT être démarré!**

**Windows:**
1. Appuyer sur `Win + R`
2. Taper `services.msc` → Entrée
3. Chercher **MySQL80** ou **MySQL**
4. Vérifier que le statut est **En cours d'exécution**
5. Si arrêté: Clic droit → **Démarrer**

---

### Étape 2: Ouvrir le Projet dans IntelliJ

1. **Lancer IntelliJ IDEA Ultimate**

2. **File → Open** (ou `Ctrl+O`)
   ```
   📁 File
      📁 Open...
      📁 New
      📁 ...
   ```

3. **Naviguer vers**: `C:\Users\aicha\Downloads\JEEproject`

4. **Sélectionner le dossier** `JEEproject`

5. **Cliquer "OK"**

6. ⏳ **Attendre** que Maven télécharge les dépendances
   - Voir la barre de progression en bas
   - Attendre 2-5 minutes
   - Les erreurs rouges vont disparaître progressivement

---

### Étape 3: Configurer Java

1. **File → Project Structure** (ou `Ctrl+Alt+Shift+S`)

2. Dans la fenêtre qui s'ouvre:
   ```
   📋 Project Settings
      📁 Project
      📁 Modules
      📁 ...
   ```

3. Cliquer sur **Project** (à gauche)

4. Vérifier **SDK**: Doit être **Java 17**
   ```
   SDK: [17] ▼
   ```

   Si pas disponible:
   - Cliquer sur le dropdown
   - **Add SDK → Download JDK**
   - Version: **17**
   - Cliquer **Download** puis **OK**

5. Cliquer **OK** pour fermer

---

### Étape 4: Configurer MySQL

1. Dans IntelliJ, ouvrir le fichier:
   ```
   📁 src
      📁 main
         📁 resources
            📄 application.properties  ← Ouvrir ce fichier
   ```

2. Chercher la ligne:
   ```properties
   spring.datasource.password=
   ```

3. **Remplacer** par votre mot de passe MySQL:
   ```properties
   spring.datasource.password=VOTRE_MOT_DE_PASSE
   ```

   ⚠️ **Exemple**: Si votre mot de passe MySQL est `1234`:
   ```properties
   spring.datasource.password=1234
   ```

4. **Sauvegarder** (`Ctrl+S`)

---

### Étape 5: Lancer l'Application 🚀

#### Méthode 1: Via la Classe Main (RECOMMANDÉ)

1. **Ouvrir** le fichier:
   ```
   📁 src
      📁 main
         📁 java
            📁 com
               📁 cabinetmedical
                  📄 CabinetMedicalApplication.java  ← Ouvrir ce fichier
   ```

2. Dans le fichier, vous verrez:
   ```java
   @SpringBootApplication
   public class CabinetMedicalApplication {
       public static void main(String[] args) {
           SpringApplication.run(CabinetMedicalApplication.class, args);
       }
   }
   ```

3. **À gauche du code**, vous verrez une **icône ▶️ verte** à côté de la classe

4. **Clic droit** sur la classe `CabinetMedicalApplication`
   ```
   📄 CabinetMedicalApplication
      ▶️ Run 'CabinetMedicalApplication'
      🐛 Debug 'CabinetMedicalApplication'
      📝 ...
   ```

5. Cliquer sur **Run 'CabinetMedicalApplication'**

   **OU** simplement cliquer sur l'icône ▶️ verte

   **OU** appuyer sur `Shift+F10`

#### Méthode 2: Via le Menu Run

1. **Run → Run 'CabinetMedicalApplication'**
   ```
   📋 Run
      ▶️ Run 'CabinetMedicalApplication'
      🐛 Debug 'CabinetMedicalApplication'
      📝 ...
   ```

---

### Étape 6: Vérifier que ça Fonctionne ✅

1. **Regarder la console** en bas de IntelliJ

2. Vous devriez voir des logs qui défilent:
   ```
   .   ____          _            __ _ _
   /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
   ...
   ```

3. **À la fin**, vous devriez voir:
   ```
   Started CabinetMedicalApplication in X.XXX seconds
   ```

4. ✅ **Si vous voyez cette ligne** → **Le backend est lancé!**

---

### Étape 7: Tester que le Backend Répond

#### Option A: Test Rapide dans le Navigateur

1. Ouvrir votre navigateur (Chrome, Firefox, etc.)

2. Aller sur:
   ```
   http://localhost:8080/api/auth/login
   ```

3. Vous devriez voir une erreur (c'est normal!)
   - C'est une erreur car on fait un GET sur un endpoint POST
   - Mais ça confirme que le serveur **répond**!

#### Option B: Test avec Postman (Recommandé)

1. Ouvrir Postman

2. Créer une nouvelle requête:
   ```
   POST http://localhost:8080/api/auth/login
   ```

3. **Headers**:
   ```
   Content-Type: application/json
   ```

4. **Body** (sélectionner "raw" et "JSON"):
   ```json
   {
     "login": "admin",
     "pwd": "password"
   }
   ```

5. Cliquer **Send**

6. ✅ **Résultat attendu**: Code 200, avec un token retourné

---

## 🛑 Arrêter l'Application

### Dans IntelliJ:

1. **Regarder la console** en bas
2. Cliquer sur le **bouton rouge ⏹️** à gauche de la console
   - Ou appuyer sur `Ctrl+F2`

### Redémarrer:

1. Cliquer sur le **bouton vert ▶️** à nouveau
   - Ou `Shift+F10`

---

## 🐛 Problèmes Courants

### ❌ "Port 8080 already in use"

**Solution:**
1. Arrêter l'application (bouton rouge ⏹️)
2. Ou modifier `application.properties`:
   ```properties
   server.port=8081
   ```

### ❌ "Cannot connect to MySQL"

**Vérifications:**
1. ✅ MySQL est démarré? (Voir Étape 1)
2. ✅ Le mot de passe dans `application.properties` est correct?
3. ✅ MySQL écoute sur le port 3306?

### ❌ "Cannot find symbol" ou erreurs rouges

**Solution:**
1. **File → Invalidate Caches / Restart**
2. Sélectionner **Invalidate and Restart**
3. Attendre la réindexation (2-3 minutes)

### ❌ L'application ne démarre pas

**Vérifier les logs** dans la console pour voir l'erreur exacte.

---

## ✅ Checklist Rapide

Avant de lancer:

- [ ] MySQL est démarré (Services Windows)
- [ ] Le projet est ouvert dans IntelliJ
- [ ] Maven a fini de télécharger (pas d'erreurs rouges)
- [ ] Java 17 est configuré
- [ ] Le mot de passe MySQL est correct dans `application.properties`

Pour lancer:

- [ ] Ouvrir `CabinetMedicalApplication.java`
- [ ] Clic droit → Run
- [ ] Vérifier: `Started CabinetMedicalApplication` dans la console
- [ ] Tester avec Postman ou navigateur

---

## 🎉 C'est Tout!

Si vous voyez `Started CabinetMedicalApplication` dans la console, **votre backend est lancé et fonctionne!**

**Prochaines étapes:**
- Tester avec Postman (voir `TEST_RAPIDE.md`)
- Générer le frontend avec V0 (voir `V0_PROMPT.md`)

---

**Besoin d'aide?** Consultez `COMMENT_LANCER.md` pour plus de détails.


