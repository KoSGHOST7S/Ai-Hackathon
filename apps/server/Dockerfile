FROM node:20-alpine

WORKDIR /app

# Copy root package.json and lockfile
COPY package*.json ./

# Copy workspaces
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/shared ./packages/shared
COPY apps/server ./apps/server

# Build shared package
RUN npm run build -w shared

# Generate Prisma Client
WORKDIR /app/apps/server
RUN npx prisma generate

# Build server
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
