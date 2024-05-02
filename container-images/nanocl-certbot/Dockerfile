FROM ubuntu:22.04

RUN apt-get update -yqq && \
  apt-get install --force-yes -yqq \
    wget \
    certbot \
    python3-certbot-nginx \
    nginx-extras \
    && apt-get clean

RUN wget https://github.com/nxthat/nanocl/releases/download/nanocl-0.13.0-nightly/nanocl_0.13.0_amd64.deb && \
  dpkg -i nanocl_0.13.0_amd64.deb

