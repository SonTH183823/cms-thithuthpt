
FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
ENV VUE_APP_DOMAIN_API=https://api.thithuthpt.click/server/cms
ENV VUE_APP_UPLOAD_API=https://api.thithuthpt.click/server/uploads
EXPOSE 3000
RUN yarn build:prod

