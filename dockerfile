# Stage 1: Build the frontend
FROM node:18 AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/frontend/ ./
RUN npm run build

# Stage 2: Build the backend
FROM python:3.9-slim AS backend
WORKDIR /app
COPY src/backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install git+https://github.com/SauravMaheshkar/samv2.git
RUN wget https://dl.fbaipublicfiles.com/segment_anything_2/072824/sam2_hiera_tiny.pt -P /app
COPY src/backend/ .

# Stage 3: Final image with Nginx
FROM nginx:latest

# Copy frontend build to Nginx
COPY --from=frontend /app/dist /usr/share/nginx/html

# Copy backend code
COPY --from=backend /app /app

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the port Nginx will serve on
EXPOSE 80

# Command to run the backend and frontend together
CMD ["nginx", "-g", "daemon off;"]
