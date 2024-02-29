# Dependencies for build
FROM node:20.11.1-alpine3.19 as deps
WORKDIR /app
COPY . ./
RUN yarn --frozen-lockfile


# Build distribution
FROM node:20.11.1-alpine3.19 as build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules/ ./node_modules
RUN yarn build


# Runner
FROM node:20.11.1-alpine3.19 as runner
WORKDIR /app
COPY --from=build /app/dist/ ./dist
COPY --from=deps /app/node_modules/ ./node_modules
COPY package.json package.json

# Cmd start
CMD [ "yarn", "start:prod" ]
