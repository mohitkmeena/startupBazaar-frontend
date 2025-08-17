# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear cache and install with ajv fixes
RUN rm -rf node_modules yarn.lock && \
    yarn add ajv@6.12.6 ajv-keywords@3.5.2 && \
    yarn install --legacy-peer-deps

# Copy updated craco config and source
COPY . .

# Build with environment variables to handle issues
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false
ENV CI=false
ENV DISABLE_HOT_RELOAD=true
ENV REACT_APP_BACKEND_URL=https://project-backend-latest.onrender.com

RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]