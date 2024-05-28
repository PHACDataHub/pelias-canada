# Stage 1: Build the React application using Node.js
FROM node:14-slim as builder
WORKDIR /app
COPY package*.json rspack.config.js ./
RUN npm install
COPY src/ src/
COPY index.html .
RUN npm run build

# Stage 2: Setup the Deno runtime environment using a specific version of the Deno base image
FROM denoland/deno:alpine-1.43.5
ENV DENO_DIR=/app/deno_dir
WORKDIR /app

RUN adduser -D myuser && \
    mkdir -p $DENO_DIR && \
    chown myuser:myuser $DENO_DIR

USER myuser
COPY --from=builder /app/dist ./dist
COPY server.ts .
EXPOSE 3000

ENTRYPOINT ["deno"]
CMD ["run", "--allow-net=0.0.0.0:3000", "--allow-env", "--allow-read=./dist", "server.ts"]