import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import OverviewDashboard from './components/OverviewDashboardWrapper'
import ModelDetailView from './components/ModelDetailView'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [activeTab, setActiveTab] = useState('models')
  const [showModelDetail, setShowModelDetail] = useState(false)
  const [selectedModel, setSelectedModel] = useState(null)
  const [modelDetailTab, setModelDetailTab] = useState('performance')

  const handleOpenModelDetail = (modelName, tab = 'performance') => {
    setSelectedModel(modelName)
    setModelDetailTab(tab)
    setShowModelDetail(true)
  }

  const handleCloseModelDetail = () => {
    setShowModelDetail(false)
    setSelectedModel(null)
  }

  const renderContent = () => {
    if (showModelDetail) {
      return <ModelDetailView modelName={selectedModel} onBack={handleCloseModelDetail} initialTab={modelDetailTab} />
    }
    
    switch (activeView) {
      case 'dashboard':
        return <OverviewDashboard activeTab={activeTab} setActiveTab={setActiveTab} onOpenModelDetail={handleOpenModelDetail} />
      case 'workload-metrics':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Workload Metrics</h2>
            <p className="text-gray-600">Workload metrics view coming soon...</p>
          </div>
        )
      case 'training-jobs':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Training Jobs</h2>
            <p className="text-gray-600">Training jobs view coming soon...</p>
          </div>
        )
      default:
        return <OverviewDashboard activeTab={activeTab} setActiveTab={setActiveTab} onOpenModelDetail={handleOpenModelDetail} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        showModelDetail={showModelDetail}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App