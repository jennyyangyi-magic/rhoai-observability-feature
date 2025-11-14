# RHOAI Observability Feature - Dashboard Prototype

Red Hat OpenShift AI (RHOAI) observability dashboard prototype for RHOAISTRAT-362.

## 📁 Repository Structure

```
.
├── docs/                    # Feature documentation and requirements
│   ├── RHOAISTRAT-362.md
│   ├── FeatureRefinement_RHOAISTRAT-362_*.md
│   └── Feature_Refinement_Template.md
│
├── prototypes/
│   └── perses-dashboard/   # Perses dashboard prototype (working)
│       ├── docker-compose.yml
│       ├── LAUNCH.md
│       ├── import-dashboards.sh
│       ├── mock-metrics/
│       ├── prometheus-config/
│       └── perses-dashboards/
│
└── README.md (this file)
```

## 🚀 Quick Start - Perses Dashboard Prototype

The **Perses dashboard prototype** is a fully functional observability dashboard with real metrics.

```bash
# Navigate to the Perses prototype
cd prototypes/perses-dashboard

# Start the prototype (requires Docker)
docker-compose up -d

# Import dashboards
./import-dashboards.sh

# Open browser
open http://localhost:8080
```

See **[prototypes/perses-dashboard/LAUNCH.md](prototypes/perses-dashboard/LAUNCH.md)** for detailed instructions.

## 📊 What's Included

A working Perses-based observability dashboard with:
- **Real Perses dashboard server** (CNCF Sandbox project)
- **Prometheus metrics backend**
- **Mock metrics generator** (simulates GPU/KServe/Istio metrics)
- **Cluster Admin Infrastructure dashboard** (pre-configured)

**Features:**
- GPU utilization tracking across nodes and namespaces
- Node health monitoring
- Resource allocation vs usage
- Temperature and power consumption metrics
- Multi-tenant data filtering

## 📚 Documentation

**Feature Requirements:**
- [RHOAISTRAT-362.md](docs/RHOAISTRAT-362.md) - Feature requirements
- [FeatureRefinement (Concise)](docs/FeatureRefinement_RHOAISTRAT-362_AI_Workload_Observability_Dashboards_Concise.md) - Detailed specifications
- [FeatureRefinement (Full)](docs/FeatureRefinement_RHOAISTRAT-362_AI_Workload_Observability_Dashboards.md) - Complete documentation

**Perses Prototype:**
- [LAUNCH.md](prototypes/perses-dashboard/LAUNCH.md) - Setup and launch instructions
- [Dashboard README](prototypes/perses-dashboard/perses-dashboards/README.md) - Dashboard details

## 🎯 Project Goals

Enable persona-specific observability for AI workloads with:
- Zero-config dashboard access (<1 min from deployment)
- Infrastructure health and model performance metrics
- Multi-tenant data isolation
- Embedded in RHOAI console (future phase)

## 🛠️ Tech Stack

- **Perses** - CNCF dashboard platform (Apache 2.0)
- **Prometheus** - Metrics storage and querying
- **Python** - Mock metrics generator
- **Docker Compose** - Local orchestration
