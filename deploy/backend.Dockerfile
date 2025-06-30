FROM node:20-alpine

WORKDIR /app

# Copy @package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source @code
COPY backend/tsconfig.json ./
COPY backend/src ./src

# Build TypeScript code
RUN npm run build

# Remove development @dependencies
RUN npm prune --production

EXPOSE 5500

CMD ["npm", "start"] 