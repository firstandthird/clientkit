FROM mhart/alpine-node:6.10

ENV NODE_ENV production

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
RUN cd /app && npm install --production
COPY . /app

ENTRYPOINT ["node", "index.js"]
