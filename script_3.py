# Create requirements.txt file for easy deployment
requirements_content = '''streamlit>=1.28.0
pandas>=1.5.0
pdfplumber>=0.9.0
openpyxl>=3.1.0
pathlib
'''

# Save requirements.txt
with open("requirements.txt", "w", encoding="utf-8") as f:
    f.write(requirements_content)

print("✅ Requirements.txt file created")
print("📦 Dependencies included:")
for line in requirements_content.strip().split('\n'):
    print(f"   - {line}")