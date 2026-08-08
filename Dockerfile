FROM node:20-alpine

WORKDIR /app

COPY package.json ./

RUN npm install react@18.3.1 react-dom@18.3.1 && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
