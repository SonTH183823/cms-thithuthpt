FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
ENV VUE_APP_DOMAIN_API="https://api.thithuthpt.click/server/cms"
ENV VUE_APP_UPLOAD_API="https://api.thithuthpt.click/server/uploads"
RUN yarn build:prod

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf

CMD ["yarn", "start"]
