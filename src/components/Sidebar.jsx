import React, { useState } from 'react'
import { 
  Monitor, 
  Database, 
  Settings, 
  Users, 
  BarChart3, 
  HelpCircle, 
  Home, 
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Bot,
  Wrench,
  Triangle,
  ArrowRight,
  Cpu,
  BookOpen,
  GitBranch,
  Play,
  Archive,
  Zap,
  TrendingUp,
  Briefcase,
  UserCircle,
  Shield,
  Globe
} from 'lucide-react'

const Sidebar = ({ activeView, setActiveView }) => {
  const [expandedSections, setExpandedSections] = useState({
    'ai-hub': false,
    'gen-ai-studio': false,
    'develop-train': false,
    'pipelines': true,
    'observe-monitor': true,
    'settings': false
  })

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    {
      id: 'ai-hub',
      label: 'AI hub',
      icon: Bot,
      expandable: true,
      children: [
        { id: 'catalog', label: 'Catalog' },
        { id: 'registry', label: 'Registry' },
        { id: 'deployments', label: 'Deployments' }
      ]
    },
    {
      id: 'gen-ai-studio',
      label: 'Gen AI studio',
      icon: Bot,
      hasIndicator: true,
      expandable: true,
      children: [
        { id: 'ai-asset-endpoints', label: 'AI asset endpoints' },
        { id: 'playground', label: 'Playground' },
        { id: 'knowledge-sources', label: 'Knowledge sources' }
      ]
    },
    {
      id: 'develop-train',
      label: 'Develop & train',
      icon: Wrench,
      hasIndicator: true,
      expandable: true,
      children: [
        { id: 'workbenches', label: 'Workbenches' },
        { id: 'feature-store', label: 'Feature store' },
        {
          id: 'pipelines',
          label: 'Pipelines',
          expandable: true,
          children: [
            { id: 'pipelines-list', label: 'Pipelines' },
            { id: 'runs', label: 'Runs' },
            { id: 'artifacts', label: 'Artifacts' },
            { id: 'executions', label: 'Executions' }
          ]
        },
        { id: 'evaluations', label: 'Evaluations' },
        { id: 'experiments', label: 'Experiments' }
      ]
    },
    {
      id: 'observe-monitor',
      label: 'Observe & monitor',
      icon: Monitor,
      expandable: true,
      active: true,
      children: [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'workload-metrics', label: 'Workload metrics' },
        { id: 'training-jobs', label: 'Training jobs' }
      ]
    },
    { id: 'learning-resources', label: 'Learning resources', icon: Triangle },
    { id: 'applications', label: 'Applications', icon: ArrowRight },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      expandable: true,
      children: [
        { id: 'cluster-settings', label: 'Cluster settings' },
        { id: 'environment-setup', label: 'Environment setup' },
        { id: 'model-resources-operations', label: 'Model resources and operations' },
        { id: 'user-management', label: 'User management' }
      ]
    }
  ]

  const renderMenuItem = (item, depth = 0) => {
    const Icon = item.icon
    const isExpanded = item.expandable && expandedSections[item.id]
    const isActive = item.id === activeView || item.active
    
    return (
      <li key={item.id}>
        <button
          onClick={() => {
            if (item.expandable) {
              toggleSection(item.id)
            } else {
              setActiveView(item.id)
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
            depth === 0 ? 'rounded-md' : ''
          } ${
            isActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${12 + (depth * 20)}px` }}
        >
          <div className="flex items-center space-x-3">
            {Icon && <Icon size={16} />}
            <span>{item.label}</span>
            {item.hasIndicator && (
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            )}
          </div>
          {item.expandable && (
            isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
        </button>
        
        {item.children && isExpanded && (
          <ul className="mt-1 space-y-1">
            {item.children.map(child => renderMenuItem(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <aside className="w-64 bg-sidebar-gray border-r border-gray-200">
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar