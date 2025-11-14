# Feature Refinement - RHOAISTRAT-362 - AI Workload Observability Dashboards

**Feature Jira Link:** RHOAISTRAT-362

**Status:** In Progress
**Feature Owner:** *(TBD)*
**Delivery Owner:** *(TBD)*
**Product:** RHOAI - Self-Managed

------------------------------------------------------------------------

## 1. Feature Overview

Persona-based observability dashboards embedded in RHOAI console using Perses, providing infrastructure and model serving metrics without manual configuration.

**Personas:**
- **Cluster Admins**: Infrastructure health, resource utilization, capacity planning, multi-tenant allocation
- **Data Scientists**: Model performance, troubleshooting, resource optimization, traffic patterns

**Current state → Future state:**
External Grafana setup (30+ min) → Integrated console dashboards (<1 min access)

------------------------------------------------------------------------

## 2. The Why

**Why now:** GPU workloads are production-critical, competitors have integrated dashboards, RHOAISTRAT-575 metrics foundation is ready

**Value:** Zero-config observability, faster troubleshooting, GPU cost optimization, multi-tenant fairness

------------------------------------------------------------------------

## 3. High-Level Requirements

### Cluster Administrator Dashboards

**Infrastructure Tab** - Monitor cluster health and resources
- Cluster health card (Node/Workload/Resource/Performance dimensions)
- Node status table with GPU count, utilization %, conditions
- GPU utilization trends (time series: GPU/CPU/Memory with 70%/85% thresholds)
- GPU temperature & power (dual-axis time series)
- GPU utilization by namespace (stacked area chart)
- Resource allocation vs usage by namespace (grouped bar chart)
- Top resource consumers table (with efficiency scores)

**Model Serving Tab** - Monitor model performance and SLAs
- Model endpoint status (donut chart: Ready/Progressing/Failed/Unknown)
- Request success rate (stat + time series, 99% SLA threshold)
- Latency percentiles (P50/P90/P95/P99 time series with SLA lines)
- Error rate breakdown (stacked area: 4xx/5xx/timeout errors)
- LLM metrics (TTFT P50/P99, token rate, throughput, queue depth)
- Top models by traffic (horizontal bar chart)
- Resource consumption tree map by namespace
- Quota utilization by namespace (horizontal bars: GPU/Memory/CPU)

### Data Scientist Dashboard

**My Models View** - Per-model monitoring and optimization
- Models card grid (status, requests/sec, P99 latency, error rate)
- Quick stats (total models, requests today, avg latency, success rate)
- Latency percentiles time series (P50/P90/P99 with deployment annotations)
- LLM performance (TTFT, token generation rate)
- Throughput & request volume (area chart)
- Endpoint availability (uptime gauge + 7d timeline)
- Error rate time series (stacked area: 4xx/5xx/timeout)
- Top error messages table
- Pod health & restarts (status table + timeline)
- GPU utilization (gauge + time series + per-replica breakdown)
- GPU memory usage (stacked bar + time series)
- Resource efficiency score (0-100 with recommendations)
- Request volume timeline (7d hourly area chart)
- Traffic heatmap (hour of day × day of week)
- Token distribution histogram (input/output for LLMs)

------------------------------------------------------------------------

## 4. Non-Functional Requirements

- **Performance**: <3s dashboard load, <2s query response, support 100+ concurrent users
- **Security**: OpenShift RBAC integration, multi-tenant data isolation by namespace
- **UX**: Embedded Perses panels, PatternFly design, mobile-responsive, WCAG 2.1 AA
- **Scalability**: Support 100+ models, 50+ namespaces, 7-30 day retention

------------------------------------------------------------------------

## 5. Out of Scope

- Alerting and notifications (separate RFE)
- Metrics collection infrastructure (RHOAIENG-28166, 12528, 25597)
- Custom dashboard builder UI
- Historical data >30 days
- Cost billing integration
- Observability for notebooks/pipelines/training (future)
- Distributed tracing
- Anomaly detection

------------------------------------------------------------------------

## 6. Acceptance Criteria

**Infrastructure Tab**
- Given cluster admin role, when I navigate to Observability → Infrastructure, then I see cluster health, node table, GPU metrics, and resource trends
- Given GPU utilization >85%, when viewing trends graph, then threshold line is crossed and colored red
- Given node with MemoryPressure, when viewing health card, then status shows "Yellow" and node is highlighted in table

**Model Serving Tab**
- Given cluster admin role, when I navigate to Observability → Model Serving, then I see endpoint status, latency, errors, and top models across all namespaces
- Given model P99 latency exceeds SLA, when viewing latency graph, then P99 line crosses threshold and is highlighted
- Given namespace resource tree map, when clicking namespace, then drill down to detailed usage

