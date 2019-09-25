FROM node:slim
LABEL maintainer="afanyiyu@hotmail.com"
LABEL version="0.1.0"
WORKDIR /app
COPY . /app
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm i
RUN npm i -s cross-env
RUN npm audit fix
RUN mkdir -p /scdb
VOLUME /scdb
EXPOSE 2161
ENTRYPOINT npm run start
