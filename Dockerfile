FROM python:3.11-slim

WORKDIR /app

# Copy all source code into the container
COPY . /app

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Point Firebase to the secret path (mounted at runtime by Cloud Run)
ENV FIREBASE_KEY_PATH=/secrets/firebase-key/secrets
ENV GOOGLE_APPLICATION_CREDENTIALS=/secrets/firebase-key/secrets

# Cloud Run uses port 8080
EXPOSE 8080

# Start the app
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]
