FROM node:16-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM node:16-alpine
WORKDIR /app
ADD . ./
COPY --from=builder ./app/node_modules ./node_modules/
COPY --from=builder /app/package.json ./package.json

ENV VUE_APP_DOMAIN_API="http://139.180.212.5:8200/cms"
ENV VUE_APP_UPLOAD_API="http://139.180.212.5:8200/uploads"

EXPOSE 3000
RUN yarn build:prod
CMD ["yarn", "start"]

