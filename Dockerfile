# Utilisez une image de base officielle de Node.js 20
FROM node:20

# Créez un répertoire de travail
WORKDIR /app

# Installez @nestjs/cli globalement
RUN npm install -g @nestjs/cli

# Copiez le fichier package.json et package-lock.json
COPY ./back/package*.json ./

# Installez les dépendances de l'application
RUN npm install

# Copiez les fichiers de l'application
COPY ./back .

# Construisez l'application NestJS
RUN nest build

# Démarrez l'application
CMD ["npm", "run", "start:prod"]
