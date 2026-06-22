# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
# We copy a dummy or decrypted .env file if it exists, but variables are typically injected via docker-compose env_file
EXPOSE 3000
CMD ["node", "dist/index.js"]
