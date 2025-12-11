# Step 1: Build the App
# We use a lightweight Node.js image to build the project
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# DEFINITION: Accept the API key as a build argument
ARG GEMINI_API_KEY

# ACTION: Write the key to .env.local so Vite can use it during build
# Note: In a real production app, ensure your code reads from this file 
# or use VITE_ prefix if using import.meta.env
RUN echo "VITE_GEMINI_API_KEY=$GEMINI_API_KEY" > .env.local

# Build the React application (creates the 'dist' folder)
RUN npm run build

# Step 2: Serve the App
# We use Nginx to serve the static files created in the build step
FROM nginx:alpine

# Copy the built files from the 'builder' stage to Nginx's html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Google Cloud Run default)
EXPOSE 8080

# Start Nginx in the foreground so the container keeps running
CMD ["nginx", "-g", "daemon off;"]
