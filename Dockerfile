# build environment
FROM node:16-alpine as deps

# for ubuntu incase something goes wrong
# RUN apt-get update \
#     && apt-get install -y net-tools build-essential python3 python3-pip valgrind
RUN apk add --update --no-cache net-tools linux-headers alpine-sdk \
    libxml2-dev \
    libxslt-dev \
    python3-dev \
    openssl-dev \
    libffi-dev \
    zlib-dev \
    py-pip python3 make gcc g++ git libuv bash curl tar bzip2 valgrind  \
    && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY yarn.lock ./
COPY package.json ./
RUN yarn


FROM node:16-alpine as builder
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN yarn build

FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build
ENV NODE_ENV production
CMD [ "npm", "start" ]
# setuid to user node
USER node