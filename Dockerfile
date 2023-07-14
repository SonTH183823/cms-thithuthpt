FROM node:16-alpine as builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM node:16-alpine
WORKDIR /app
ADD . ./
COPY --from=builder ./app/node_modules ./node_modules/
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
RUN yarn build:prod
CMD ["yarn", "start"]

