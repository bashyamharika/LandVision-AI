# === Stage 1: Build the React Application (Node Environment) ===
# Use the Node Alpine image for a lightweight build environment.
FROM node:20-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
# This step is cached efficiently if package.json doesn't change
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# IMPORTANT: Write the GEMINI_API_KEY into a .env.local file
# Cloud Run passes 'GEMINI_API_KEY' as a build arg. We use it to create the VITE-prefixed key.
ARG GEMINI_API_KEY
RUN echo "VITE_GEMINI_API_KEY=${GEMINI_API_KEY}" > .env.local

# Run the Vite build command
# The output is placed in the /app/dist directory
RUN npm run build

# === Stage 2: Serve the Application (Nginx Environment) ===
# Use a minimal NGINX image for serving static files.
FROM nginx:alpine

# Copy the NGINX configuration file from the project root 
# to the default NGINX configuration directory.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application files from the 'builder' stage 
# to the NGINX web root directory. Vite outputs to 'dist'.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the standard HTTP port 80
EXPOSE 80

# Command to run NGINX and keep it in the foreground (required for Docker/Cloud Run)
CMD ["nginx", "-g", "daemon off;"]