**Data Scientist Dashboard**
- Given data scientist role, when viewing My Models, then I see only models in my namespaces with status and metrics
- Given selected model, when viewing performance section, then I see latency, throughput, success rate, and resource usage
- Given error spike in last hour, when viewing health section, then error graph shows spike and top errors table is populated

**General**
- Given first access, when dashboard loads, then all panels render within 3 seconds without manual config
- Given auto-refresh enabled (30s), when new data available, then panels update without full page reload
- Given limited namespace access, when viewing any dashboard, then only data from permitted namespaces is shown

------------------------------------------------------------------------

## 7. Risks & Assumptions

**Risks:**
- RHOAISTRAT-575 metrics backend unavailable → no data to display
- Perses (CNCF Sandbox) breaking changes → pin stable version
- Multi-tenancy RBAC misconfiguration → thorough security testing required
- Time series query performance at scale → implement pagination/optimization

**Assumptions:**
- Prometheus-compatible backend deployed (RHOAISTRAT-575)
- KServe runtimes expose standard metrics (vLLM, OpenVINO, TorchServe)
- RHOAI console supports embedding React components (Perses panels)
- OpenShift RBAC configured for namespace access control
- GPU metrics available via DCGM exporter or equivalent

------------------------------------------------------------------------

## 8. Supporting Documentation

- RHOAISTRAT-362 Requirements: `/workspace/.../RHOAISTRAT-362.md`
- RHOAISTRAT-575: Centralized Platform Metrics (foundation)
- Perses: https://perses.dev
- Dashboard Mockup: `/workspace/.../perses-dashboards/`

------------------------------------------------------------------------

## 9. Additional Clarifying Info

**Dashboard Navigation:**
- **Cluster Admin**: Tab 1 (Infrastructure), Tab 2 (Model Serving)
- **Data Scientist**: Single view with model selection
- Future extensibility for notebooks/pipelines/training workloads

**Perses Integration:**
- CNCF Sandbox project, Apache 2.0 license
- Embeddable React components via npm (`@perses-dev/panels`)
- Prometheus-native, Dashboard-as-Code support

**Health Calculation (4 dimensions):**
1. **Node Health**: Green (all Ready), Yellow (some pressure), Red (>20% NotReady)
2. **Workload Health**: Green (>95% pods healthy), Yellow (90-95%), Red (<90%)
3. **Resource Health**: Green (<70% util), Yellow (70-85%), Red (>85%)
4. **Performance Health**: Green (within SLA, <1% errors), Yellow (1-2x SLA, 1-5% errors), Red (>2x SLA, >5% errors)

Overall status: Worst dimension wins (any Red → Red, any Yellow → Yellow, else Green)

------------------------------------------------------------------------

## 10. Prerequisites & Dependencies

**ODH / RHOAI Build:** No new container images (npm packages only)

**License:** Perses - Apache 2.0 (CNCF Sandbox) ✅

**Accelerator Support:** Not required

**Architecture Review:** **YES** - Review needed for:
- Perses integration with RHOAI console
- Metrics backend connectivity & multi-tenancy enforcement
- RBAC integration with OpenShift auth
- Time series query performance at scale

**Dependencies:**
- **RHOAISTRAT-575** (Centralized Metrics) - REQUIRED
- **RHOAIENG-28166** (vLLM metrics) - REQUIRED for vLLM
- **RHOAIENG-12528** (KServe metrics) - REQUIRED for KServe
- **RHOAIENG-25597** (OpenVINO metrics) - REQUIRED for OpenVINO
- **DCGM Exporter** - REQUIRED for GPU hardware metrics
- **RHOAI Console UI Team** - REQUIRED for embedding coordination

------------------------------------------------------------------------

## 11. High-Level Plan

| Team Involved               | Start Date | Work My Team Will Deliver (Epic) | Dependencies | T-Shirt Size | Approval / Comments |
|-----------------------------|------------|-----------------------------------|--------------|--------------|---------------------|
| team-ai-core-platform       |            |                                   |              |              |                     |
| *(required)*                |            |                                   |              |              |                     |

------------------------------------------------------------------------

## 12. How to Engage Docs & UXD

**Docs:**
- Add "Documentation" component to RHOAISTRAT-362
- Set *Product Documentation Required* = Yes
- Follow [Docs Intake Process](https://docs.google.com/document/d/1G_LKipII0DMX3UxpkxVEpgM9Pk5tHcfZdvnkjn9E1mI/edit?tab=t.0)

**UXD:**
- Add "UXD" component to RHOAISTRAT-362
- Contact: [Jenn Giardino](mailto:jgiardin@redhat.com) or [Beau Morley](mailto:bmorley@redhat.com)
- Deliverables: Dashboard wireframes, navigation patterns, responsive design, WCAG 2.1 AA compliance
