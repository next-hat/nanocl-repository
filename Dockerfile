FROM ghcr.io/nxthat/nhsf:0.1.2-nightly

COPY ./root /opt/nhsf/root
COPY ./config /opt/nhsf/config
COPY ./conf.yml /opt/nhsf/conf.yml

CMD ["-c", "/opt/nhsf/conf.yml"]
