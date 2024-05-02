FROM ubuntu:latest

RUN apt-get update -yqq && \
  apt-get install --force-yes -yqq \
    wget \
    certbot \
    python3-certbot-nginx \
    nginx-extras \
    && apt-get clean

RUN wget https://github.com/nxthat/nanocl/releases/download/nanocl-0.14.0-nightly/nanocl_0.14.0_amd64.deb && \
  dpkg -i nanocl_0.14.0_amd64.deb

LABEL org.opencontainers.image.source https://github.com/next-hat/nanocl-repository
LABEL org.opencontainers.image.description Nanocl CLI with Certbot
