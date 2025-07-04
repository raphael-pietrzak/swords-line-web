[![SwordsLine-Deploy](https://github.com/swords-line-team/swords-line-web/actions/workflows/docker-image.yml/badge.svg)](https://github.com/swords-line-team/swords-line-web/actions/workflows/docker-image.yml)

# ⚔️ SwordsLine

**SwordsLine** est un jeu de combat multijoueur en ligne en 2D.  
Affrontez d'autres joueurs en temps réel dans une arène dynamique à l'épée !

> 🔧 **Projet en développement actif** – l’expérience et les fonctionnalités peuvent évoluer rapidement.

🎮 [Jouer maintenant](http://ns321435.ip-37-187-155.eu:3000)  
📖 [Voir le Wiki du jeu](https://github.com/swords-line-team/swords-line-web/wiki)

---

## 🎮 Gameplay

- Carte multijoueur partagée en ligne
- Mouvements fluides (ZQSD ou flèches)
- Combat à l'épée directionnelle avec la souris
- Dash/esquive, collisions précises
- Classement en direct par élimination

---

## ⚙️ Stack technique

### Frontend
- React + HTML5 Canvas
- WebSocket client (communication temps réel)

### Backend
- Express.js (Node.js)
- WebSocket (lib `ws`) pour la logique serveur multijoueur

### Infrastructure
- Environnement : **Debian 12** sur machine dédiée OVH
- IP publique : `ns321435.ip-37-187-155.eu`
- Docker : déploiement du client et serveur via conteneurs
- GitHub Actions : CI/CD automatisée pour build et push
