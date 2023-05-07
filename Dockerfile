FROM node:lts

RUN mkdir -p /bot/src

WORKDIR /bot

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build
CMD [ "node", "./dist/index.js" ]
