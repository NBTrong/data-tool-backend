FROM node:14

# Create app directory
RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

# RUN npm audit fix --force
RUN npm install --verbose
# run this for production
# RUN npm ci --only=production

COPY . .