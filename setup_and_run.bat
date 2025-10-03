@echo off
echo 🚀 Setting up Financial Document Analyzer...

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv financial_analyzer_env

REM Activate virtual environment
echo ⚡ Activating virtual environment...
call financial_analyzer_env\Scripts\activate.bat

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
