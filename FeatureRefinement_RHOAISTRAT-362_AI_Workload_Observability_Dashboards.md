# Feature Refinement Template

**Document Name:** `FeatureRefinement - RHOAISTRAT-362 - AI Workload Observability Dashboards`

**Feature Jira Link:** RHOAISTRAT-362

**Status:** In Progress
**Slack Channel / Thread:** *(TBD)*
**Feature Owner:** *(TBD)*
**Delivery Owner:** *(TBD)*
**RFE Council Reviewer:** *(TBD)*
**Product:** RHOAI - Self-Managed

------------------------------------------------------------------------

## 1. Feature Overview

This feature delivers persona-based observability dashboards for AI workloads deployed on OpenShift AI, embedded directly within the RHOAI console using the Perses visualization library.

**Who benefits:**
- **Cluster Administrators / Platform Admins**: Monitor infrastructure health, resource utilization, capacity planning, and multi-tenant resource allocation across all AI workloads
- **Data Scientists**: Monitor individual model performance, troubleshoot issues, optimize resource usage, and understand traffic patterns for their deployed models

**How it changes the current state:**
Currently, users must leave the OpenShift AI console and manually configure external visualization tools (Grafana) to monitor AI workloads. This feature provides pre-configured, role-based dashboards integrated directly into the RHOAI console, eliminating manual setup and context switching.

**Example user narrative:**
As a cluster administrator, when I log into the OpenShift AI console in the morning, I navigate to the Observability section and immediately see the infrastructure health status across all nodes and GPUs. I can quickly identify that GPU utilization is at 82% cluster-wide, with the "data-science-team-a" namespace consuming 45% of total GPU hours. I drill down to see 3 models in that namespace and notice one model has been idle for 24 hours, allowing me to reclaim those resources.

As a data scientist, after deploying my LLM model, I navigate to the Model Serving observability tab to monitor its performance. I see my model's P99 latency is 245ms with a 99.7% success rate, and my GPU utilization is at 68%. I notice a latency spike 2 hours ago that correlates with a traffic increase, confirming my model scaled appropriately.

------------------------------------------------------------------------

## 2. The Why

**Why now:**
- AI workloads, particularly GPU-intensive model serving, are becoming production-critical for enterprises
- Lack of integrated observability is a top friction point for AI platform adoption and operational maturity
- Competitors (Databricks, SageMaker) provide integrated monitoring dashboards; we need feature parity
- RHOAI now has foundational metrics collection infrastructure (RHOAISTRAT-575) that enables visualization layer

**What it brings to the platform:**
- Production-ready observability experience without manual configuration
- Faster time-to-value for AI platform users (from hours of Grafana setup to immediate access)
- Proactive issue detection and troubleshooting for AI workloads
- Resource optimization insights to reduce GPU waste and infrastructure costs
- Multi-tenant visibility for fair resource allocation and chargeback

**Customer benefits:**
- **Enterprises running production AI**: Operational visibility for SLA compliance, incident response, and cost management
- **Platform teams**: Capacity planning data, multi-tenant resource governance, infrastructure health monitoring
- **Data science teams**: Model performance insights, debugging capabilities, resource optimization

**Supporting data:**
- Customer requests for integrated observability (RHOAIRFE-XXX references)
- Observability gaps identified in RHOAISTRAT-575 discovery
- Industry standard: All major ML platforms provide integrated monitoring dashboards

**Success metrics:**
- Time to access observability data: <1 minute (vs. 30+ minutes for manual Grafana setup)
- User adoption: >60% of RHOAI users access dashboards within first week of deployment
- Issue detection time: Reduce mean-time-to-detect (MTTD) for model performance issues by 50%

------------------------------------------------------------------------

## 3. High-Level Requirements

### Cluster Administrator Dashboard Requirements

#### Infrastructure Observability Tab

> As a cluster administrator, I want to monitor infrastructure health across all nodes and GPUs, so that I can proactively detect hardware issues and ensure platform reliability.

