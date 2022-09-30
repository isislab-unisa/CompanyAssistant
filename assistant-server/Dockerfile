FROM golang:1.19.1-alpine AS GO_BUILD
WORKDIR /assistant-server
COPY . .
RUN apk add build-base
RUN go build

EXPOSE 80
CMD ./server