FROM keymetrics/pm2:slim
LABEL maintainer="afanyiyu@hotmail.com"
LABEL version="0.1.0"
WORKDIR /app
COPY . /app
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm i
RUN npm audit fix
RUN mkdir -p /scdb
VOLUME /scdb
EXPOSE 2162
ENTRYPOINT pm2-runtime start pm2.json