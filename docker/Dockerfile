# syntax=docker/dockerfile:1

FROM node:16

# Create app directory
WORKDIR /usr/src/app

ENV NODE_ENV production

# Install envsubst
RUN apt-get update && apt-get install -y gettext
COPY docker/custom-entrypoint /usr/local/bin/
RUN chmod u+x /usr/local/bin/custom-entrypoint
ENTRYPOINT ["custom-entrypoint"]
RUN mkdir /usr/src/app/config/

# Copy config files
COPY config/*.tmp /tmp/config/

# Install Node.js dependencies
COPY package*.json /usr/src/app/
RUN npm ci --only=production

# Copy Node.js files
COPY data /usr/src/app/data
COPY public /usr/src/app/public
COPY views /usr/src/app/views
COPY server.js /usr/src/app/

# Expose port 3000 and start Node.js server
EXPOSE 3000
CMD ["node", "server.js"]