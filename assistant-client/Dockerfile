
FROM node:14.18.1-alpine as dependencies
WORKDIR /assistant-client
COPY ./package.json ./
RUN npm install


FROM node:14.18.1-alpine as builder
WORKDIR /assistant-client
COPY . .
COPY --from=dependencies assistant-client/node_modules ./node_modules
RUN npm run build

EXPOSE 3000

CMD npm start
