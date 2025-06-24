# === Stage 1: Build React Frontend ===
FROM node:20-alpine as frontend

# Set working directory in the frontend
WORKDIR /app/frontend

# Install dependencies and build React
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# === Stage 2: Build Flask Backend ===
FROM python:3.11-slim

# Install OS-level dependencies (optional: include libmagic if needed later)
RUN apt-get update && apt-get install -y build-essential gcc && rm -rf /var/lib/apt/lists/*

# Set environment variables for Firebase/Google Cloud credentials
ENV FIREBASE_KEY_PATH=/secrets/firebase-key/secrets
ENV GOOGLE_APPLICATION_CREDENTIALS=/secrets/firebase-key/secrets

# Set working directory
WORKDIR /app

# Copy Python dependencies and install them
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the entire backend source
COPY . /app

# Copy built React frontend to Flask templates directory
COPY --from=frontend /app/frontend/build /app/templates

# Update Flask to serve static assets from React
ENV FLASK_STATIC_FOLDER=/app/templates/static

# Expose port for Cloud Run
EXPOSE 8080

# Start Flask app using Gunicorn (recommended for production)
CMD ["gunicorn", "-b", "0.0.0.0:8080", "main:app"]
