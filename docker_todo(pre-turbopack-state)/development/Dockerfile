FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
ARG NODE_ENV
RUN npm ci
COPY ./ ./
EXPOSE 1337
CMD [ "npm", "run", "migrate:dev"]