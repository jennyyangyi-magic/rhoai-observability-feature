import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, Cell, ReferenceLine } from 'recharts'

const OverviewDashboardV2 = ({ activeTab, setActiveTab, onOpenModelDetail }) => {
  // State for selected filters
  const [selectedApiKey, setSelectedApiKey] = useState('')
  const [selectedRuntime, setSelectedRuntime] = useState('')
  
  // State for time duration filter (global across all tabs)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')
  
  // Available models data
  const availableModels = [
    { id: 'granite-7b-instruct-v2', name: 'granite-7b-instruct-v2', status: 'Running' },
    { id: 'llama-70b-chat', name: 'llama-70b-chat', status: 'Running' },
    { id: 'mistral-7b-instruct-v2', name: 'mistral-7b-instruct-v2', status: 'Running' },
    { id: 'stable-diffusion-xl-beta', name: 'stable-diffusion-xl-beta', status: 'Paused' },
    { id: 'codellama-34b-instruct', name: 'codellama-34b-instruct', status: 'Degraded' },
    { id: 'falcon-180b-chat', name: 'falcon-180b-chat', status: 'Running' }
  ]

  // State for selected models (multi-select) - default to all models
  const [selectedModels, setSelectedModels] = useState(availableModels.map(model => model.id))
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false)
  
  // Separate state for trace tab model dropdown to avoid conflicts
  const [isTraceModelDropdownOpen, setIsTraceModelDropdownOpen] = useState(false)
  

  // State for performance metrics popover
  const [metricsPopover, setMetricsPopover] = useState({ 
    isOpen: false, 
    modelIndex: null, 
    position: { x: 0, y: 0 },
    metricType: 'latency' // 'latency', 'ttft', 'itl'
  })
  
  // State for Usage per Group dropdowns
  const [groupBy, setGroupBy] = useState('Users')
  const [groupMetrics, setGroupMetrics] = useState('Tokens')
  
  
  // State for expandable rows in Logs tab
  const [expandedRows, setExpandedRows] = useState(new Set())

  // Enhanced popover state with view modes
  const [popoverViewMode, setPopoverViewMode] = useState('aggregate') // 'aggregate', 'response-level'

  // State for selected model type filter
  const [selectedModelType, setSelectedModelType] = useState('')
  
  // State for selected service type filter
  const [selectedServiceType, setSelectedServiceType] = useState('')

  // Sample response-level metrics data (similar to chat interface)
  const recentResponseMetrics = [
    {
      id: 'req_001',
      timestamp: '2025-09-16 18:49:01',
      model: 'granite-7b-instruct-v2',
      tokenUsage: 204,
      tokensPerSecond: 22,
      ttif: 243, // Time to First Token in ms
      responseTime: 0.3, // in seconds
      traceId: 'a4b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5',
      status: 'success',
      request: 'Hi, I have an appointment for a routine blood test next week. Is there anything specific I need to do to prepare for it?',
      spans: [
        { name: 'process_user_request', duration: 4.810, totalDuration: 4.810 },
        { name: 'run_input_guardrails', duration: 0.255, info: 'All input guardrails passed. Intent: ask_appointment_preparation' },
        { name: 'execute_rag_pipeline', duration: 1.182 },
        { name: 'retrieve_documents', duration: 1.012, info: 'Retriever found 1 relevant document chunk. Attributes: {"doc_id": "PatientLeaflet-BTest-v3.2.pdf", "score": 0.91}' },
        { name: 'call_llm', duration: 1.623, info: 'METRIC: llm.output.tokens = 85 token' },
        { name: 'run_output_guardrails', duration: 0.003 }
      ]
    },
    {
      id: 'req_002',
      timestamp: '2025-09-16 18:48:45',
      model: 'granite-7b-instruct-v2',
      tokenUsage: 156,
      tokensPerSecond: 28,
      ttif: 198,
      responseTime: 0.25,
      traceId: 'b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9q0',
      status: 'success',
      request: 'What are the side effects of the medication prescribed?',
      spans: [
        { name: 'process_user_request', duration: 3.420 },
        { name: 'run_input_guardrails', duration: 0.180 },
        { name: 'execute_rag_pipeline', duration: 0.890 },
        { name: 'retrieve_documents', duration: 0.750 },
        { name: 'call_llm', duration: 1.200 },
        { name: 'run_output_guardrails', duration: 0.002 }
      ]
    },
    {
      id: 'req_003',
      timestamp: '2025-09-16 18:48:12',
      model: 'granite-7b-instruct-v2',
      tokenUsage: 312,
      tokensPerSecond: 18,
      ttif: 456,
      responseTime: 0.68,
      traceId: 'c7d8e9f0-g1h2-i3j4-k5l6-m7n8o9p0q1r2',
      status: 'warning',
      request: 'Can you explain the complex interaction between multiple medications I am taking?',
      spans: [
        { name: 'process_user_request', duration: 6.800 },
        { name: 'run_input_guardrails', duration: 0.420 },
        { name: 'execute_rag_pipeline', duration: 2.150 },
        { name: 'retrieve_documents', duration: 1.890 },
        { name: 'call_llm', duration: 2.800 },
        { name: 'run_output_guardrails', duration: 0.008 }
      ]
    }
  ]

  // P90 Performance metrics time-series data with SLA zones
  const p90PerformanceTimeSeriesData = [
    { time: '00:00', latency: 450, ttft: 85, itl: 32, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '01:00', latency: 380, ttft: 72, itl: 28, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '02:00', latency: 420, ttft: 88, itl: 35, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '03:00', latency: 750, ttft: 165, itl: 68, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '04:00', latency: 680, ttft: 145, itl: 58, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '05:00', latency: 320, ttft: 65, itl: 25, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '06:00', latency: 290, ttft: 58, itl: 22, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '07:00', latency: 1200, ttft: 285, itl: 125, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '08:00', latency: 1450, ttft: 320, itl: 145, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '09:00', latency: 890, ttft: 195, itl: 82, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '10:00', latency: 340, ttft: 68, itl: 28, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '11:00', latency: 410, ttft: 92, itl: 38, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '12:00', latency: 1800, ttft: 380, itl: 165, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '13:00', latency: 1650, ttft: 350, itl: 152, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '14:00', latency: 1320, ttft: 295, itl: 135, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '15:00', latency: 280, ttft: 55, itl: 20, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '16:00', latency: 350, ttft: 75, itl: 30, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '17:00', latency: 1900, ttft: 420, itl: 185, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '18:00', latency: 1750, ttft: 385, itl: 168, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '19:00', latency: 920, ttft: 210, itl: 88, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '20:00', latency: 480, ttft: 95, itl: 42, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '21:00', latency: 380, ttft: 78, itl: 32, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '22:00', latency: 420, ttft: 85, itl: 38, latencySLA: 500, ttftSLA: 150, itlSLA: 50 },
    { time: '23:00', latency: 1600, ttft: 340, itl: 148, latencySLA: 500, ttftSLA: 150, itlSLA: 50 }
  ]
  
  // Latency distribution data with SLA zones
  const latencyDistributionData = [
    { range: '0-100ms', requests: 245, zone: 'good' },
    { range: '100-200ms', requests: 422, zone: 'good' },
    { range: '200-300ms', requests: 386, zone: 'good' },
    { range: '300-400ms', requests: 298, zone: 'good' },
    { range: '400-500ms', requests: 189, zone: 'good' },
    { range: '500-750ms', requests: 156, zone: 'warning' },
    { range: '750-1000ms', requests: 89, zone: 'warning' },
    { range: '1000-1500ms', requests: 42, zone: 'critical' },
    { range: '1500ms+', requests: 18, zone: 'critical' }
  ]
  
  // Helper function to get color for SLA zone
  const getColorForZone = (zone) => {
    switch (zone) {
      case 'good': return '#10B981'
      case 'warning': return '#F59E0B'
      case 'critical': return '#EF4444'
      default: return '#6B7280'
    }
  }
  
  // Handle latency bar click for drill-down
  const handleLatencyBarClick = (data) => {
    if (onOpenModelDetail) {
      // Open detailed view with latency range context
      onOpenModelDetail({
        type: 'latency-detail',
        range: data.range,
        zone: data.zone,
        requests: data.requests
      })
    }
  }

  // Handle performance metrics popover open/close
  const handleMetricClick = (event, modelIndex, metricType) => {
    event.stopPropagation()
    const rect = event.target.getBoundingClientRect()
    
    if (metricsPopover.isOpen && metricsPopover.modelIndex === modelIndex && metricsPopover.metricType === metricType) {
      // Close if clicking on the same cell and metric
      setMetricsPopover({ isOpen: false, modelIndex: null, position: { x: 0, y: 0 }, metricType: 'latency' })
    } else {
      // Calculate smart positioning
      const popoverWidth = 450 // Expected popover width
      const popoverHeight = 600 // Expected popover height (with expansion)
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scrollY = window.scrollY
      
      // Default position: to the right of the metric value
      let x = rect.right + 10
      let y = rect.top + scrollY
      
      // Check if popover would go off-screen to the right
      if (x + popoverWidth > viewportWidth) {
        // Position to the left of the metric value
        x = rect.left - popoverWidth - 10
      }
      
      // Ensure popover doesn't go off-screen to the left
      if (x < 10) {
        x = 10
      }
      
      // Check if popover would go off-screen at the bottom
      if (y + popoverHeight > scrollY + viewportHeight) {
        // Position above the metric value
        y = rect.top + scrollY - popoverHeight - 10
      }
      
      // Ensure popover doesn't go off-screen at the top
      if (y < scrollY + 10) {
        y = scrollY + 10
      }
      
      // Open popover at calculated position
      setMetricsPopover({
        isOpen: true,
        modelIndex: modelIndex,
        position: { x, y },
        metricType: metricType
      })
    }
  }



  // Handle model selection/deselection
  const handleModelToggle = (modelId) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId)
      } else {
        return [...prev, modelId]
      }
    })
  }

  // Handle row expansion toggle
  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index)
    } else {
      newExpandedRows.add(index)
    }
    setExpandedRows(newExpandedRows)
  }

  // Close popover when clicking outside
  const handleDocumentClick = (event) => {
    if (!event.target.closest('.metrics-popover') && !event.target.closest('.metrics-clickable')) {
      setMetricsPopover({ isOpen: false, modelIndex: null, position: { x: 0, y: 0 }, metricType: 'latency' })
    }
    // Close model dropdown when clicking outside
    if (!event.target.closest('.model-dropdown') && isModelDropdownOpen) {
      setIsModelDropdownOpen(false)
    }
    // Close trace model dropdown when clicking outside
    if (!event.target.closest('.trace-model-dropdown') && isTraceModelDropdownOpen) {
      setIsTraceModelDropdownOpen(false)
    }
  }

  // Handle window resize to reposition popover
  const handleWindowResize = () => {
    if (metricsPopover.isOpen) {
      // Close popover on resize to avoid positioning issues
      setMetricsPopover({ isOpen: false, modelIndex: null, position: { x: 0, y: 0 }, metricType: 'latency' })
    }
  }

  // Mini graph component for table cells
  const MiniGraph = ({ data, metricKey, threshold, color }) => {
    const maxValue = Math.max(...data.map(d => d[metricKey]))
    const points = data.slice(-8).map((d, i) => {
      const x = (i / 7) * 40
      const y = 20 - ((d[metricKey] / maxValue) * 18)
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width="40" height="20" className="inline-block ml-2">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={points}
        />
        {data.slice(-8).map((d, i) => {
          const x = (i / 7) * 40
          const y = 20 - ((d[metricKey] / maxValue) * 18)
          const isAboveThreshold = d[metricKey] > threshold
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1.5"
              fill={isAboveThreshold ? '#EF4444' : color}
            />
          )
        })}
      </svg>
    )
  }

  // Navigate to specific trace in Traces tab
  const handleViewTrace = (traceId) => {
    setMetricsPopover({ isOpen: false, modelIndex: null, position: { x: 0, y: 0 }, metricType: 'latency' })
    setActiveTab('logs')
    
    // Find the trace in the data and expand it
    setTimeout(() => {
      const allRequests = Object.values(apiKeyData).flat()
      const traceIndex = allRequests.findIndex(request => request.traceId === traceId)
      if (traceIndex !== -1) {
        const newExpandedRows = new Set([traceIndex])
        setExpandedRows(newExpandedRows)
        
        // Scroll to the trace (optional)
        const traceElement = document.querySelector(`[data-trace-id="${traceId}"]`)
        if (traceElement) {
          traceElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 100)
  }

  // Add document click listener and window resize handler
  useEffect(() => {
    if (metricsPopover.isOpen || isModelDropdownOpen || isTraceModelDropdownOpen) {
      document.addEventListener('click', handleDocumentClick)
      window.addEventListener('resize', handleWindowResize)
      return () => {
        document.removeEventListener('click', handleDocumentClick)
        window.removeEventListener('resize', handleWindowResize)
      }
    }
  }, [metricsPopover.isOpen, isModelDropdownOpen, isTraceModelDropdownOpen])
  // Sample data for charts
  const usageData = [
    { name: 'User 1', 'llama-70b-chat': 120, 'mistral-7b-instruct-v2': 50, 'stable-diffusion-xl-beta': 30 },
    { name: 'User 2', 'llama-70b-chat': 200, 'mistral-7b-instruct-v2': 100, 'stable-diffusion-xl-beta': 50 },
    { name: 'User 3', 'llama-70b-chat': 80, 'mistral-7b-instruct-v2': 60, 'stable-diffusion-xl-beta': 40 },
    { name: 'User 4', 'llama-70b-chat': 250, 'mistral-7b-instruct-v2': 120, 'stable-diffusion-xl-beta': 50 },
    { name: 'User 5', 'llama-70b-chat': 170, 'mistral-7b-instruct-v2': 80, 'stable-diffusion-xl-beta': 40 },
    { name: 'User 6', 'llama-70b-chat': 220, 'mistral-7b-instruct-v2': 110, 'stable-diffusion-xl-beta': 50 },
    { name: 'User 7', 'llama-70b-chat': 280, 'mistral-7b-instruct-v2': 120, 'stable-diffusion-xl-beta': 50 }
  ]

  const modelDetailChartData = [
    { name: '00:00', category1: 65, category2: 45, category3: 30 },
    { name: '02:00', category1: 70, category2: 50, category3: 35 },
    { name: '04:00', category1: 55, category2: 35, category3: 28 },
    { name: '06:00', category1: 80, category2: 60, category3: 42 },
    { name: '08:00', category1: 75, category2: 55, category3: 38 },
    { name: '10:00', category1: 85, category2: 65, category3: 45 }
  ]

  const utilizationData = [
    { name: '00:00', gpu: 65, memory: 45, category1: 30, category2: 25 },
    { name: '02:00', gpu: 70, memory: 50, category1: 35, category2: 30 },
    { name: '04:00', gpu: 55, memory: 35, category1: 28, category2: 22 },
    { name: '06:00', gpu: 80, memory: 60, category1: 42, category2: 35 },
    { name: '08:00', gpu: 75, memory: 55, category1: 38, category2: 32 },
    { name: '10:00', gpu: 85, memory: 65, category1: 45, category2: 38 }
  ]

  // Usage trend data for the line chart
  const usageTrendData = [
    { time: '9/10', requests: 45 },
    { time: '9/11', requests: 52 },
    { time: '9/12', requests: 48 },
    { time: '9/13', requests: 61 },
    { time: '9/14', requests: 55 },
    { time: '9/15', requests: 67 },
    { time: '9/16', requests: 58 }
  ]

  // Inference metrics data for selected models
  const inferenceMetricsData = {
    'granite-7b-instruct-v2': {
      tokenThroughput: [
        { time: '9/10', tokens: 12500 },
        { time: '9/11', tokens: 14200 },
        { time: '9/12', tokens: 13800 },
        { time: '9/13', tokens: 15600 },
        { time: '9/14', tokens: 14900 },
        { time: '9/15', tokens: 16200 },
        { time: '9/16', tokens: 15800 }
      ],
      queueLength: [
        { time: '9/10', queue: 3 },
        { time: '9/11', queue: 5 },
        { time: '9/12', queue: 2 },
        { time: '9/13', queue: 7 },
        { time: '9/14', queue: 4 },
        { time: '9/15', queue: 8 },
        { time: '9/16', queue: 6 }
      ],
      replicaCount: [
        { time: '9/10', replicas: 2 },
        { time: '9/11', replicas: 3 },
        { time: '9/12', replicas: 2 },
        { time: '9/13', replicas: 4 },
        { time: '9/14', replicas: 3 },
        { time: '9/15', replicas: 4 },
        { time: '9/16', replicas: 3 }
      ],
      latency: [
        { time: '9/10', p50: 820, p90: 1200 },
        { time: '9/11', p50: 750, p90: 1100 },
        { time: '9/12', p50: 890, p90: 1300 },
        { time: '9/13', p50: 680, p90: 980 },
        { time: '9/14', p50: 920, p90: 1400 },
        { time: '9/15', p50: 710, p90: 1050 },
        { time: '9/16', p50: 850, p90: 1250 }
      ],
      successfulRequests: [
        { time: '9/10', length: 45, stop: 38 },
        { time: '9/11', length: 52, stop: 44 },
        { time: '9/12', length: 48, stop: 40 },
        { time: '9/13', length: 61, stop: 52 },
        { time: '9/14', length: 55, stop: 47 },
        { time: '9/15', length: 67, stop: 58 },
        { time: '9/16', length: 58, stop: 50 }
      ],
      cacheUtilization: [
        { time: '9/10', gpuCache: 2.1, cpuCache: 1.8 },
        { time: '9/11', gpuCache: 2.8, cpuCache: 2.2 },
        { time: '9/12', gpuCache: 2.3, cpuCache: 1.9 },
        { time: '9/13', gpuCache: 3.2, cpuCache: 2.6 },
        { time: '9/14', gpuCache: 2.9, cpuCache: 2.4 },
        { time: '9/15', gpuCache: 3.5, cpuCache: 2.8 },
        { time: '9/16', gpuCache: 3.1, cpuCache: 2.5 }
      ]
    },
    'llama-70b-chat': {
      tokenThroughput: [
        { time: '9/10', tokens: 8900 },
        { time: '9/11', tokens: 9800 },
        { time: '9/12', tokens: 9200 },
        { time: '9/13', tokens: 10500 },
        { time: '9/14', tokens: 9700 },
        { time: '9/15', tokens: 11200 },
        { time: '9/16', tokens: 10800 }
      ],
      queueLength: [
        { time: '9/10', queue: 5 },
        { time: '9/11', queue: 8 },
        { time: '9/12', queue: 4 },
        { time: '9/13', queue: 12 },
        { time: '9/14', queue: 7 },
        { time: '9/15', queue: 15 },
        { time: '9/16', queue: 10 }
      ],
      replicaCount: [
        { time: '9/10', replicas: 3 },
        { time: '9/11', replicas: 4 },
        { time: '9/12', replicas: 3 },
        { time: '9/13', replicas: 5 },
        { time: '9/14', replicas: 4 },
        { time: '9/15', replicas: 6 },
        { time: '9/16', replicas: 5 }
      ],
      latency: [
        { time: '9/10', p50: 1850, p90: 2400 },
        { time: '9/11', p50: 1720, p90: 2200 },
        { time: '9/12', p50: 1950, p90: 2600 },
        { time: '9/13', p50: 1680, p90: 2100 },
        { time: '9/14', p50: 2100, p90: 2800 },
        { time: '9/15', p50: 1750, p90: 2300 },
        { time: '9/16', p50: 1900, p90: 2500 }
      ],
      successfulRequests: [
        { time: '9/10', length: 32, stop: 28 },
        { time: '9/11', length: 38, stop: 33 },
        { time: '9/12', length: 35, stop: 30 },
        { time: '9/13', length: 45, stop: 40 },
        { time: '9/14', length: 41, stop: 36 },
        { time: '9/15', length: 52, stop: 46 },
        { time: '9/16', length: 48, stop: 42 }
      ],
      cacheUtilization: [
        { time: '9/10', gpuCache: 4.2, cpuCache: 3.1 },
        { time: '9/11', gpuCache: 4.8, cpuCache: 3.6 },
        { time: '9/12', gpuCache: 4.4, cpuCache: 3.3 },
        { time: '9/13', gpuCache: 5.5, cpuCache: 4.2 },
        { time: '9/14', gpuCache: 5.1, cpuCache: 3.9 },
        { time: '9/15', gpuCache: 6.2, cpuCache: 4.8 },
        { time: '9/16', gpuCache: 5.8, cpuCache: 4.4 }
      ]
    },
    'mistral-7b-instruct-v2': {
      tokenThroughput: [
        { time: '9/10', tokens: 11200 },
        { time: '9/11', tokens: 12800 },
        { time: '9/12', tokens: 11900 },
        { time: '9/13', tokens: 13500 },
        { time: '9/14', tokens: 12600 },
        { time: '9/15', tokens: 14100 },
        { time: '9/16', tokens: 13700 }
      ],
      queueLength: [
        { time: '9/10', queue: 2 },
        { time: '9/11', queue: 4 },
        { time: '9/12', queue: 3 },
        { time: '9/13', queue: 6 },
        { time: '9/14', queue: 5 },
        { time: '9/15', queue: 7 },
        { time: '9/16', queue: 4 }
      ],
      replicaCount: [
        { time: '9/10', replicas: 2 },
        { time: '9/11', replicas: 3 },
        { time: '9/12', replicas: 2 },
        { time: '9/13', replicas: 3 },
        { time: '9/14', replicas: 3 },
        { time: '9/15', replicas: 4 },
        { time: '9/16', replicas: 3 }
      ],
      latency: [
        { time: '9/10', p50: 650, p90: 950 },
        { time: '9/11', p50: 580, p90: 850 },
        { time: '9/12', p50: 720, p90: 1050 },
        { time: '9/13', p50: 520, p90: 780 },
        { time: '9/14', p50: 780, p90: 1150 },
        { time: '9/15', p50: 610, p90: 890 },
        { time: '9/16', p50: 690, p90: 980 }
      ],
      // New metrics for additional charts
      successfulRequests: [
        { time: '9/10', length: 58, stop: 52 },
        { time: '9/11', length: 65, stop: 58 },
        { time: '9/12', length: 61, stop: 54 },
        { time: '9/13', length: 72, stop: 65 },
        { time: '9/14', length: 68, stop: 61 },
        { time: '9/15', length: 78, stop: 70 },
        { time: '9/16', length: 74, stop: 66 }
      ],
      cacheUtilization: [
        { time: '9/10', gpuCache: 1.8, cpuCache: 1.4 },
        { time: '9/11', gpuCache: 2.2, cpuCache: 1.7 },
        { time: '9/12', gpuCache: 2.0, cpuCache: 1.5 },
        { time: '9/13', gpuCache: 2.8, cpuCache: 2.1 },
        { time: '9/14', gpuCache: 2.5, cpuCache: 1.9 },
        { time: '9/15', gpuCache: 3.1, cpuCache: 2.4 },
        { time: '9/16', gpuCache: 2.9, cpuCache: 2.2 }
      ]
    }
  }

  // Box plot data for latency distribution charts (based on selected models)
  const getLatencyBoxPlotData = () => {
    if (selectedModels.length === 0) return []
    
    return selectedModels.map(modelId => {
      const modelName = availableModels.find(m => m.id === modelId)?.name || modelId
      
      // Generate realistic latency distribution data based on model type
      let baseLatency = 8 // Default for 7B models
      if (modelId.includes('70b')) baseLatency = 12
      else if (modelId.includes('34b')) baseLatency = 10
      else if (modelId.includes('180b')) baseLatency = 18
      else if (modelId.includes('stable-diffusion')) baseLatency = 15
      
      return {
        model: modelName.split('-')[0] + '...',
        p99: baseLatency + Math.random() * 3,
        p95: baseLatency * 0.85 + Math.random() * 2,
        p90: baseLatency * 0.7 + Math.random() * 1.5,
        p50: baseLatency * 0.5 + Math.random() * 1
      }
    })
  }

  const getTTFTBoxPlotData = () => {
    if (selectedModels.length === 0) return []
    
    return selectedModels.map(modelId => {
      const modelName = availableModels.find(m => m.id === modelId)?.name || modelId
      
      // Generate realistic TTFT data based on model type  
      let baseTTFT = 1.0 // Default for 7B models
      if (modelId.includes('70b')) baseTTFT = 1.8
      else if (modelId.includes('34b')) baseTTFT = 1.4
      else if (modelId.includes('180b')) baseTTFT = 3.2
      else if (modelId.includes('stable-diffusion')) baseTTFT = 2.8
      
      return {
        model: modelName.split('-')[0] + '...',
        p99: baseTTFT + Math.random() * 0.5,
        p95: baseTTFT * 0.85 + Math.random() * 0.3,
        p90: baseTTFT * 0.7 + Math.random() * 0.2,
        p50: baseTTFT * 0.5 + Math.random() * 0.1
      }
    })
  }

  // Generate aggregated data for selected models
  const getAggregatedInferenceData = (metric) => {
    if (selectedModels.length === 0) return []
    
    const timePoints = ['9/10', '9/11', '9/12', '9/13', '9/14', '9/15', '9/16']
    
    return timePoints.map(time => {
      const dataPoint = { time }
      
      selectedModels.forEach((modelId, index) => {
        const modelData = inferenceMetricsData[modelId]
        if (modelData && modelData[metric]) {
          const timeData = modelData[metric].find(d => d.time === time)
          if (timeData) {
            // Add data for each selected model
            Object.keys(timeData).forEach(key => {
              if (key !== 'time') {
                dataPoint[`${modelId}_${key}`] = timeData[key]
              }
            })
          }
        }
      })
      
      return dataPoint
    })
  }

  // Enhanced user request data that connects with popover responses
  const apiKeyData = {
    'd789e0b3fa84h6i9j02k34l5m67n89o0': [
      // This matches the first response in recentResponseMetrics
      { 
        user: 'patient_user', 
        timestamp: '2025-09-16 18:49:01', 
        promptTokens: '204', 
        model: 'granite-7b-instruct-v2', 
        completion: '85%', 
        request: 'Hi, I have an appointment for a routine blood test next week. Is there anything specific I need to do to prepare for it?',
        traceId: 'a4b1c2d3-e4f5-g6h7-i8j9-k0l1m2n3o4p5',
        duration: '4.81s',
        status: 'success',
        services: ['api-gateway', 'guardrails-service', 'rag-pipeline', 'document-retriever', 'llm-service'],
        errorCount: 0,
        retryCount: 0,
        queueTime: '0.02s',
        inferenceTime: '1.62s',
        networkTime: '0.15s',
        // Enhanced metrics from popover
        tokenUsage: 204,
        tokensPerSecond: 22,
        ttif: 243,
        responseTime: 0.3,
        spans: [
          { spanId: 'span_001', operationName: 'process_user_request', duration: '4.81s', status: 'success', service: 'api-gateway', startTime: 0, endTime: 4810, info: 'Total request processing pipeline' },
          { spanId: 'span_002', operationName: 'run_input_guardrails', duration: '0.26s', status: 'success', service: 'guardrails-service', startTime: 0, endTime: 255, info: 'All input guardrails passed. Intent: ask_appointment_preparation' },
          { spanId: 'span_003', operationName: 'execute_rag_pipeline', duration: '1.18s', status: 'success', service: 'rag-pipeline', startTime: 255, endTime: 1437 },
          { spanId: 'span_004', operationName: 'retrieve_documents', duration: '1.01s', status: 'success', service: 'document-retriever', startTime: 1437, endTime: 2449, info: 'Retriever found 1 relevant document chunk. Attributes: {"doc_id": "PatientLeaflet-BTest-v3.2.pdf", "score": 0.91}' },
          { spanId: 'span_005', operationName: 'call_llm', duration: '1.62s', status: 'success', service: 'llm-service', startTime: 2449, endTime: 4072, info: 'METRIC: llm.output.tokens = 85 token' },
          { spanId: 'span_006', operationName: 'run_output_guardrails', duration: '0.003s', status: 'success', service: 'guardrails-service', startTime: 4072, endTime: 4075 }
        ]
      },
      // This matches the second response in recentResponseMetrics
      { 
        user: 'health_user', 
        timestamp: '2025-09-16 18:48:45', 
        promptTokens: '156', 
        model: 'granite-7b-instruct-v2', 
        completion: '92%', 
        request: 'What are the side effects of the medication prescribed?',
        traceId: 'b5c6d7e8-f9g0-h1i2-j3k4-l5m6n7o8p9q0',
        duration: '3.42s',
        status: 'success',
        services: ['api-gateway', 'guardrails-service', 'rag-pipeline', 'document-retriever', 'llm-service'],
        errorCount: 0,
        retryCount: 0,
        queueTime: '0.01s',
        inferenceTime: '1.20s',
        networkTime: '0.12s',
        // Enhanced metrics from popover
        tokenUsage: 156,
        tokensPerSecond: 28,
        ttif: 198,
        responseTime: 0.25,
        spans: [
          { spanId: 'span_001', operationName: 'process_user_request', duration: '3.42s', status: 'success', service: 'api-gateway', startTime: 0, endTime: 3420 },
          { spanId: 'span_002', operationName: 'run_input_guardrails', duration: '0.18s', status: 'success', service: 'guardrails-service', startTime: 0, endTime: 180 },
          { spanId: 'span_003', operationName: 'execute_rag_pipeline', duration: '0.89s', status: 'success', service: 'rag-pipeline', startTime: 180, endTime: 1070 },
          { spanId: 'span_004', operationName: 'retrieve_documents', duration: '0.75s', status: 'success', service: 'document-retriever', startTime: 1070, endTime: 1820 },
          { spanId: 'span_005', operationName: 'call_llm', duration: '1.20s', status: 'success', service: 'llm-service', startTime: 1820, endTime: 3020 },
          { spanId: 'span_006', operationName: 'run_output_guardrails', duration: '0.002s', status: 'success', service: 'guardrails-service', startTime: 3020, endTime: 3022 }
        ]
      },
      // This matches the third response in recentResponseMetrics
      { 
        user: 'complex_user', 
        timestamp: '2025-09-16 18:48:12', 
        promptTokens: '312', 
        model: 'granite-7b-instruct-v2', 
        completion: '78%', 
        request: 'Can you explain the complex interaction between multiple medications I am taking?',
        traceId: 'c7d8e9f0-g1h2-i3j4-k5l6-m7n8o9p0q1r2',
        duration: '6.80s',
        status: 'warning',
        services: ['api-gateway', 'guardrails-service', 'rag-pipeline', 'document-retriever', 'llm-service'],
        errorCount: 0,
        retryCount: 1,
        queueTime: '0.15s',
        inferenceTime: '2.80s',
        networkTime: '0.25s',
        // Enhanced metrics from popover
        tokenUsage: 312,
        tokensPerSecond: 18,
        ttif: 456,
        responseTime: 0.68,
        spans: [
          { spanId: 'span_001', operationName: 'process_user_request', duration: '6.80s', status: 'success', service: 'api-gateway', startTime: 0, endTime: 6800 },
          { spanId: 'span_002', operationName: 'run_input_guardrails', duration: '0.42s', status: 'success', service: 'guardrails-service', startTime: 0, endTime: 420 },
          { spanId: 'span_003', operationName: 'execute_rag_pipeline', duration: '2.15s', status: 'warning', service: 'rag-pipeline', startTime: 420, endTime: 2570 },
          { spanId: 'span_004', operationName: 'retrieve_documents', duration: '1.89s', status: 'success', service: 'document-retriever', startTime: 2570, endTime: 4460, info: 'Multiple document chunks retrieved for complex query' },
          { spanId: 'span_005', operationName: 'call_llm', duration: '2.80s', status: 'success', service: 'llm-service', startTime: 4460, endTime: 7260, info: 'Complex reasoning required, extended processing time' },
          { spanId: 'span_006', operationName: 'run_output_guardrails', duration: '0.008s', status: 'success', service: 'guardrails-service', startTime: 7260, endTime: 7268 }
        ]
      },
      // Additional traces for the production API key
      { 
        user: 'enterprise_user', 
        timestamp: '2025-09-16 18:47:23', 
        promptTokens: '89', 
        model: 'granite-7b-instruct-v2', 
        completion: '95%', 
        request: 'What is the recommended dosage for my medication?',
        traceId: 'd8e9f0a1-h2i3-j4k5-l6m7-n8o9p0q1r2s3',
        duration: '2.15s',
        status: 'success',
        services: ['api-gateway', 'guardrails-service', 'rag-pipeline', 'document-retriever', 'llm-service'],
        errorCount: 0,
        retryCount: 0,
        queueTime: '0.01s',
        inferenceTime: '0.98s',
        networkTime: '0.08s',
        tokenUsage: 89,
        tokensPerSecond: 35,
        ttif: 156,
        responseTime: 0.18,
        spans: [
          { spanId: 'span_001', operationName: 'process_user_request', duration: '2.15s', status: 'success', service: 'api-gateway', startTime: 0, endTime: 2150 },
          { spanId: 'span_002', operationName: 'run_input_guardrails', duration: '0.12s', status: 'success', service: 'guardrails-service', startTime: 0, endTime: 120 },
          { spanId: 'span_003', operationName: 'execute_rag_pipeline', duration: '0.65s', status: 'success', service: 'rag-pipeline', startTime: 120, endTime: 770 },
          { spanId: 'span_004', operationName: 'retrieve_documents', duration: '0.45s', status: 'success', service: 'document-retriever', startTime: 770, endTime: 1220 },
          { spanId: 'span_005', operationName: 'call_llm', duration: '0.98s', status: 'success', service: 'llm-service', startTime: 1220, endTime: 2200 },
          { spanId: 'span_006', operationName: 'run_output_guardrails', duration: '0.001s', status: 'success', service: 'guardrails-service', startTime: 2200, endTime: 2201 }
        ]
      },
      // Additional sample traces for production API key
      { 
        user: 'system_admin', 
        timestamp: '2025-09-16 17:32:15', 
        promptTokens: '124', 
        model: 'granite-7b-instruct-v2', 
        completion: '88%', 
        request: 'Generate system maintenance report for database optimization',
        traceId: 'e9f0a1b2-i3j4-k5l6-m7n8-o9p0q1r2s3t4',
        duration: '1.89s',
        status: 'success',
        services: ['api-gateway', 'guardrails-service', 'rag-pipeline', 'document-retriever', 'llm-service'],
        errorCount: 0,
        retryCount: 0,
        queueTime: '0.03s',
        inferenceTime: '0.72s',
        networkTime: '0.09s',
        tokenUsage: 124,
        tokensPerSecond: 31,
        ttif: 145,
        responseTime: 0.22,
        spans: [
          { spanId: 'span_011', operationName: 'process_user_request', duration: '1.89s', status: 'success', service: 'api-gateway', startTime: 0, endTime: 1890 },
          { spanId: 'span_012', operationName: 'run_input_guardrails', duration: '0.08s', status: 'success', service: 'guardrails-service', startTime: 0, endTime: 80 },
          { spanId: 'span_013', operationName: 'execute_rag_pipeline', duration: '0.45s', status: 'success', service: 'rag-pipeline', startTime: 80, endTime: 530 },
          { spanId: 'span_014', operationName: 'retrieve_documents', duration: '0.32s', status: 'success', service: 'document-retriever', startTime: 530, endTime: 850 },
          { spanId: 'span_015', operationName: 'call_llm', duration: '0.72s', status: 'success', service: 'llm-service', startTime: 850, endTime: 1570 },
          { spanId: 'span_016', operationName: 'run_output_guardrails', duration: '0.001s', status: 'success', service: 'guardrails-service', startTime: 1570, endTime: 1571 }
        ]
      }
    ],
    'a986c7d6ad42e3bfb9a34a9b8ba4ca3': [
      { user: 'dev_team_lead', timestamp: '2025-09-16 19:12:34', promptTokens: '1,247', model: 'llama-70b-chat', completion: '95%', request: 'Review code architecture and suggest improvements' },
      { user: 'qa_engineer', timestamp: '2025-09-16 18:45:22', promptTokens: '632', model: 'mistral-7b-instruct-v2', completion: '88%', request: 'Generate test cases for API endpoints' },
      { user: 'product_manager', timestamp: '2025-09-16 17:23:11', promptTokens: '892', model: 'granite-7b-instruct-v2', completion: '91%', request: 'Analyze user feedback and create feature roadmap' },
      { user: 'senior_dev', timestamp: '2025-09-16 16:58:45', promptTokens: '334', model: 'llama-70b-chat', completion: '87%', request: 'Debug performance issues in database queries' }
    ],
    'b123f8e9bc58f2d4e67a89c0d1e2f3a4': [
      { user: 'production_user', timestamp: '2025-09-16 20:15:33', promptTokens: '2,145', model: 'granite-7b-instruct-v2', completion: '96%', request: 'Process customer service inquiries and generate responses' },
      { user: 'api_client_01', timestamp: '2025-09-16 19:47:22', promptTokens: '1,523', model: 'llama-70b-chat', completion: '93%', request: 'Generate automated email responses for support tickets' },
      { user: 'batch_processor', timestamp: '2025-09-16 18:31:15', promptTokens: '756', model: 'mistral-7b-instruct-v2', completion: '89%', request: 'Batch process document classification tasks' },
      { user: 'analytics_svc', timestamp: '2025-09-16 17:14:27', promptTokens: '1,089', model: 'granite-7b-instruct-v2', completion: '94%', request: 'Analyze user behavior patterns and generate insights' },
      { user: 'ml_pipeline', timestamp: '2025-09-16 16:23:41', promptTokens: '445', model: 'llama-70b-chat', completion: '90%', request: 'Feature extraction for machine learning model training' },
      { user: 'data_ingestion', timestamp: '2025-09-16 15:56:18', promptTokens: '612', model: 'mistral-7b-instruct-v2', completion: '86%', request: 'Clean and normalize incoming data streams' }
    ],
    'c456d9a2ef73g5h8i91j23k4l56m78n9': [
      { user: 'legacy_system', timestamp: '2025-09-15 23:45:12', promptTokens: '89', model: 'granite-7b-instruct-v2', completion: '45%', request: 'Migrate legacy data format to new schema' },
      { user: 'maintenance_bot', timestamp: '2025-09-15 22:33:45', promptTokens: '156', model: 'mistral-7b-instruct-v2', completion: '52%', request: 'Generate system maintenance reports' }
    ],
    'e012f1c4gb95i7j0k13l45m6n78o90p1': [
      { user: 'admin_user', timestamp: '2025-09-16 21:08:15', promptTokens: '3,247', model: 'llama-70b-chat', completion: '98%', request: 'Generate comprehensive system performance report' },
      { user: 'system_monitor', timestamp: '2025-09-16 20:42:33', promptTokens: '1,876', model: 'granite-7b-instruct-v2', completion: '97%', request: 'Monitor cluster health and resource utilization' },
      { user: 'backup_service', timestamp: '2025-09-16 19:25:47', promptTokens: '924', model: 'mistral-7b-instruct-v2', completion: '95%', request: 'Validate backup integrity and generate status report' },
      { user: 'health_checker', timestamp: '2025-09-16 18:17:22', promptTokens: '567', model: 'llama-70b-chat', completion: '91%', request: 'Perform health checks on all system components' },
      { user: 'log_aggregator', timestamp: '2025-09-16 17:09:38', promptTokens: '1,234', model: 'granite-7b-instruct-v2', completion: '93%', request: 'Aggregate and analyze system logs for anomalies' },
      { user: 'metric_collector', timestamp: '2025-09-16 16:42:15', promptTokens: '445', model: 'mistral-7b-instruct-v2', completion: '88%', request: 'Collect and process performance metrics' },
      { user: 'alert_manager', timestamp: '2025-09-16 15:33:51', promptTokens: '789', model: 'llama-70b-chat', completion: '92%', request: 'Analyze system alerts and prioritize critical issues' }
    ]
  }

  // Get current user requests based on selected API key
  const currentUserRequests = selectedApiKey 
    ? apiKeyData[selectedApiKey] || []
    : Object.values(apiKeyData).flat() // Show all APIs when none selected

  const modelInventoryData = [
    { 
      model: 'granite-7b-instruct-v2', 
      project: 'llm-TGIS', 
      runtime: 'vLLM', 
      totalRequests: '273962',
      p90Latency: '820ms', 
      p90TTFT: '120ms',
      p90ITL: '45ms',
      errorRate: '3.34%', 
      resources: 'GPU 1/1 CPU 5/6', 
      status: 'Running',
      apiKey: 'production',
      serviceType: 'Server-based',
      modelType: 'Generative'
    },
    {
      model: 'granite-34b-code-instruct',
      project: 'llm-TGIS',
      runtime: 'KServe',
      totalRequests: '273962',
      p90Latency: '950ms',
      p90TTFT: '145ms',
      p90ITL: '52ms',
      errorRate: '3.34%',
      resources: 'GPU 1/1 CPU 7/8',
      status: 'Running',
      apiKey: 'production',
      serviceType: 'Server-based',
      modelType: 'Generative'
    },
    {
      model: 'llama-70b-chat',
      project: 'llm-TGIS',
      runtime: 'llm-d',
      totalRequests: '185432',
      p90Latency: '1850ms',
      p90TTFT: '280ms',
      p90ITL: '95ms',
      errorRate: '2.18%',
      resources: 'GPU 2/2 CPU 4/6',
      status: 'Running',
      apiKey: 'development',
      serviceType: 'Server-based',
      modelType: 'Generative'
    },
    {
      model: 'mistral-7b-instruct-v2',
      project: 'llm-TGIS',
      runtime: 'vLLM',
      totalRequests: '156890',
      p90Latency: '650ms',
      p90TTFT: '95ms',
      p90ITL: '38ms',
      errorRate: '1.94%',
      resources: 'GPU 1/1 CPU 3/6',
      status: 'Running',
      apiKey: 'development',
      serviceType: 'Server-based',
      modelType: 'Generative'
    },
    {
      model: 'stable-diffusion-xl-beta',
      project: 'diffusion-models',
      runtime: 'KServe',
      totalRequests: '98765',
      p90Latency: '3200ms',
      p90TTFT: '450ms',
      p90ITL: '180ms',
      errorRate: '5.67%',
      resources: 'GPU 2/1 CPU 6/8',
      status: 'Paused',
      apiKey: 'staging',
      serviceType: 'Server-based',
      modelType: 'Generative'
    },
    {
      model: 'codellama-34b-instruct',
      project: 'code-generation',
      runtime: 'vLLM',
      totalRequests: '67543',
      p90Latency: '1420ms',
      p90TTFT: '195ms',
      p90ITL: '78ms',
      errorRate: '4.23%',
      resources: 'GPU 1/1 CPU 5/8',
      status: 'Degraded',
      apiKey: 'staging',
      serviceType: 'Server-based',
      modelType: 'Predictive'
    },
    {
      model: 'falcon-180b-chat',
      project: 'conversational-ai',
      runtime: 'llm-d',
      totalRequests: '234567',
      p90Latency: '2850ms',
      p90TTFT: '380ms',
      p90ITL: '125ms',
      errorRate: '2.89%',
      resources: 'GPU 4/4 CPU 8/8',
      status: 'Running',
      apiKey: 'analytics',
      serviceType: 'Server-based',
      modelType: 'Predictive'
    }
  ]

  // Filter model inventory data based on selected filters
  const getFilteredModelInventoryData = () => {
    let filtered = modelInventoryData

    // Filter by selected models if any are selected
    if (selectedModels.length > 0) {
      filtered = filtered.filter(model => selectedModels.includes(model.model))
    }

    // Filter by runtime if one is selected
    if (selectedRuntime) {
      filtered = filtered.filter(model => model.runtime === selectedRuntime)
    }


    // Filter by model type if one is selected
    if (selectedModelType) {
      filtered = filtered.filter(model => model.modelType === selectedModelType)
    }

    // Filter by service type if one is selected
    if (selectedServiceType) {
      filtered = filtered.filter(model => model.serviceType === selectedServiceType)
    }

    // Filter by API key if one is selected (moved to last position)
    if (selectedApiKey) {
      filtered = filtered.filter(model => model.apiKey === selectedApiKey)
    }

    return filtered
  }

  const filteredModelInventoryData = getFilteredModelInventoryData()

  // Generate Usage per Group data based on selections
  const generateGroupUsageData = () => {
    const baseData = {
      'Users': [
        { name: 'User 1', Tokens: 15420, Requests: 120, Cost: 45.60 },
        { name: 'User 2', Tokens: 28750, Requests: 200, Cost: 78.25 },
        { name: 'User 3', Tokens: 12300, Requests: 80, Cost: 32.40 },
        { name: 'User 4', Tokens: 35600, Requests: 250, Cost: 98.50 },
        { name: 'User 5', Tokens: 21800, Requests: 170, Cost: 62.30 },
        { name: 'User 6', Tokens: 31200, Requests: 220, Cost: 85.40 },
        { name: 'User 7', Tokens: 42500, Requests: 280, Cost: 124.75 }
      ],
      'Projects': [
        { name: 'Chat Bot', Tokens: 45600, Requests: 380, Cost: 142.80 },
        { name: 'Content Gen', Tokens: 62300, Requests: 520, Cost: 195.50 },
        { name: 'Code Assistant', Tokens: 38900, Requests: 310, Cost: 118.70 },
        { name: 'Image Gen', Tokens: 28400, Requests: 240, Cost: 89.20 },
        { name: 'Analytics', Tokens: 35700, Requests: 290, Cost: 112.65 }
      ],
      'API Keys': [
        { name: 'Production', Tokens: 89400, Requests: 750, Cost: 278.45 },
        { name: 'Development', Tokens: 52300, Requests: 420, Cost: 163.20 },
        { name: 'Staging', Tokens: 34600, Requests: 280, Cost: 108.30 },
        { name: 'Analytics', Tokens: 28700, Requests: 230, Cost: 89.85 }
      ]
    }
    
    return baseData[groupBy] || baseData['Users']
  }

  // Generate Usage Trends data based on selection
  const generateTrendData = () => {
    const baseData = {
      'Total Requests': [
        { time: '9/10', value: 45 },
        { time: '9/11', value: 52 },
        { time: '9/12', value: 48 },
        { time: '9/13', value: 61 },
        { time: '9/14', value: 55 },
        { time: '9/15', value: 67 },
        { time: '9/16', value: 58 }
      ],
      'Total Tokens': [
        { time: '9/10', value: 4500 },
        { time: '9/11', value: 5200 },
        { time: '9/12', value: 4800 },
        { time: '9/13', value: 6100 },
        { time: '9/14', value: 5500 },
        { time: '9/15', value: 6700 },
        { time: '9/16', value: 5800 }
      ],
      'Total Cost': [
        { time: '9/10', value: 14.5 },
        { time: '9/11', value: 16.8 },
        { time: '9/12', value: 15.2 },
        { time: '9/13', value: 19.7 },
        { time: '9/14', value: 17.8 },
        { time: '9/15', value: 21.6 },
        { time: '9/16', value: 18.7 }
      ]
    }
    
    // Use the groupMetrics filter to determine which trend data to show
    const metricMap = {
      'Tokens': 'Total Tokens',
      'Requests': 'Total Requests', 
      'Cost': 'Total Cost'
    }
    return baseData[metricMap[groupMetrics]] || baseData['Total Requests']
  }

  const groupUsageData = generateGroupUsageData()
  const trendData = generateTrendData()

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button className="hover:text-blue-600 cursor-pointer">Home</button>
        <span>/</span>
        <button className="hover:text-blue-600 cursor-pointer">Observe & monitor</button>
        <span>/</span>
        <span className="text-gray-900">Dashboard</span>
      </div>

      {/* Page Header with Real-time Status */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Real-time Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600 font-medium">Live</span>
            </div>
            {/* Last Updated */}
            <span className="text-xs text-gray-500">Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        <p className="text-gray-600">Monitor the health and performance of your AI workloads and infrastructure with comprehensive observability.</p>
        
      </div>

      {/* AI Workloads Observability Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <h3 className="text-base font-semibold text-blue-900">AI Workloads Observability</h3>
              <span className="inline-flex px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-full">GUIDE</span>
            </div>
            <p className="text-sm text-blue-800 mb-4 leading-relaxed">
              Monitor and optimize your AI model deployments with comprehensive observability across infrastructure, performance, and usage patterns. 
              Track latency, throughput, error rates, and resource utilization for your AI model deployments.
            </p>
            
            {/* Tabs Guide */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-blue-900">CLUSTERS</span>
                </div>
                <p className="text-xs text-blue-700">Infrastructure health, GPU utilization, and system metrics</p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-blue-900">MODELS</span>
                </div>
                <p className="text-xs text-blue-700">Model inventory, performance analytics, and deployment status</p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-blue-900">USAGE</span>
                </div>
                <p className="text-xs text-blue-700">Request patterns, token usage, and cost analysis by groups</p>
              </div>
              
              <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-blue-100">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-blue-900">TRACES</span>
                </div>
                <p className="text-xs text-blue-700">Distributed tracing, request timelines, and error investigation</p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <span className="text-xs text-blue-700">💡 <strong>Tip:</strong> Use the filters above each tab to drill down into specific models, services, or API keys</span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <button className="text-blue-600 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Overview Cards with Trends */}
      <div className="bg-white rounded-lg p-4 border">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900">Overview</h4>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-500">All systems operational</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
          {/* Clusters Tab Metrics */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <span className="text-blue-700 text-xs font-medium">CLUSTERS</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">8 Nodes</div>
              <div className="flex items-center space-x-1 text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7H7v10" />
                </svg>
                <span className="text-xs">+2</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <span className="text-blue-700 text-xs font-medium">COMPUTE</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">24 GPUs</div>
              <div className="flex items-center space-x-1 text-orange-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span className="text-xs">58% util</span>
              </div>
            </div>
          </div>

          {/* Models Tab Metrics */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <span className="text-green-700 text-xs font-medium">MODELS</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">4 Active</div>
              <div className="flex items-center space-x-1 text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7H7v10" />
                </svg>
                <span className="text-xs">+1</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <span className="text-green-700 text-xs font-medium">P90 LATENCY</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">820ms</div>
              <div className="flex items-center space-x-1 text-yellow-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7H7v10" />
                </svg>
                <span className="text-xs">+45ms</span>
              </div>
            </div>
          </div>

          {/* Usage Tab Metrics */}
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <span className="text-purple-700 text-xs font-medium">REQUESTS</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">2.8K</div>
              <div className="flex items-center space-x-1 text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7H7v10" />
                </svg>
                <span className="text-xs">+12%</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <span className="text-purple-700 text-xs font-medium">TOKENS</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">1.2M</div>
              <div className="flex items-center space-x-1 text-green-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l10-10M17 7H7v10" />
                </svg>
                <span className="text-xs">+8%</span>
              </div>
            </div>
          </div>

          {/* Traces Tab Metrics */}
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <span className="text-orange-700 text-xs font-medium">COST PER REQUEST</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">$0.023</div>
              <div className="flex items-center space-x-1 text-red-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
                <span className="text-xs">+$0.002</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <span className="text-orange-700 text-xs font-medium">ERROR RATE</span>
            <div className="flex items-center justify-between mt-1">
              <div className="font-semibold">0.8%</div>
              <div className="flex items-center space-x-1 text-red-600">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17l-10-10M7 17l10-10" />
                </svg>
                <span className="text-xs">-0.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('clusters')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'clusters'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cluster
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'models'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Models
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'usage'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Usage
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Traces
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'clusters' && (
        <div className="space-y-6">
          {/* Top Section - Details and Inventory */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Details Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Cluster Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Provider</span>
                  <p className="text-sm text-gray-900">AWS</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">OpenShift version</span>
                  <p className="text-sm text-gray-900">2.24.0</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Channel</span>
                  <p className="text-sm text-gray-900">fast</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">API server</span>
                  <p className="text-sm text-gray-900">https://api.cluster-z84h8.z84h8.sandbox.opentlc.com</p>
                </div>
                <div>
                  <button className="text-sm text-blue-600 hover:text-blue-800">View settings →</button>
                </div>
              </div>
            </div>

            {/* Cluster Inventory with Job Context */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Resource Inventory</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">3 Nodes</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-blue-600 font-medium">3</span>
                    <div className="text-xs text-gray-500">2 with active jobs</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">24 GPUs</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-blue-600 font-medium">24</span>
                    <div className="text-xs text-gray-500">10 running jobs</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Training Jobs</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-blue-600 font-medium">12 active</span>
                    <div className="text-xs text-gray-500">8 queued</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">30 Pods</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-blue-600 font-medium">30</span>
                    <div className="text-xs text-gray-500">18 job-related</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">12 PVs</span>
                  </div>
                  <span className="text-sm text-blue-600">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">18 PVCs</span>
                  </div>
                  <span className="text-sm text-blue-600">18</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Charts and Metrics */}
          <div className="space-y-6">
            {/* Cluster Utilizations */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Utilizations</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Time Range:</span>
                  <select 
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                  >
                    <option value="1h">Last 1 Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="3m">Last 3 Months</option>
                    <option value="6m">Last 6 Months</option>
                    <option value="1y">Last 1 Year</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">GPU</span>
                    <span className="text-sm text-gray-500">100%</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">77% available of 80</div>
                  <div className="h-16 bg-blue-50 rounded">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={utilizationData.slice(0, 10)}>
                        <Area type="monotone" dataKey="gpu" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">CPU</span>
                    <span className="text-sm text-gray-500">50%</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">71% available of 80</div>
                  <div className="h-16 bg-blue-50 rounded">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={utilizationData.slice(0, 10)}>
                        <Area type="monotone" dataKey="memory" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Memory</span>
                    <span className="text-sm text-gray-500">120 GB</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">2,048 GB available of 3,677 GB</div>
                  <div className="h-16 bg-blue-50 rounded">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={utilizationData.slice(0, 10)}>
                        <Area type="monotone" dataKey="category1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Network</span>
                    <span className="text-sm text-gray-500">3.8 Mbps In</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Description text item</div>
                  <div className="h-16 bg-blue-50 rounded">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={utilizationData.slice(0, 10)}>
                        <Area type="monotone" dataKey="category2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health Score */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">System health score</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-4">
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Health score</div>
                  <div className="text-xl sm:text-2xl font-semibold">100%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Active errors</div>
                  <div className="text-xl sm:text-2xl font-semibold">0</div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Pending requests</div>
                  <div className="text-xl sm:text-2xl font-semibold">0</div>
                </div>
                <div className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 mb-1">Active warnings</div>
                  <div className="text-xl sm:text-2xl font-semibold">0</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>Healthy</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                  <span>No data</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>No requests</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  <span>No warnings</span>
                </div>
              </div>
            </div>

            {/* GPU Core Utilization */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">GPU Core Utilization</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="gpu" stroke="#3B82F6" strokeWidth={2} name="GPU" />
                  <Line type="monotone" dataKey="category1" stroke="#10B981" strokeWidth={2} name="Category 2" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center space-x-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>GPU</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Category 2</span>
                </div>
              </div>
            </div>

            {/* Average Memory Utilization */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Average Memory Utilization</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="memory" stroke="#3B82F6" strokeWidth={2} name="GPU" />
                  <Line type="monotone" dataKey="category1" stroke="#10B981" strokeWidth={2} name="Category 2" />
                  <Line type="monotone" dataKey="category2" stroke="#F59E0B" strokeWidth={2} name="Category 3" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center space-x-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>GPU</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Category 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Category 3</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'models' && (
        <div className="space-y-6">
          {/* Model Inventory Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Model Inventory</h3>
              <p className="text-sm text-gray-600">View and control performance metrics and monitor the health of your selected models.</p>
              {/* Filters Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-6">

                  {/* Models Filter */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Models:</span>
                    <div className="relative model-dropdown">
                      <button
                        onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                        className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px] text-left flex items-center justify-between"
                    >
                      <span className="truncate">
                        {selectedModels.length === 0 
                          ? 'Select models...' 
                          : selectedModels.length === availableModels.length
                            ? 'All models'
                            : selectedModels.length === 1 
                              ? availableModels.find(m => m.id === selectedModels[0])?.name.split('-')[0] + '...'
                              : `${selectedModels.length} selected`
                        }
                      </span>
                      <svg className="w-4 h-4 ml-2 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isModelDropdownOpen && (
                      <div 
                        className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-64 max-h-60 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-2">
                          {availableModels.map((model) => (
                            <label
                              key={model.id}
                              className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedModels.includes(model.id)}
                                onChange={() => handleModelToggle(model.id)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                                <div className="flex-1">
                                  <span className="text-sm text-gray-900">{model.name}</span>
                                </div>
                            </label>
                          ))}
                        </div>
                        {selectedModels.length > 0 && (
                          <div className="border-t border-gray-100 p-2">
                            <button
                              onClick={() => setSelectedModels([])}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >
                              Clear all selections
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    </div>
                  </div>

                  {/* API Key Filter */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">API Key:</span>
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                      value={selectedApiKey}
                      onChange={(e) => setSelectedApiKey(e.target.value)}
                    >
                      <option value="">All Keys</option>
                      <option value="production">Production</option>
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="test">Test</option>
                      <option value="analytics">Analytics</option>
                    </select>
                  </div>

                  {/* Runtime Filter */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Runtime:</span>
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                      value={selectedRuntime}
                      onChange={(e) => setSelectedRuntime(e.target.value)}
                    >
                      <option value="">All Runtimes</option>
                      <option value="vLLM">vLLM</option>
                      <option value="KServe">KServe</option>
                      <option value="llm-d">llm-d</option>
                      <option value="TensorRT-LLM">TensorRT-LLM</option>
                    </select>
                  </div>

                </div>
              </div>

            </div>

            {/* Model Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model deployment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runtime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total requests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P90 Latency(ms)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P90 TTFT(ms)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P90 ITL(ms)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredModelInventoryData.length > 0 ? (
                    filteredModelInventoryData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span 
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => onOpenModelDetail && onOpenModelDetail(row.model)}
                          >
                            {row.model}
                          </span>
                          {row.serviceType === 'MaaS' && (
                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              MaaS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="text-gray-400 text-xs">-</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          row.modelType === 'Generative' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {row.modelType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.project}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.runtime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.totalRequests}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button 
                          className="metrics-clickable flex items-center text-blue-600 hover:text-blue-800 hover:underline cursor-pointer font-medium"
                          onClick={(e) => handleMetricClick(e, index, 'latency')}
                        >
                          <span className={`${
                            parseFloat(row.p90Latency?.replace('ms', '') || 0) < 500 ? 'text-green-700' :
                            parseFloat(row.p90Latency?.replace('ms', '') || 0) < 1000 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {row.p90Latency}
                          </span>
                          <MiniGraph 
                            data={p90PerformanceTimeSeriesData} 
                            metricKey="latency" 
                            threshold={500} 
                            color="#2563EB" 
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button 
                          className="metrics-clickable flex items-center text-purple-600 hover:text-purple-800 hover:underline cursor-pointer font-medium"
                          onClick={(e) => handleMetricClick(e, index, 'ttft')}
                        >
                          <span className={`${
                            parseFloat(row.p90TTFT?.replace('ms', '') || 0) < 150 ? 'text-green-700' :
                            parseFloat(row.p90TTFT?.replace('ms', '') || 0) < 250 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {row.p90TTFT}
                          </span>
                          <MiniGraph 
                            data={p90PerformanceTimeSeriesData} 
                            metricKey="ttft" 
                            threshold={150} 
                            color="#7C3AED" 
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button 
                          className="metrics-clickable flex items-center text-green-600 hover:text-green-800 hover:underline cursor-pointer font-medium"
                          onClick={(e) => handleMetricClick(e, index, 'itl')}
                        >
                          <span className={`${
                            parseFloat(row.p90ITL?.replace('ms', '') || 0) < 50 ? 'text-green-700' :
                            parseFloat(row.p90ITL?.replace('ms', '') || 0) < 100 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {row.p90ITL}
                          </span>
                          <MiniGraph 
                            data={p90PerformanceTimeSeriesData} 
                            metricKey="itl" 
                            threshold={50} 
                            color="#10B981" 
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.errorRate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.resources}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          row.status === 'Running' ? 'bg-green-100 text-green-800' :
                          row.status === 'Starting' ? 'bg-yellow-100 text-yellow-800' :
                          row.status === 'Paused' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p className="text-sm">No models match your current selection.</p>
                          <p className="text-xs mt-1">
                            {!selectedApiKey && selectedModels.length === 0 
                              ? 'Select an API key or models to filter the table.'
                              : 'Try adjusting your API key or model selection.'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Inference Metrics Charts */}
            <div className="mt-6 px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Token Throughput Chart */}
                <div className="bg-white rounded-lg p-4 border">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Token throughput</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={getAggregatedInferenceData('tokenThroughput')}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    {selectedModels.map((modelId, index) => (
                      <Line 
                        key={modelId}
                        type="monotone" 
                        dataKey={`${modelId}_tokens`}
                        stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                        strokeWidth={2} 
                        dot={false}
                        name={`${availableModels.find(m => m.id === modelId)?.name || modelId}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs flex-wrap">
                  {selectedModels.slice(0, 6).map((modelId, index) => (
                    <div key={modelId} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: `hsl(${index * 137.5}, 70%, 50%)` }}
                      ></div>
                      <span className="text-gray-600 text-xs">
                        {availableModels.find(m => m.id === modelId)?.name.split('-')[0] || modelId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Queue Length Chart */}
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Request queue length</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={getAggregatedInferenceData('queueLength')}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    {selectedModels.map((modelId, index) => (
                      <Line 
                        key={modelId}
                        type="monotone" 
                        dataKey={`${modelId}_queue`}
                        stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                        strokeWidth={2} 
                        dot={false}
                        name={`${availableModels.find(m => m.id === modelId)?.name || modelId}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs flex-wrap">
                  {selectedModels.slice(0, 6).map((modelId, index) => (
                    <div key={modelId} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: `hsl(${index * 137.5}, 70%, 50%)` }}
                      ></div>
                      <span className="text-gray-600 text-xs">
                        {availableModels.find(m => m.id === modelId)?.name.split('-')[0] || modelId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Replica Count Chart */}
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Replica count</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={getAggregatedInferenceData('replicaCount')}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    {selectedModels.map((modelId, index) => (
                      <Line 
                        key={modelId}
                        type="monotone" 
                        dataKey={`${modelId}_replicas`}
                        stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                        strokeWidth={2} 
                        dot={false}
                        name={`${availableModels.find(m => m.id === modelId)?.name || modelId}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs flex-wrap">
                  {selectedModels.slice(0, 6).map((modelId, index) => (
                    <div key={modelId} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: `hsl(${index * 137.5}, 70%, 50%)` }}
                      ></div>
                      <span className="text-gray-600 text-xs">
                        {availableModels.find(m => m.id === modelId)?.name.split('-')[0] || modelId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Latency Chart */}
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Request latency (P90)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={getAggregatedInferenceData('latency')}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    {selectedModels.map((modelId, index) => (
                      <Line 
                        key={modelId}
                        type="monotone" 
                        dataKey={`${modelId}_p90`}
                        stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                        strokeWidth={2} 
                        dot={false}
                        name={`${availableModels.find(m => m.id === modelId)?.name || modelId}`}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs flex-wrap">
                  {selectedModels.slice(0, 6).map((modelId, index) => (
                    <div key={modelId} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: `hsl(${index * 137.5}, 70%, 50%)` }}
                      ></div>
                      <span className="text-gray-600 text-xs">
                        {availableModels.find(m => m.id === modelId)?.name.split('-')[0] || modelId}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Box Plot Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Time Per Output Token Latency Box Plot */}
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Time Per Output Token Latency</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getLatencyBoxPlotData()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis type="category" dataKey="model" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [`${value.toFixed(1)}ms`, name]}
                    />
                    <Bar dataKey="p50" fill="#22C55E" opacity={0.8} name="P50" />
                    <Bar dataKey="p90" fill="#EAB308" opacity={0.8} name="P90" />
                    <Bar dataKey="p95" fill="#F97316" opacity={0.8} name="P95" />
                    <Bar dataKey="p99" fill="#EF4444" opacity={0.8} name="P99" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">P50</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">P90</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-gray-600">P95</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-600">P99</span>
                  </div>
                </div>
              </div>

              {/* Time To First Token Latency Box Plot */}
              <div className="bg-white rounded-lg p-4 border">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Time To First Token Latency</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getTTFTBoxPlotData()} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis type="category" dataKey="model" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [`${value.toFixed(2)}s`, name]}
                    />
                    <Bar dataKey="p50" fill="#22C55E" opacity={0.8} name="P50" />
                    <Bar dataKey="p90" fill="#EAB308" opacity={0.8} name="P90" />
                    <Bar dataKey="p95" fill="#F97316" opacity={0.8} name="P95" />
                    <Bar dataKey="p99" fill="#EF4444" opacity={0.8} name="P99" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">P50</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-gray-600">P90</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-gray-600">P95</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-600">P99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Enhanced Performance Metrics Popover */}
        {metricsPopover.isOpen && (
        <div 
              className="metrics-popover fixed z-50 bg-white rounded-lg shadow-xl border max-h-screen overflow-y-auto"
              style={{
                left: `${metricsPopover.position.x}px`,
                top: `${metricsPopover.position.y}px`,
                zIndex: 1000,
                width: popoverViewMode === 'response-level' ? '500px' : '450px',
                maxWidth: 'calc(100vw - 20px)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              {/* Arrow pointer - positioned based on popover location */}
              <div 
                className="absolute w-3 h-3 bg-white border transform rotate-45"
                style={{
                  left: metricsPopover.position.x > window.innerWidth / 2 ? 'calc(100% - 6px)' : '-6px',
                  top: '20px',
                  borderBottom: 'none',
                  borderRight: 'none',
                  zIndex: -1
                }}
              ></div>
              
              {/* Header with Context-Aware Title */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium mb-1">
                      {popoverViewMode === 'aggregate' ? 
                        (metricsPopover.metricType === 'latency' ? 'P90 Latency Analysis' :
                         metricsPopover.metricType === 'ttft' ? 'P90 TTFT Analysis' : 'P90 ITL Analysis') :
                        'Recent Response Metrics'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {popoverViewMode === 'aggregate' ? 
                        (metricsPopover.metricType === 'latency' ? 'End-to-end response time trends with SLA monitoring' :
                         metricsPopover.metricType === 'ttft' ? 'Time to First Token trends for streaming responsiveness' :
                         'Inter-Token Latency trends for streaming consistency') :
                        'Individual request metrics and traces'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setMetricsPopover({ isOpen: false, modelIndex: null, position: { x: 0, y: 0 }, metricType: 'latency' })}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setPopoverViewMode('aggregate')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      popoverViewMode === 'aggregate' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Trends
                  </button>
                  <button
                    onClick={() => setPopoverViewMode('response-level')}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      popoverViewMode === 'response-level' 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Responses
                  </button>
                </div>
              </div>

              <div className="p-4">
                {/* Aggregate View */}
                {popoverViewMode === 'aggregate' && (
                  <div className="mb-6">
                    <div className="mb-4">
                      <div className="text-xs text-gray-600 mb-3">
                        {metricsPopover.metricType === 'latency' ? 
                          'Green zones indicate performance within SLA (under 500ms). Red zones show periods outside SLA thresholds.' :
                         metricsPopover.metricType === 'ttft' ? 
                          'Green zones indicate TTFT within SLA (under 150ms). Red zones show periods outside SLA thresholds.' :
                          'Green zones indicate ITL within SLA (under 50ms). Red zones show periods outside SLA thresholds.'}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Within SLA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span>Outside SLA</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-0.5 bg-green-600"></div>
                          <span>SLA Threshold</span>
                        </div>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={p90PerformanceTimeSeriesData}>
                        <defs>
                          <linearGradient id="colorGoodZone" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorBadZone" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#6B7280' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: '#6B7280' }}
                          label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }}
                          domain={[0, metricsPopover.metricType === 'latency' ? 2000 : 
                                     metricsPopover.metricType === 'ttft' ? 500 : 200]}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }}
                          formatter={(value) => [`${value}ms`, 
                            metricsPopover.metricType === 'latency' ? 'P90 Latency' :
                            metricsPopover.metricType === 'ttft' ? 'P90 TTFT' : 'P90 ITL'
                          ]}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        
                        {/* Green SLA Zone (Good Performance) */}
                        <Area 
                          type="monotone" 
                          dataKey={() => metricsPopover.metricType === 'latency' ? 500 :
                                        metricsPopover.metricType === 'ttft' ? 150 : 50}
                          stackId="1"
                          stroke="none"
                          fill="url(#colorGoodZone)"
                          fillOpacity={0.2}
                        />
                        
                        {/* SLA Reference Line */}
                        <ReferenceLine 
                          y={metricsPopover.metricType === 'latency' ? 500 :
                             metricsPopover.metricType === 'ttft' ? 150 : 50} 
                          stroke="#10B981" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          label={{ 
                            value: metricsPopover.metricType === 'latency' ? 'SLA: 500ms' :
                                   metricsPopover.metricType === 'ttft' ? 'SLA: 150ms' : 'SLA: 50ms',
                            position: "topRight" 
                          }}
                        />
                        
                        {/* Performance Metric Line */}
                        <Area 
                          type="monotone" 
                          dataKey={metricsPopover.metricType} 
                          stroke={metricsPopover.metricType === 'latency' ? '#2563EB' :
                                 metricsPopover.metricType === 'ttft' ? '#7C3AED' : '#10B981'} 
                          strokeWidth={3}
                          fill="none"
                          dot={(props) => {
                            const { payload } = props;
                            const threshold = metricsPopover.metricType === 'latency' ? 500 :
                                            metricsPopover.metricType === 'ttft' ? 150 : 50;
                            const value = payload[metricsPopover.metricType];
                            const color = value > threshold ? '#EF4444' : '#10B981';
                            return <circle {...props} fill={color} stroke={color} r={4} />;
                          }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    
                    {/* Context-Specific Information */}
                    <div className="mt-4 p-3 rounded-lg" style={{
                      backgroundColor: metricsPopover.metricType === 'latency' ? '#EFF6FF' :
                                     metricsPopover.metricType === 'ttft' ? '#F3E8FF' : '#ECFDF5'
                    }}>
                      <div className="text-sm font-medium" style={{
                        color: metricsPopover.metricType === 'latency' ? '#1D4ED8' :
                               metricsPopover.metricType === 'ttft' ? '#7C3AED' : '#059669'
                      }}>
                        {metricsPopover.metricType === 'latency' ? 'P90 Latency Insights' :
                         metricsPopover.metricType === 'ttft' ? 'P90 TTFT Insights' : 'P90 ITL Insights'}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {metricsPopover.metricType === 'latency' ? 
                          'End-to-end response time including all processing stages. SLA: under 500ms for optimal user experience.' :
                         metricsPopover.metricType === 'ttft' ? 
                          'Time until the first token appears. Critical for perceived responsiveness. SLA: under 150ms for real-time feel.' :
                          'Consistency of token generation during streaming. SLA: under 50ms for smooth user experience.'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Response-Level View */}
                {popoverViewMode === 'response-level' && (
                  <div>
                    <h5 className="font-medium text-sm mb-3">Recent Responses</h5>
                    <div className="space-y-3">
                      {recentResponseMetrics.map((response, index) => (
                        <div key={response.id} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${
                                response.status === 'success' ? 'bg-green-500' :
                                response.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                              }`}></span>
                              <span className="text-xs text-gray-600">{response.timestamp}</span>
                              <span className="text-xs font-mono text-blue-600">{response.traceId.slice(0, 8)}...</span>
                            </div>
                            <div className={`text-xs px-2 py-0.5 rounded ${
                              response.responseTime < 0.5 ? 'bg-green-100 text-green-700' :
                              response.responseTime < 1.0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {response.responseTime}s
                            </div>
                          </div>
                          
                          {/* Key Metrics */}
                          <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                            <div className="bg-white rounded px-2 py-1">
                              <span className="text-gray-500">Tokens:</span>
                              <span className="font-semibold ml-1">{response.tokenUsage}</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                              <span className="text-gray-500">Tokens/s:</span>
                              <span className="font-semibold ml-1">{response.tokensPerSecond}</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                              <span className="text-gray-500">TTIF:</span>
                              <span className="font-semibold ml-1">{response.ttif}ms</span>
                            </div>
                            <div className="bg-white rounded px-2 py-1">
                              <span className="text-gray-500">Response:</span>
                              <span className="font-semibold ml-1">{response.responseTime}s</span>
                            </div>
                          </div>

                          {/* Request Preview */}
                          <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                            <span className="font-medium">Request: </span>
                            {response.request}
                          </div>

                          {/* Expandable Trace Details */}
                          <details className="text-xs">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                              View Trace ({response.spans.length} spans)
                            </summary>
                            <div className="mt-2 space-y-1 bg-gray-900 text-green-600 font-medium p-2 rounded font-mono text-xs overflow-x-auto">
                              <div className="text-gray-600">Trace ID: {response.traceId}</div>
                              <div className="border-b border-gray-700 pb-1 mb-2"></div>
                              {response.spans.map((span, spanIndex) => (
                                <div key={spanIndex} className="pl-2">
                                  <div className="text-white">[Span {spanIndex + 1}] {span.name}</div>
                                  <div className="text-gray-400">(Duration: {span.duration}s)</div>
                                  {span.info && (
                                    <div className="text-blue-300 pl-2">- {span.info}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </details>

                          {/* View in Traces Button */}
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewTrace(response.traceId)
                              }}
                              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-1.5 px-3 rounded text-xs flex items-center justify-center space-x-1 transition-colors"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>View in Traces</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => {
                      setMetricsPopover({ isOpen: false, modelIndex: null, position: { x: 0, y: 0 }, metricType: 'latency' });
                      setActiveTab('logs');
                    }}
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>View All Traces</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="space-y-6">
          {/* Consolidated Usage Dashboard with Title Bar */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Usage Analytics Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold">Usage Analytics</h3>
                  <p className="text-sm text-gray-600">Monitor usage patterns, costs, and consumption across your AI workloads</p>
                </div>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
                  Export
                </button>
              </div>
              
              {/* Filters Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex flex-wrap items-center gap-6">

                  {/* Time Range Filter */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Time Range:</span>
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                      value={selectedTimeRange}
                      onChange={(e) => setSelectedTimeRange(e.target.value)}
                    >
                      <option value="1h">Last 1 Hour</option>
                      <option value="6h">Last 6 Hours</option>
                      <option value="24h">Last 24 Hours</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="3m">Last 3 Months</option>
                      <option value="6m">Last 6 Months</option>
                      <option value="1y">Last 1 Year</option>
                    </select>
                  </div>

                  {/* Group By Filter */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Group by:</span>
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                      value={groupBy}
                      onChange={(e) => setGroupBy(e.target.value)}
                    >
                      <option value="Users">Users</option>
                      <option value="Projects">Projects</option>
                      <option value="Models">Models</option>
                      <option value="API Keys">API Keys</option>
                    </select>
                  </div>

                  {/* Metrics Filter */}
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Metrics:</span>
                    <select 
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
                      value={groupMetrics}
                      onChange={(e) => setGroupMetrics(e.target.value)}
                    >
                      <option value="Tokens">Tokens</option>
                      <option value="Requests">Requests</option>
                      <option value="Cost">Cost</option>
                    </select>
                  </div>

                </div>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="p-6">
            {/* Usage per Group Chart */}
            <div>
              <h4 className="text-md font-medium mb-4">Usage per Group</h4>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    groupMetrics === 'Cost' ? '$' + value.toFixed(2) : value.toLocaleString(),
                    groupMetrics
                  ]}
                />
                <Bar 
                  dataKey={groupMetrics} 
                  fill="#3B82F6" 
                  name={groupMetrics}
                />
              </BarChart>
            </ResponsiveContainer>
            
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>{groupMetrics} by {groupBy}</span>
                </div>
              </div>
            </div>

            {/* Usage Trends Chart */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="mb-6">
                <h4 className="text-md font-medium mb-1">Usage Trends</h4>
                <p className="text-sm text-gray-600">Live chart showing {groupMetrics} trends over the selected time period</p>
              </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [
                    groupMetrics === 'Cost' ? '$' + value.toFixed(2) : value.toLocaleString(),
                    groupMetrics
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name={groupMetrics}
                />
              </LineChart>
              </ResponsiveContainer>
            </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-6">
          {/* User Requests Section */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Request traces</h3>
              <p className="text-sm text-gray-600 mb-4">View distributed traces for user requests with detailed service timelines and performance metrics.</p>
              
              
              {/* Filters Section - Inspired by OpenShift Console */}
              <div className="mt-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-6">
                    
                    {/* Service Name Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Service Name:</span>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]">
                          <option value="">All Services</option>
                          <option value="granite-inference">granite-inference</option>
                          <option value="llama-chat">llama-chat</option>
                          <option value="mistral-api">mistral-api</option>
                          <option value="code-assistant">code-assistant</option>
                          <option value="content-gen">content-gen</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Namespace Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Namespace:</span>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]">
                          <option value="">All Namespaces</option>
                          <option value="observability-hub">observability-hub</option>
                          <option value="model-serving">model-serving</option>
                          <option value="inference-prod">inference-prod</option>
                          <option value="training-dev">training-dev</option>
                          <option value="monitoring">monitoring</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Model Filter */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Model:</span>
                      <div className="relative trace-model-dropdown">
                        <button
                          onClick={() => setIsTraceModelDropdownOpen(!isTraceModelDropdownOpen)}
                          className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px] text-left flex items-center justify-between"
                        >
                          <span className="truncate">
                            {selectedModels.length === 0 
                              ? 'All Models' 
                              : selectedModels.length === availableModels.length
                                ? 'All Models'
                                : selectedModels.length === 1 
                                  ? availableModels.find(m => m.id === selectedModels[0])?.name.split('-')[0]
                                  : `${selectedModels.length} selected`
                            }
                          </span>
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isTraceModelDropdownOpen && (
                          <div 
                            className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-64 max-h-60 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="p-2">
                              {availableModels.map((model) => (
                                <label
                                  key={model.id}
                                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedModels.includes(model.id)}
                                    onChange={() => handleModelToggle(model.id)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-900">{model.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Time Range Filter - Right Side */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Time range:</span>
                      <div className="relative">
                        <select 
                          className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
                          value={selectedTimeRange}
                          onChange={(e) => setSelectedTimeRange(e.target.value)}
                        >
                          <option value="1h">Last 1 hour</option>
                          <option value="6h">Last 6 hours</option>
                          <option value="24h">Last 24 hours</option>
                          <option value="7d">Last 7 days</option>
                          <option value="30d">Last 30 days</option>
                          <option value="3m">Last 3 months</option>
                          <option value="6m">Last 6 months</option>
                          <option value="1y">Last 1 year</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Limit Traces */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Limit traces:</span>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-gray-300 rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-20">
                          <option value="20">20</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                          <option value="500">500</option>
                          <option value="1000">1000</option>
                          <option value="5000">5000</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Trace ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Timestamp</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Model</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentUserRequests.map((row, index) => (
                    <React.Fragment key={index}>
                      <tr 
                        className="hover:bg-gray-50 cursor-pointer" 
                        onClick={() => toggleRowExpansion(index)}
                        data-trace-id={row.traceId}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <button className="text-gray-400 hover:text-gray-600">
                              {expandedRows.has(index) ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              )}
                            </button>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  row.status === 'success' ? 'bg-green-500' :
                                  row.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                }`}></div>
                                <span className="text-blue-600 hover:underline cursor-pointer font-medium">{row.user}</span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {row.tokenUsage || row.promptTokens || 'N/A'} tokens • {row.tokensPerSecond || 'N/A'} tok/s • {row.ttif ? `${row.ttif}ms TTIF` : 'No TTIF'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {row.traceId ? (
                            <span className="text-blue-600 hover:underline cursor-pointer font-mono text-xs">
                              {row.traceId}
                            </span>
                          ) : (
                            <span className="text-gray-400">No trace</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            parseFloat(row.duration?.replace('s', '') || 0) < 2 ? 'bg-green-100 text-green-800' :
                            parseFloat(row.duration?.replace('s', '') || 0) < 5 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {row.duration || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          <div className="flex items-center space-x-1">
                            <span>{row.tokenUsage || row.promptTokens || 'N/A'}</span>
                            {row.tokenUsage && (
                              <span className="text-xs text-gray-500">tokens</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          <div className={`flex items-center space-x-1 ${
                            (row.tokensPerSecond || 0) > 25 ? 'text-green-700' :
                            (row.tokensPerSecond || 0) > 15 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            <span>{row.tokensPerSecond || 'N/A'}</span>
                            {row.tokensPerSecond && (
                              <span className="text-xs">tok/s</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          <div className={`flex items-center space-x-1 ${
                            (row.ttif || 0) < 200 ? 'text-green-700' :
                            (row.ttif || 0) < 400 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            <span>{row.ttif || 'N/A'}</span>
                            {row.ttif && (
                              <span className="text-xs">ms</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-blue-600 hover:underline cursor-pointer text-sm">{row.model}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            row.status === 'success' ? 'bg-green-100 text-green-800' :
                            row.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            row.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {row.status || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                      {expandedRows.has(index) && row.spans && (
                        <tr>
                          <td colSpan="6" className="px-0 py-0 bg-gray-50">
                            <div className="p-6 space-y-4">
                              {/* Clean Trace Details */}
                              <div className="bg-white rounded-lg p-4 border">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Trace Information</h4>
                                    <div className="text-sm text-gray-900 font-medium">{row.model}</div>
                                    <div className="text-xs text-gray-500 font-mono">{row.traceId}</div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Performance</h4>
                                    <div className="text-sm text-gray-900">
                                      <span className="font-semibold">{row.duration}</span> total
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {row.tokensPerSecond || 'N/A'} tok/s
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Request Details</h4>
                                    <div className="text-xs text-gray-600 truncate" title={row.request}>
                                      {row.request?.substring(0, 80) || 'No request data'}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Key Metrics */}
                                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-500">Tokens:</span>
                                    <div className="font-semibold">{row.tokenUsage || row.promptTokens || 'N/A'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Tokens/s:</span>
                                    <div className="font-semibold">{row.tokensPerSecond || 'N/A'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">TTIF:</span>
                                    <div className="font-semibold">{row.ttif ? `${row.ttif}ms` : 'N/A'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Queue Time:</span>
                                    <div className="font-semibold">{row.queueTime || 'N/A'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Inference:</span>
                                    <div className="font-semibold">{row.inferenceTime || 'N/A'}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Network:</span>
                                    <div className="font-semibold">{row.networkTime || 'N/A'}</div>
                                  </div>
                                </div>
                              </div>

                              {/* Waterfall Timeline */}
                              <div className="bg-white rounded-lg border">
                                <div className="p-4 border-b border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900">Trace Timeline</h4>
                                </div>
                                
                                {/* Timeline Header */}
                                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                                  <div className="flex items-center">
                                    <div className="w-64 text-xs font-medium text-gray-700">Service & Operation</div>
                                    <div className="flex-1 flex justify-between text-xs text-gray-500 px-4">
                                      <span>0μs</span>
                                      <span>{parseFloat(row.duration.replace('s', '')) * 1000000}μs</span>
                                    </div>
                                    <div className="w-20 text-xs font-medium text-gray-700 text-right">Duration</div>
                                  </div>
                                </div>
                                
                                {/* Timeline Spans */}
                                <div className="divide-y divide-gray-100">
                                  {row.spans.map((span, spanIndex) => {
                                    const totalDurationMs = parseFloat(row.duration.replace('s', '')) * 1000;
                                    const spanDurationMs = parseFloat(span.duration.replace('s', '')) * 1000;
                                    const widthPercentage = (spanDurationMs / totalDurationMs) * 100;
                                    const leftPercentage = (span.startTime / totalDurationMs) * 100;
                                    
                                    return (
                                      <div key={spanIndex} className="px-4 py-3 hover:bg-gray-50 group">
                                        <div className="flex items-center">
                                          {/* Service & Operation */}
                                          <div className="w-64 pr-4">
                                            <div className="flex items-center space-x-2">
                                              <div className={`w-2 h-2 rounded-full ${
                                                span.status === 'success' ? 'bg-green-500' :
                                                span.status === 'warning' ? 'bg-yellow-500' :
                                                span.status === 'error' ? 'bg-red-500' : 'bg-gray-400'
                                              }`}></div>
                                              <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                  {span.service || 'Unknown Service'}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                  {span.operationName || span.name || 'Unknown Operation'}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          {/* Timeline Bar */}
                                          <div className="flex-1 px-4">
                                            <div className="relative h-6 bg-gray-100 rounded">
                                              <div 
                                                className={`absolute h-full rounded transition-all group-hover:opacity-80 ${
                                                  span.status === 'success' ? 'bg-teal-400' :
                                                  span.status === 'warning' ? 'bg-yellow-400' :
                                                  span.status === 'error' ? 'bg-red-400' : 'bg-blue-400'
                                                }`}
                                                style={{
                                                  left: `${leftPercentage}%`,
                                                  width: `${Math.max(widthPercentage, 0.5)}%`
                                                }}
                                                title={`${span.operationName || span.name}: ${span.duration} (${widthPercentage.toFixed(1)}% of total)`}
                                              ></div>
                                            </div>
                                          </div>
                                          
                                          {/* Duration */}
                                          <div className="w-20 text-xs text-gray-600 text-right font-mono">
                                            {span.duration}
                                          </div>
                                        </div>
                                        
                                        {/* Span Details (expandable) */}
                                        {span.info && (
                                          <div className="mt-2 ml-6 text-xs text-gray-600 bg-gray-50 rounded p-2 font-mono">
                                            {span.info}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>

                              {/* Trace Attributes */}
                              <div className="bg-white rounded-lg p-4 border">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Trace Attributes</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Service Name:</span>
                                        <span className="font-medium">{row.model}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Status:</span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                                          row.status === 'success' ? 'bg-green-100 text-green-800' :
                                          row.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          {row.status}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Error Count:</span>
                                        <span className="font-medium">{row.errorCount || 0}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Retry Count:</span>
                                        <span className="font-medium">{row.retryCount || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="space-y-2">
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">User:</span>
                                        <span className="font-medium">{row.user}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Timestamp:</span>
                                        <span className="font-medium font-mono text-xs">{row.timestamp}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Completion:</span>
                                        <span className="font-medium">{row.completion || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-gray-500">Spans:</span>
                                        <span className="font-medium">{row.spans?.length || 0}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Services Involved */}
                              <div className="bg-white rounded-lg p-4 border">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Services Involved</h4>
                                <div className="flex flex-wrap gap-2">
                                  {(row.services || []).map((service, serviceIndex) => (
                                    <span key={serviceIndex} className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                      {service}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}

export default OverviewDashboardV2