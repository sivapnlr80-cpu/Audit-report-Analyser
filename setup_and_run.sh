#!/bin/bash

# Financial Document Analyzer - Setup and Deployment Script
# This script sets up the environment and runs the application locally

echo "🚀 Setting up Financial Document Analyzer..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv financial_analyzer_env

# Activate virtual environment
echo "⚡ Activating virtual environment..."
source financial_analyzer_env/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Setup complete!"
echo "🌐 Starting web application..."

# Run the Streamlit app
streamlit run financial_document_analyzer.py --server.port 8501 --server.address localhost

echo "📝 Application should now be running at: http://localhost:8501"
