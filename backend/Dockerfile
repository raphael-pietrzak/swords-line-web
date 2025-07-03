FROM node:20

# Dossier de travail
USER root
WORKDIR /app

# Copier package.json et lockfile pour profiter du cache Docker
COPY package*.json ./

# Installer TOUTES les dépendances (dev + prod)
RUN npm install

# Copier le reste du projet
COPY . .

RUN ls -la /app
RUN ls -la /app/node_modules
RUN cat /app/package.json

# Exposer le port de l'application
EXPOSE 3000

# Lancer l'application en mode production
CMD ["node", "server.js"]