# 🚀 Guide d'Intégration - Landing Page Noble Cabinet

## 📋 Aperçu

Cette landing page moderne et animée remplace votre page de login comme page d'accueil. Elle présente :
- Informations sur le cabinet médical
- Liste des médecins
- Services offerts
- Formulaire de contact
- Bouton "Espace Professionnel" qui redirige vers `/login`

## 🎨 Design

**Palette de couleurs :**
- Primary: `#84cc16` (Vert lime - comme votre thème)
- Secondary: `#22c55e` (Vert)
- Dark: `#1a1a1a`
- Light: `#f8fafc`

**Animations incluses :**
- ✨ Animations de scroll fluides
- 🌊 Formes flottantes dans le hero
- 💫 Cartes animées au hover
- 🔄 Transitions smooth entre sections
- 📱 Responsive design complet

## 📁 Structure des Fichiers

Vous avez reçu 2 fichiers :
1. `LandingPage.tsx` - Composant React TypeScript
2. `LandingPage.css` - Styles avec animations

## 🔧 Installation

### Étape 1: Installer les dépendances nécessaires

```bash
npm install react-router-dom react-icons
```

Ou si vous utilisez yarn :
```bash
yarn add react-router-dom react-icons
```

### Étape 2: Placer les fichiers dans votre projet

Basé sur votre structure frontend :

```
front/
├── app/
│   ├── admin/
│   ├── login/
│   ├── medecin/
│   ├── profile/
│   ├── secretaire/
│   └── landing/           ← CRÉER CE DOSSIER
│       ├── page.tsx       ← LandingPage.tsx renommé en page.tsx
│       └── LandingPage.css
```

**Option Alternative (Recommandée pour Next.js) :**

```
front/
├── app/
│   ├── page.tsx          ← Remplacer par LandingPage (renommé)
│   └── landing.css       ← Ajouter le CSS
│   ├── login/
│   │   └── page.tsx      ← Votre page de login existante
│   └── ... (autres dossiers)
```

### Étape 3: Adapter le fichier selon votre architecture

#### Pour Next.js App Router (Recommandé) :

**Créer `app/page.tsx` :**

```typescript
'use client';

import LandingPage from './components/LandingPage';

export default function Home() {
  return <LandingPage />;
}
```

**Créer `app/components/LandingPage.tsx` :**
```typescript
// Collez le contenu de LandingPage.tsx ici
// Modifier la première ligne en :
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ← CHANGEMENT ICI
// ... reste du code
```

**Dans le composant, remplacer :**
```typescript
// AVANT
const navigate = useNavigate();

const handleLoginClick = () => {
  navigate('/login');
};

// APRÈS
const router = useRouter();

const handleLoginClick = () => {
  router.push('/login');
};
```

#### Pour React avec React Router :

**Créer `src/pages/LandingPage.tsx` :**
```typescript
// Collez le contenu tel quel, il fonctionne déjà avec React Router
```

**Mettre à jour `App.tsx` ou votre routeur :**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
// ... autres imports

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* ... autres routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

### Étape 4: Importer le CSS

**Dans `LandingPage.tsx`, vérifier l'import :**

```typescript
import './LandingPage.css';
```

**Ou si vous utilisez un dossier global de styles :**

```typescript
import '@/styles/LandingPage.css';
// ou
import '../styles/LandingPage.css';
```

## 🎯 Configuration du Routing

### Configuration Actuelle
Votre app démarre actuellement sur `/login`. Nous allons changer cela.

### Nouvelle Configuration

**Avant :**
```
http://localhost:3000 → Redirect to /login
http://localhost:3000/login → Page de login
```

**Après :**
```
http://localhost:3000 → Landing Page (nouveau)
http://localhost:3000/login → Page de login (inchangée)
```

### Pour Next.js :

**`app/page.tsx` devient la landing page :**
```typescript
'use client';
import LandingPage from '@/components/LandingPage';

export default function Home() {
  return <LandingPage />;
}
```

**`app/login/page.tsx` reste votre page de login actuelle**

### Pour React Router :

