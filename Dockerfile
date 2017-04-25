FROM node

RUN mkdir -p /usr/src/app

COPY ./package.json /usr/src

WORKDIR /usr/src

RUN npm install

COPY ./src /usr/src/app

WORKDIR /usr/src/app

CMD npm start