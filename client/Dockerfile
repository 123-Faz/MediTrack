# # Use the latest Node Alpine image
# FROM node:alpine as dev

# # Set working directory
# WORKDIR /app

# # Copy frontend files
# COPY client/package.json ./

# # Install dependencies
# RUN npm install

# COPY client/ .
# # Expose frontend port
# EXPOSE 5173

# # Run frontend (Vite or React dev server)
# CMD ["npm", "run", "dev"]

# # Step 1: Build the React/Vite app
# FROM node:alpine AS build

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Step 2: Use NGINX to serve the build
# FROM nginx:alpine as prod

# # Copy built files to NGINX’s default static folder
# COPY --from=build /app/dist /usr/share/nginx/html

# # Expose port 80 for the web server
# EXPOSE 80

# # Start NGINX
# CMD ["nginx", "-g", "daemon off;"]


# Build stage
# Build stage
FROM node:alpine as builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine as prod

# Copy built app to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx configuration for SPA
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # SPA fallback \
    location / { \
        try_files \$uri \$uri/ /index.html; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]