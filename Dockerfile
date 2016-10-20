FROM node:boron

# Install app dependencies
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --production

# Bundle app source
COPY config ./config/
COPY server ./server/
EXPOSE 8000
CMD [ "node", "." ]
