# Base image
FROM node:20-alpine AS base
WORKDIR /code

# Dependencies
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Production dependencies
FROM deps AS prod-deps
RUN npm prune --production

# Build
FROM deps AS build

ARG COMMIT_SHA
ENV COMMIT_SHA=$COMMIT_SHA

COPY . .
RUN npm run build

# Runtime
FROM base AS runtime
WORKDIR /code

RUN apk update && apk add --no-cache libc6-compat dumb-init

COPY --chown=node:node --from=build /code/build ./build
COPY --chown=node:node --from=prod-deps /code/node_modules ./node_modules
COPY --chown=node:node --from=prod-deps /code/package.json ./package.json

ARG COMMIT_SHA

ENV PORT=3000 \
    HOST=0.0.0.0 \
    NODE_ENV=production \
    COMMIT_SHA=$COMMIT_SHA

USER node
EXPOSE $PORT

CMD ["dumb-init", "npm", "run", "start"]
