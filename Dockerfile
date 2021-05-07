FROM node:14.16.0-slim as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci --no-progress

COPY ./ /app/

RUN npm run build



# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx # 
FROM nginx:1.20.0-alpine

RUN apk upgrade --no-cache "libjpeg-turbo" 

COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/templates/nginx.conf.template 

EXPOSE 3000