FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["node_modules/.bin/ng", "serve", "--host", "0.0.0.0"]
