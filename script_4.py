# Create deployment script for easy local setup
deployment_script = '''#!/bin/bash

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
'''

# Save deployment script
with open("setup_and_run.sh", "w", encoding="utf-8") as f:
    f.write(deployment_script)

# Create Windows batch file as well
windows_script = '''@echo off
echo 🚀 Setting up Financial Document Analyzer...

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv financial_analyzer_env

REM Activate virtual environment
echo ⚡ Activating virtual environment...
call financial_analyzer_env\\Scripts\\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install --upgrade pip
pip install -r requirements.txt

echo ✅ Setup complete!
echo 🌐 Starting web application...

REM Run the Streamlit app
streamlit run financial_document_analyzer.py --server.port 8501 --server.address localhost

echo 📝 Application should now be running at: http://localhost:8501
pause
'''

with open("setup_and_run.bat", "w", encoding="utf-8") as f:
    f.write(windows_script)

print("✅ Deployment scripts created:")
print("   - setup_and_run.sh (Linux/Mac)")
print("   - setup_and_run.bat (Windows)")
print("🚀 Users can now run these scripts to set up and launch the application")