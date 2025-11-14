# 🚀 RHOAI Observability Dashboard Prototype - Quick Start

This is a fully functional Perses dashboard prototype for Red Hat OpenShift AI (RHOAI) observability.

## What's Included

- **Perses Dashboard Server** - Modern observability dashboard UI (port 8080)
- **Prometheus** - Metrics backend (port 9090)
- **Mock Metrics Generator** - Simulates realistic RHOAI/GPU/KServe metrics (port 8000)
- **Pre-configured Dashboard** - Cluster Admin Infrastructure dashboard

## Prerequisites

- Docker Desktop or Docker Engine (with docker-compose)
- 2GB free disk space
- Ports 8080, 9090, 8000 available

## 🎯 Quick Launch (2 minutes)

### Step 1: Start the Stack

```bash
# From the repo root
docker-compose up -d
```

This will start:
- Perses (dashboard UI)
- Prometheus (metrics storage)
- Mock metrics generator (simulates 5 GPU nodes, 4 GPUs each, 8 namespaces, 12 models)

### Step 2: Wait for Services

```bash
# Check status
docker-compose ps

# Watch logs (optional)
docker-compose logs -f
```

Wait ~30 seconds for all services to be healthy.

### Step 3: Import Dashboards

```bash
./import-dashboards.sh
```

### Step 4: Access Perses

Open your browser to: **http://localhost:8080**

Navigate to:
- **Projects** → **rhoai-observability**
- **Dashboards** → **cluster-admin-infrastructure**

## 🎛️ What You'll See

### Executive Summary Section
- **Overall Cluster Health** - Node health status
- **Cluster GPU Utilization** - Average GPU usage across all nodes
- **Total Active Models** - Number of deployed models
- **Request Success Rate** - Percentage of successful requests

### Node & Infrastructure Health Section
- **Node Status Table** - All nodes with GPU count and status
- **Resource Utilization Trends** - GPU, CPU, Memory over time
- **GPU Temperature & Power** - Thermal and power consumption metrics

### Resource Utilization & Capacity Section
- **GPU Utilization by Namespace** - Stacked area chart showing usage breakdown
- **Resource Allocation vs Usage** - Bar chart comparing requested vs used
- **Top Resource Consumers** - Table of namespaces by GPU-hours

## 🔧 Accessing Individual Services

| Service | URL | Description |
|---------|-----|-------------|
| Perses UI | http://localhost:8080 | Main dashboard interface |
| Prometheus | http://localhost:9090 | Query metrics directly |
| Mock Metrics | http://localhost:8000/metrics | View raw Prometheus metrics |

## 🎨 Customizing Mock Data

Edit environment variables in `docker-compose.yml`:

```yaml
mock-metrics:
  environment:
    - NUM_NODES=5              # Number of GPU nodes
    - NUM_GPUS_PER_NODE=4      # GPUs per node
    - NUM_NAMESPACES=8         # Number of namespaces/teams
    - NUM_MODELS=12            # Number of deployed models
```

Then restart:
```bash
docker-compose restart mock-metrics
```

## 📊 Exploring Metrics in Prometheus

Visit http://localhost:9090 and try these queries:

```promql
# Average GPU utilization
avg(DCGM_FI_DEV_GPU_UTIL)

# GPU utilization by namespace
sum by (namespace) (DCGM_FI_DEV_GPU_UTIL)

# Node ready status
kube_node_status_condition{condition="Ready", status="true"}

# Model request rate
rate(istio_requests_total[5m])
```

## 🛑 Stopping the Stack

```bash
# Stop services (keeps data)
docker-compose stop

# Stop and remove containers (keeps data volumes)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

## 🐛 Troubleshooting

### Dashboard shows "No Data"

1. Check Prometheus is scraping metrics:
   ```bash
   curl http://localhost:9090/api/v1/targets
   ```

2. Check mock metrics are generating:
   ```bash
   curl http://localhost:8000/metrics | grep DCGM
   ```

3. Check Perses can reach Prometheus:
   ```bash
   docker-compose logs perses
   ```

### Port already in use

Change ports in `docker-compose.yml`:
```yaml
perses:
  ports:
    - "8081:8080"  # Changed from 8080
```

### Services not starting

```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

### Dashboard import fails

Try manually importing:
1. Go to http://localhost:8080
2. Create project: "rhoai-observability"
3. Click "Create Dashboard"
4. Switch to JSON mode
5. Paste contents of `perses-dashboards/cluster-admin-infrastructure.json`
6. Save

## 📁 Project Structure

```
.
├── docker-compose.yml              # Main orchestration file
├── import-dashboards.sh            # Dashboard import script
├── perses-config/
│   └── config.yaml                 # Perses configuration
├── prometheus-config/
│   └── prometheus.yml              # Prometheus scrape config
├── mock-metrics/
│   ├── generate_metrics.py         # Metrics generator
│   ├── requirements.txt
│   └── Dockerfile
└── perses-dashboards/
    ├── cluster-admin-infrastructure.json    # Dashboard definition
    └── README.md                            # Dashboard documentation
```

## 🎯 Next Steps

1. **View the existing dashboard** - Explore the Cluster Admin Infrastructure dashboard
2. **Create more dashboards** - Add Model Serving and Data Scientist dashboards
3. **Customize panels** - Edit JSON to add/modify visualizations
4. **Connect to real metrics** - Point Prometheus at actual RHOAI cluster

## 🧪 Testing with Real Data

To connect to a real OpenShift cluster with RHOAI:

1. Expose your cluster's Prometheus (port-forward or route)
2. Update `perses-config/config.yaml` datasource URL
3. Update `cluster-admin-infrastructure.json` to remove `cluster` label filter if needed
4. Restart Perses: `docker-compose restart perses`

## 📚 Documentation

- Perses Docs: https://perses.dev
- RHOAISTRAT-362: See `RHOAISTRAT-362.md`
- Feature Refinement: See `FeatureRefinement_RHOAISTRAT-362_AI_Workload_Observability_Dashboards_Concise.md`
- Dashboard Details: See `perses-dashboards/README.md`

## 🙋 Need Help?

Check the logs:
```bash
docker-compose logs -f perses
docker-compose logs -f prometheus
docker-compose logs -f mock-metrics
```

Verify connectivity:
```bash
# From within Perses container
docker-compose exec perses wget -O- http://prometheus:9090/api/v1/query?query=up
```
