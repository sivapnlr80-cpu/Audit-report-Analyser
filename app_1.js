// Application state
let analysisData = null;
let currentFile = null;

// Sample data for simulation
const sampleData = {
  total_pdf_files: 18,
  missing_files: ["Schedule 5", "Schedule 12", "Schedule 18", "Annexure 3", "Annexure 7"],
  file_analysis: [
    {
      filename: "Financial_Statement_2023.pdf",
      pages: 25,
      blank_pages: 2,
      financial_tables: 8,
      status: "Complete"
    },
    {
      filename: "Trial_Balance_Q4.pdf", 
      pages: 15,
      blank_pages: 0,
      financial_tables: 12,
      status: "Complete"
    },
    {
      filename: "Schedule_1_Assets.pdf",
      pages: 8,
      blank_pages: 1,
      financial_tables: 3,
      status: "Complete"
    },
    {
      filename: "Schedule_2_Liabilities.pdf",
      pages: 6,
      blank_pages: 0,
      financial_tables: 2,
      status: "Complete"
    },
    {
      filename: "Annexure_1_Notes.pdf",
      pages: 12,
      blank_pages: 0,
      financial_tables: 5,
      status: "Complete"
    },
    {
      filename: "Schedule_3_Income.pdf",
      pages: 10,
      blank_pages: 1,
      financial_tables: 4,
      status: "Complete"
    },
    {
      filename: "Receipt_Payment_Account.pdf",
      pages: 18,
      blank_pages: 0,
      financial_tables: 6,
      status: "Complete"
    }
  ],
  receipt_payment_verification: {
    receipt_total: 2500000,
    payment_total: 2500000,
    equal: true,
    difference: 0,
    status: "Balanced"
  },
  trial_balance_verification: {
    file1_total: 5000000,
    file2_total: 5000000,
    consistent: true,
    difference: 0,
    status: "Consistent"
  }
};

const schedulesList = Array.from({length: 22}, (_, i) => `Schedule ${i + 1}`);
const annexuresList = Array.from({length: 12}, (_, i) => `Annexure ${i + 1}`);

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectFileBtn = document.getElementById('selectFileBtn');
const uploadStatus = document.getElementById('uploadStatus');
const resetBtn = document.getElementById('resetBtn');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const generateReportBtn = document.getElementById('generateReportBtn');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFileUpload();
    initializeFilesDisplay();
    initializeSearch();
    initializeReportGeneration();
    initializeModal();
    addDemoMode();
});

// Add demo mode functionality
function addDemoMode() {
    // Add demo button to upload area
    const uploadContent = document.querySelector('.upload-content');
    const demoButton = document.createElement('button');
    demoButton.className = 'btn btn--outline';
    demoButton.textContent = '🎯 Try Demo Mode';
    demoButton.style.marginTop = '16px';
    demoButton.addEventListener('click', startDemoMode);
    
    const smallElement = uploadContent.querySelector('small');
    uploadContent.insertBefore(demoButton, smallElement);
}

function startDemoMode() {
    // Simulate a demo file
    const demoFile = {
        name: 'Financial_Documents_Demo.zip',
        size: 2457600, // 2.4 MB
        type: 'application/zip'
    };
    
    processFile(demoFile, true);
}

// Navigation functionality
function initializeNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            switchSection(sectionId);
        });
    });
}

