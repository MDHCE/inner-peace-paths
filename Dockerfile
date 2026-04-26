# syntax=docker/dockerfile:1.6

# ---- Build stage: Vite-builds the SPA ---------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install all deps (incl. dev) for Vite build
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ---- Runtime stage: Express serves dist + API -------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Production deps only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Bundled artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/data ./data

# Drop root for runtime
RUN chown -R node:node /app
USER node

EXPOSE 3001
CMD ["node", "server.js"]
