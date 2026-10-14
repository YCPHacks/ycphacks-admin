# ---- Development stage ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Buidl prod static files
RUN npm run build

FROM nginx:alpine

# Remove default Nginx website files
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder stage
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy your custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]