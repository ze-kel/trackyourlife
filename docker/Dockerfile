FROM node:20-alpine AS base
 
FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app

RUN npm install -g pnpm
RUN npm install -g turbo@^2
COPY . .
 
# Generate a partial monorepo with a pruned lockfile for a target workspace.
RUN turbo prune @tyl/nextjs --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
 
# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm
RUN pnpm install
 
# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@tyl/nextjs...
 
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
COPY --from=installer /app/apps/next/next.config.js .
COPY --from=installer /app/apps/next/package.json .
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/next/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/next/.next/static ./apps/next/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/next/public ./apps/next/public

# Copy drizzle folder
# It will run migration on statup
COPY --chown=nextjs:nodejs /packages/db/drizzle  apps/next/drizzle
 
CMD node apps/next/server.js
