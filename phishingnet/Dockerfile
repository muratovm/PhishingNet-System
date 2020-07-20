# pull official base image
FROM node:13.12.0-alpine AS builder

RUN mkdir -p /app
WORKDIR /app

ENV PATH="./node_modules/.bin:$PATH"
COPY package*.json ./
RUN npm install

COPY . ./

EXPOSE 3000

# start app
CMD ["npm", "start", "0.0.0.0:3000"]