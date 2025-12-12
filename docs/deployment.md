# Stratégie de Déploiement : Render et GitHub Actions

## Choix de la Plateforme

Nous avons choisi **Render.com** pour le déploiement.

* **Avantages** : Support natif de la connexion entre services (Internal Connect), gestion facile des variables d'environnement secrètes, et support des Dockerfiles pour les services Web.
* **Services utilisés** : Base de données PostgreSQL, Service Web Go (Backend), Service Web Nginx/Vite (Frontend).

## Configuration des Services Render

### Base de Données (PostgreSQL)

* **Type** : PostgreSQL Database (Managed).
* **Rôle** : Fournit la variable `DATABASE_URL` injectée dans le service Backend.

### Backend (Go / `oumaima-backend`)

* **Source** : GitHub Repository (Connexion via CI/CD).
* **Build** : Utilisation de `backend/Dockerfile` pour construire l'image Docker du serveur Go.
* **Environnement** : Reçoit la variable `DATABASE_URL`.
* **Correction Appliquée** : La règle CORS a été modifiée dans le code pour autoriser l'accès depuis le domaine `oumaima-frontend.onrender.com`.

### Frontend (React/Vite / `oumaima-frontend`)

* **Source** : GitHub Repository (Connexion via CI/CD).
* **Build** : Utilisation de `frontend/Dockerfile` pour construire l'image Docker statique.
* **Environnement** : Reçoit la variable `VITE_API_BASE_URL` pointant vers le Backend.
* **Correction Appliquée** : Le `Dockerfile` a été ajusté pour injecter la variable `VITE_API_BASE_URL` au moment du `npm run build`, résolvant le problème de l'URL codée en dur.

## Pipeline CI/CD (GitHub Actions)

Le workflow `.github/workflows/ci-cd.yml` orchestre le déploiement continu :

1.  **Trigger** : `push` sur la branche `main`.
2.  **Authentification** : Connexion à Docker Hub et Render via des secrets GitHub.
3.  **Build/Push Images** : Les Dockerfiles du Backend et du Frontend sont construits et envoyés sur Docker Hub.
4.  **Déploiement Render** : Utilisation de l'action Render Deploy pour forcer le redéploiement des services `oumaima-backend` et `oumaima-frontend`.
5.  **GitHub Release** : Création d'une étiquette (tag) et d'une *release* automatique pour marquer la version déployée.