function switchSection(sectionId) {
    // Update active nav item
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
    
    // Update active content section
    contentSections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// File upload functionality
function initializeFileUpload() {
    // Select file button
    selectFileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    uploadArea.addEventListener('click', function(e) {
        if (e.target === uploadArea || e.target.closest('.upload-content')) {
            fileInput.click();
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', resetUpload);
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    if (!uploadArea.contains(e.relatedTarget)) {
        uploadArea.classList.remove('dragover');
    }
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file, isDemoMode = false) {
    // Validate file type (skip validation for demo mode)
    if (!isDemoMode && !file.name.toLowerCase().endsWith('.zip')) {
        showAlert('Please select a ZIP file', 'error');
        return;
    }
    
    currentFile = file;
    
    // Show file details
    const fileDetails = document.getElementById('fileDetails');
    fileDetails.innerHTML = `
        <div class="file-detail" style="margin-bottom: 8px;">
            <strong>Name:</strong> ${file.name}
        </div>
        <div class="file-detail" style="margin-bottom: 8px;">
            <strong>Size:</strong> ${formatFileSize(file.size)}
        </div>
        <div class="file-detail">
            <strong>Type:</strong> ${file.type || 'application/zip'}
        </div>
        ${isDemoMode ? '<div class="file-detail" style="margin-top: 8px; color: var(--color-primary);"><strong>Mode:</strong> Demo Analysis</div>' : ''}
    `;
    
    // Show upload status and start analysis
    uploadArea.style.display = 'none';
    uploadStatus.classList.remove('hidden');
    
    startAnalysis();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function startAnalysis() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 12 + 3; // More consistent progress
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(completeAnalysis, 500); // Small delay for better UX
        }
        
        progressFill.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
    }, 200);
}

function completeAnalysis() {
    analysisData = sampleData;
    updateDashboard();
    updateMissingFiles();
    updateValidation();
    updateDocumentsTable();
    generateReportBtn.disabled = false;
    
    showAlert('Analysis completed successfully! Navigate to Dashboard to view results.', 'success');
    
    // Auto-switch to dashboard after brief delay
    setTimeout(() => {
        switchSection('dashboard');
    }, 1500);
}

function resetUpload() {
    uploadArea.style.display = 'block';
    uploadStatus.classList.add('hidden');
    currentFile = null;
    analysisData = null;
    fileInput.value = '';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    
    // Reset all displays
    resetDashboard();
    resetMissingFiles();
    resetValidation();
    resetDocumentsTable();
    generateReportBtn.disabled = true;
    
    switchSection('upload');
}

// Dashboard functionality
function updateDashboard() {
    if (!analysisData) return;
    
    document.getElementById('totalFiles').textContent = analysisData.total_pdf_files;
    document.getElementById('missingCount').textContent = analysisData.missing_files.length;
    
    // Update receipt status
    const receiptIcon = document.getElementById('receiptIcon');
    const receiptStatus = document.getElementById('receiptStatus');
    if (analysisData.receipt_payment_verification.equal) {
        receiptIcon.className = 'metric-icon success';
        receiptStatus.textContent = 'Balanced';
    } else {
        receiptIcon.className = 'metric-icon error';
        receiptStatus.textContent = 'Unbalanced';
    }
    
    // Update trial balance status
    const trialIcon = document.getElementById('trialIcon');
    const trialStatus = document.getElementById('trialStatus');
    if (analysisData.trial_balance_verification.consistent) {
        trialIcon.className = 'metric-icon success';
        trialStatus.textContent = 'Consistent';
    } else {
        trialIcon.className = 'metric-icon error';
        trialStatus.textContent = 'Inconsistent';
    }
    
    // Update missing files icon
    const missingIcon = document.getElementById('missingIcon');
    if (analysisData.missing_files.length === 0) {
        missingIcon.className = 'metric-icon success';
    } else {
        missingIcon.className = 'metric-icon error';
    }
    
    // Update summary
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = `
        <div class="summary-stats">
            <p><strong>Total Files Analyzed:</strong> ${analysisData.total_pdf_files}</p>
            <p><strong>Missing Files:</strong> ${analysisData.missing_files.length} (${analysisData.missing_files.join(', ')})</p>
            <p><strong>Total Pages:</strong> ${analysisData.file_analysis.reduce((sum, file) => sum + file.pages, 0)}</p>
            <p><strong>Blank Pages Found:</strong> ${analysisData.file_analysis.reduce((sum, file) => sum + file.blank_pages, 0)}</p>
            <p><strong>Financial Tables:</strong> ${analysisData.file_analysis.reduce((sum, file) => sum + file.financial_tables, 0)}</p>
            <p><strong>Receipt-Payment Status:</strong> ${analysisData.receipt_payment_verification.status}</p>
            <p><strong>Trial Balance Status:</strong> ${analysisData.trial_balance_verification.status}</p>
        </div>
    `;
}

function resetDashboard() {
    document.getElementById('totalFiles').textContent = '0';
    document.getElementById('missingCount').textContent = '0';
    document.getElementById('receiptStatus').textContent = '-';
    document.getElementById('trialStatus').textContent = '-';
    
    // Reset icons
    document.getElementById('receiptIcon').className = 'metric-icon';
    document.getElementById('trialIcon').className = 'metric-icon';
    document.getElementById('missingIcon').className = 'metric-icon error';
    
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '<p>Upload a ZIP file to begin analysis</p>';
}

// Missing files functionality
function initializeFilesDisplay() {
    displaySchedules();
    displayAnnexures();
}

function displaySchedules() {
    const schedulesGrid = document.getElementById('schedulesGrid');
    schedulesGrid.innerHTML = schedulesList.map(schedule => {
        const isMissing = analysisData ? analysisData.missing_files.includes(schedule) : true;
        const statusClass = analysisData ? (isMissing ? 'missing' : 'found') : 'missing';
        return `<div class="file-item ${statusClass}">${schedule}</div>`;
    }).join('');
}

function displayAnnexures() {
    const annexuresGrid = document.getElementById('annexuresGrid');
    annexuresGrid.innerHTML = annexuresList.map(annexure => {
        const isMissing = analysisData ? analysisData.missing_files.includes(annexure) : true;
        const statusClass = analysisData ? (isMissing ? 'missing' : 'found') : 'missing';
        return `<div class="file-item ${statusClass}">${annexure}</div>`;
    }).join('');
}

function updateMissingFiles() {
    displaySchedules();
    displayAnnexures();
}

function resetMissingFiles() {
    displaySchedules();
    displayAnnexures();
}

// Validation functionality
function updateValidation() {
    if (!analysisData) return;
    
    // Receipt-Payment validation
    const receiptValidation = document.getElementById('receiptValidation');
    const rpv = analysisData.receipt_payment_verification;
    receiptValidation.innerHTML = `
        <div class="validation-item">
            <span class="validation-label">Receipt Total:</span>
            <span class="validation-value">₹${rpv.receipt_total.toLocaleString()}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Payment Total:</span>
            <span class="validation-value">₹${rpv.payment_total.toLocaleString()}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Difference:</span>
            <span class="validation-value ${rpv.equal ? 'success' : 'error'}">₹${rpv.difference.toLocaleString()}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Status:</span>
            <span class="validation-value ${rpv.equal ? 'success' : 'error'}">${rpv.status}</span>
        </div>
    `;
    
    // Trial Balance validation
    const trialValidation = document.getElementById('trialValidation');
    const tbv = analysisData.trial_balance_verification;
    trialValidation.innerHTML = `
        <div class="validation-item">
            <span class="validation-label">File 1 Total:</span>
            <span class="validation-value">₹${tbv.file1_total.toLocaleString()}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">File 2 Total:</span>
            <span class="validation-value">₹${tbv.file2_total.toLocaleString()}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Difference:</span>
            <span class="validation-value ${tbv.consistent ? 'success' : 'error'}">₹${tbv.difference.toLocaleString()}</span>
        </div>
        <div class="validation-item">
            <span class="validation-label">Status:</span>
            <span class="validation-value ${tbv.consistent ? 'success' : 'error'}">${tbv.status}</span>
        </div>
    `;
}

function resetValidation() {
    document.getElementById('receiptValidation').innerHTML = '<p>No data available</p>';
    document.getElementById('trialValidation').innerHTML = '<p>No data available</p>';
}

// Documents table functionality
function updateDocumentsTable() {
    if (!analysisData) return;
    
    const tableBody = document.getElementById('documentsTableBody');
    tableBody.innerHTML = analysisData.file_analysis.map(file => `
        <tr>
            <td>${file.filename}</td>
            <td>${file.pages}</td>
            <td>${file.blank_pages}</td>
            <td>${file.financial_tables}</td>
            <td><span class="status-badge ${file.status.toLowerCase()}">${file.status}</span></td>
        </tr>
    `).join('');
}

function resetDocumentsTable() {
    const tableBody = document.getElementById('documentsTableBody');
    tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No documents analyzed yet</td></tr>';
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    
    searchInput.addEventListener('input', filterTable);
    statusFilter.addEventListener('change', filterTable);
}

function filterTable() {
    if (!analysisData) return;
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const filteredData = analysisData.file_analysis.filter(file => {
        const matchesSearch = file.filename.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || file.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    const tableBody = document.getElementById('documentsTableBody');
    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="no-data">No matching documents found</td></tr>';
    } else {
        tableBody.innerHTML = filteredData.map(file => `
            <tr>
                <td>${file.filename}</td>
                <td>${file.pages}</td>
                <td>${file.blank_pages}</td>
                <td>${file.financial_tables}</td>
                <td><span class="status-badge ${file.status.toLowerCase()}">${file.status}</span></td>
            </tr>
        `).join('');
    }
}

// Report generation functionality
function initializeReportGeneration() {
    generateReportBtn.addEventListener('click', generateReport);
}

function generateReport() {
    if (!analysisData) return;
    
    const reportStatus = document.getElementById('reportStatus');
    const reportProgress = document.getElementById('reportProgress');
    const reportProgressText = document.getElementById('reportProgressText');
    
    reportStatus.classList.remove('hidden');
    generateReportBtn.disabled = true;
    generateReportBtn.innerHTML = '<span class="spinner"></span> Generating...';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            completeReportGeneration();
        }
        
        reportProgress.style.width = progress + '%';
        reportProgressText.textContent = Math.round(progress) + '%';
    }, 150);
}

