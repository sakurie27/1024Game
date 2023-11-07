FROM node:20 as build

RUN npm install -g pnpm

WORKDIR /usr/src/app

# COPY ./package.json ./
# COPY ./pnpm-lock.yaml ./
COPY ./ ./
FROM build AS prod-deps

# Build the project
RUN pnpm i
RUN pnpm build

# Pull the same Node image and use it as the final (production image)
FROM node:20 as production

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Only copy the results from the build over to the final image
# We do this to keep the final image as small as possible
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/server ./server
COPY --from=build /usr/src/app/dist ./dist

# Expose port 3000 (default port)
EXPOSE 3000

# Start the application
CMD [ "node", "server/entry.express"]