FROM node:16.3.0-alpine
WORKDIR /usr/src/nest-api

COPY package*.json /usr/src/nest-api/
COPY src /usr/src/nest-api/src

RUN npm install
RUN npm run build
RUN npm prune --production
RUN npm run clear:dev

COPY . .