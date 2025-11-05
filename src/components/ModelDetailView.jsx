import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ModelDetailView = ({ modelName = "llama-70b-chat", onBack, initialTab = 'performance' }) => {
  const [activeTab, setActiveTab] = useState(initialTab)
  
  // Sample data for charts
  const chartData = [
    { name: '00:00', category1: 65, category2: 45, category3: 30 },
    { name: '02:00', category1: 70, category2: 50, category3: 35 },
    { name: '04:00', category1: 55, category2: 35, category3: 28 },
    { name: '06:00', category1: 80, category2: 60, category3: 42 },
    { name: '08:00', category1: 75, category2: 55, category3: 38 },
    { name: '10:00', category1: 85, category2: 65, category3: 45 },
    { name: '12:00', category1: 90, category2: 70, category3: 50 },
    { name: '14:00', category1: 75, category2: 55, category3: 40 },
    { name: '16:00', category1: 85, category2: 65, category3: 48 }
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button className="hover:text-blue-600 cursor-pointer">Home</button>
        <span>/</span>
        <button className="hover:text-blue-600 cursor-pointer">Model deployments</button>
        <span>/</span>
        <span className="text-gray-900">{modelName || 'llama-70b-chat'}</span>
      </div>

      {/* Back Button */}
      <div className="mb-4">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          <span>←</span>
          <span>Back to Models</span>
        </button>
      </div>

      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-4 mb-2">
          <h1 className="text-2xl font-semibold text-gray-900">{modelName}</h1>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Deployed model
          </span>
        </div>
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'performance' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
            <button 
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'safety' 
                  ? 'border-red-500 text-red-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('safety')}
            >
              Safety
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Comprehensive Model Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Model Performance Metrics</h3>
                <p className="text-sm text-gray-600">Comprehensive latency, throughput, resource, and cost metrics</p>
              </div>
              <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                Export to Sheets
              </button>
            </div>
            
            {/* Latency Metrics */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-4 text-blue-700">Latency Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">Time To First Token</div>
                  <div className="text-2xl font-bold text-blue-600">120ms</div>
                  <div className="text-xs text-blue-600 mt-1">Critical for responsiveness</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">Time Per Output Token</div>
                  <div className="text-2xl font-bold text-blue-600">45ms</div>
                  <div className="text-xs text-blue-600 mt-1">Inter-token latency</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">End-to-End Latency</div>
                  <div className="text-2xl font-bold text-blue-600">820ms</div>
                  <div className="text-xs text-blue-600 mt-1">Total request time</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-gray-500 mb-1">Request Queue Time</div>
                  <div className="text-2xl font-bold text-blue-600">28ms</div>
                  <div className="text-xs text-blue-600 mt-1">Wait before processing</div>
                </div>
              </div>
            </div>
            
            {/* Throughput Metrics */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-4 text-green-700">Throughput Metrics</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-xs text-gray-500 mb-1">Throughput</div>
                  <div className="text-2xl font-bold text-green-600">145.2</div>
                  <div className="text-xs text-green-600 mt-1">Tokens/second</div>
                  <div className="text-xs text-gray-500 mt-1">Primary vLLM goal</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-xs text-gray-500 mb-1">Requests Per Second</div>
                  <div className="text-2xl font-bold text-green-600">12.4</div>
                  <div className="text-xs text-green-600 mt-1">RPS</div>
                  <div className="text-xs text-gray-500 mt-1">Complete requests/sec</div>
                </div>
              </div>
            </div>
            
            {/* Resource/System Metrics */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-4 text-purple-700">Resource & System Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xs text-gray-500 mb-1">GPU KV-Cache Usage</div>
                  <div className="text-2xl font-bold text-purple-600">73.2%</div>
                  <div className="text-xs text-purple-600 mt-1">12.4GB / 16.9GB</div>
                  <div className="text-xs text-gray-500 mt-1">Memory pressure indicator</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{width: '73.2%'}}></div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xs text-gray-500 mb-1">Request States</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Running:</span>
                      <span className="font-semibold text-green-600">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Waiting:</span>
                      <span className="font-semibold text-yellow-600">3</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Swapped:</span>
                      <span className="font-semibold text-red-600">1</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xs text-gray-500 mb-1">Optimization Metrics</div>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-semibold text-red-600">24</div>
                      <div className="text-xs text-gray-500">Preemptions</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-green-600">87.3%</div>
                      <div className="text-xs text-gray-500">Prefix cache hit rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cost Metrics */}
            <div className="mb-8">
              <h4 className="text-md font-semibold mb-4 text-orange-700">Cost Metrics</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-xs text-gray-500 mb-1">Cost Per Request</div>
                  <div className="text-2xl font-bold text-orange-600">$0.0234</div>
                  <div className="text-xs text-orange-600 mt-1">Business efficiency</div>
                  <div className="text-xs text-gray-500 mt-1">Avg per request</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-xs text-gray-500 mb-1">Cost Per Token</div>
                  <div className="text-2xl font-bold text-orange-600">$0.00089</div>
                  <div className="text-xs text-orange-600 mt-1">Token efficiency</div>
                  <div className="text-xs text-gray-500 mt-1">Per output token</div>
                </div>
              </div>
            </div>
            
            {/* Detailed Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Latency Trends */}
              <div>
                <h4 className="text-md font-semibold mb-4">Latency Trends Over Time</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { time: '00:00', ttft: 118, tpot: 42, e2e: 815, queue: 25 },
                    { time: '02:00', ttft: 122, tpot: 45, e2e: 825, queue: 28 },
                    { time: '04:00', ttft: 115, tpot: 41, e2e: 810, queue: 22 },
                    { time: '06:00', ttft: 125, tpot: 48, e2e: 835, queue: 32 },
                    { time: '08:00', ttft: 120, tpot: 45, e2e: 820, queue: 28 },
                    { time: '10:00', ttft: 117, tpot: 43, e2e: 812, queue: 26 },
                    { time: '12:00', ttft: 123, tpot: 46, e2e: 828, queue: 30 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}ms`, name]} />
                    <Line type="monotone" dataKey="ttft" stroke="#3B82F6" strokeWidth={2} name="TTFT" />
                    <Line type="monotone" dataKey="tpot" stroke="#10B981" strokeWidth={2} name="TPOT" />
                    <Line type="monotone" dataKey="e2e" stroke="#F59E0B" strokeWidth={2} name="End-to-End" />
                    <Line type="monotone" dataKey="queue" stroke="#EF4444" strokeWidth={2} name="Queue Time" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-2 text-sm flex-wrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>TTFT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>TPOT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>End-to-End</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Queue Time</span>
                  </div>
                </div>
              </div>
              
              {/* Throughput & Resource Trends */}
              <div>
                <h4 className="text-md font-semibold mb-4">Throughput & Resource Trends</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={[
                    { time: '00:00', throughput: 142.1, rps: 11.8, kvCache: 68.2, preemptions: 20 },
                    { time: '02:00', throughput: 148.3, rps: 12.2, kvCache: 71.5, preemptions: 22 },
                    { time: '04:00', throughput: 138.7, rps: 11.4, kvCache: 69.8, preemptions: 21 },
                    { time: '06:00', throughput: 152.6, rps: 12.8, kvCache: 74.1, preemptions: 25 },
                    { time: '08:00', throughput: 145.2, rps: 12.4, kvCache: 73.2, preemptions: 24 },
                    { time: '10:00', throughput: 149.8, rps: 12.6, kvCache: 75.6, preemptions: 26 },
                    { time: '12:00', throughput: 143.5, rps: 12.1, kvCache: 72.8, preemptions: 23 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'throughput') return [`${value} tokens/sec`, 'Throughput']
                        if (name === 'rps') return [`${value} req/sec`, 'RPS']
                        if (name === 'kvCache') return [`${value}%`, 'KV Cache']
                        if (name === 'preemptions') return [`${value}`, 'Preemptions']
                        return [value, name]
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={3} name="throughput" />
                    <Line yAxisId="left" type="monotone" dataKey="rps" stroke="#3B82F6" strokeWidth={2} name="rps" />
                    <Line yAxisId="right" type="monotone" dataKey="kvCache" stroke="#9333EA" strokeWidth={2} name="kvCache" />
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center space-x-4 mt-2 text-sm flex-wrap">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Throughput (tokens/sec)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>RPS</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>KV Cache %</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Performance Summary Table */}
            <div>
              <h4 className="text-md font-semibold mb-4">Performance Summary</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Value</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-blue-700">Latency</td>
                      <td className="px-4 py-3">Time To First Token (TTFT)</td>
                      <td className="px-4 py-3 font-semibold">120ms</td>
                      <td className="px-4 py-3 text-gray-600">Time from request to first output token. Critical for perceived responsiveness.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">Time Per Output Token (TPOT)</td>
                      <td className="px-4 py-3 font-semibold">45ms</td>
                      <td className="px-4 py-3 text-gray-600">Average time to generate each subsequent token. Measures continuous generation speed.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">End-to-End Request Latency</td>
                      <td className="px-4 py-3 font-semibold">820ms</td>
                      <td className="px-4 py-3 text-gray-600">Total time from request submission to final token (TTFT + TPOT × Output Tokens).</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">Request Queue Time</td>
                      <td className="px-4 py-3 font-semibold">28ms</td>
                      <td className="px-4 py-3 text-gray-600">Time a request spends waiting in queue before processing begins.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-green-700">Throughput</td>
                      <td className="px-4 py-3">Throughput (Tokens/second)</td>
                      <td className="px-4 py-3 font-semibold">145.2 tok/s</td>
                      <td className="px-4 py-3 text-gray-600">Total output tokens per second across all concurrent requests. Primary vLLM optimization goal.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">Requests Per Second (RPS)</td>
                      <td className="px-4 py-3 font-semibold">12.4 req/s</td>
                      <td className="px-4 py-3 text-gray-600">Total number of complete requests processed per second.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-purple-700">Resource/System</td>
                      <td className="px-4 py-3">GPU KV-Cache Usage (%)</td>
                      <td className="px-4 py-3 font-semibold">73.2%</td>
                      <td className="px-4 py-3 text-gray-600">Percentage of GPU memory used by KV cache. High usage indicates memory pressure and preemption.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">Requests Running/Waiting/Swapped</td>
                      <td className="px-4 py-3 font-semibold">8/3/1</td>
                      <td className="px-4 py-3 text-gray-600">Request counts in different lifecycle stages, indicating load and scheduling efficiency.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">Number of Preemptions</td>
                      <td className="px-4 py-3 font-semibold">24</td>
                      <td className="px-4 py-3 text-gray-600">Cumulative count of stopped/swapped requests. High values indicate inefficiency.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">Prefix Cache Hit Rate</td>
                      <td className="px-4 py-3 font-semibold">87.3%</td>
                      <td className="px-4 py-3 text-gray-600">Percentage of shared prompt prefix KV cache block reuse. Key optimization metric.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-orange-700">Cost</td>
                      <td className="px-4 py-3">Cost Per Request/Token</td>
                      <td className="px-4 py-3 font-semibold">$0.0234 / $0.00089</td>
                      <td className="px-4 py-3 text-gray-600">Derived business metrics to measure financial efficiency of the deployment.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="space-y-6">
            {/* Token throughput */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h4 className="text-lg font-semibold mb-4">Token throughput</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="category1" stroke="#3B82F6" strokeWidth={2} name="Category 1" />
                  <Line type="monotone" dataKey="category2" stroke="#10B981" strokeWidth={2} name="Category 2" />
                  <Line type="monotone" dataKey="category3" stroke="#F59E0B" strokeWidth={2} name="Category 3" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Category 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Category 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Category 3</span>
                </div>
              </div>
            </div>

            {/* Request latency */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h4 className="text-lg font-semibold mb-4">Request latency</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="category1" stroke="#3B82F6" strokeWidth={2} name="Category 1" />
                  <Line type="monotone" dataKey="category2" stroke="#10B981" strokeWidth={2} name="Category 2" />
                  <Line type="monotone" dataKey="category3" stroke="#F59E0B" strokeWidth={2} name="Category 3" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Category 1</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Category 2</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Category 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Safety Tab Content */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          {/* Safety Report Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Red Hat LLM Analysis Report</h3>
              <p className="text-sm text-gray-600">TrustyAI LLM Eval results for {modelName}</p>
            </div>

            {/* Report Context */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Report context</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Model source</div>
                  <div className="text-gray-600">HF</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Model revision</div>
                  <div className="text-gray-600">039e39f2</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Data type</div>
                  <div className="text-gray-600">torch.bfloat16</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Batch size</div>
                  <div className="text-gray-600">2</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Transformers version</div>
                  <div className="text-gray-600">4.51.3</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">LM-Eval version</div>
                  <div className="text-gray-600">0.4.8</div>
                </div>
                <div className="md:col-span-3">
                  <div className="font-medium text-gray-700">Generated on</div>
                  <div className="text-gray-600">07 Mar 2025 12:34</div>
                </div>
                <div className="md:col-span-3">
                  <div className="font-medium text-gray-700">Github link</div>
                  <div className="text-blue-600 hover:underline cursor-pointer">
                    https://github.com/trustification/red-hat-dependency-analytics/issues/1
                  </div>
                </div>
              </div>
            </div>

            {/* Priority Safety Metrics */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Priority safety metrics</h4>
              <p className="text-sm text-gray-600 mb-4">
                This report prioritizes the following critical safety metrics: TruthfulQA (mc1), Toxigen (toxicity), Winogender (bias), CrowS-Pairs (stereotype), BBQ-Lite (bias agreement), Sycophancy Rate, MMLU-Harmful (harmful response), Ethics (consistency), and Safety Prompts (malicious compliance).
              </p>
              
              {/* Safety Metrics Chart */}
              <div className="bg-white border rounded-lg p-4">
                <div className="space-y-3">
                  {[
                    { name: 'crows_pairs_english_pct_stereotype', value: 0.85, impact: 'high', color: 'bg-red-500' },
                    { name: 'truthfulqa_mc1_acc', value: 0.35, impact: 'moderate', color: 'bg-orange-400' },
                    { name: 'bbq_accuracy_amb', value: 0.55, impact: 'moderate', color: 'bg-orange-400' },
                    { name: 'truthfulqa_mc1_acc', value: 0.45, impact: 'moderate', color: 'bg-orange-400' },
                    { name: 'bbq_amb_bias_score_Gender_identity', value: 0.78, impact: 'low', color: 'bg-green-500' },
                    { name: 'ethics_cm_acc', value: 0.82, impact: 'low', color: 'bg-green-500' },
                    { name: 'toxigen_acc', value: 0.79, impact: 'low', color: 'bg-green-500' },
                    { name: 'winogender_acc', value: 0.81, impact: 'low', color: 'bg-green-500' },
                    { name: 'bbq_acc', value: 0.65, impact: 'unknown', color: 'bg-gray-400' }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-40 text-xs text-gray-600 truncate">{metric.name}</div>
                      <div className="flex-1 mx-3">
                        <div className="w-full bg-gray-200 rounded-full h-4 relative">
                          <div 
                            className={`${metric.color} h-4 rounded-full`} 
                            style={{ width: `${metric.value * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 w-8">{metric.value.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-gray-600">High impact</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-400 rounded"></div>
                    <span className="text-gray-600">Moderate impact</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Low impact</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded"></div>
                    <span className="text-gray-600">Unknown impact</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Safety Guardrails */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Recommended safety guardrails</h4>
              <p className="text-sm text-gray-600 mb-4">
                Based on the evaluation results, we recommend implementing the following guardrails to address identified safety concerns:
              </p>
              
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Llama Guard 3</div>
                      <div className="text-sm text-gray-600">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mr-2">input_output</span>
                        Categories: toxicity, bias, harmful_content, ethics
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Perspective API</div>
                      <div className="text-sm text-gray-600">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mr-2">input_output</span>
                        Categories: toxicity, bias
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Azure content safety</div>
                      <div className="text-sm text-gray-600">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mr-2">input_output</span>
                        Categories: toxicity, bias
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Evaluation Task Details */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Evaluation task details</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">bbq</td>
                      <td className="px-4 py-3 text-gray-600">Bias Benchmark for QA - tests for social bias in question answering</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">My application</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">crows_pairs_english</td>
                      <td className="px-4 py-3 text-gray-600">CrowS-Pairs - measures stereotype bias in masked language models</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">My application</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">truthfulqa_mc1</td>
                      <td className="px-4 py-3 text-gray-600">TruthfulQA Multiple Choice - tests truthfulness in question answering</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">My application</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">toxigen</td>
                      <td className="px-4 py-3 text-gray-600">ToxiGen - tests for toxic content generation</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">My application</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">ethics_cm</td>
                      <td className="px-4 py-3 text-gray-600">Ethics Commonsense Morality - tests ethical reasoning</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">My application</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">winogender</td>
                      <td className="px-4 py-3 text-gray-600">Winogender - tests for gender bias in coreference resolution</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">My application</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ModelDetailView