**Metrics and visualizations:**
- Overall cluster health status card with four health dimensions: Node Health, Workload Health, Resource Health, Performance Health
- Node status table showing all nodes with Ready/NotReady status, GPU count, CPU/Memory/GPU utilization %, and node conditions
- GPU health heatmap showing all GPUs color-coded by utilization with hover details for GPU ID, utilization %, memory usage, temperature
- Node resource utilization trends (time series) for GPU/CPU/Memory utilization % over 24h with threshold lines at 70% (yellow) and 85% (red)
- GPU temperature and power consumption dual-axis time series showing min/avg/max across all GPUs

> As a cluster administrator, I want to monitor resource allocation and utilization across namespaces, so that I can optimize resource distribution and identify waste.

**Metrics and visualizations:**
- GPU utilization by namespace stacked area chart showing each namespace's GPU usage over 24h
- Resource allocation vs usage grouped bar chart per namespace comparing allocated vs used for GPU/Memory/CPU
- Top resource consumers table with columns for namespace, GPU hours (last 24h with 7d sparkline), memory GB-hours, and efficiency score (used/allocated ratio)

#### Model Serving Observability Tab

> As a cluster administrator, I want to monitor model serving performance and health across all deployed models, so that I can ensure SLAs are met and identify underperforming models.

**Metrics and visualizations:**
- Model endpoint status donut chart showing breakdown of InferenceService status (Ready, Progressing, Failed, Unknown) with total count and 24h availability %
- Request success rate single stat with time series showing success rate over 24h with SLA threshold line at 99%
- Latency percentiles multi-line time series for P50/P90/P95/P99 latency with SLA threshold lines
- Error rate breakdown stacked area chart showing 4xx errors, 5xx errors, timeout errors, and other errors per minute over 24h
- LLM-specific performance stat panel showing Time to First Token (TTFT) P50/P99, Token Generation Rate avg/p90, current throughput (requests/sec), and current queue depth
- Top models by request volume horizontal bar chart showing top 10 models by requests/sec, colored by health status

> As a cluster administrator, I want to view multi-tenant resource consumption, so that I can ensure fair resource sharing and enable chargeback.

**Metrics and visualizations:**
- Resource consumption by namespace tree map with each namespace sized by GPU hours consumed, colored by efficiency score
- Quota utilization horizontal bar chart per namespace showing used/quota ratio for GPU/Memory/CPU with color coding (green <70%, yellow 70-90%, red >90%)
- Active vs idle models stacked bar chart by namespace showing models receiving traffic vs models with no traffic in last 1h

### Data Scientist Dashboard Requirements

#### My Models Overview

> As a data scientist, I want to see the status of all my deployed models at a glance, so that I can quickly identify issues requiring attention.

**Metrics and visualizations:**
- My models card grid showing each model with status indicator (healthy/degraded/down), current requests/sec, P99 latency, error rate %, and last deployed timestamp
- Quick stats panel showing total active models, total requests today, average P99 latency, and average success rate across all my models

#### Model Performance Metrics (per selected model)

> As a data scientist, I want to monitor my model's latency and throughput, so that I can ensure good user experience and identify performance degradation.

**Metrics and visualizations:**
- Model summary card showing model name, version, runtime, deployment time, replica count (ready/desired), and resource allocation
- Latency percentiles time series showing P50/P90/P99 latency over 24h with deployment event annotations and SLA threshold lines
- LLM-specific performance dual time series showing Time to First Token (TTFT) P50/P99 and Token Generation Rate (tokens/sec) avg/p90
- Throughput and request volume area chart with line overlay showing request volume (requests/sec) as area and successful requests/sec as line
- Request success rate single stat with 7-day sparkline showing success rate trend

#### Model Health and Errors

> As a data scientist, I want to monitor my model's health and error rates, so that I can troubleshoot issues and maintain model reliability.

**Metrics and visualizations:**
- Endpoint availability uptime gauge showing 7-day uptime % with visual timeline bar showing uptime/downtime periods
- Error rate over time stacked area chart showing 4xx errors, 5xx errors, and timeout errors per minute over 24h
- Top error messages table showing error message/type, count in last 24h, first seen timestamp, last seen timestamp
- Pod health and restarts status table showing list of pods with status, restart count in last 24h, and timeline showing pod lifecycle

#### Resource Usage and Efficiency

> As a data scientist, I want to monitor my model's resource usage, so that I can optimize costs and be a good cluster citizen.

