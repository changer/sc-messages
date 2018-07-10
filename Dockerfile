FROM capptions/khabar:develop-775

RUN apk update && apk add ca-certificates && apk --no-cache add openssl

WORKDIR /usr/local/src

COPY notifications khabar
