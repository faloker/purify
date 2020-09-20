FROM node:14.10-alpine as build-static

WORKDIR /web
COPY ./web/package*.json ./
RUN npm install
COPY ./web/ .
RUN sed -i "/enbale_cdn/d" public/index.html 
RUN npm run build


FROM node:14.10-alpine as build-api

WORKDIR /api
COPY ./api/package*.json ./
RUN npm install
COPY ./api/ .
RUN npm run build


FROM node:14.10-alpine as production-stage

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN npm install -g migrate-mongo

WORKDIR /home/node/app
COPY ./api/package*.json ./

USER node
RUN mkdir ./static

RUN npm ci --only=production

COPY --chown=node:node ./api/ .
COPY --chown=node:node docker/web-entrypoint.sh .
COPY --chown=node:node --from=build-api /api/dist ./dist
COPY --chown=node:node --from=build-static  /web/dist ./static

RUN chmod +x web-entrypoint.sh

ENTRYPOINT ["./web-entrypoint.sh"]
