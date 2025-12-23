FROM node:20-alpine AS builder
WORKDIR /app

ARG GIT_HASH=unknown

COPY package*.json ./
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN npm install

COPY src ./src
COPY public ./public

# Append git hash to APP_VERSION in constants.js
RUN sed -i "s/export const APP_VERSION = '\([^']*\)';/export const APP_VERSION = '\1-${GIT_HASH}';/" src/constants.js

RUN npm run build:node

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8787

COPY --from=builder /app/dist ./dist
COPY public ./public

EXPOSE 8787

CMD ["node", "dist/node-server.cjs"]
