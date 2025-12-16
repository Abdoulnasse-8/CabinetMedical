# 🔧 Corriger les Erreurs de Compilation

## Problème
Les erreurs indiquent que les fichiers compilés dans `target/classes` sont corrompus ou incomplets. Spring ne peut pas charger certaines classes.

## Solution: Nettoyer et Recompiler

### Méthode 1: Via IntelliJ (Recommandé)

1. **Arrêter l'application** si elle tourne (bouton rouge ⏹️)

2. **Nettoyer le projet:**
   - **Build → Clean Project**
   - Ou `Ctrl+Alt+Shift+S` → **Build** → **Clean**

3. **Supprimer le dossier target manuellement:**
   - Dans IntelliJ, ouvrir l'explorateur de fichiers (à gauche)
   - Trouver le dossier `target`
   - Clic droit → **Delete**
   - Confirmer la suppression

4. **Invalidate Caches:**
   - **File → Invalidate Caches / Restart**
   - Sélectionner **Invalidate and Restart**
   - ⏳ Attendre que IntelliJ redémarre

5. **Recompiler:**
   - **Build → Rebuild Project**
   - Ou `Ctrl+Shift+F9`
   - ⏳ Attendre la fin de la compilation (1-2 minutes)

6. **Relancer l'application:**
   - Ouvrir `CabinetMedicalApplication.java`
   - Clic droit → **Run 'CabinetMedicalApplication'**

### Méthode 2: Via Maven en Ligne de Commande

1. **Ouvrir un Terminal** dans IntelliJ:
   - **View → Tool Windows → Terminal** (ou `Alt+F12`)

2. **Nettoyer:**
   ```bash
   mvn clean
   ```

3. **Recompiler:**
   ```bash
   mvn clean install
   ```

4. **Relancer:**
   ```bash
   mvn spring-boot:run
   ```

### Méthode 3: Via IntelliJ Maven Tool Window

1. **Ouvrir Maven Tool Window:**
   - **View → Tool Windows → Maven** (ou cliquer sur l'onglet Maven à droite)

2. **Nettoyer:**
   - **cabinet-medical-backend → Lifecycle**
   - Double-cliquer sur **clean**

3. **Compiler:**
   - Double-cliquer sur **install**

4. **Relancer l'application**

---

## Si ça ne fonctionne toujours pas

### Solution Alternative: Désactiver Spring DevTools temporairement

1. Ouvrir `pom.xml`

2. Commenter ou supprimer temporairement la dépendance DevTools:
   ```xml
   <!-- Spring Boot DevTools -->
   <!--
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-devtools</artifactId>
       <scope>runtime</scope>
       <optional>true</optional>
   </dependency>
   -->
   ```

3. **Recompiler** et **relancer**

4. Une fois que ça fonctionne, vous pouvez remettre DevTools

---

## Vérification

Après avoir nettoyé et recompilé, vous devriez voir dans la console:

```
Started CabinetMedicalApplication in X.XXX seconds
```

Sans erreurs!

---

## Ordre des Opérations Recommandé

1. ✅ Arrêter l'application
2. ✅ Build → Clean Project
3. ✅ Supprimer le dossier `target`
4. ✅ File → Invalidate Caches / Restart
5. ✅ Build → Rebuild Project
6. ✅ Relancer l'application

---

**Cette procédure devrait résoudre tous les problèmes de compilation!**


