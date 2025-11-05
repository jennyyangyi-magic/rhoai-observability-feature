import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const ModelPerformance = () => {
  // Sample data for charts
  const performanceData = [
    { name: '00:00', category1: 30, category2: 20, category3: 25 },
    { name: '02:00', category1: 45, category2: 35, category3: 40 },
    { name: '04:00', category1: 25, category2: 15, category3: 20 },
    { name: '06:00', category1: 60, category2: 50, category3: 55 },
    { name: '08:00', category1: 70, category2: 60, category3: 65 },
    { name: '10:00', category1: 85, category2: 75, category3: 80 },
    { name: '12:00', category1: 90, category2: 80, category3: 85 },
    { name: '14:00', category1: 75, category2: 65, category3: 70 }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button className="hover:text-blue-600 cursor-pointer">Home</button>
        <span>/</span>
        <button className="hover:text-blue-600 cursor-pointer">Model deployments</button>
        <span>/</span>
        <span className="text-gray-900">llama-70b-chat</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold text-gray-900">llama-70b-chat</h1>
        <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">Deployed model</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Model Performance Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Model performance monitoring</h3>
            <p className="text-sm text-gray-600 mb-4">View real-time performance metrics and monitor the health of your selected model.</p>
            
            <div className="flex items-center space-x-2 mb-6">
              <select className="border rounded px-3 py-1 text-sm">
                <option>app-rag-051 Running</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Model performance</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Speed</div>
                  <div className="text-lg font-semibold">820 ms</div>
                  <div className="text-xs text-blue-600">P50 latency</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">-</div>
                  <div className="text-lg font-semibold">120 ms</div>
                  <div className="text-xs text-purple-600">P90 TTFT</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">-</div>
                  <div className="text-lg font-semibold">45 ms</div>
                  <div className="text-xs text-green-600">P90</div>
                </div>
              </div>

              <div className="mt-4 text-right">
                <span className="text-sm text-gray-600">% Health</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-600">Total load</div>
                  <div className="text-lg font-semibold">64.4%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Slow</div>
                  <div className="text-lg font-semibold">19.2%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Predicted</div>
                  <div className="text-lg font-semibold">16.4%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Token throughput */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Token throughput</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="category1" stroke="#3B82F6" strokeWidth={2} name="Category 1" />
                <Line type="monotone" dataKey="category2" stroke="#10B981" strokeWidth={2} name="Category 2" />
                <Line type="monotone" dataKey="category3" stroke="#8B5CF6" strokeWidth={2} name="Category 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Request queue length */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Request queue length</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="category1" stroke="#3B82F6" strokeWidth={2} name="Category 1" />
                <Line type="monotone" dataKey="category2" stroke="#10B981" strokeWidth={2} name="Category 2" />
                <Line type="monotone" dataKey="category3" stroke="#8B5CF6" strokeWidth={2} name="Category 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Replica count */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Replica count</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="category1" stroke="#3B82F6" strokeWidth={2} name="Category 1" />
                <Line type="monotone" dataKey="category2" stroke="#10B981" strokeWidth={2} name="Category 2" />
                <Line type="monotone" dataKey="category3" stroke="#8B5CF6" strokeWidth={2} name="Category 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Request latency */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Request latency</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="category1" stroke="#3B82F6" strokeWidth={2} name="Category 1" />
                <Line type="monotone" dataKey="category2" stroke="#10B981" strokeWidth={2} name="Category 2" />
                <Line type="monotone" dataKey="category3" stroke="#8B5CF6" strokeWidth={2} name="Category 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelPerformance