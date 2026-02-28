FROM node:20-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./ 

RUN npm install --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

