# ── Stage 1: Build ──────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml* package-lock.json* ./
RUN npm install --omit=dev || true
COPY . .
RUN npm run build

# ── Stage 2: Runtime ────────────────────────────
FROM node:20-slim AS runtime

WORKDIR /app

RUN groupadd -r app && useradd -r -g app -d /app app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER app

ENV PORT=8787
EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD node -e "fetch('http://localhost:8787/health').then(r=>r.ok?process.exit(0):process.exit(1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
