FROM node AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app
RUN npm run build -- --configuration=kubernetes

FROM nginx
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
