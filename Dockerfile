FROM node:14.16.0-slim as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci --no-progress

COPY ./ /app/

RUN npm run build



# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx # 
FROM nginx:1.21.3-alpine

COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/templates/nginx.conf.template 

EXPOSE 3000
