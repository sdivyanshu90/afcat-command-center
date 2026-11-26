FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node server ./server
COPY --chown=node:node data ./data
COPY --chown=node:node migrations ./migrations
COPY package.json ./
RUN mkdir -p /app/var && chown node:node /app/var
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=5173 AFCAT_DB=/app/var/afcat.sqlite
VOLUME /app/var
EXPOSE 5173
CMD ["node","server/index.mjs"]
