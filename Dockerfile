FROM mhart/alpine-node:6.9

EXPOSE 3000
WORKDIR /app
ENV NODE_ENV production

ADD package.json /app
RUN npm install

ADD . /app

CMD ["node", "index.js"]
