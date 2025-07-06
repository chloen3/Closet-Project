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

# Install OS-level deps
RUN apt-get update \
  && apt-get install -y build-essential gcc \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps
COPY requirements.txt ./
RUN pip install --upgrade pip \
  && pip install -r requirements.txt

# Copy your Flask sources
COPY main.py ./
COPY firebase-key.json /secrets/firebase-key/secrets

# ── Copy the React “build” into the exact place Flask will look ──
# This will produce:
#   /app/templates/index.html
#   /app/templates/static/... (css/js assets)
COPY --from=frontend /app/frontend/build /app/frontend/build

# Expose and run
EXPOSE 8080
CMD ["gunicorn", "-b", "0.0.0.0:8080", "main:app"]
