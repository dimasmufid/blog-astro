---
title: "Mark Initial Deployment"
description: "Initial deployment of Mark"
date: 2025-05-22
tags:
  - mark
---

## Background

At first, I don't feel like urgent to set up deployment soon. Because there still many feature that is still under development. But then I believe, the quick win is important for my own self to get the progress. In addition, I believe progressive CI CD is important. So if there anything that become obstacle on deployment, I could know it soon and incremental. It is not become a big burden later.

### Project Structure

This is my current project structure. For each apps (backend and frontend), have their own `Dockerfile`, and then it orchestrate under `docker-compose.yml`.

For each apps, it needs `Dockerfile` for it having its own isolated container to run. Then the docker compose will connect them into 1 mono repo apps.

```shell
.
├── backend
│   ├── alembic_app_state
│   ├── alembic.ini
│   ├── app
│   ├── credentials
│   ├── Dockerfile
│   ├── requirements.txt
│   └── todo.md
├── docker-compose.yml
├── frontend
│   ├── components.json
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── postcss.config.mjs
│   ├── public
│   ├── README.md
│   ├── src
│   ├── todo.md
│   └── tsconfig.json
└── README.md
```

### Code

#### Dockerfile - Frontend

```dockerfile
FROM node:20-slim

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install build dependencies for node-gyp
RUN apt-get update && apt-get install -y --no-install-recommends \
python3 \
make \
g++ \
build-essential \
pkg-config \
libcairo2-dev \
libpango1.0-dev \
libjpeg-dev \
libgif-dev \
librsvg2-dev \
&& rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

RUN pnpm install

# Copy the frontend code
COPY . .

RUN pnpm run build

EXPOSE 3000

# Default command is dev, but can be overridden in docker-compose
CMD ["pnpm", "start"]
```

#### Dockerfile - Backend

```dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
PYTHONDONTWRITEBYTECODE=1 \
ENV_MODE="production" \
PYTHONPATH=/app

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
build-essential \
curl \
&& rm -rf /var/lib/apt/lists/*

# Create non-root user and set up directories
RUN useradd -m -u 1000 appuser && \
mkdir -p /app/logs && \
chown -R appuser:appuser /app

# Install Python dependencies
COPY --chown=appuser:appuser requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn


# Switch to non-root user
USER appuser

# Copy application code
COPY --chown=appuser:appuser . .

# Expose the port the app runs on
EXPOSE 8000

# Gunicorn configuration
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000"]
```

#### Docker Compose

```yaml
services:

backend:

build:

context: ./backend

dockerfile: Dockerfile

ports:

- "8000:8000"

volumes:

- ./backend:/app

environment:

- ENV_MODE=local



frontend:

build:

context: ./frontend

dockerfile: Dockerfile

ports:

- "3001:3000"

volumes:

- ./frontend:/app

- /app/node_modules # Exclude node_modules from being overwritten by the volume mount

- /app/.next # Exclude .next from being overwritten

command: ["pnpm", "run", "start"]

depends_on:

- backend



volumes:

backend_data:

frontend_data:
```
