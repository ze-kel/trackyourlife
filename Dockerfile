FROM node:16
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY startup.dev.sh .
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
COPY . ./
EXPOSE 1337
