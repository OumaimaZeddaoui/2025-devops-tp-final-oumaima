# Stratégie DevOps – Projet Christmas Gift List

## 1. Objectif de la stratégie DevOps

Le but est de mettre en place un pipeline DevOps complet pour automatiser :
- la construction et les tests de l’application,
- la création et la publication des images Docker,
- le déploiement du backend et du frontend,
- la gestion de plusieurs environnements (local, preprod, prod).

L'application ne doit pas être modifiée : la stratégie DevOps doit fonctionner sans toucher le code existant.

---

## 2. Outils choisis

### 🐙 GitHub Actions – CI/CD
- Automatisation des tests
- Build Docker
- Push Docker Hub
- Déploiement Render & Netlify
- Création automatique de releases GitHub

### 🐳 Docker & Docker Hub
- Dockerisation du frontend et du backend
- Stockage des images sur Docker Hub

### 🟦 Render (Backend + Database)
- Hébergement du backend Go
- PostgreSQL managé
- 2 environnements : preprod (develop), prod (main)

### 🟩 Netlify (Frontend + Storybook)
- Build et déploiement du frontend
- Déploiement de Storybook

---

## 3. Stratégie Git

- `main` → production
- `develop` → preproduction
- `feature/<nom>` → nouvelles fonctionnalités
- CI obligatoire avant merge

---

## 4. Environnements

### Local
- Docker Compose (frontend + backend + postgres)

### Preproduction
- Branche : `develop`
- Backend : Render (service 1)
- Frontend : Netlify (site 1)

### Production
- Branche : `main`
- Backend : Render (service 2)
- Frontend : Netlify (site 2)

---

## 5. Plan des étapes

1. Dockerfile frontend
2. Dockerfile backend
3. docker-compose.yml
4. Docker Hub
5. GitHub Actions CI
6. GitHub Actions CD (Render + Netlify)
7. Deployment Storybook
8. GitHub Release
9. Documenter tout dans `docs`
