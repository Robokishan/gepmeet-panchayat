# build environment
FROM node:14-bullseye as deps
RUN apt-get update \
    && apt-get install -y net-tools build-essential python3 python3-pip valgrind
WORKDIR /usr/src/app
COPY yarn.lock ./
COPY package.json ./
RUN yarn


FROM node:14-bullseye as builder
WORKDIR /usr/src/app
COPY . .
COPY --from=deps /usr/src/app/node_modules ./node_modules
RUN yarn build

FROM node:14-bullseye as runner
WORKDIR /usr/src/app

# COPY --from=builder /usr/src/app/next-i18next.config.js ./
# COPY --from=builder /usr/src/app/next.config.js ./
# COPY --from=builder /usr/src/app/public ./public
# COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/build ./build
ENV NODE_ENV production
CMD [ "npm", "start" ]
USER node