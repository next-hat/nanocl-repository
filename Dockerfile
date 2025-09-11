FROM node:22.19.0-alpine3.22

WORKDIR /webapp

COPY ./webapp/package*.json /webapp

RUN npm install

ENV NODE_ENV=production

COPY ./webapp /webapp

RUN npm run build

COPY ./statefiles /statefiles

EXPOSE 3000/tcp

CMD ["npm", "start", "/statefiles", "v0.17"]