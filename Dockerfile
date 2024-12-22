FROM node:18-alpine

WORKDIR /app

ARG SERVICE
COPY ./services/${SERVICE}/package*.json ./
RUN npm install

COPY ./services/${SERVICE} ./

RUN npm run build

CMD ["npm", "run", "start"]
