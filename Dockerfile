# Multi-stage Dockerfile for building and serving an Astro static site

############################
# Builder stage
############################
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Enable pnpm via Corepack and lock pnpm version from packageManager
RUN corepack enable && corepack prepare pnpm@10.3.0 --activate

# Install dependencies first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public
COPY tailwind.config.mjs ./

# Build the site to dist/
RUN pnpm build

############################
# Runtime stage (NGINX)
############################
FROM nginx:1.27-alpine AS runner

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4321
CMD ["nginx", "-g", "daemon off;"]


