FROM python:3.11-slim

WORKDIR /app

# Copy everything into the container
COPY . /app

# Explicitly copy the Firebase key so the file path is guaranteed
COPY firebase-key.json /app/firebase-key.json

# Install dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Set the environment variable so Firebase uses the key
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-key.json

ENV FIREBASE_KEY_PATH=/app/firebase-key.json

# Expose the port Cloud Run uses
EXPOSE 8080

# Start the app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "main:app"]
