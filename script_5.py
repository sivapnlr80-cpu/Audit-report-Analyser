# Create a comprehensive README file with instructions
readme_content = '''# Financial Document Analyzer

A comprehensive Python application for analyzing financial documents from ZIP files, identifying missing schedules and annexures, validating financial totals, and generating detailed Excel reports.

## 🎯 Features

### Document Analysis
- **Missing File Detection**: Automatically identifies missing Schedules (1-22) and Annexures (1-12)
- **Blank Page Detection**: Finds pages with minimal content
- **PDF Processing**: Extracts and analyzes data from PDF documents within ZIP files

### Financial Validation
- **Table Analysis**: Automatically detects and analyzes financial tables
- **Column Recognition**: Identifies Opening Balance, Debit, Credit, and Closing Balance columns
- **Total Calculation**: Computes and validates financial totals
- **Receipt-Payment Verification**: Checks if receipt and payment totals match
- **Trial Balance Consistency**: Verifies consistency between multiple trial balance files

### Reporting
- **Excel Export**: Generates comprehensive Excel reports with multiple worksheets
- **Web Interface**: User-friendly Streamlit web application
- **Summary Dashboard**: Visual overview of analysis results
- **Detailed Breakdowns**: Page-by-page analysis with financial data

## 🚀 Quick Start

### Option 1: Using Setup Scripts (Recommended)

#### For Windows:
```bash
# Run the Windows batch file
setup_and_run.bat
```

#### For Linux/Mac:
```bash
# Make the script executable and run
chmod +x setup_and_run.sh
./setup_and_run.sh
```

### Option 2: Manual Setup

1. **Clone or Download** the project files
2. **Create Virtual Environment**:
   ```bash
   python -m venv financial_analyzer_env
   ```

3. **Activate Virtual Environment**:
   - Windows: `financial_analyzer_env\\Scripts\\activate`
   - Linux/Mac: `source financial_analyzer_env/bin/activate`

4. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Run Application**:
   ```bash
   streamlit run financial_document_analyzer.py
   ```

6. **Open Browser** and navigate to `http://localhost:8501`

## 📋 Usage Instructions

1. **Upload ZIP File**: Select a ZIP file containing PDF documents
2. **Wait for Analysis**: The application will process all PDFs and analyze them
3. **Review Results**: View the analysis dashboard with key metrics
4. **Download Report**: Generate and download a comprehensive Excel report

## 📊 Report Contents

The generated Excel report includes:

### Summary Sheet
- Total PDF files processed
- Count of missing files
- Receipt-Payment balance status
- Trial balance consistency status

### Detailed Analysis Sheet
- File-by-file breakdown
- Page-level analysis
- Financial totals for each page
- Blank page indicators

### Missing Files Sheet
- List of missing Schedules (1-22)
- List of missing Annexures (1-12)

### Verification Sheet
- Receipt-Payment verification details
- Trial balance consistency check results

## 🔧 Technical Requirements

### Dependencies
- Python 3.8 or higher
- streamlit >= 1.28.0
- pandas >= 1.5.0
- pdfplumber >= 0.9.0
- openpyxl >= 3.1.0

### System Requirements
- Minimum 4GB RAM (8GB recommended for large files)
- 1GB free disk space
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 📁 File Structure

```
financial-document-analyzer/
├── financial_document_analyzer.py    # Main application
├── requirements.txt                  # Python dependencies
├── setup_and_run.sh                # Linux/Mac setup script
├── setup_and_run.bat               # Windows setup script
└── README.md                        # This file
```

## 🌐 Deployment Options

### Local Deployment
Use the provided setup scripts for quick local deployment.

### Cloud Deployment

#### Streamlit Community Cloud
1. Push code to GitHub repository
2. Connect repository to Streamlit Community Cloud
3. Deploy with one click

#### Heroku
1. Add `Procfile` with: `web: streamlit run financial_document_analyzer.py --server.port=$PORT --server.address=0.0.0.0`
2. Deploy using Heroku CLI or GitHub integration

#### AWS/Azure/GCP
Use containerization with Docker for cloud deployment on major cloud platforms.

## 🔍 Supported File Types

### Input Files
- **ZIP files** containing PDF documents
- **PDF files** with financial tables and data

### Output Files
- **Excel files** (.xlsx) with comprehensive analysis reports

## ⚠️ Important Notes

### File Naming Conventions
The application looks for files containing:
- "schedule 1" through "schedule 22"
- "annexure 1" through "annexure 12"
- "trial balance" for consistency checking

### Performance Considerations
- Large ZIP files may take several minutes to process
- Processing time depends on number of PDFs and their complexity
- Ensure sufficient system memory for large document sets

## 🛠️ Customization

### Adding New Schedule/Annexure Requirements
Edit the `FinancialDocumentAnalyzer` class constructor:
```python
self.required_schedules = [f"schedule {i}" for i in range(1, 23)]  # Modify range
self.required_annexures = [f"annexure {i}" for i in range(1, 13)]  # Modify range
```

### Modifying Financial Column Detection
Update the `analyze_financial_table` method to recognize different column headers:
```python
# Add new patterns to match
if any(term in header for term in ['your_new_pattern', 'alternative_name']):
    financial_columns['your_column'] = idx
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 📞 Support

For support, please:
1. Check this README for common issues
2. Review error messages in the application
3. Ensure all dependencies are properly installed
4. Verify input file formats are correct

## 🔄 Version History

- **v1.0.0**: Initial release with core functionality
  - ZIP file processing
  - PDF analysis
  - Excel report generation
  - Web interface
  - Missing file detection
  - Financial validation

---

**Built with ❤️ using Python, Streamlit, and modern data analysis libraries**
'''

# Save README file
with open("README.md", "w", encoding="utf-8") as f:
    f.write(readme_content)

print("✅ Comprehensive README.md file created")
print("📖 Documentation includes:")
print("   - Feature overview")
print("   - Installation instructions")
print("   - Usage guide")
print("   - Technical requirements")
print("   - Deployment options")
print("   - Customization guide")