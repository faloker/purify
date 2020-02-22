FROM node:13-alpine as build-static

RUN apk add --no-cache git
WORKDIR /web
COPY ./web/package*.json ./
RUN npm install
COPY ./web/ .
RUN npm run build

FROM nginx as production-stage

ARG env=prod

RUN mkdir /app

COPY --from=build-static  /web/dist /app

COPY nginx/nginx.$env.conf /etc/nginx/nginx.conf
COPY docker/nginx-entrypoint.sh /

RUN chmod +x nginx-entrypoint.sh

ENTRYPOINT ["/nginx-entrypoint.sh"]
