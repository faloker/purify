FROM node:13-alpine as build-static

RUN apk add --no-cache git

WORKDIR /web

COPY ./web/package*.json ./

RUN npm install

COPY ./web/ .

RUN npm run build


FROM node:13-alpine as build-api

WORKDIR /api

COPY ./api/package*.json ./

RUN npm install

COPY ./api/ .

RUN npm run build


FROM node:13-alpine as production-stage

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --from=build-static /web/dist ./static

COPY --from=build-api /api/lib ./lib

COPY ./api/package*.json ./

USER node

RUN npm ci --only=production

COPY --chown=node:node ./api/ .

EXPOSE 3000

CMD [ "node", "lib/index.js"]
