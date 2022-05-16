FROM node:16
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
RUN yarn build
ENV NODE_ENV production
ENV PORT 8080
EXPOSE 8080
CMD [ "node", "build/index.js" ]
USER node