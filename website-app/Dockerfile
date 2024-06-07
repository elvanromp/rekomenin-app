FROM node:18 AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /website-app

COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /website-app
COPY --from=deps /website-app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

FROM base AS runner
WORKDIR /website-app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /website-app/public ./public
COPY --from=builder --chown=nextjs:nodejs /website-app/.next ./.next
COPY --from=builder /website-app/node_modules ./node_modules
COPY --from=builder /website-app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["npm", "start"]