FROM node:slim
WORKDIR /app
COPY package*.json ./app
RUN npm install react-scripts && npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]