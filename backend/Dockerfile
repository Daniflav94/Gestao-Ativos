FROM node:latest

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm ci
RUN npm install

COPY . /usr/src/app

EXPOSE 3001
CMD [ "npm", "run", "start:migrate:prod" ]