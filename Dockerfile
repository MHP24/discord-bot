# Dependencies for build
FROM node:18.19-alpine as deps
WORKDIR /app
COPY . ./
RUN npm install


# Build distribution
FROM node:18.19-alpine as build
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules/ ./node_modules
RUN npm run build


# Runner
FROM node:18.19-alpine as runner
WORKDIR /app
COPY --from=build /app/dist/ ./dist
COPY --from=deps /app/node_modules/ ./node_modules
# FFMpeg required for audio player
RUN apk add --no-cache ffmpeg
COPY package.json package.json

# Cmd start
CMD [ "npm", "run", "start:prod" ]