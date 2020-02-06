FROM node:11-alpine AS production

ENV PORT ${PORT}
ENV DB_HOST ${DB_HOST}
ENV DB_PORT ${DB_PORT}
ENV DB_USER ${DB_USER}
ENV DB_PASS ${DB_PASS}
ENV DB_DATABASE ${DB_DATABASE}

RUN mkdir -p /usr/local/src
COPY . /usr/local/src
WORKDIR /usr/local/src

RUN npm install && \
    npm install -g db-migrate && \
    npm install -g db-migrate-pg

CMD ["./run_migrations.sh"]