**Modifier `App.tsx` ou votre fichier de routes :**

```typescript
// AVANT
<Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />
  {/* autres routes */}
</Routes>

// APRÈS
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  {/* autres routes */}
</Routes>
```

## 🖼️ Personnalisation du Contenu

### 1. Informations du Cabinet

**Dans `LandingPage.tsx`, ligne ~60-90 :**

```typescript
// Modifier les informations de contact
<div className="contact-details">
  <h4>Adresse</h4>
  <p>123 Rue Principale, Casablanca<br />Maroc, 20000</p>  {/* ← MODIFIER */}
</div>

// Téléphone
<p>+212 5XX-XXXXXX<br />+212 6XX-XXXXXX</p>  {/* ← MODIFIER */}

// Email
<p>contact@noblecabinet.ma<br />info@noblecabinet.ma</p>  {/* ← MODIFIER */}
```

### 2. Liste des Médecins

**Ligne ~30-60 :**

```typescript
const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Hassan Alami",              // ← MODIFIER avec vrais noms
    specialty: "Médecin Généraliste",       // ← MODIFIER spécialités
    experience: "15 ans d'expérience",      // ← MODIFIER expérience
    image: "https://randomuser.me/api/portraits/men/32.jpg",  // ← Changer par vraies photos
    rating: 4.9
  },
  // Ajouter vos médecins...
];
```

**Pour utiliser de vraies photos :**

```typescript
// Option 1: Photos locales
image: "/images/doctors/dr-alami.jpg"

// Option 2: URL absolue
image: "https://votre-domaine.com/photos/dr-alami.jpg"

// Les photos doivent être placées dans :
// - Next.js : /public/images/doctors/
// - React : /public/images/doctors/
```

### 3. Services

**Ligne ~65-120 :**

```typescript
const services: Service[] = [
  {
    id: 1,
    title: "Consultation Générale",                    // ← MODIFIER
    description: "Consultations médicales complètes",  // ← MODIFIER
    icon: <FaStethoscope />,                          // ← Changer icône si besoin
    color: "#84cc16"                                  // ← Changer couleur
  },
  // Modifier ou ajouter vos services...
];
```

**Icônes disponibles (react-icons/fa) :**
- `FaStethoscope` - Stéthoscope
- `FaXRay` - Radiologie
- `FaHeartbeat` - Cardiologie
- `FaMicroscope` - Analyses
- `FaPills` - Pharmacie
- `FaAmbulance` - Urgences
- `FaSyringe` - Vaccinations
- `FaTeeth` - Dentaire
- `FaEye` - Ophtalmologie
- `FaBaby` - Pédiatrie

### 4. Statistiques dans le Hero

**Ligne ~200-220 :**

```typescript
<div className="hero-stats">
  <div className="stat-item">
    <div className="stat-number">15+</div>      {/* ← MODIFIER */}
    <div className="stat-label">Années d'expérience</div>
  </div>
  <div className="stat-item">
    <div className="stat-number">10K+</div>     {/* ← MODIFIER */}
    <div className="stat-label">Patients satisfaits</div>
  </div>
  <div className="stat-item">
    <div className="stat-number">20+</div>      {/* ← MODIFIER */}
    <div className="stat-label">Médecins experts</div>
  </div>
</div>
```

## 🎨 Personnalisation des Couleurs

**Dans `LandingPage.css`, ligne 1-10 :**

```css
:root {
  --primary-color: #84cc16;      /* ← Votre couleur principale */
  --primary-dark: #65a30d;        /* ← Version plus foncée */
  --primary-light: #a3e635;       /* ← Version plus claire */
  --secondary-color: #22c55e;     /* ← Couleur secondaire */
  /* ... */
}
```

**Pour garder votre thème actuel, ces couleurs sont déjà alignées avec votre design !**

## 🔗 Intégration avec votre Backend

### Récupérer les médecins depuis l'API

```typescript
import { useEffect, useState } from 'react';

const LandingPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à votre API backend
    fetch('http://localhost:8080/api/doctors')  // ← Adapter l'URL
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // ... reste du code
};
```

### Récupérer les services depuis l'API

