import React, { useState } from 'react'
import { ChevronRight, Filter, Eye, EyeOff } from 'lucide-react'

const TracesView = () => {
  const [selectedTrace, setSelectedTrace] = useState(null)
  const [timeRange, setTimeRange] = useState('Last 30 minutes')
  const [limitTraces, setLimitTraces] = useState('20')
  const [tempoInstance, setTempoInstance] = useState('observability-hub / tempostack')
  const [tenant, setTenant] = useState('dev')
  const [serviceNameFilter, setServiceNameFilter] = useState('Service Name')
  const [serviceNameValue, setServiceNameValue] = useState('Filter by Service Name')
  const [showGraph, setShowGraph] = useState(true)

  // Mock trace data matching your screenshots
  const traceData = {
    traceId: 'llamastack: create_agent',
    totalDuration: '24.95ms',
    spans: [
      {
        service: 'llamastack',
        operation: 'create_agent',
        duration: '24.95ms',
        startTime: 0,
        endTime: 24.95,
        color: 'bg-teal-400'
      }
    ],
    attributes: {
      '__location__': 'server',
      '__root__': 'true',
      '__root_span__': 'true',
      'ttl': '604800',
      'raw_path': '/v1/agents',
      'deployment.environment': 'development',
      'service.name': 'llamastack',
      'service.version': '1.0.0',
      'telemetry.sdk.language': 'python',
      'telemetry.sdk.name': 'opentelemetry',
      'telemetry.sdk.version': '1.33.1'
    }
  }

  // Mock traces table data
  const tracesData = [
    {
      traceName: 'llamastack: /v1/models',
      spans: '2 spans',
      duration: '<1ms',
      startTime: '17 June 2025 at 23:43:53',
      tags: ['2 llamastack']
    },
    {
      traceName: 'llamastack: /v1/providers',
      spans: '2 spans', 
      duration: '<1ms',
      startTime: '17 June 2025 at 23:43:49',
      tags: ['2 llamastack']
    },
    {
      traceName: 'vllm-llama32b: llm_request',
      spans: '1 spans',
      duration: '337ms',
      startTime: '17 June 2025 at 23:43:36',
      tags: ['1 vllm-llama32b']
    }
  ]

  const handleTraceClick = (trace) => {
    setSelectedTrace(trace)
  }

  const renderTraceDetail = () => {
    if (!selectedTrace) {
      // Default to showing the create_agent trace
      return (
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="text-blue-600 hover:underline cursor-pointer">Traces</span>
            <ChevronRight className="w-4 h-4" />
            <span>Trace details</span>
          </div>

          {/* Trace Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{traceData.traceId}</h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Timeline Section - Takes 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Timeline Header */}
              <div className="bg-white rounded-lg border">
                <div className="px-6 py-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Service & Operation</h3>
                    <div className="text-sm text-gray-600">
                      Ops: 0μs - 6.24ms - 12.47ms - 18.71ms - 24.95ms
                    </div>
                  </div>
                </div>

                {/* Timeline Visualization */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Timeline ruler */}
                    <div className="relative h-8 border-b border-gray-200">
                      <div className="absolute inset-0 flex justify-between text-xs text-gray-500 pt-1">
                        <span>0μs</span>
                        <span>6.24ms</span>
                        <span>12.47ms</span>
                        <span>18.71ms</span>
                        <span>24.95ms</span>
                      </div>
                    </div>

                    {/* Span visualization */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <div className="w-48">
                          <div className="text-sm font-medium">llamastack: create_agent</div>
                        </div>
                        <div className="flex-1 relative">
                          <div className="h-6 bg-gray-100 rounded relative">
                            <div 
                              className="absolute inset-y-0 left-0 bg-teal-400 rounded"
                              style={{ width: '100%' }}
                              title="llamastack: create_agent - 24.95ms"
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 w-20 text-right">
                          24.95ms
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attributes Panel - Takes 1 column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold">llamastack</h3>
                  <p className="text-sm text-gray-600">create_agent</p>
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      Attributes
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {Object.entries(traceData.attributes).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <div className="font-medium text-gray-700">{key}</div>
                        <div className="text-gray-600 break-all">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Trace Detail View */}
      {renderTraceDetail()}

      {/* Traces Overview Table */}
      <div className="bg-white rounded-lg border">
        {/* Header with filters */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Traces</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Time range</span>
                <select 
                  className="border rounded px-3 py-1 text-sm"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option>Last 30 minutes</option>
                  <option>Last hour</option>
                  <option>Last 24 hours</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Limit traces</span>
                <select 
                  className="border rounded px-3 py-1 text-sm"
                  value={limitTraces}
                  onChange={(e) => setLimitTraces(e.target.value)}
                >
                  <option>20</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo instance <span className="text-blue-500">ⓘ</span>
              </label>
              <select 
                className="w-full border rounded px-3 py-2 text-sm"
                value={tempoInstance}
                onChange={(e) => setTempoInstance(e.target.value)}
              >
                <option>observability-hub / tempostack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tenant</label>
              <select 
                className="w-full border rounded px-3 py-2 text-sm"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
              >
                <option>dev</option>
                <option>prod</option>
                <option>staging</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
              <div className="flex">
                <select 
                  className="border rounded-l px-3 py-2 text-sm flex-shrink-0"
                  value={serviceNameFilter}
                  onChange={(e) => setServiceNameFilter(e.target.value)}
                >
                  <option>Service Name</option>
                  <option>Operation Name</option>
                  <option>Duration</option>
                </select>
                <select 
                  className="border-t border-r border-b rounded-r px-3 py-2 text-sm flex-1"
                  value={serviceNameValue}
                  onChange={(e) => setServiceNameValue(e.target.value)}
                >
                  <option>Filter by Service Name</option>
                  <option>llamastack</option>
                  <option>vllm-llama32b</option>
                </select>
              </div>
            </div>
            <div className="flex items-end space-x-2">
              <button className="text-blue-600 hover:underline text-sm">Show query</button>
              <button 
                className="flex items-center space-x-1 text-blue-600 hover:underline text-sm"
                onClick={() => setShowGraph(!showGraph)}
              >
                {showGraph ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showGraph ? 'Hide' : 'Show'} graph</span>
              </button>
            </div>
          </div>
        </div>

        {/* Duration Chart */}
        {showGraph && (
          <div className="px-6 py-4 border-b bg-gray-50">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Duration</h4>
              <div className="relative h-32 bg-white rounded border">
                {/* Mock chart visualization */}
                <div className="absolute inset-0 flex items-end justify-around p-4">
                  {[
                    { time: '23:43:10', height: '20%' },
                    { time: '23:43:15', height: '40%' },
                    { time: '23:43:20', height: '60%' },
                    { time: '23:43:25', height: '80%' },
                    { time: '23:43:30', height: '30%' },
                    { time: '23:43:35', height: '15%' },
                    { time: '23:43:40', height: '5%' },
                    { time: '23:43:45', height: '10%' },
                    { time: '23:43:50', height: '90%' }
                  ].map((point, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-3 bg-blue-500 rounded-t"
                        style={{ height: point.height }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                        {point.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-2 right-2 text-xs text-gray-500">
                  Local Time
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Traces Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trace name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tracesData.map((trace, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleTraceClick(trace)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-blue-600 hover:underline font-medium">
                      {trace.traceName}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {trace.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trace.spans}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trace.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trace.startTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TracesView





