import React from 'react'
import OverviewDashboardV2Github from './OverviewDashboardV2-github'

const OverviewDashboard = ({ activeTab, setActiveTab, onOpenModelDetail }) => {
  return (
    <OverviewDashboardV2Github 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onOpenModelDetail={onOpenModelDetail} 
    />
  )
}

export default OverviewDashboard
