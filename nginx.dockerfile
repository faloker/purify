FROM node:14.10-alpine as build-static

WORKDIR /web
COPY ./web/package*.json ./
RUN npm install
COPY ./web/ .
RUN sed -i "/enbale_cdn/d" public/index.html 
RUN npm run build

FROM nginx:1.19-alpine as production-stage

ARG env=prod

RUN mkdir /app

COPY --from=build-static  /web/dist /app

COPY nginx/nginx.$env.conf /etc/nginx/nginx.conf
COPY docker/nginx-entrypoint.sh /

RUN chmod +x nginx-entrypoint.sh

ENTRYPOINT ["./nginx-entrypoint.sh"]
