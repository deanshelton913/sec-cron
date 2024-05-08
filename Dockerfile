FROM node:alpine
WORKDIR /usr/sec-cron
RUN npm install typescript -g
COPY package.json .
RUN npm install
COPY . .
RUN tsc
CMD ["node", "./dist/index.js"]