FROM node:6
MAINTAINER John Marion <john@lmsn.net>

# https://serverfault.com/questions/96416/-/96420#96420
COPY . /opt/DiscoBot/
WORKDIR /opt/DiscoBot/

RUN npm install

CMD [ "node", "index.js" ]
