# Stage 1: Build the React application using Node.js
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Remove existing node_modules to ensure a clean install
RUN rm -rf node_modules

# Install dependencies using npm ci to ensure consistency with package-lock.json
RUN npm ci || npm install --force

# Install the optional Rollup dependency
RUN npm install @rollup/rollup-linux-x64-musl

# Copy the rest of the application code to the container
COPY . .

# Run the build process to generate the static files in the dist directory
RUN npm run build

# Stage 2: Setup the Deno runtime environment using a specific version of the Deno base image
FROM denoland/deno:alpine-1.43.5

# Set the environment variable for Deno directory
ENV DENO_DIR=/app/deno_dir

# Set the working directory inside the container
WORKDIR /app

# Add a new user and set permissions for the Deno directory
RUN adduser -D myuser && \
    mkdir -p $DENO_DIR && \
    chown myuser:myuser $DENO_DIR

# Switch to the newly created user
USER myuser

# Copy the built files from the builder stage to the current stage
COPY --from=builder /app/dist ./dist

# Copy the Deno server script to the container
COPY server.ts .

# Expose port 3000 to the host
EXPOSE 3000

# Set the entry point to use the Deno runtime to run the server script
ENTRYPOINT ["deno"]

# Run the server script with necessary permissions
CMD ["run", "--allow-net=0.0.0.0:3000", "--allow-env", "--allow-read=./dist", "server.ts"]
