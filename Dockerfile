FROM node:14.17.5-alpine as deps
WORKDIR /opt/app
RUN apk add dumb-init
COPY package*.json /opt/app/
RUN npm ci
COPY . .

FROM deps as builder
RUN npm run build
RUN npm prune --production
RUN npm run clear:dev

FROM builder as runner
EXPOSE 3000
ENV NODE_ENV production
CMD ["dumb-init","node", "./dist/main.js"]
