FROM node:10.14-alpine

ENV NODE_ENV production
ENV FORCE_COLOR 1

RUN apk add --update git

RUN mkdir -p /ck && mkdir -p /app
WORKDIR /app

COPY package.json /ck/

RUN cd /ck && npm install --production
COPY . /ck

CMD [ "node", "/ck/index.js" ]
