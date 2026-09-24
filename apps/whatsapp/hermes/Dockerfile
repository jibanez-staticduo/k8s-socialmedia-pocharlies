FROM python:3.13-alpine AS build

ARG HERMES_COMMIT=073c57872a4616ac7567d76b1e51429f96dba53f
RUN apk add --no-cache build-base cargo libffi-dev openssl-dev git curl
WORKDIR /app
RUN curl --fail --location --retry 3 \
      "https://github.com/NousResearch/hermes-agent/archive/${HERMES_COMMIT}.tar.gz" \
      | tar -xz --strip-components=1
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --no-cache-dir -e '.[mcp]' 'aiohttp==3.14.3'

FROM python:3.13-alpine
ENV TZ=Europe/Madrid \
    PATH=/opt/venv/bin:$PATH \
    HERMES_HOME=/data/hermes \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1
RUN apk add --no-cache libstdc++ libffi openssl tzdata \
    && addgroup -g 1000 hermes \
    && adduser -D -u 1000 -G hermes hermes \
    && mkdir -p /data/hermes \
    && chown hermes:hermes /data/hermes
WORKDIR /app
COPY --from=build /opt/venv /opt/venv
COPY --from=build /app /app
COPY config.template.yaml startup.py /runtime/
USER hermes
EXPOSE 8642
ENTRYPOINT ["python", "/runtime/startup.py"]
