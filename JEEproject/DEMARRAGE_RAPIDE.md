# 🚀 Démarrage Rapide - IntelliJ Ultimate

## ⚠️ AVANT TOUT: Vérifier MySQL

**MySQL doit être démarré!**
- Windows: Ouvrir **Services** → Chercher **MySQL** → Vérifier qu'il est **En cours d'exécution**
- Si arrêté: Clic droit → **Démarrer**

---

## En 5 Minutes ⏱️

### 1️⃣ Ouvrir le Projet (30 secondes)
```
File → Open → Sélectionner le dossier JEEproject
```
⏳ Attendre que Maven télécharge les dépendances (2-3 minutes)
- Voir la barre de progression en bas à droite
- Attendre que les erreurs rouges disparaissent

### 2️⃣ Configurer Java (30 secondes)
```
File → Project Structure (Ctrl+Alt+Shift+S)
→ Project → SDK: Java 17
```
Si Java 17 n'existe pas: **Add SDK → Download JDK → Version 17**

### 3️⃣ Configurer MySQL (1 minute)
1. Ouvrir `src/main/resources/application.properties`
2. Trouver la ligne: `spring.datasource.password=`
3. Remplacer par votre mot de passe MySQL:
```properties
spring.datasource.password=VOTRE_MOT_DE_PASSE_MYSQL
```
⚠️ **Important**: Mettre votre VRAI mot de passe MySQL!

### 4️⃣ Lancer l'Application (10 secondes)

**Méthode Simple:**
1. Ouvrir le fichier: `src/main/java/com/cabinetmedical/CabinetMedicalApplication.java`
2. Vous verrez une icône ▶️ verte à côté de la classe
3. **Clic droit** sur la classe → **Run 'CabinetMedicalApplication'**
   - Ou simplement cliquer sur l'icône ▶️ verte
   - Ou appuyer sur `Shift+F10`

### 5️⃣ Tester (1 minute)
Dans IntelliJ:
```
File → New → HTTP Request
```

Coller:
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "login": "admin",
  "pwd": "password"
}
```

Cliquer ▶️ pour exécuter

---

## ✅ Vérification

Si vous voyez dans la console:
```
Started CabinetMedicalApplication in X.XXX seconds
```

🎉 **C'est bon! Le backend fonctionne!**

---

## 📚 Documentation Complète

- **GUIDE_INTELLIJ.md** - Guide détaillé IntelliJ
- **API_DOCUMENTATION.md** - Tous les endpoints API
- **MANUEL_INSTALLATION.md** - Installation complète
- **V0_PROMPT.md** - Pour générer le frontend

---

## 🆘 Problèmes Courants

### "Cannot resolve symbol"
```
File → Invalidate Caches / Restart → Invalidate and Restart
```

### Port 8080 déjà utilisé
Modifier dans `application.properties`:
```properties
server.port=8081
```

### Erreur de connexion MySQL
Vérifier que MySQL est démarré et que le mot de passe est correct.

---

**Besoin d'aide? Consultez GUIDE_INTELLIJ.md** 📖

