import React from 'react'

const GuidelinesView = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RHOAI Foundational Observability UX</h1>
          <p className="text-gray-600">Last Updated: September 22, 2025</p>
        </div>

        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            This document outlines the user experience (UX) for the foundational observability features of AI model 
            deployments on RHOAI. The goal is to provide data scientists, AI/ML engineers, and platform 
            administrators with immediate, transparent visibility into AI workload performance, resource consumption, 
            and model serving health.
          </p>
        </section>

        {/* Design Problem */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Design Problem</h2>
          <p className="text-gray-700 leading-relaxed">
            Observability for AI workloads today is fragmented and complex. Unlike traditional applications, AI models 
            introduce unique metrics like inference latency and token generation rates that require specialized 
            monitoring. The current lack of a unified, out-of-the-box solution means customers have to build their own 
            monitoring stacks from scratch (Grafana). This leads to inconsistent data, manual overhead, and a 
            reactive approach to performance issues.
          </p>
        </section>

        {/* Problems by Persona */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Problems by Persona</h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900 mb-3">1. Platform Administrators</h3>
              <h4 className="font-medium text-red-800 mb-2">Lack of Infrastructure Visibility</h4>
              <p className="text-red-700">
                Admins don't have a clear, centralized view of how AI workloads are using cluster resources. They struggle 
                to see key metrics like GPU utilization and are unable to quickly identify and reclaim underutilized or 
                idle resources. Without this visibility, they can't effectively manage capacity or enforce policies.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">2. AI/ML Ops Engineers</h3>
              <h4 className="font-medium text-orange-800 mb-2">Unreliable Deployments</h4>
              <p className="text-orange-700">
                Ensuring the reliability and maintaining SLAs for AI models is a major challenge. There's no unified, 
                automated way to monitor the health and performance of model serving components and the underlying 
                infrastructure. This makes it difficult to troubleshoot issues and be alerted to performance degradation 
                before it impacts end-users.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">3. Data Scientists</h3>
              <h4 className="font-medium text-blue-800 mb-2">No Insight into Model Performance</h4>
              <p className="text-blue-700">
                After deploying a model, Data Scientists have a blind spot. They can't easily see how their model is 
                performing in a production environment. There is no simple way to track crucial metrics like inference 
                latency, throughput, and resource consumption without a complex, manual setup. This prevents them from 
                optimizing their models post-deployment and identifying performance regressions.
              </p>
            </div>
          </div>
        </section>

        {/* Personas & Key User Stories */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personas & Key User Stories</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Administrator</h3>
              <p className="text-gray-700 italic mb-3">
                "As a Platform Administrator, I want comprehensive visibility into accelerator infrastructure health and 
                resource allocation, so that I can proactively manage capacity, enforce policies, and support end-users 
                without additional setup."
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Key Story:</strong> Instantly view GPU/CPU/memory utilization across all projects and users, 
                    with the ability to drill down to individual workloads.</li>
                <li>• <strong>Key Story:</strong> Identify and reclaim underutilized or idle resources to maximize cluster efficiency.</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Scientists</h3>
              <p className="text-gray-700 italic mb-3">
                "As a Data Scientist, I want immediate, transparent visibility into my AI workload performance and 
                resource consumption, so that I can optimize models and experiments without setup complexity."
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Key Story:</strong> Track inference latency, throughput, and resource usage for deployed models 
                    as they go live.</li>
                <li>• <strong>Key Story:</strong> Access historical performance and accuracy data to identify optimization 
                    opportunities and regressions.</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI/ML Ops Engineers</h3>
              <p className="text-gray-700 italic mb-3">
                "As an AI/ML Ops Engineer, I want unified, automated monitoring and alerting for all AI infrastructure and 
                model serving components, so that I can ensure reliability, troubleshoot issues, and maintain SLAs with 
                minimal manual configuration."
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Key Story:</strong> Proactively alert about model performance degradation or resource bottlenecks.</li>
                <li>• <strong>Key Story:</strong> Gain comprehensive visibility into the health and performance of model serving 
                    deployments (e.g., vLLM, OpenVINO, KServe).</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Metrics & Visualizations */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Metrics & Visualizations</h2>
          <p className="text-gray-700 mb-6">
            The observability dashboard will provide key metrics across three layers: model, infrastructure, and deployment.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-3">📊 Model Metrics</h3>
              <p className="text-green-700 text-sm mb-4">
                Critical for evaluating model performance and automatically collected for vLLM and KServe deployments.
              </p>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• <strong>Inference Latency:</strong> Time to first token (TTFT), token generation rate, and end-to-end (E2E) response time distributions.</li>
                <li>• <strong>Throughput (TP):</strong> Requests per second (RPS).</li>
                <li>• <strong>Error Rate:</strong> The percentage of failed requests.</li>
              </ul>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">🖥️ Infrastructure Metrics</h3>
              <p className="text-purple-700 text-sm mb-4">
                Focuses on resource utilization and is accessible via the NVIDIA DCGM Exporter or equivalent for non-NVIDIA accelerators.
              </p>
              <ul className="space-y-2 text-purple-700 text-sm">
                <li>• <strong>GPU-specific Metrics:</strong> Temperature, power, utilization, and TensorCore usage.</li>
                <li>• <strong>CPU Metrics:</strong> CPU and memory utilization.</li>
                <li>• <strong>Resource Efficiency:</strong> Queue depths and concurrency throttling.</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">🩺 Model Serving Health Metrics</h3>
              <p className="text-blue-700 text-sm mb-4">
                Provides a high-level view of the overall deployment health.
              </p>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• <strong>Endpoint Availability:</strong> Uptime and status of the serving endpoint.</li>
                <li>• <strong>Response Time Distributions:</strong> Detailed breakdown of how long requests take to complete.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* UX Structure & Principles */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">UX Structure & Principles</h2>
          <p className="text-gray-700 mb-6">
            The observability experience is structured into two main views to serve our distinct user personas. 
            Additional Tabs may be added depending on the feature requests.
          </p>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Admin Observability</h3>
              <p className="text-gray-700 mb-4">
                Dedicated left-navigation entry for Platform Admins and Cluster Administrators. This view provides a fleet-wide perspective.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Scope:</strong> Health, capacity, and usage across all projects.</li>
                <li>• <strong>Audience:</strong> Platform Admins for monitoring system stability and resource planning.</li>
                <li>• <strong>Tabs:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>- Cluster View: Aggregated graphs for accelerators (GPU/CPU) across all projects.</li>
                    <li>- Models View: A table-based view of all deployed models, allowing for selection to view aggregated inference metrics.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Deployment Detail</h3>
              <p className="text-gray-700 mb-4">
                A tab accessible from within each Model Deployment for AI Engineers and Data Scientists. This view provides a deep dive into a single deployment.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Scope:</strong> Performance and health of a single deployment.</li>
                <li>• <strong>Audience:</strong> AI Engineers for debugging and optimizing their models.</li>
                <li>• <strong>Tabs:</strong>
                  <ul className="ml-4 mt-1 space-y-1">
                    <li>- Performance: Detailed model-specific metrics like latency, throughput, and error rates.</li>
                    <li>- Health: Status and health of the deployment.</li>
                    <li>- Usage: Token and replica usage, and cost information.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Shared UX Principles */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shared UX Principles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Zero-Configuration</h4>
              <p className="text-green-700 text-sm">The entire monitoring stack is automatically enabled upon OpenShift AI installation.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Immediate Visibility</h4>
              <p className="text-blue-700 text-sm">All dashboards are accessible within one hour of deployment.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Performance Baseline</h4>
              <p className="text-purple-700 text-sm">Monitoring infrastructure with less than 5% overhead on AI workload performance.</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-2">Consistency</h4>
              <p className="text-orange-700 text-sm">Users will see a single, pre-configured, read-only dashboard. Global filters (namespace, project, runtime) will be consistent across all views.</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 mb-2">Onboarding</h4>
              <p className="text-yellow-700 text-sm">Users without deployments will land on an empty state with clear instructions on how to get started with observability.</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold text-indigo-900 mb-2">Deep Links</h4>
              <p className="text-indigo-700 text-sm">Filters are preserved when navigating between the Admin and Deployment Detail views, enabling seamless drill-downs.</p>
            </div>
          </div>
        </section>

        {/* Customization & Access Control */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customization & Access Control</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customization</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>No UI customization for MVP:</strong> Users will consume a pre-defined, read-only artifact. 
                  This ensures that everyone in the organization sees the exact same dashboard.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Access & User Management</h3>
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-700">
                    <strong>Admin Permissions:</strong> Only users with admin permissions can access the fleet-wide observability 
                    dashboard. This prevents regular users from seeing sensitive, aggregated data across projects they don't have access to.
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700">
                    <strong>Role-Based Access Control:</strong> Monitoring data will be properly isolated and accessible based on 
                    user roles and project boundaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default GuidelinesView