FROM node:16.3.0-alpine
WORKDIR /opt/app
COPY package*.json /opt/app/
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production
# RUN npm run clear:dev
CMD ["node", "./dist/main.js"]