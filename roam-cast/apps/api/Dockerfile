FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/types/package.json ./packages/types/package.json

RUN npm install

COPY . .
RUN npm run --workspace @roamcast/api build

EXPOSE 4000
CMD ["npm","run","--workspace","@roamcast/api","start"]
