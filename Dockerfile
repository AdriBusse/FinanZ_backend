FROM node:20

# Create app directory
WORKDIR /app
RUN echo "DEBUG: contents of /app after WORKDIR" && ls -la /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./


RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
RUN npm run compile
RUN echo "DEBUG1: contents of /app after COMPILE" && ls -la /app

EXPOSE 4000

CMD [ "node", "dist/index.js" ]
