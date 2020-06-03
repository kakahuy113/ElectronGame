FROM node:14.2.0-slim

RUN apt-get update -y && apt-get install -y \
 libx11-xcb-dev \
 libxtst6 \
 libnss3 \ 
 libgtk-3-0 \ 
 libxss1 \ 
 libasound2 \
 x11-xserver-utils

WORKDIR /home

COPY package*.json ./
RUN npm i

COPY ./src ./src

USER node
CMD ["npx", "electron", "."]
