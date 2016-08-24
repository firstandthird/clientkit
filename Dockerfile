FROM mhart/alpine-node:6.4

ENV NODE_ENV production

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/
RUN npm install
COPY . /app

ENTRYPOINT ["node", "app.js"]
