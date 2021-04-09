FROM node:14.16.0-slim as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm ci --no-progress

COPY ./ /app/

RUN npm run build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM sdelrio/docker-minimal-nginx:latest
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000