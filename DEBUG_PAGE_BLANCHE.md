# 🔍 Guide de Débogage - Page Blanche

## Problème : Le frontend démarre mais n'affiche rien

### ✅ Vérifications Immédiates

#### 1. Ouvrir la Console du Navigateur

**Important :** Ouvrez les outils de développement du navigateur (F12) et vérifiez l'onglet **Console** pour voir les erreurs.

**Comment faire :**
1. Ouvrir `http://localhost:3000` dans votre navigateur
2. Appuyer sur **F12** (ou clic droit → Inspecter)
3. Aller dans l'onglet **Console**
4. Regarder les erreurs en rouge

**Erreurs courantes à chercher :**
- `ReferenceError: localStorage is not defined`
- `Cannot read property 'X' of undefined`
- `Module not found`
- Erreurs de réseau (CORS, 404, etc.)

#### 2. Vérifier l'Onglet Network

1. Dans les outils de développement (F12)
2. Onglet **Network**
3. Recharger la page (F5)
4. Vérifier si les fichiers se chargent :
   - `_next/static/...` (fichiers Next.js)
   - `globals.css`
   - Les composants

#### 3. Vérifier que le Backend est Lancé

Le frontend a besoin du backend pour fonctionner. Vérifiez :

```bash
# Dans un autre terminal
curl http://localhost:8080/api/auth/login
```

Si vous obtenez une erreur de connexion, le backend n'est pas lancé.

---

## 🐛 Solutions aux Problèmes Courants

### Problème 1 : Erreur "localStorage is not defined"

**Symptôme :** Erreur dans la console mentionnant `localStorage`

**Cause :** Next.js essaie d'accéder à `localStorage` côté serveur (SSR)

**Solution :** Vérifier que tous les accès à `localStorage` sont protégés avec `typeof window !== "undefined"`

**Vérification :** Le code dans `contexts/auth-context.tsx` devrait déjà être correct, mais vérifiez.

### Problème 2 : Page Complètement Blanche (Aucune Erreur)

**Symptôme :** Page blanche, aucune erreur dans la console

**Solutions à essayer :**

1. **Vider le cache du navigateur :**
   - Chrome/Edge : `Ctrl + Shift + Delete`
   - Ou ouvrir en navigation privée : `Ctrl + Shift + N`

2. **Vérifier l'URL :**
   - Doit être exactement : `http://localhost:3000`
   - Pas `https://` ni un autre port

3. **Vérifier les logs du terminal :**
   - Regarder le terminal où `pnpm dev` tourne
   - Chercher des erreurs de compilation

4. **Redémarrer le serveur de développement :**
   ```bash
   # Arrêter avec Ctrl+C
   # Puis relancer
   pnpm dev
   ```

### Problème 3 : Erreurs de Compilation TypeScript

**Symptôme :** Erreurs TypeScript dans le terminal

**Solution :** Vérifier que tous les fichiers sont corrects

### Problème 4 : Erreurs CORS

**Symptôme :** Erreurs CORS dans la console du navigateur

**Solution :**
- Vérifier que le backend est lancé sur `http://localhost:8080`
- Vérifier que `cors.allowed-origins` dans `application.properties` inclut `http://localhost:3000`

### Problème 5 : CSS ne se charge pas

**Symptôme :** Page s'affiche mais sans style (texte brut)

**Solution :**
- Vérifier que `globals.css` existe dans `app/globals.css`
- Vérifier que Tailwind est configuré correctement

---

## 🔧 Commandes de Diagnostic

### 1. Vérifier les Erreurs de Build

```bash
cd front
pnpm build
```

Cela va compiler le projet et montrer toutes les erreurs.

### 2. Vérifier les Dépendances

```bash
cd front
pnpm install
```

### 3. Nettoyer et Réinstaller

```bash
cd front
rm -rf .next node_modules
pnpm install
pnpm dev
```

**Windows PowerShell :**
```powershell
cd front
Remove-Item -Recurse -Force .next, node_modules
pnpm install
pnpm dev
```

---

## 📋 Checklist de Diagnostic

Cocher chaque étape :

- [ ] Le backend est lancé sur `http://localhost:8080`
- [ ] Le frontend est lancé sur `http://localhost:3000`
- [ ] J'ai ouvert la console du navigateur (F12)
- [ ] J'ai vérifié l'onglet Console pour les erreurs
- [ ] J'ai vérifié l'onglet Network pour les requêtes
- [ ] J'ai essayé de vider le cache du navigateur
- [ ] J'ai essayé en navigation privée
- [ ] J'ai vérifié les logs du terminal `pnpm dev`

---

## 🆘 Si Rien ne Fonctionne

### Option 1 : Mode Debug Détaillé

Ajouter dans `next.config.mjs` :

```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ajouter ceci pour plus de logs
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

### Option 2 : Créer une Page de Test Simple

Créer `front/app/test/page.tsx` :

```tsx
export default function TestPage() {
  return (
    <div style={{ padding: '20px', background: 'lightblue' }}>
      <h1>Test Page</h1>
      <p>Si vous voyez ceci, Next.js fonctionne !</p>
    </div>
  )
}
```

Puis ouvrir : `http://localhost:3000/test`

Si cette page s'affiche, le problème est dans les autres pages.

### Option 3 : Vérifier la Configuration

Vérifier que `tsconfig.json` a les bons chemins :

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## 📞 Informations à Fournir pour Aide

Si vous avez besoin d'aide, fournissez :

1. **Screenshot de la console du navigateur** (F12 → Console)
2. **Screenshot de l'onglet Network** (F12 → Network)
3. **Logs du terminal** où `pnpm dev` tourne
4. **Version de Node.js** : `node -version`
5. **Version de pnpm** : `pnpm -version`
6. **Erreurs exactes** copiées depuis la console

---

## ✅ Solution Rapide - Réinitialisation Complète

Si rien ne fonctionne, essayez cette réinitialisation complète :

```bash
# 1. Arrêter tous les serveurs (Ctrl+C)

# 2. Nettoyer le frontend
cd front
rm -rf .next node_modules pnpm-lock.yaml

# 3. Réinstaller
pnpm install

# 4. Relancer
pnpm dev
```

**Windows PowerShell :**
```powershell
cd front
Remove-Item -Recurse -Force .next, node_modules, pnpm-lock.yaml
pnpm install
pnpm dev
```

---

Bon débogage ! 🔧

