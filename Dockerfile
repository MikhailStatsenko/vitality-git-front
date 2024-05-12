FROM node:current-slim

WORKDIR /client

COPY /src /client/src
COPY /public /client/public
COPY tailwind.config.js /client/
COPY package.json /client/

RUN npm install -g bun
RUN bun install
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]