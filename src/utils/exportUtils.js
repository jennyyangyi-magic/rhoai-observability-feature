import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Papa from 'papaparse'
import { saveAs } from 'file-saver'

// Export data to CSV format
export const exportToCSV = (data, filename = 'export') => {
  try {
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    alert('Failed to export CSV file. Please try again.')
  }
}

// Export data to JSON format
export const exportToJSON = (data, filename = 'export') => {
  try {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.json`)
  } catch (error) {
    console.error('Error exporting to JSON:', error)
    alert('Failed to export JSON file. Please try again.')
  }
}

// Export element as PDF
export const exportToPDF = async (elementId, filename = 'export', options = {}) => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`)
    }

    // Show loading state
    const originalContent = element.innerHTML
    
    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      backgroundColor: '#ffffff',
      ...options
    })

    // Create PDF
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate dimensions to fit the page
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    
    const finalWidth = imgWidth * ratio
    const finalHeight = imgHeight * ratio
    
    // Center the image on the page
    const x = (pdfWidth - finalWidth) / 2
    const y = (pdfHeight - finalHeight) / 2

    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
    
    // Add metadata
    pdf.setProperties({
      title: filename,
      creator: 'ChapRouge Dashboard',
      creationDate: new Date()
    })

    pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    alert('Failed to export PDF file. Please try again.')
  }
}

// Export chart data specifically formatted for charts
export const exportChartData = (chartData, chartTitle, format = 'csv') => {
  const filename = `${chartTitle.replace(/\s+/g, '_').toLowerCase()}_chart_data`
  
  if (format === 'csv') {
    exportToCSV(chartData, filename)
  } else if (format === 'json') {
    const exportData = {
      title: chartTitle,
      exportDate: new Date().toISOString(),
      data: chartData
    }
    exportToJSON(exportData, filename)
  }
}

// Export table data with proper formatting
export const exportTableData = (tableData, columns, tableName, format = 'csv') => {
  const filename = `${tableName.replace(/\s+/g, '_').toLowerCase()}_table`
  
  if (format === 'csv') {
    // Ensure we have proper column headers
    const formattedData = tableData.map(row => {
      const formattedRow = {}
      columns.forEach(col => {
        formattedRow[col.header || col.key] = row[col.key] || ''
      })
      return formattedRow
    })
    exportToCSV(formattedData, filename)
  } else if (format === 'json') {
    const exportData = {
      tableName,
      exportDate: new Date().toISOString(),
      columns: columns.map(col => ({ key: col.key, header: col.header || col.key })),
      data: tableData
    }
    exportToJSON(exportData, filename)
  }
}

// Export model performance metrics
export const exportModelMetrics = (modelData, modelName, format = 'csv') => {
  const filename = `${modelName.replace(/\s+/g, '_').toLowerCase()}_metrics`
  
  const metricsData = {
    modelName,
    exportDate: new Date().toISOString(),
    performanceMetrics: modelData.aggregated || {},
    modelDetails: modelData.models || [],
    summary: {
      totalModels: modelData.models?.length || 0,
      avgLatency: modelData.aggregated?.p50Latency || 'N/A',
      healthScore: modelData.aggregated?.health || 'N/A'
    }
  }

  if (format === 'csv') {
    // Flatten the data for CSV export
    const csvData = []
    
    // Add performance metrics
    if (modelData.aggregated) {
      Object.entries(modelData.aggregated).forEach(([key, value]) => {
        csvData.push({
          Category: 'Performance Metrics',
          Metric: key,
          Value: value
        })
      })
    }
    
    // Add model details
    if (modelData.models) {
      modelData.models.forEach((model, index) => {
        Object.entries(model).forEach(([key, value]) => {
          csvData.push({
            Category: `Model ${index + 1}`,
            Metric: key,
            Value: value
          })
        })
      })
    }
    
    exportToCSV(csvData, filename)
  } else if (format === 'json') {
    exportToJSON(metricsData, filename)
  }
}

// Export safety evaluation data
export const exportSafetyData = (safetyData, format = 'csv') => {
  const filename = 'safety_evaluation_report'
  
  if (format === 'csv') {
    exportToCSV(safetyData, filename)
  } else if (format === 'json') {
    const exportData = {
      reportType: 'Safety Evaluation',
      exportDate: new Date().toISOString(),
      totalTasks: safetyData.length,
      summary: {
        passed: safetyData.filter(task => task.status === 'passed').length,
        warnings: safetyData.filter(task => task.status === 'warning').length,
        failed: safetyData.filter(task => task.status === 'failed').length
      },
      data: safetyData
    }
    exportToJSON(exportData, filename)
  }
}

// Export trace data
export const exportTraceData = (traceData, format = 'csv') => {
  const filename = 'trace_data'
  
  if (format === 'csv') {
    // Flatten trace data for CSV
    const csvData = traceData.map(trace => ({
      'Trace Name': trace.traceName,
      'Spans': trace.spans,
      'Duration': trace.duration,
      'Start Time': trace.startTime,
      'Tags': Array.isArray(trace.tags) ? trace.tags.join(', ') : trace.tags
    }))
    exportToCSV(csvData, filename)
  } else if (format === 'json') {
    const exportData = {
      reportType: 'Trace Analysis',
      exportDate: new Date().toISOString(),
      totalTraces: traceData.length,
      data: traceData
    }
    exportToJSON(exportData, filename)
  }
}

// Generate comprehensive dashboard report
export const exportDashboardReport = async (dashboardData, format = 'pdf') => {
  const filename = 'dashboard_comprehensive_report'
  
  if (format === 'json') {
    const reportData = {
      reportTitle: 'ChapRouge Dashboard Comprehensive Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalModels: dashboardData.models?.length || 0,
        activeModels: dashboardData.models?.filter(m => m.status === 'Running').length || 0,
        totalTraces: dashboardData.traces?.length || 0,
        safetyIssues: dashboardData.safetyData?.filter(s => s.status === 'failed').length || 0
      },
      sections: {
        modelInventory: dashboardData.models || [],
        performanceMetrics: dashboardData.performanceMetrics || {},
        safetyEvaluation: dashboardData.safetyData || [],
        traceAnalysis: dashboardData.traces || [],
        systemOverview: dashboardData.systemMetrics || {}
      }
    }
    exportToJSON(reportData, filename)
  } else if (format === 'pdf') {
    // For PDF, we'll capture the main dashboard element
    await exportToPDF('dashboard-main', filename)
  }
}

// Utility to show export options modal
export const showExportModal = (exportFunctions, elementRef = null) => {
  return new Promise((resolve) => {
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Export Options</h3>
        <div class="space-y-3">
          <button class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" data-format="csv">
            Export as CSV
          </button>
          <button class="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" data-format="json">
            Export as JSON
          </button>
          ${elementRef ? '<button class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" data-format="pdf">Export as PDF</button>' : ''}
        </div>
        <button class="w-full mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" data-action="cancel">
          Cancel
        </button>
      </div>
    `
    
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.format) {
        document.body.removeChild(modal)
        resolve(e.target.dataset.format)
      } else if (e.target.dataset.action === 'cancel' || e.target === modal) {
        document.body.removeChild(modal)
        resolve(null)
      }
    })
    
    document.body.appendChild(modal)
  })
}

