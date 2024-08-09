# build stage
FROM node:16-alpine as build-stage
COPY . .
RUN npm install
RUN npm run build

#production stage
FROM nginx:alpine as production-stage
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage ./build /usr/share/nginx/html
COPY create-env.sh /usr/share/nginx/html/create-env.sh
RUN chmod +x /usr/share/nginx/html/create-env.sh
ENTRYPOINT ["/usr/share/nginx/html/create-env.sh"]