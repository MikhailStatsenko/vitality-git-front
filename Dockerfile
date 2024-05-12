FROM node:22-alpine

COPY . .
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]