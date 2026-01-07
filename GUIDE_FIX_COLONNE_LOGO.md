# 🔧 Guide de Correction - Colonne Logo

## ❌ Problème

Erreur lors de l'upload de logo :
```
Data truncation: Data too long for column 'logo' at row 1
```

La colonne `logo` était en `TEXT` (limite ~64KB) mais les images en base64 peuvent être beaucoup plus grandes.

---

## ✅ Solutions Appliquées

### 1. **Backend** : Modification de la colonne en LONGTEXT

✅ Fait : `Cabinet.java` modifié pour utiliser `LONGTEXT` (peut stocker jusqu'à 4GB)

### 2. **Frontend** : Compression automatique des images

✅ Fait : Les images sont maintenant :
- Redimensionnées à maximum 600x600px
- Compressées avec qualité 0.7 (JPEG)
- Si encore trop grande, nouvelle compression à 400x400px avec qualité 0.6
- Limite finale : ~500KB en base64

---

## 🚀 Actions Requises

### Option 1 : Migration Automatique (Recommandé)

**Si vous pouvez redémarrer l'application :**

1. Arrêtez le backend
2. Exécutez le script SQL suivant dans MySQL :

```sql
USE cabinet_medical;
ALTER TABLE cabinets MODIFY COLUMN logo LONGTEXT;
```

3. Redémarrez le backend
4. Hibernate utilisera maintenant LONGTEXT pour les nouvelles créations

### Option 2 : Migration Manuelle via MySQL

1. Ouvrez MySQL Workbench ou votre client MySQL
2. Connectez-vous à la base `cabinet_medical`
3. Exécutez :

```sql
ALTER TABLE cabinets MODIFY COLUMN logo LONGTEXT;
```

### Option 3 : Supprimer et Recréer (⚠️ Perte de données)

**Attention : Ceci supprimera tous les cabinets existants !**

1. Dans `application.properties`, changez temporairement :
   ```properties
   spring.jpa.hibernate.ddl-auto=create
   ```
2. Redémarrez le backend
3. Remettez :
   ```properties
   spring.jpa.hibernate.ddl-auto=update
   ```
4. Les données initiales seront recréées automatiquement

---

## 🧪 Vérification

Après la migration, testez :

1. Créer un cabinet avec logo
2. Modifier un cabinet existant avec nouveau logo
3. Vérifier que le logo s'affiche correctement

---

## 📊 Tailles Approximatives

| Type | Avant | Après Compression |
|------|-------|-------------------|
| Image originale | Jusqu'à 5MB | ~200-400KB en base64 |
| Dimensions | Variable | Max 600x600px |
| Qualité | 100% | 70% (bon compromis) |

---

## ✅ Avantages de la Solution

1. **Compression automatique** : L'utilisateur n'a pas à se soucier de la taille
2. **Performance** : Images plus légères = chargement plus rapide
3. **Stockage** : Moins d'espace en base de données
4. **UX** : L'aperçu se charge instantanément

---

## 🔍 Si le Problème Persiste

1. Vérifiez que la migration SQL a bien été exécutée :
   ```sql
   DESCRIBE cabinets;
   ```
   La colonne `logo` doit être de type `longtext`

2. Vérifiez les logs du backend pour d'autres erreurs

3. Videz le cache du navigateur et réessayez

---

**Date de correction :** Aujourd'hui
**Statut :** ✅ Backend modifié, Frontend avec compression