**Metrics and visualizations:**
- GPU utilization gauge and time series showing current GPU utilization % with time series over 24h and per-replica breakdown
- GPU memory usage stacked bar and time series showing used/allocated/available GPU memory with time series over time
- CPU and system memory dual-axis time series showing CPU % utilization and system memory % utilization per replica
- Resource efficiency score card (0-100) based on GPU utilization, memory efficiency, request success rate, with optimization recommendations

#### Traffic Patterns and Usage

> As a data scientist, I want to understand my model's traffic patterns, so that I can plan for scaling and optimize for peak usage times.

**Metrics and visualizations:**
- Request volume timeline area chart showing requests per hour over last 7 days with peak traffic times highlighted
- Traffic heatmap (calendar view) showing hour of day (0-23) vs day of week with color intensity indicating request volume
- Input/output token distribution histogram (for LLMs) showing distribution of input token counts and output token counts
- Request duration distribution histogram showing latency buckets with request counts and P50/P90/P99 overlay markers

------------------------------------------------------------------------

## 4. Non-Functional Requirements

### Performance
- Dashboard load time: <3 seconds for initial render
- Real-time data refresh: Support auto-refresh intervals of 30s, 1m, 5m
- Time series query performance: <2 seconds for 24h data queries
- Support concurrent access by 100+ users without degradation

### Security
- Role-based access control (RBAC) integration with OpenShift authentication
- Cluster admins see all namespaces; data scientists see only their namespaces based on OpenShift project permissions
- Dashboard views must respect multi-tenant data isolation (namespace boundaries)
- Secure data source connections to Prometheus/metrics backends

### User Experience
- Dashboards embedded seamlessly within RHOAI console UI using Perses library
- Consistent look-and-feel with RHOAI console (PatternFly design system)
- Mobile-responsive design for dashboard views
- Tooltips and contextual help for metrics interpretation
- Accessible UI meeting WCAG 2.1 AA standards

### Scalability
- Support monitoring of 100+ deployed models per cluster
- Support 50+ namespaces with multi-tenant isolation
- Time series data retention: 7 days minimum, 30 days preferred
- Handle metric cardinality for large-scale deployments

### Compatibility
- Works with all supported KServe runtimes (vLLM, OpenVINO, TorchServe, etc.)
- Compatible with RHOAI metrics collection infrastructure (RHOAISTRAT-575)
- No dependency on external Grafana installation for Phase 2

------------------------------------------------------------------------

## 5. Out of Scope

- **Alerting and notification capabilities**: To be addressed in separate dedicated Alerting RFE (future work)
- **Metrics collection infrastructure**: Covered by existing initiatives (RHOAIENG-28166 for vLLM, RHOAIENG-12528 for KServe, RHOAIENG-25597 for OpenVINO)
- **Third-party metrics export**: Covered by RHOAIENG-25581 & RHOAIENG-25586
- **Custom dashboard creation UI**: Phase 1 and 2 provide pre-configured dashboards only; custom dashboard builder is future work
- **Historical data beyond 30 days**: Long-term metrics storage and analysis
- **Cost calculation and billing integration**: Cost metrics shown only if pricing data available; billing system integration is separate effort
- **Automated remediation workflows**: Dashboards provide visibility only; automation/remediation is future work
- **Observability for notebooks, pipelines, training jobs**: Focus is model serving only for initial release; other workload types in future phases
- **Distributed tracing integration**: Metrics and logs only; traces integration is future work
- **Anomaly detection and AI-powered insights**: Advanced analytics capabilities for future releases

------------------------------------------------------------------------

## 6. Acceptance Criteria

### Infrastructure Observability Tab

> Given I am a cluster administrator logged into RHOAI console,
> When I navigate to Observability → Infrastructure tab,
> Then I see overall cluster health status, node status table, GPU health heatmap, resource utilization trends, and multi-tenant resource breakdown.

> Given there is a node with MemoryPressure condition,
> When I view the Infrastructure tab,
> Then the overall cluster health shows "Yellow" degraded status and the node status table highlights the affected node with condition details.

> Given GPU utilization exceeds 85% cluster-wide,
> When I view the resource utilization trends graph,
> Then I see the utilization line cross the red threshold and the graph is color-coded to indicate critical level.

### Model Serving Observability Tab

