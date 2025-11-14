# RHOAI Observability Dashboards - Perses Mockup

This directory contains Perses dashboard definitions for RHOAI Observability (RHOAISTRAT-362).

## Quick Start

### Option 1: Docker Compose (Recommended for quick demo)

1. **Start Perses with Prometheus**:
   ```bash
   cd /workspace/sessions/agentic-session-1763094882/workspace/perses
   docker-compose --file dev/docker-compose.yaml --profile prometheus up --detach
   ```

2. **Access Perses UI**:
   - Open browser to `http://localhost:8080`
   - Default credentials (if auth enabled): Check Perses docs

3. **Import the dashboard**:
   ```bash
   # Install percli if not already installed
   # Mac/Linux: brew install perses/tap/percli
   # Or download from https://github.com/perses/perses/releases

   # Import the Infrastructure dashboard
   percli apply -f /workspace/sessions/agentic-session-1763094882/workspace/odh-dashboard/perses-dashboards/cluster-admin-infrastructure.json --url http://localhost:8080
   ```

### Option 2: Using Perses Demo Instance

1. **Go to Perses demo**: https://demo.perses.dev

2. **Create a new project** called `rhoai-observability`

3. **Import the dashboard JSON**:
   - Click "Create Dashboard"
   - Switch to JSON mode
   - Paste the contents of `cluster-admin-infrastructure.json`
   - Save

### Option 3: Kubernetes Deployment (Production-like)

If you have a Kubernetes cluster with Prometheus already running:

1. **Install Perses Operator**:
   ```bash
   kubectl apply -f https://github.com/perses/perses-operator/releases/latest/download/bundle.yaml
   ```

2. **Deploy the dashboard as a CRD**:
   ```bash
   kubectl apply -f cluster-admin-infrastructure.json
   ```

## Dashboard Files

### cluster-admin-infrastructure.json
**Persona**: Cluster Administrator
**Purpose**: Infrastructure observability for AI workloads

**Sections**:
1. **Executive Summary**: Overall health, GPU utilization, active models, success rate
2. **Node & Infrastructure Health**: Node status, GPU utilization trends, temperature/power
3. **Resource Utilization & Capacity**: GPU by namespace, allocation vs usage, top consumers

**Metrics Used**:
- `DCGM_FI_DEV_GPU_UTIL` - GPU utilization from NVIDIA DCGM exporter
- `DCGM_FI_DEV_GPU_TEMP` - GPU temperature
- `DCGM_FI_DEV_POWER_USAGE` - GPU power consumption
- `kube_node_status_condition` - Node health status
- `kube_pod_container_resource_requests` - Resource requests
- `kserve_model_info` - Model information
- `istio_requests_total` - Request metrics

## Prerequisites

For the dashboard to show real data, you need:

1. **Prometheus** - Metrics backend
2. **DCGM Exporter** - For GPU metrics (https://github.com/NVIDIA/dcgm-exporter)
3. **KServe Metrics** - For model serving metrics
4. **Kube-state-metrics** - For Kubernetes resource metrics
5. **Node Exporter** - For node-level metrics

## Customization

### Changing Prometheus URL

In the dashboard JSON, update the datasource configuration:

```json
"datasources": {
  "prometheus": {
    "plugin": {
      "kind": "PrometheusDatasource",
      "spec": {
        "proxy": {
          "spec": {
            "url": "http://your-prometheus-url:9090"
          }
        }
      }
    }
  }
}
```

### Adjusting Queries

All Prometheus queries are in the `queries` section of each panel. Modify them based on your metric names and labels.

Example:
```json
"query": "avg(DCGM_FI_DEV_GPU_UTIL{cluster=\"$cluster\"}) * 100"
```

## Testing with Mock Data

If you don't have real metrics, you can use Avalanche to generate fake Prometheus metrics:

```bash
cd /workspace/sessions/agentic-session-1763094882/workspace/perses
docker-compose --file dev/docker-compose.yaml --profile prometheus --profile avalanche up --detach
```

This will start:
- Prometheus at `http://localhost:9090`
- Avalanche (fake metrics generator) at `http://localhost:9001`
- Perses at `http://localhost:8080`

## Dashboard Structure

Perses dashboards use a grid layout system (24 columns):

- **width**: 24 = full width, 12 = half width, 6 = quarter width
- **height**: Measured in grid units (each unit ≈ 30px)
- **x, y**: Position in the grid

Panel types available:
- `StatChart` - Single stat with thresholds
- `GaugeChart` - Gauge visualization
- `TimeSeriesChart` - Line/area charts
- `BarChart` - Bar charts
- `Table` - Data tables
- `Markdown` - Static text/documentation

## Next Steps

1. **Create Model Serving Dashboard** - For model-specific metrics
2. **Create Data Scientist Dashboard** - For individual model monitoring
3. **Add Alerting** - Once dashboards are validated
4. **Integrate with RHOAI Console** - Embed Perses panels using npm packages

## Resources

- Perses Documentation: https://perses.dev
- Perses GitHub: https://github.com/perses/perses
- Dashboard-as-Code Guide: https://perses.dev/docs/dac/getting-started
- Plugin Catalog: https://github.com/perses/plugins

## Troubleshooting

### Dashboard not loading
- Check Prometheus datasource URL is correct
- Verify Prometheus is accessible from Perses
- Check browser console for errors

### No data showing
- Verify metrics exist in Prometheus: `http://localhost:9090/graph`
- Check metric names match your environment
- Verify time range is appropriate
- Check variable values are set correctly

### Authentication issues
- Perses may require login depending on configuration
- Check `dev/config.yaml` for auth settings
- Use `percli login` if using CLI
