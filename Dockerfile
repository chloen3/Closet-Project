# === Stage 1: React Build ===
FROM node:20-alpine as frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# === Stage 2: Flask Backend ===
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend files
COPY . /app

# Copy built React app into Flask templates
COPY --from=frontend /app/frontend/build /app/templates

ENV FIREBASE_KEY_PATH=/secrets/firebase-key/secrets
ENV GOOGLE_APPLICATION_CREDENTIALS=/secrets/firebase-key/secrets

CMD ["gunicorn", "-b", "0.0.0.0:8080", "main:app"]
