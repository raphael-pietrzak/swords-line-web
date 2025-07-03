# Étape 1 : Utiliser une image Node.js comme base
FROM node:20 AS build

# Étape 2 : Définir le dossier de travail
WORKDIR /app

# Étape 3 : Copier les fichiers nécessaires et installer les dépendances
COPY package*.json ./
RUN npm install

# Étape 4 : Copier le reste des sources et construire l’application
COPY . .
RUN npm run build

# Étape 5 : Utiliser une image Nginx pour servir les fichiers statiques
FROM nginx:stable-alpine

# Étape 6 : Copier le build React vers le dossier public de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Étape 7 : Copier la configuration personnalisée de Nginx si nécessaire
# (Optionnel - tu peux ignorer ou adapter selon tes besoins)
# COPY nginx.conf /etc/nginx/nginx.conf

# Étape 8 : Exposer le port 80
EXPOSE 80

# Étape 9 : Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]