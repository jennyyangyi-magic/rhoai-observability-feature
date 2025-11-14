# RHOAISTRAT-362: AI Workload Observability Dashboards

## Problem Statement

Organizations deploying AI workloads on OpenShift AI face critical visibility gaps in observability dashboards that impact their ability to effectively monitor and understand AI operations. Current monitoring capabilities lack unified dashboard experiences, requiring users to leave the OpenShift AI console to view infrastructure and model performance metrics, with no integrated visualization layer for comprehensive AI workload observability.

### Current Pain Points

- **Fragmented Dashboard Experience**: Infrastructure and model metrics exist in separate systems without unified visualization
- **Lack of Role-Based Dashboards**: No persona-specific observability experiences for Data Scientists and Cluster Administrators
- **Console Integration Gap**: Monitoring dashboards exist outside OpenShift AI console, requiring context switching
- **Manual Dashboard Setup**: Users must manually configure visualization tools for AI-specific monitoring

## Goals

Enable comprehensive, unified observability dashboards for AI workloads with persona-based experiences, delivered through integrated OpenShift AI console dashboards that provide actionable insights for optimization and troubleshooting without requiring manual configuration.

## User Personas and Dashboard Requirements

### Data Scientist Dashboard

- **Model Performance Metrics**: Time to first token, token generation rate, throughput (requests/sec), P50/P90/P99 latency percentiles
- **Resource Consumption Tracking**: GPU utilization, memory usage, CPU consumption for deployed models
- **Historical Analysis**: Performance trend analysis, resource usage patterns over time
- **Model Health Indicators**: Endpoint availability, error rates, response time distributions

### Cluster Administrator Dashboard

- **Resource Utilization Overview**: GPU/CPU/memory utilization across all projects and users, with drill-down to individual workloads (reconciled with RHOAIRFE-638 for Kueue/GPUaaS-specific metrics)
- **Infrastructure Health Monitoring**: Hardware health status, temperature, power consumption metrics
- **Multi-Tenant Resource Allocation**: Project-level resource usage with proper tenant isolation

## Implementation Approach

### Dashboard Integration Strategy

- **Phase 1 Approach**: Reference Grafana dashboard templates that can be imported immediately, with comprehensive documentation for setup and configuration
- **Phase 2 Approach**: Native embedded dashboard integration within OpenShift AI console interface
- **Foundation**: Build upon existing RHOAI platform metrics collection (RHOAISTRAT-575 foundation)
- **Personas**: Two focused dashboard experiences (Data Scientist, Cluster Administrator) with role-specific metrics and views

### Delivery Vehicle

Primary implementation via RHOAISTRAT-362 (KServe Metrics - GPU + LLM) with scope expansion to cover all persona-based dashboard requirements

## Implementation Phases

### Phase 1: Reference Grafana Dashboards (MVP)

#### Reference Dashboard Development

- Create two reference Grafana dashboards as standalone templates that can be imported immediately
- **Data Scientist Dashboard**: Model performance metrics (TTFT, token generation rate, throughput, P50/P90/P99 latency), resource consumption tracking, historical analysis, model health indicators
- **Cluster Administrator Dashboard**: Resource utilization overview, infrastructure health monitoring, multi-tenant resource allocation views
- Integration with existing RHOAI platform metrics collection (RHOAISTRAT-575 foundation)
- Dashboard templates with proper multi-tenant data filtering

#### Documentation and Setup Guides

- Comprehensive documentation for importing and configuring reference dashboards
- Setup guides for connecting dashboards to RHOAI metrics infrastructure

#### Deliverables

- Two reference Grafana dashboard templates available for immediate import
- Complete documentation package for dashboard deployment and configuration
- Validated integration with RHOAI metrics collection infrastructure

### Phase 2: RHOAI Console Integration

#### Embedded Dashboard Integration

- Integrate persona-specific dashboard experiences directly within OpenShift AI console interface
- Seamless SSO integration with OpenShift OAuth for unified authentication experience
- Native RHOAI console navigation and user experience patterns
- Model-level dashboard views linked directly from deployed model pages in RHOAI console

#### Deliverables

- Complete persona-specific dashboard experiences embedded in RHOAI console
- Unified user experience with seamless navigation between console and observability views (embedded)
- Advanced dashboard capabilities with optimized performance for production use

## Scope Definition

### In Scope (Observability Dashboard Layer Only)

- **Persona-Based Dashboard Experiences**: Role-specific observability dashboards for Data Scientists and Cluster Administrators
- **Console Integration**: Embedded dashboard experiences within OpenShift AI console with seamless navigation
- **Unified Metric Visualization**: Dashboard layer that presents infrastructure, model serving, and performance metrics in coordinated views
- **Role-Based Access Control**: Proper tenant isolation for dashboard access aligned with OpenShift AI project permissions
- **Pre-configured Dashboard Templates**: Default dashboard configurations for common AI monitoring scenarios

### Out of Scope (Covered by Existing Initiatives)

- **Metrics Collection Infrastructure**: Covered by RHOAIENG-28166 (vLLM), RHOAIENG-12528 (KServe), RHOAIENG-25597 (OpenVINO), and platform metrics work
- **Alerting Capabilities**: To be addressed in separate dedicated Alerting RFE
- **3rd Party Integration**: Metrics export covered by RHOAIENG-25581 & RHOAIENG-25586
- **Resource Detection/Management Automation**: Requires separate requirements definition
- **Advanced Remediation Workflows**: Too broad for current scope

## Success Criteria

### Phase 1 Success Metrics

- Two reference Grafana dashboard templates available for immediate import and deployment
- Complete documentation package enabling deployment within 30 minutes for experienced users
- Dashboard templates integrate seamlessly with RHOAI metrics infrastructure (RHOAISTRAT-575)
- Proper multi-tenant data filtering and project-level isolation validated in dashboard templates

### Phase 2 Success Metrics

- Persona-specific dashboards accessible directly from OpenShift AI console within 1 hour of deployment
- Unified visualization of infrastructure and model metrics without external tool dependencies
- Role-based dashboard access properly isolated by project/namespace boundaries
- Native console integration with seamless SSO and navigation experience

## User Value

**User Value**: Enable persona-specific observability dashboard experiences for AI workloads, delivered through integrated OpenShift AI console interfaces that provide unified visualization and actionable insights for optimization and troubleshooting without requiring manual dashboard configuration.

**Goal**: Provide role-based dashboard experiences that unify infrastructure and model metrics visualization within the OpenShift AI console, accessible immediately upon deployment.

## Related Work

### Related RFEs

- **RHOAISTRAT-575**: Centralized Platform Metrics (foundation)
- **RHOAISTRAT-362**: KServe Metrics - GPU + LLM (delivery vehicle)
- **RHOAIRFE-638**: GPUaaS observability (scope coordination needed)
- **RHOAIENG-28166**: vLLM metrics collection
- **RHOAIENG-12528**: KServe metrics integration
- **RHOAIENG-25597**: OpenVINO metrics collection
- **RHOAIUX-971**: The User Experience for Foundational Observability
