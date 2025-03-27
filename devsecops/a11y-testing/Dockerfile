FROM node:22-alpine3.21@sha256:f2dc6eea95f787e25f173ba9904c9d0647ab2506178c7b5b7c5a3d02bc4af145

WORKDIR /app

# We don't need the standalone Chromium for puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH='/usr/bin/chromium-browser'

ENV HOMEPAGE_URL="http://frontend:3000"

# Install packages (Chromium and dependencies)
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates 
  # ttf-freefont # only needed if testing fonts - leaving out for now 

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code for building (and testing)
COPY ./axeignore.json .
COPY ./src ./src
COPY ./jest.unit.config.cjs .
COPY ./jest.e2e.config.cjs .
COPY ./index.js .
COPY ./e2e-tests .

# Install project dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# Expose the port for the local server
EXPOSE 8080

# Create a non-root user
RUN addgroup -g 1001 -S puppeteer && adduser -u 1001 -S puppeteer -G puppeteer

# Create and set permissions for the coverage directory
RUN mkdir -p /app/coverage && chmod -R 777 /app/coverage && chown -R puppeteer:puppeteer /app/coverage

# Set ownership of the working directory to puppeteer user
RUN chown -R puppeteer:puppeteer /app

# Switch to the non-root user 
USER puppeteer

# Start application (this is overridden for tests at runtime)
CMD ["npm", "--no-update-notifier", "start"]