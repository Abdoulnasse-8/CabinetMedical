# 🚨 Diagnostic Rapide - Page Blanche

## Étapes Immédiates (À FAIRE MAINTENANT)

### 1. Ouvrir la Console du Navigateur ⚠️ IMPORTANT

1. Ouvrez `http://localhost:3000` dans votre navigateur
2. **Appuyez sur F12** (ou clic droit → Inspecter)
3. Cliquez sur l'onglet **"Console"**
4. **Copiez toutes les erreurs en rouge** que vous voyez

**C'est la première chose à vérifier !** Les erreurs dans la console vous diront exactement quel est le problème.

---

### 2. Tester la Page de Test

J'ai créé une page de test simple. Ouvrez dans votre navigateur :

```
http://localhost:3000/test
```

**Si cette page s'affiche :**
- ✅ Next.js fonctionne
- ✅ Le problème est dans les autres pages (login, dashboard, etc.)

**Si cette page ne s'affiche pas :**
- ❌ Problème avec Next.js lui-même
- Vérifiez les erreurs dans la console (étape 1)

---

### 3. Vérifier que le Backend est Lancé

Le frontend a besoin du backend. Vérifiez dans un autre terminal :

```powershell
# Test simple
curl http://localhost:8080/api/auth/login
```

**Si vous obtenez une erreur de connexion :**
- Le backend n'est pas lancé
- Lancez-le avec `mvn spring-boot:run` dans le dossier `JEEproject`

---

## 🔍 Erreurs Courantes et Solutions

### Erreur : "Cannot read property 'X' of undefined"

**Cause :** Une variable est undefined

**Solution :** Vérifier les composants qui utilisent des données du backend

### Erreur : "localStorage is not defined"

**Cause :** Accès à localStorage côté serveur

**Solution :** Déjà corrigé dans le code, mais vérifiez la console

### Erreur : "Failed to fetch" ou Erreurs CORS

**Cause :** Le backend n'est pas accessible

**Solution :**
1. Vérifier que le backend est lancé
2. Vérifier l'URL dans `front/lib/api.ts` : `http://localhost:8080`

### Erreur : "Module not found"

**Cause :** Dépendance manquante ou chemin incorrect

**Solution :**
```powershell
cd front
pnpm install
```

---

## 📋 Checklist Rapide

Cochez ce que vous avez fait :

- [ ] J'ai ouvert la console du navigateur (F12)
- [ ] J'ai vérifié l'onglet Console pour les erreurs
- [ ] J'ai testé `http://localhost:3000/test`
- [ ] J'ai vérifié que le backend est lancé
- [ ] J'ai vérifié l'onglet Network dans les outils de développement

---

## 🆘 Si Vous Voyez une Page Blanche

### Option 1 : Vider le Cache

1. Ouvrir en navigation privée : `Ctrl + Shift + N`
2. Aller sur `http://localhost:3000`

### Option 2 : Vérifier les Logs du Terminal

Regardez le terminal où `pnpm dev` tourne. Cherchez :
- Des erreurs de compilation
- Des warnings
- Des messages d'erreur

### Option 3 : Redémarrer Proprement

```powershell
# Arrêter avec Ctrl+C
# Puis relancer
cd front
pnpm dev
```

---

## 📸 Informations à Me Fournir

Pour que je puisse vous aider, j'ai besoin de :

1. **Screenshot de la console du navigateur** (F12 → Console)
   - Montre toutes les erreurs en rouge

2. **Ce que vous voyez exactement**
   - Page complètement blanche ?
   - Page avec du texte mais sans style ?
   - Erreur dans le navigateur ?

3. **Logs du terminal `pnpm dev`**
   - Copiez les dernières lignes

4. **Résultat du test de la page `/test`**
   - Est-ce que `http://localhost:3000/test` s'affiche ?

---

## ✅ Test Rapide

1. Ouvrir `http://localhost:3000/test` → Doit afficher "Test Page"
2. Ouvrir `http://localhost:3000/login` → Doit afficher le formulaire de login
3. Ouvrir la console (F12) → Ne doit pas avoir d'erreurs en rouge

**Si les 3 fonctionnent, votre application fonctionne !**

---

Dites-moi ce que vous voyez dans la console du navigateur (F12) ! 🔍


