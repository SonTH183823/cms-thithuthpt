#FROM node:16-alpine as builder
#WORKDIR /app
#COPY package.json yarn.lock ./
#RUN yarn
#
#FROM node:16-alpine
#WORKDIR /app
#ADD . ./
#COPY --from=builder ./app/node_modules ./node_modules/
#COPY --from=builder /app/package.json ./package.json
#
#EXPOSE 3000
#RUN yarn build:prod
#CMD ["yarn", "start"]


FROM node:16-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build:prod


FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
