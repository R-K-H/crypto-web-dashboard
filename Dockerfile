FROM node:8.8.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
COPY webpack.config.js /usr/src/app/
#RUN npm install pm2 -g
RUN npm install && npm cache clean --force
COPY . /usr/src/app
RUN npm run build

#CMD [ "pm2-docker", "--json", "start" ]
CMD [ "npm", "start" ]