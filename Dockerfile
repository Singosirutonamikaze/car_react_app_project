FROM node:22.14.0-bookworm-slim

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --ignore-scripts

COPY backend/ .
RUN npm run build && npm prune --omit=dev

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]
