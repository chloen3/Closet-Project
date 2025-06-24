# === Stage 1: Build React Frontend ===
FROM node:20-alpine as frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# === Stage 2: Build Flask Backend ===
FROM python:3.11-slim

# Set env vars for Firebase and Google Cloud credentials
ENV FIREBASE_KEY_PATH=/secrets/firebase-key/secrets
ENV GOOGLE_APPLICATION_CREDENTIALS=/secrets/firebase-key/secrets

# Set working dir and install dependencies
WORKDIR /app
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend code
COPY . /app

# Copy React build output into Flask's templates folder
COPY --from=frontend /app/frontend/build /app/templates

# Expose Flask port
EXPOSE 8080

# Start Flask using gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8080", "main:app"]
