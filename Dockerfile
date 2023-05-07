FROM node:18-alpine3.17

WORKDIR /bot

ARG MONGO_CONNECTION_LINK \
    CLIENT_ID \
    GUILD_ID \
    TOKEN

ENV MONGO_CONNECTION_LINK=$MONGO_CONNECTION_LINK \
    CLIENT_ID=$CLIENT_ID \
    GUILD_ID=$GUILD_ID \
    TOKEN=$TOKEN

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build
CMD [ "node", "./dist/index.js" ]
