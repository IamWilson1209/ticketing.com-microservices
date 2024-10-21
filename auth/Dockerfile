FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev --force --verbose
COPY . .

CMD ["npm", "start"]