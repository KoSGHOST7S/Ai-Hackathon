FROM node:20-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests and lockfile for dependency install
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Build shared package
RUN pnpm --filter shared build

# Generate Prisma Client
RUN pnpm --filter server exec prisma generate

# Build server
RUN pnpm --filter server build

EXPOSE 3000

CMD ["node", "apps/server/dist/index.js"]
