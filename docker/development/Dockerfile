FROM node:18
WORKDIR /app
COPY package.json .
COPY package-lock.json .
ARG NODE_ENV
RUN npm install
COPY ./ ./
EXPOSE 1337
CMD [ "npm", "run", "docker:push:dev"]