> Given I am a cluster administrator,
> When I navigate to Observability → Model Serving tab,
> Then I see model endpoint status overview, latency percentiles, error rates, and top models by traffic volume across all namespaces.

> Given a model's P99 latency exceeds SLA threshold,
> When I view the latency percentiles graph,
> Then I see the P99 line cross the threshold line and the metric is highlighted with warning color.

> Given I want to investigate resource consumption by namespace,
> When I view the resource consumption tree map,
> Then I can click on a namespace to drill down to detailed resource usage for that namespace.

### Data Scientist Dashboard

> Given I am a data scientist with deployed models,
> When I navigate to Observability → My Models,
> Then I see only models deployed in namespaces where I have view permissions, with status, performance metrics, and health indicators for each model.

> Given I select a specific model from my models list,
> When I view the model performance section,
> Then I see latency percentiles, throughput, success rate, LLM-specific metrics (if applicable), and resource utilization for that model.

> Given my model has error rate spike in the last hour,
> When I view the model health section,
> Then I see the error rate graph show the spike, the top error messages table populated with recent errors, and pod health status indicating any pod restarts.

### General Acceptance Criteria

> Given I access dashboards for the first time,
> When the dashboard loads,
> Then all panels render within 3 seconds and display data without manual configuration.

> Given I have auto-refresh enabled at 30-second interval,
> When new metrics data is available,
> Then dashboard panels update automatically without full page reload.

> Given I am viewing a time series graph,
> When I hover over a data point,
> Then I see a tooltip with timestamp, metric value, and contextual information.

> Given I am a user with limited namespace access,
> When I view any dashboard,
> Then I see only data from namespaces where I have view permissions (multi-tenant isolation enforced).

------------------------------------------------------------------------

## 7. Risks & Assumptions

### Risks

- **Metrics infrastructure availability**: Dashboards depend on RHOAISTRAT-575 metrics collection being fully functional and deployed. If metrics backend is unavailable or incomplete, dashboards will show no data or partial data.
- **Performance at scale**: Time series queries for 100+ models with high cardinality metrics may impact dashboard load times. Mitigation: Implement query optimization and pagination.
- **Perses library maturity**: Perses is a CNCF Sandbox project; potential for breaking changes or missing features. Mitigation: Pin to stable version, contribute upstream if needed.
- **Multi-tenancy enforcement**: Incorrect RBAC configuration could expose cross-namespace data. Mitigation: Thorough security testing and RBAC validation.
- **User adoption**: Users may continue using existing Grafana setups if embedded dashboards lack features. Mitigation: Ensure feature parity with common Grafana use cases in Phase 1.

### Assumptions

- Prometheus-compatible metrics backend is deployed and accessible (RHOAISTRAT-575)
- All KServe runtimes (vLLM, OpenVINO, TorchServe) expose standard serving metrics (RHOAIENG-28166, RHOAIENG-12528, RHOAIENG-25597)
- RHOAI console UI supports embedding third-party React components (Perses panels)
- Users have OpenShift authentication and RBAC configured for namespace access control
- Metrics retention policy provides at least 7 days of historical data
- GPU metrics (utilization, memory, temperature, power) are available via DCGM exporter or equivalent

------------------------------------------------------------------------

## 8. Supporting Documentation

- **RHOAISTRAT-362 Requirements Document**: `/workspace/sessions/agentic-session-1763094882/workspace/odh-dashboard/RHOAISTRAT-362.md`
- **RHOAISTRAT-575**: Centralized Platform Metrics (foundation for metrics collection)
- **Perses Documentation**: https://perses.dev
- **Perses GitHub Repository**: https://github.com/perses/perses
- **Dashboard Design Brainstorm**: (Session notes from 2025-11-14 with detailed panel designs)
- **UX Designs**: *(To be created by UXD team - see Section 12)*
- **Technical Architecture Document**: *(To be created during implementation planning)*

------------------------------------------------------------------------

## 9. Additional Clarifying Info

### Dashboard Navigation Structure

The observability dashboards will be organized as follows:

**For Cluster Administrators:**
- Tab 1: **Infrastructure** - Node health, GPU health, resource utilization, capacity planning (infrastructure-agnostic metrics)
- Tab 2: **Model Serving** - Model endpoint status, performance/SLA metrics, model-specific health (model serving-specific metrics)

