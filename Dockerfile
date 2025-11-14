FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE
EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]
