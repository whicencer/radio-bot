FROM node:14

RUN apt-get update && \
  apt-get install -y software-properties-common && \
  add-apt-repository ppa:jonathonf/ffmpeg-4 && \
  apt-get update && \
  apt-get install -y ffmpeg

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

CMD [ "node", "bot.js" ]
