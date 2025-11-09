# Build the React Frontend
FROM node:18-alpine AS client-build
WORKDIR /app

# Copy client package.json and package-lock.json
COPY client/package.json client/package-lock.json ./client/

# Install all client dependencies
RUN npm install --prefix client

# Copy the rest of the client source code
COPY client ./client

# Build the production-ready static files
RUN npm run build --prefix client

# Build the Node.js Backend
FROM node:18-alpine AS server-build
WORKDIR /app

# Copy server package.json and package-lock.json
COPY server/package.json server/package-lock.json ./server/

# Install *only* production dependencies for a smaller image
RUN npm install --prefix server --omit=dev

# Copy the rest of the server source code
COPY server ./server

# Final Production Image
FROM node:18-alpine
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Cloud Run provides its own PORT variable, defaulting to 8080
ENV PORT=${PORT:-8080}

# Copy the server's built code and node_modules from Stage 2
COPY --from=server-build /app/server ./

# Copy the client's build output from Stage 1 into a 'public' folder
COPY --from=client-build /app/client/dist ./public

# Expose the port the app will run on
EXPOSE ${PORT}

# The command to start the application
CMD [ "node", "src/server.js" ]