FROM node:22.13 AS base
RUN npm install --global pnpm
RUN pnpm config set store-dir ~/.pnpm-store

FROM base AS build_server
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm -r install --frozen-lockfile
RUN pnpm run generate
RUN pnpm run build

FROM base AS production_server
ENV NODE_ENV=production
COPY --from=build_server /usr/src/app/dist ./dist
COPY --from=build_server /usr/src/app/package.json ./package.json
COPY --from=build_server /usr/src/app/prisma ./prisma
COPY --from=build_server /usr/src/app/node_modules ./node_modules
EXPOSE ${PORT} 80

CMD ["sh", "-c", "pnpx prisma migrate deploy && pnpm tsx prisma/seed.ts && pnpm start:prod"]