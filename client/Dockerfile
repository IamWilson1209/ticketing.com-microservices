FROM node:alpine

WORKDIR /app

COPY package.json .
RUN npm install --force --verbose
COPY . .

CMD ["npm", "run", "dev"]
