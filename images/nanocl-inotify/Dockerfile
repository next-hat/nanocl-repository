FROM ubuntu:22.04

WORKDIR /tmp

RUN apt-get update -yqq && \
  apt-get install --force-yes -yqq \
    wget \
    inotify-tools \
    && apt-get clean

RUN wget https://github.com/nxthat/nanocl/releases/download/nanocl-0.13.0-nightly/nanocl_0.13.0_amd64.deb && \
  dpkg -i nanocl_0.13.0_amd64.deb

WORKDIR /root

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]