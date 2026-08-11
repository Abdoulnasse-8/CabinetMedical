# ── Build stage ─────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# pnpm 9 (lockfile v9)
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install deps (cache-friendly)
COPY front/package.json front/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build the Next.js app (workspace yaml has no packages field — remove it)
COPY front/ ./
RUN rm -f pnpm-workspace.yaml && pnpm build

# ── Runtime stage ───────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8000

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

EXPOSE 8000
CMD ["npx", "next", "start"]