function completeReportGeneration() {
    // Simulate Excel file download
    const reportData = generateReportData();
    const filename = `Financial_Analysis_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // Create a simulated download experience
    showAlert(`📊 Report generated successfully! Filename: ${filename}`, 'success');
    
    // Reset progress after delay
    setTimeout(() => {
        document.getElementById('reportStatus').classList.add('hidden');
        document.getElementById('reportProgress').style.width = '0%';
        document.getElementById('reportProgressText').textContent = '0%';
        generateReportBtn.disabled = false;
        generateReportBtn.innerHTML = '📊 Generate Excel Report';
    }, 2000);
}

function generateReportData() {
    if (!analysisData) return null;
    
    return {
        summary: {
            total_files: analysisData.total_pdf_files,
            missing_files_count: analysisData.missing_files.length,
            total_pages: analysisData.file_analysis.reduce((sum, file) => sum + file.pages, 0),
            total_blank_pages: analysisData.file_analysis.reduce((sum, file) => sum + file.blank_pages, 0)
        },
        missing_files: analysisData.missing_files,
        file_details: analysisData.file_analysis,
        validations: {
            receipt_payment: analysisData.receipt_payment_verification,
            trial_balance: analysisData.trial_balance_verification
        }
    };
}

// Utility functions
function showAlert(message, type = 'info') {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.maxWidth = '400px';
    alert.style.boxShadow = 'var(--shadow-lg)';
    
    // Insert into body
    document.body.appendChild(alert);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

// Modal functionality
function initializeModal() {
    const modal = document.getElementById('detailModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');
    
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function openModal(title, content) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = content;
    if (modal) modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.add('hidden');
}