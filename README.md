# 🎓 API de Gestion des Stages - Projet Tutoré

## 📋 Description du Projet

Cette API REST a été développée dans le cadre du cours **Projet Tutoré** pour la gestion complète des stages étudiants. Elle permet la mise en relation entre étudiants, entreprises et établissements d'enseignement pour faciliter le processus de recherche, validation et suivi des stages.

## 🏛️ Architecture du Système

### Rôles Utilisateurs
- **👨‍🎓 Étudiant** : Recherche et postule aux offres de stage
- **🏢 Entreprise** : Publie des offres et évalue les stagiaires
- **🏫 Établissement** : Valide les offres et supervise les stages

### Technologies Utilisées
- **Backend** : Node.js / Express.js
- **Point d'entrée** : server.js
- **Authentification** : JWT (JSON Web Tokens)
- **Gestion des fichiers** : Multer (dossier uploads/)
- **Documentation** : Cette API REST

## 🚀 Installation et Configuration

### Prérequis
```bash
Node.js >= 14.x
npm >= 6.x
```

### Installation
```bash
# Cloner le repository
git clone [URL_DU_PROJET]
cd PROJET-TUTORER

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env

# Démarrer le serveur de développement
npm start
# ou
node server.js
```

### Variables d'Environnement
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=your_database_connection_string
```

## 📚 Documentation des Endpoints

### 📋 Vue d'Ensemble des Routes

| Endpoint | Méthode | Accès | Description |
|----------|---------|-------|-------------|
| `/api/auth/signup` | `POST` | 🌍 **Public** | Créer un compte |
| `/api/auth/login` | `POST` | 🌍 **Public** | Se connecter |
| `/api/offers` | `GET` | 🌍 **Public** | Lister les offres |
| `/api/offers/:id` | `GET` | 🌍 **Public** | Voir une offre |
| `/api/offers` | `POST` | 🏢 **Entreprise** | Créer une offre |
| `/api/offers/:id/close` | `PATCH` | 🏢🏫 **Entreprise/Établissement** | Fermer une offre |
| `/api/offers/:id/validate` | `PATCH` | 🏫 **Établissement** | Valider une offre |
| `/api/stages` | `POST` | 🏢🏫 **Entreprise/Établissement** | Créer un stage |
| `/api/stages/:stageId/convention` | `POST` | 👨‍🎓🏫 **Étudiant/Établissement** | Upload convention |
| `/api/stages/mine` | `GET` | 👨‍🎓🏫 **Étudiant/Établissement** | Mes stages |
| `/api/evaluations` | `POST` | 🏢🏫 **Entreprise/Établissement** | Créer évaluation |
| `/api/evaluations/stage/:stageId` | `GET` | 🔐 **Authentifié** | Voir évaluations |
| `/api/dashboard` | `GET` | 🔐 **Authentifié** | Tableau de bord |

### 🎭 Légende des Rôles

| Symbole | Rôle | Description |
|---------|------|-------------|
| 🌍 | **Public** | Accessible sans authentification |
| 👨‍🎓 | **Étudiant** | Recherche et postule aux stages |
| 🏢 | **Entreprise** | Publie des offres et évalue |
| 🏫 | **Établissement** | Valide et supervise |
| 🔐 | **Authentifié** | Tous les utilisateurs connectés |

---

### 🔐 **AUTHENTIFICATION**

#### 📝 S'inscrire
```bash
POST /api/auth/signup
```
**🌍 Accès :** Public  
**📋 Corps de la requête :**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "motdepasse123",
  "role": "etudiant" // etudiant, entreprise ou etablissement
}
```

#### 🚪 Se connecter
```bash
POST /api/auth/login
```
**🌍 Accès :** Public  
**📋 Corps de la requête :**
```json
{
  "email": "utilisateur@exemple.com",
  "password": "motdepasse123"
}
```
**📤 Retourne :** Token JWT pour les requêtes authentifiées

---

### 💼 **OFFRES DE STAGE**

#### 📋 Lister toutes les offres
```bash
GET /api/offers
```
**🌍 Accès :** Public

