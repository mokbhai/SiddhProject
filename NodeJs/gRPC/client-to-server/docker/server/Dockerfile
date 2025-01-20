FROM node:18-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server .
COPY proto ../proto

EXPOSE 50051

CMD ["npm", "start"]