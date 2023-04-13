FROM node:lts

RUN mkdir -p /bot/src

WORKDIR /bot

COPY package.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/

CMD [ "npm", "start" ]
