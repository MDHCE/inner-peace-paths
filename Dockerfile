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

# Writable content lives on a volume at /app/data so admin edits survive a
# redeploy; /app/data-seed holds the committed defaults used to populate an
# empty volume on first boot.
ENV DATA_DIR=/app/data
ENV SEED_DIR=/app/data-seed

# Production deps only
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Bundled artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/data ./data-seed

# Mount point for the content volume (seeded from ./data-seed when empty)
RUN mkdir -p /app/data

# Drop root for runtime
RUN chown -R node:node /app
USER node

VOLUME ["/app/data"]

EXPOSE 3001
CMD ["node", "server.js"]
