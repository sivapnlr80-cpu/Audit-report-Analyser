# Create a Docker configuration for easy deployment
dockerfile_content = '''# Dockerfile for Financial Document Analyzer
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY financial_document_analyzer.py .

# Expose port
EXPOSE 8501

# Health check
HEALTHCHECK CMD curl --fail http://localhost:8501/_stcore/health || exit 1

# Run the application
CMD ["streamlit", "run", "financial_document_analyzer.py", "--server.port=8501", "--server.address=0.0.0.0"]
'''

# Save Dockerfile
with open("Dockerfile", "w", encoding="utf-8") as f:
    f.write(dockerfile_content)

# Create docker-compose file for easy local development
docker_compose_content = '''version: '3.8'

services:
  financial-analyzer:
    build: .
    ports:
      - "8501:8501"
    volumes:
      - ./uploads:/app/uploads
    environment:
      - PYTHONUNBUFFERED=1
    restart: unless-stopped

networks:
  default:
    driver: bridge
'''

with open("docker-compose.yml", "w", encoding="utf-8") as f:
    f.write(docker_compose_content)

print("✅ Docker configuration files created:")
print("   - Dockerfile")
print("   - docker-compose.yml")
print("🐳 Users can now deploy using Docker with:")
print("   docker-compose up --build")