FROM node:16-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk --no-cache add curl

RUN npm install --production

COPY . .

CMD ["npm", "run", "start:docker-prod"]
