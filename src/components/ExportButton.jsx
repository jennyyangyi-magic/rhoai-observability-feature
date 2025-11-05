import React, { useState } from 'react'
import { Download, FileText, Database, FileImage } from 'lucide-react'
import {
  exportToCSV,
  exportToJSON,
  exportToPDF,
  exportChartData,
  exportTableData,
  exportModelMetrics,
  exportSafetyData,
  exportTraceData,
  exportDashboardReport
} from '../utils/exportUtils'

const ExportButton = ({ 
  data, 
  type = 'generic', // 'chart', 'table', 'model', 'safety', 'trace', 'dashboard'
  filename,
  elementId,
  columns = [],
  title = '',
  className = '',
  size = 'md'
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const handleExport = async (format) => {
    if (!data && format !== 'pdf') {
      alert('No data available for export')
      return
    }

    setIsExporting(true)
    setShowDropdown(false)

    try {
      switch (type) {
        case 'chart':
          exportChartData(data, title || filename, format)
          break
        
        case 'table':
          exportTableData(data, columns, title || filename, format)
          break
        
        case 'model':
          exportModelMetrics(data, title || filename, format)
          break
        
        case 'safety':
          exportSafetyData(data, format)
          break
        
        case 'trace':
          exportTraceData(data, format)
          break
        
        case 'dashboard':
          await exportDashboardReport(data, format)
          break
        
        default:
          if (format === 'csv') {
            exportToCSV(data, filename)
          } else if (format === 'json') {
            exportToJSON(data, filename)
          } else if (format === 'pdf' && elementId) {
            await exportToPDF(elementId, filename)
          }
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const buttonSizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className={`
          inline-flex items-center space-x-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
          disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          ${buttonSizeClasses[size]} ${className}
        `}
      >
        <Download className={iconSizeClasses[size]} />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Database className="w-4 h-4 mr-3" />
              Export as CSV
            </button>
            <button
              onClick={() => handleExport('json')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="w-4 h-4 mr-3" />
              Export as JSON
            </button>
            {elementId && (
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FileImage className="w-4 h-4 mr-3" />
                Export as PDF
              </button>
            )}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default ExportButton

