FROM node:13-alpine as build-stage

WORKDIR /web

COPY ./web/package*.json ./

RUN npm install

COPY ./web/ .

RUN npm run build


FROM node:13-alpine as production-stage

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

RUN npm install -g nodemon @babel/node @babel/cli @babel/core @babel/preset-env

COPY --from=build-stage /web/dist ./static

COPY ./api/package*.json ./

USER node

RUN npm ci --only=production

COPY --chown=node:node ./api/ .

EXPOSE 3000

CMD [ "nodemon", "src/index.js", "--exec", "babel-node"]
