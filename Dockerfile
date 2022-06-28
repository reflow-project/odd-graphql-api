FROM node:17-alpine

MAINTAINER milko.monecke@fokus.fraunhofer.de

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./keycloak-config.js ./keycloak-config.js
COPY ./index.js ./index.js

EXPOSE 3000
CMD [ "node", "index.js" ]