**For Data Scientists:**
- Single dashboard view with sections: My Models Overview, Model Performance Metrics (per selected model), Model Health, Resource Usage, Traffic Patterns

This tab structure allows clear separation between infrastructure-level concerns (applicable to all workload types) and model serving-specific observability. Future workload types (notebooks, pipelines) can be added as additional tabs without disrupting the existing structure.

### Perses Library Integration

Perses is a CNCF Sandbox project that provides embeddable observability panels and dashboards. Key benefits:
- **Embeddable React components**: npm packages for integrating panels into RHOAI console UI
- **Prometheus native**: Built for Prometheus metrics, aligns with RHOAI metrics backend
- **Dashboard-as-Code**: JSON/YAML dashboard definitions for GitOps workflows
- **Extensible plugin architecture**: Can extend with custom panel types if needed
- **Open specification**: Vendor-neutral dashboard specification

The RHOAI console will embed Perses panels using the `@perses-dev/panels` and `@perses-dev/plugin-system` npm packages.

### Health Status Calculation

Overall cluster health is calculated across four dimensions:

1. **Node Health**: Based on node Ready status, pressure conditions (MemoryPressure, DiskPressure), and GPU hardware errors
   - Green: All nodes Ready, no pressure conditions
   - Yellow: Some nodes with pressure OR <20% nodes NotReady
   - Red: >20% nodes NotReady OR critical nodes down

2. **Workload Health**: Based on pod status and model endpoint availability
   - Green: >95% pods Running/Succeeded, no CrashLoopBackOff
   - Yellow: 90-95% pods healthy OR some pods restarting frequently
   - Red: <90% pods healthy OR critical system pods failing

3. **Resource Health**: Based on cluster-wide resource utilization
   - Green: <70% average resource utilization
   - Yellow: 70-85% utilization OR pockets of saturation
   - Red: >85% utilization sustained OR resource exhaustion

4. **Performance Health**: Based on SLA compliance
   - Green: P99 latency within SLA, <1% error rate
   - Yellow: P99 latency 1-2x SLA OR 1-5% error rate
   - Red: P99 latency >2x SLA OR >5% error rate

Overall health status uses "worst status wins" approach: if any dimension is Red, overall is Red; if any is Yellow, overall is Yellow; else Green.

### Phase 1 vs Phase 2 Scope Clarification

Given the focus on integrated console experience, **this feature refinement targets Phase 2 (RHOAI Console Integration)** as the primary deliverable for 3.3 release.

Phase 1 (Reference Grafana Dashboards) is considered out of scope for this immediate release, as the goal is to provide embedded observability within the RHOAI console, not external Grafana templates.

------------------------------------------------------------------------

## 10. Prerequisites & Dependencies

### ODH / RHOAI Build Process

- **Will this feature onboard a new container image or component?** NO
  - Perses is integrated as npm packages in the RHOAI console frontend build; no new container images required

### License Validation

