# 📊 Guide des Diagrammes UML pour le Rapport

Ce document liste tous les diagrammes PlantUML créés pour votre rapport de projet de gestion de cabinet médical.

## 📁 Liste des Diagrammes

### 1. **Diagramme de Classes** ✅
**Fichier:** `diagramme_classe_plantuml.puml`

**Description:**
- Représente la structure complète des entités, DTOs, repositories, services et contrôleurs
- Montre les relations entre les différentes classes
- Inclut les énumérations (Role, StatutRendezVous, etc.)

**Utilisation dans le rapport:**
- Section "Conception" ou "Architecture du Système"
- Illustre la structure des données et les relations entre entités

---

### 2. **Diagramme de Cas d'Utilisation** ✅
**Fichier:** `diagramme_cas_utilisation.puml`

**Description:**
- Représente tous les cas d'utilisation pour chaque acteur (Administrateur, Médecin, Secrétaire)
- Montre les relations <<include>> et <<extend>> entre cas d'utilisation
- Organisé par packages fonctionnels

**Acteurs:**
- Administrateur
- Médecin
- Secrétaire

**Utilisation dans le rapport:**
- Section "Spécifications Fonctionnelles"
- Décrit les fonctionnalités accessibles à chaque rôle

---

### 3. **Diagramme de Séquence - Authentification** ✅
**Fichier:** `diagramme_sequence_connexion.puml`

**Description:**
- Montre le processus complet de connexion
- Détaille les interactions entre Frontend, Backend, Services et Base de données
- Inclut la validation des credentials, génération de JWT, et gestion des erreurs

**Utilisation dans le rapport:**
- Section "Processus d'Authentification"
- Illustre le flux d'authentification avec JWT

---

### 4. **Diagramme de Séquence - Création Consultation** ✅
**Fichier:** `diagramme_sequence_consultation.puml`

**Description:**
- Détaille le processus de création d'une consultation par un médecin
- Montre les interactions avec les différents repositories
- Inclut la mise à jour du dossier médical

**Utilisation dans le rapport:**
- Section "Processus Médical"
- Explique le flux de création d'une consultation

---

### 5. **Diagramme de Séquence - Création Rendez-vous** ✅
**Fichier:** `diagramme_sequence_rendez_vous.puml`

**Description:**
- Illustre le processus de création d'un rendez-vous par la secrétaire
- Montre la vérification de disponibilité
- Inclut la génération de notifications

**Utilisation dans le rapport:**
- Section "Processus Secrétarial"
- Explique la gestion des rendez-vous

---

### 6. **Diagramme d'Activité - Processus Consultation** ✅
**Fichier:** `diagramme_activite_consultation.puml`

**Description:**
- Décrit le processus complet depuis l'arrivée du patient jusqu'à la finalisation
- Inclut les décisions et conditions (dossier complet, prescriptions, etc.)
- Montre les différentes étapes du processus médical

**Utilisation dans le rapport:**
- Section "Processus Métier"
- Décrit le workflow de consultation

---

### 7. **Diagramme d'Activité - Processus Facturation** ✅
**Fichier:** `diagramme_activite_facturation.puml`

**Description:**
- Détaille le processus de facturation depuis la consultation jusqu'au paiement
- Inclut les différents modes de paiement
- Montre la validation et le suivi du paiement

**Utilisation dans le rapport:**
- Section "Processus Métier"
- Explique le workflow de facturation

---

### 8. **Diagramme de Déploiement** ✅
**Fichier:** `diagramme_deploiement.puml`

**Description:**
- Montre l'architecture de déploiement du système
- Illustre les interactions entre Frontend, Backend et Base de données
- Inclut les technologies utilisées

**Utilisation dans le rapport:**
- Section "Architecture de Déploiement"
- Décrit l'environnement technique

---

### 9. **Diagramme de Composants** ✅
**Fichier:** `diagramme_composants.puml`

**Description:**
- Représente l'architecture en composants du système
- Organisé par couches (Présentation, API, Métier, Persistance)
- Montre les dépendances entre composants

**Utilisation dans le rapport:**
- Section "Architecture Logicielle"
- Décrit l'organisation des composants

---

## 🛠️ Comment Générer les Diagrammes

### Option 1: PlantUML Online
1. Allez sur http://www.plantuml.com/plantuml/uml/
2. Copiez le contenu d'un fichier `.puml`
3. Collez dans l'éditeur en ligne
4. Exportez en PNG ou SVG

### Option 2: Plugin IDE
1. Installez le plugin PlantUML dans votre IDE (IntelliJ, VS Code, etc.)
2. Ouvrez le fichier `.puml`
3. Prévisualisez et exportez

### Option 3: Extension VS Code
1. Installez l'extension "PlantUML" dans VS Code
2. Utilisez `Alt+D` pour prévisualiser
3. Exportez en PNG avec `Ctrl+Shift+P` > "PlantUML: Export Current Diagram"

---

## 📝 Suggestions pour le Rapport

### Structure Recommandée:

1. **Introduction**
   - Contexte du projet
   - Objectifs

2. **Analyse des Besoins**
   - Diagramme de cas d'utilisation
   - Spécifications fonctionnelles

3. **Conception**
   - Diagramme de classes
   - Diagramme de composants
   - Diagramme de déploiement

4. **Implémentation**
   - Diagrammes de séquence (pour les fonctionnalités clés)
   - Diagrammes d'activité (pour les processus métier)
   - Technologies utilisées

5. **Tests et Validation**
   - Scénarios de test

6. **Conclusion**
   - Bilan
   - Perspectives

---

## 💡 Conseils

1. **Inclure des légendes** pour expliquer les couleurs et symboles
2. **Ajouter des notes** sur les diagrammes complexes
3. **Numéroter les diagrammes** dans le rapport
4. **Citer les diagrammes** dans le texte du rapport
5. **Utiliser une résolution suffisante** pour l'export (300 DPI minimum)

---

## 📚 Diagrammes Additionnels (Optionnels)

Si besoin, vous pouvez aussi créer:
- **Diagramme d'état** pour les statuts des rendez-vous/factures
- **Diagramme de séquence** pour d'autres fonctionnalités (gestion patients, etc.)
- **Diagramme de packages** pour l'organisation des modules

---

Bon travail pour votre rapport ! 🚀