```typescript
useEffect(() => {
  fetch('http://localhost:8080/api/services')
    .then(res => res.json())
    .then(data => setServices(data))
    .catch(error => console.error('Erreur:', error));
}, []);
```

## 🧪 Test de l'Intégration

### 1. Lancer le frontend

```bash
# Next.js
npm run dev

# React
npm start
```

### 2. Vérifier les URLs

- ✅ `http://localhost:3000` → Doit afficher la landing page
- ✅ `http://localhost:3000/login` → Doit afficher votre page de login
- ✅ Cliquer sur "Espace Professionnel" → Doit rediriger vers `/login`

### 3. Tester les animations

- ✅ Scroll fluide entre les sections
- ✅ Hover sur les cartes
- ✅ Navigation sticky
- ✅ Responsive sur mobile

## 📱 Responsive Design

La page est entièrement responsive :

- **Desktop** (> 1024px) : Layout complet
- **Tablet** (768px - 1024px) : 2 colonnes
- **Mobile** (< 768px) : 1 colonne, menu simplifié

**Test responsive :**
```bash
# Ouvrir Chrome DevTools (F12)
# Toggle device toolbar (Ctrl+Shift+M)
# Tester différentes tailles
```

## 🐛 Résolution de Problèmes

### Problème : Le CSS ne s'applique pas

**Solution :**
```typescript
// Vérifier l'import dans LandingPage.tsx
import './LandingPage.css';  // Chemin relatif
// ou
import '@/styles/LandingPage.css';  // Chemin absolu
```

### Problème : react-icons ne fonctionne pas

**Solution :**
```bash
# Réinstaller
npm uninstall react-icons
npm install react-icons

# Vérifier l'import
import { FaStethoscope } from 'react-icons/fa';
```

### Problème : Navigation ne fonctionne pas

**Solution pour Next.js :**
```typescript
// Utiliser next/navigation
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/login');
```

**Solution pour React Router :**
```typescript
// Utiliser react-router-dom
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/login');
```

### Problème : Images ne se chargent pas

**Solution :**
```typescript
// Next.js - Placer dans /public/
image: "/images/doctors/dr-alami.jpg"

// React - Placer dans /public/
image: "/images/doctors/dr-alami.jpg"

// Ou utiliser import
import doctorImage from '@/assets/doctors/dr-alami.jpg';
image: doctorImage
```

## 🚀 Déploiement

### Build de production

```bash
# Next.js
npm run build
npm start

# React
npm run build
# Servir le dossier build/
```

### Variables d'environnement

**Créer `.env.local` (Next.js) ou `.env` (React) :**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_SITE_NAME=Noble Cabinet
```

**Utiliser dans le code :**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

## ✅ Checklist Finale

- [ ] Dépendances installées (`react-router-dom`, `react-icons`)
- [ ] Fichiers placés dans la bonne structure
- [ ] Routes configurées correctement
- [ ] CSS importé
- [ ] Contenu personnalisé (médecins, services, contact)
- [ ] Bouton login redirige vers `/login`
- [ ] Page responsive testée
- [ ] Animations fonctionnent
- [ ] Build de production réussi

## 🎓 Ressources Supplémentaires

**Documentation :**
- React Router : https://reactrouter.com/
- Next.js Routing : https://nextjs.org/docs/routing
- React Icons : https://react-icons.github.io/react-icons/

**Animations CSS :**
- Keyframes : https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes
- Transitions : https://developer.mozilla.org/en-US/docs/Web/CSS/transition

## 💡 Conseils

1. **Testez d'abord** avec le contenu par défaut
2. **Personnalisez ensuite** progressivement
3. **Gardez une sauvegarde** de votre code actuel
4. **Utilisez Git** pour versionner vos changements

```bash
git add .
git commit -m "feat: Add landing page with animations"
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur (F12)
2. Vérifiez les erreurs de compilation
3. Relisez ce guide
4. Vérifiez que toutes les dépendances sont installées

---

**Bon courage avec votre intégration ! 🚀**

Date de création : Janvier 2026
Version : 1.0