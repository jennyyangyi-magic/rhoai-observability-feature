#!/bin/bash

echo "🔍 Checking RHOAI Observability Prototype Setup"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker Desktop."
    exit 1
fi
echo "✅ Docker found: $(docker --version)"

# Check docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi
echo "✅ docker-compose found: $(docker-compose --version)"

# Check required files
echo ""
echo "📁 Checking required files..."
required_files=(
    "docker-compose.yml"
    "prometheus-config/prometheus.yml"
    "mock-metrics/generate_metrics.py"
    "mock-metrics/Dockerfile"
    "perses-dashboards/cluster-admin-infrastructure.json"
    "import-dashboards.sh"
)

all_present=true
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
        all_present=false
    fi
done

if [ "$all_present" = false ]; then
    echo ""
    echo "❌ Some required files are missing. Please check the setup."
    exit 1
fi

# Check ports
echo ""
echo "🔌 Checking port availability..."
ports=(8080 9090 8000)
for port in "${ports[@]}"; do
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "   ⚠️  Port $port is already in use"
    else
        echo "   ✅ Port $port is available"
    fi
done

echo ""
echo "✅ Setup validation complete!"
echo ""
echo "🚀 Ready to launch. Run:"
echo "   docker-compose up -d"
echo "   ./import-dashboards.sh"
