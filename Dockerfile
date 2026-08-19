FROM node:22

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY package-lock.json ./

RUN npm install

# Bundle app source
COPY . .
RUN npm run compile

EXPOSE 4000

CMD [ "node", "dist/main.js" ]
