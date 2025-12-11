# ---- 1) Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# 1. DÉFINIR LA VARIABLE COMME ARGUMENT DE BUILD
ARG VITE_API_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
# 2. PASSER LA VARIABLE DANS LA COMMANDE DE BUILD
# Cela force Vite à l'intégrer au moment de la compilation.
RUN VITE_API_BASE_URL=$VITE_API_BASE_URL npm run build

# ---- 2) Run stage ----
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]