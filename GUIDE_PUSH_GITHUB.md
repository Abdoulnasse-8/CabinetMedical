# 🚀 Guide pour Pousser vers GitHub

## Étapes pour pousser votre code

### 1. Vérifier que Git est configuré

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

### 2. Ajouter le remote (déjà fait)

```bash
git remote add origin https://github.com/Abdoulnasse-8/CabinetMedical.git
```

### 3. Ajouter tous les fichiers

```bash
git add .
```

### 4. Faire le commit initial

```bash
git commit -m "Initial commit: Backend Spring Boot + Frontend Next.js"
```

### 5. Pousser vers GitHub

```bash
git push -u origin master
```

**OU** si la branche s'appelle `main` :

```bash
git branch -M main
git push -u origin main
```

---

## ⚠️ Fichiers exclus par .gitignore

Les fichiers suivants ne seront **PAS** poussés (c'est normal) :
- `node_modules/` (dépendances)
- `front/.next/` (build Next.js)
- `JEEproject/target/` (build Maven)
- `.idea/` (fichiers IDE)
- Fichiers de logs et temporaires

---

## 🔐 Authentification GitHub

Si GitHub vous demande de vous authentifier :

### Option 1 : Token d'accès personnel (recommandé)

1. Allez sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Créez un nouveau token avec les permissions `repo`
3. Utilisez le token comme mot de passe lors du push

### Option 2 : GitHub CLI

```bash
gh auth login
```

### Option 3 : SSH (pour l'avenir)

Configurez une clé SSH pour éviter de taper le mot de passe à chaque fois.

---

## 📋 Commandes Complètes (Copier-Coller)

```bash
# 1. Ajouter tous les fichiers
git add .

# 2. Commit initial
git commit -m "Initial commit: Backend Spring Boot + Frontend Next.js - Gestion de cabinet médical"

# 3. Vérifier la branche
git branch

# 4. Pousser vers GitHub
git push -u origin master
# OU si c'est 'main'
git push -u origin main
```

---

## ✅ Vérification

Après le push, vérifiez sur GitHub :
- https://github.com/Abdoulnasse-8/CabinetMedical

Vous devriez voir tous vos fichiers !

