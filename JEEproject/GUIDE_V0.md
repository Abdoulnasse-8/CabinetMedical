# Guide Rapide - Utilisation du Prompt V0

## Comment utiliser V0_PROMPT.md pour générer le frontend

### Étape 1: Accéder à V0 by Vercel
1. Aller sur https://v0.dev
2. Créer un compte ou se connecter

### Étape 2: Copier le Prompt
1. Ouvrir le fichier `V0_PROMPT.md`
2. Copier tout le contenu (Ctrl+A, Ctrl+C)

### Étape 3: Coller dans V0
1. Dans V0, coller le prompt complet dans la zone de texte
2. Cliquer sur "Generate" ou "Create"

### Étape 4: Personnaliser
V0 va générer le code React/Next.js. Vous pouvez ensuite:
- Modifier les composants générés
- Ajuster les styles
- Ajouter des fonctionnalités supplémentaires

### Étape 5: Télécharger le Code
1. Une fois satisfait, télécharger le code généré
2. Installer les dépendances: `npm install`
3. Configurer l'URL de l'API dans un fichier de configuration

### Étape 6: Intégration avec le Backend
1. Démarrer le backend: `mvn spring-boot:run`
2. Démarrer le frontend: `npm run dev`
3. Tester l'application complète

## Configuration Frontend

Créer un fichier `.env.local` dans le projet frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Ou pour React/Vite:
```javascript
// config/api.js
export const API_BASE_URL = 'http://localhost:8080';
```

## Points Importants

- ✅ Le backend doit être démarré avant le frontend
- ✅ Configurer CORS si nécessaire (déjà fait dans SecurityConfig)
- ✅ Le token JWT doit être stocké dans localStorage
- ✅ Ajouter le token dans toutes les requêtes API

## Structure Frontend Attendue

```
frontend/
├── pages/ ou app/          # Pages Next.js ou routes React
│   ├── login/
│   ├── medecin/
│   ├── secretaire/
│   └── admin/
├── components/             # Composants réutilisables
├── services/               # Services API
├── context/                # Context React pour auth
└── utils/                  # Utilitaires
```

## Test Rapide

Une fois le frontend généré et configuré:

1. **Démarrer le backend**
   ```bash
   cd JEEproject
   mvn spring-boot:run
   ```

2. **Démarrer le frontend**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Tester la connexion**
   - Aller sur http://localhost:3000 (ou le port du frontend)
   - Se connecter avec `admin` / `password`
   - Vérifier que le dashboard s'affiche

## Support

Si V0 ne génère pas exactement ce que vous voulez:
- Modifier le prompt dans V0_PROMPT.md
- Ajouter plus de détails sur les composants souhaités
- Utiliser plusieurs prompts pour différentes pages

---

**Bon développement ! 🚀**


