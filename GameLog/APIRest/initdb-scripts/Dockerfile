FROM mcr.microsoft.com/mssql/server:2022-CU14-ubuntu-22.04

USER root
RUN mkdir -p /usr/config
WORKDIR /usr/config

COPY . /usr/config/

RUN chmod +x /usr/config/entrypoint.sh
RUN chmod +x /usr/config/configure-db.sh

ENTRYPOINT ["./entrypoint.sh"]