- **Will this feature bring in new upstream projects/sub-projects?** YES
  - **Project**: Perses (https://github.com/perses/perses)
  - **License**: Apache 2.0 ✅
  - **CNCF Status**: Sandbox project
  - **Justification**: Apache 2.0 license is preferred and acceptable. Perses is a CNCF project with open governance.

### Accelerator / Package Support

- **Requires AIPCC team support?** NO
  - This is a visualization/UI feature; does not require accelerator-specific support

### Architecture Review

- **"requires_architecture_review" label present?** YES
- **RFE indicates "Requires architecture review"?** YES
  - **Review topics**:
    - Perses library integration approach with RHOAI console UI architecture
    - Metrics backend connectivity and multi-tenancy data isolation enforcement
    - RBAC integration with OpenShift authentication
    - Performance considerations for time series queries at scale
  - **Recommendation**: Review at OpenShift AI Architecture Forum before committing to implementation design

### Other Dependencies

- **RHOAISTRAT-575 (Centralized Platform Metrics)**: REQUIRED
  - Provides foundational metrics collection infrastructure
  - Status: In progress / needs confirmation
  - Impact if delayed: Dashboards will have no data to display

- **RHOAIENG-28166 (vLLM metrics collection)**: REQUIRED for vLLM model metrics
  - Status: Needs confirmation
  - Impact if unavailable: vLLM models will show incomplete metrics

- **RHOAIENG-12528 (KServe metrics integration)**: REQUIRED for KServe serving metrics
  - Status: Needs confirmation
  - Impact if unavailable: KServe models will show incomplete metrics

- **RHOAIENG-25597 (OpenVINO metrics collection)**: REQUIRED for OpenVINO model metrics
  - Status: Needs confirmation
  - Impact if unavailable: OpenVINO models will show incomplete metrics

- **RHOAI Console UI Team**: REQUIRED for embedding Perses components
  - Needs coordination on React component integration, routing, and RBAC enforcement

- **DCGM Exporter or equivalent**: REQUIRED for GPU hardware metrics (temperature, power, memory)
  - Needs confirmation if deployed by default in RHOAI clusters
  - Impact if unavailable: GPU health metrics will be limited to utilization only

------------------------------------------------------------------------

## 11. High-Level Plan

| Team Involved               | Start Date | Work My Team Will Deliver (Epic)                                      | Dependencies                                                  | T-Shirt Size | Approval / Comments |
|-----------------------------|------------|------------------------------------------------------------------------|---------------------------------------------------------------|--------------|---------------------|
| team-ai-core-platform       | TBD        | Perses library integration into RHOAI console UI                      | Console UI architecture, RBAC integration                     | L            |                     |
| team-ai-core-platform       | TBD        | Cluster Admin Infrastructure observability tab implementation         | RHOAISTRAT-575 metrics availability                           | M            |                     |
| team-ai-core-platform       | TBD        | Cluster Admin Model Serving observability tab implementation          | KServe/vLLM/OpenVINO metrics (RHOAIENG-28166, 12528, 25597)   | L            |                     |
| team-ai-core-platform       | TBD        | Data Scientist dashboard implementation                                | Metrics backend, RBAC for namespace filtering                 | L            |                     |
| team-ai-core-platform       | TBD        | Multi-tenancy and RBAC enforcement for dashboards                     | OpenShift authentication integration                          | M            |                     |
| team-ai-core-platform       | TBD        | Performance testing and optimization for scale (100+ models)          | Test environment with realistic data scale                    | S            |                     |
| UXD Team                    | TBD        | Dashboard UX designs, wireframes, and user flow validation            | Feature refinement approval                                   | M            |                     |
| Docs Team                   | TBD        | User documentation for observability dashboards                        | Feature implementation completion                             | S            |                     |
| QE Team                     | TBD        | Test plan, functional testing, RBAC/security testing                 | Feature implementation completion                             | M            |                     |

**Estimated Total Effort**: 3-4 engineer-months (depends on Perses integration complexity and metrics backend readiness)

**Target Release**: RHOAI 3.3 (subject to dependency completion and architecture review)

------------------------------------------------------------------------

## 12. How to Engage Docs & UXD

### Docs

- **Action Items**:
  - Add "Documentation" component to RHOAISTRAT-362 Jira
  - Set *Product Documentation Required* = Yes
  - Follow the [Docs Intake Process](https://docs.google.com/document/d/1G_LKipII0DMX3UxpkxVEpgM9Pk5tHcfZdvnkjn9E1mI/edit?tab=t.0)
- **Documentation Needed**:
  - User guide: How to access and navigate observability dashboards
  - Metrics reference: Explanation of all metrics shown in dashboards
  - Troubleshooting guide: Interpreting health status and common issues
  - Administrator guide: RBAC configuration for dashboard access

### UXD

- **Action Items**:
  - Add "UXD" component to RHOAISTRAT-362 Jira
  - Include UXD team in High-Level Plan (Section 11)
  - Reach out to [Jenn Giardino](mailto:jgiardin@redhat.com) or [Beau Morley](mailto:bmorley@redhat.com)
- **UX Deliverables Needed**:
  - Dashboard wireframes for both personas (Cluster Admin, Data Scientist)
  - Navigation patterns and tab structure within RHOAI console
  - Panel layout and visual hierarchy for each dashboard section
  - Responsive design considerations for different screen sizes
  - Accessibility review (WCAG 2.1 AA compliance)
  - User testing and validation with target personas

**Note**: UXD engagement should occur early (before implementation) to validate dashboard designs align with user workflows and RHOAI console design patterns.
