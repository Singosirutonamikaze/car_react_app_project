FROM node:22.14.0-alpine

RUN apk update && apk upgrade --no-cache

WORKDIR /app

COPY backend/package.json backend/package-lock.json ./
RUN npm ci --ignore-scripts

COPY backend/ .
RUN npm run build && npm prune --omit=dev

RUN mkdir -p /app/uploads && chown -R node:node /app

ENV NODE_ENV=production

USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health',(r)=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

EXPOSE 5000

CMD ["node", "dist/index.js"]
