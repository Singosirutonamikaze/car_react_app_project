# ─── Stage 1 : dépendances de production ────────────────────────────────────
# Debian slim : patches de sécurité plus fréquents qu'Alpine actuellement
FROM node:22.14.0-bookworm-slim AS deps

# Mettre à jour les packages OS pour éliminer les CVEs Debian
RUN apt-get update \
  && apt-get upgrade -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/package*.json ./

# npm ci respecte exactement le package-lock.json (overrides déjà résolus)
RUN npm ci --omit=dev --ignore-scripts \
  && npm prune --omit=dev

# ─── Stage 2 : build TypeScript ──────────────────────────────────────────────
FROM node:22.14.0-bookworm-slim AS builder

RUN apt-get update \
  && apt-get upgrade -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --ignore-scripts

COPY backend/ .
RUN npm run build

# ─── Stage 3 : production distroless (surface d'attaque minimale) ────────────
# Pas de shell, pas d'apt/apk, pas de binaires inutiles
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS production

ENV NODE_ENV=production

WORKDIR /app

# Copier uniquement l'artefact compilé et les dépendances prod patchées
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/dist         ./dist

# :nonroot tourne en uid 65532 — S6504 ✔
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD ["/nodejs/bin/node", "-e", \
  "require('http').get('http://localhost:5000/health',(r)=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"]

EXPOSE 5000

CMD ["dist/index.js"]