#### 👁️ Consulter une offre spécifique
```bash
GET /api/offers/:id
```
**🌍 Accès :** Public

#### ➕ Créer une nouvelle offre
```bash
POST /api/offers
Authorization: Bearer <token>
```
**🏢 Accès :** Entreprise uniquement

#### ❌ Fermer une offre
```bash
PATCH /api/offers/:id/close
Authorization: Bearer <token>
```
**🏢🏫 Accès :** Entreprise ou Établissement  
**📝 Description :** Marque une offre comme pourvue ou expirée

#### ✅ Valider une offre
```bash
PATCH /api/offers/:id/validate
Authorization: Bearer <token>
```
**🏫 Accès :** Établissement uniquement  
**📝 Description :** Valide une offre de stage pour publication

---

### 📋 **GESTION DES STAGES**

#### ➕ Créer un stage
```bash
POST /api/stages
Authorization: Bearer <token>
```
**🏢🏫 Accès :** Entreprise ou Établissement

#### 📄 Téléverser une convention de stage
```bash
POST /api/stages/:stageId/convention
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**👨‍🎓🏫 Accès :** Étudiant ou Établissement  
**📁 Paramètres :** `convention` (fichier PDF)

#### 👀 Consulter mes stages
```bash
GET /api/stages/mine
Authorization: Bearer <token>
```
**👨‍🎓🏫 Accès :** Étudiant ou Établissement  
**📝 Description :** Liste des stages de l'utilisateur connecté

---

### ⭐ **ÉVALUATIONS**

#### ➕ Créer une évaluation
```bash
POST /api/evaluations
Authorization: Bearer <token>
```
**🏢🏫 Accès :** Entreprise ou Établissement

#### 👁️ Consulter les évaluations d'un stage
```bash
GET /api/evaluations/stage/:stageId
Authorization: Bearer <token>
```
**🔐 Accès :** Tous les utilisateurs authentifiés

---

### 📊 **TABLEAU DE BORD**

#### 🏠 Accéder au tableau de bord
```bash
GET /api/dashboard
Authorization: Bearer <token>
```
**🔐 Accès :** Tous les rôles authentifiés  
**📝 Description :** Tableau de bord personnalisé selon le rôle utilisateur

## 🔒 Authentification

Toutes les routes protégées nécessitent un token JWT dans le header Authorization :

```http
Authorization: Bearer <votre_token_jwt>
```

Le token est obtenu lors de la connexion et doit être inclus dans chaque requête nécessitant une authentification.

## 📋 Codes de Statut HTTP

| Code | Description |
|------|-------------|
| `200` | ✅ Requête réussie |
| `201` | ✅ Création réussie |
| `400` | ❌ Mauvaise requête |
| `401` | ❌ Non autorisé (token manquant/invalide) |
| `403` | ❌ Accès refusé (permissions insuffisantes) |
| `404` | ❌ Ressource non trouvée |
| `500` | ❌ Erreur interne du serveur |

## 🧪 Tests

```bash
# Exécuter les tests
npm test

# Tests avec couverture
npm run test:coverage
```

## 📁 Structure du Projet

```
PROJET TUTORER/
├── config/             # Configuration de l'application
├── controllers/        # Contrôleurs des routes API
├── middleware/         # Middlewares (auth, validation, etc.)
├── models/            # Modèles de données et schémas
├── node_modules/      # Dépendances npm
├── Routes/            # Définition des routes API
├── uploads/           # Fichiers téléversés (conventions, etc.)
├── .env              # Variables d'environnement
├── package-lock.json # Verrouillage des versions
├── package.json      # Configuration npm et dépendances
├── README.md         # Documentation du projet
└── server.js         # Point d'entrée de l'application
```

## 👥 Équipe de Développement

- **Développeur(s)** : [Vos noms]
- **Encadrant** : [Nom du professeur/tuteur]
- **Cours** : Projet Tutoré
- **Période** : [Année académique]

## 📄 Licence

Ce projet est développé dans un cadre académique pour le cours Projet Tutoré.
