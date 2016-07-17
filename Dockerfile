FROM firstandthird/node:0.0.3

RUN npm dedupe

ENTRYPOINT ["node", "app.js"]
