### STAGE 1: Build ###
FROM node:lts-alpine AS build
ARG PRODUCTION
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --quiet
COPY . .
RUN npx ng build ngx-audiostream --prod=$PRODUCTION
RUN npx ng build ngx-audiostream-test --prod=$PRODUCTION

### STAGE 2: Run ###
FROM nginx:stable-alpine
COPY --from=build /usr/src/app/dist/ngx-audiostream-test /usr/share/nginx/html
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]