# Build stage
FROM node:16-alpine as build-stage

WORKDIR /app

## install dependencies
COPY package*.json .
RUN npm install

## build code
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine as production-stage

WORKDIR /run

## copy files
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/build html
COPY --from=build-stage /app/create-env.sh create-env.sh

## set permissions
RUN chown -R nginx. /run
RUN chmod -R 700 /run

## entrypoint
EXPOSE 80
ENTRYPOINT ["sh", "/run/create-env.sh"]