FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN mkdir -p public/images

EXPOSE 5001

CMD ["node", "index.js"]
