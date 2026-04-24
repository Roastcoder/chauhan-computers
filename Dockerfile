# ─────────────────────────────────────────────
# Stage 1 – Build
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source
COPY . .

# Build production bundle
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 – Serve with Nginx
# ─────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
