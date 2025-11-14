#!/bin/bash
set -e

PERSES_URL="${PERSES_URL:-http://localhost:8080}"
DASHBOARD_DIR="./perses-dashboards"

echo "🎯 Importing RHOAI Observability Dashboards to Perses"
echo "📍 Perses URL: $PERSES_URL"
echo ""

# Wait for Perses to be ready
echo "⏳ Waiting for Perses to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s -f "$PERSES_URL/api/v1/health" > /dev/null 2>&1; then
        echo "✅ Perses is ready!"
        break
    fi
    attempt=$((attempt + 1))
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ Perses did not become ready in time"
        exit 1
    fi
    echo "   Attempt $attempt/$max_attempts - waiting..."
    sleep 2
done

echo ""

# Create the project first
echo "📁 Creating project: rhoai-observability"
curl -s -X POST "$PERSES_URL/api/v1/projects" \
    -H "Content-Type: application/json" \
    -d '{
        "kind": "Project",
        "metadata": {
            "name": "rhoai-observability"
        },
        "spec": {
            "display": {
                "name": "RHOAI Observability"
            }
        }
    }' > /dev/null 2>&1 || echo "   (Project may already exist)"

echo ""

# Import each dashboard
for dashboard_file in "$DASHBOARD_DIR"/*.json; do
    if [ -f "$dashboard_file" ]; then
        dashboard_name=$(basename "$dashboard_file" .json)
        echo "📊 Importing dashboard: $dashboard_name"

        response=$(curl -s -X POST "$PERSES_URL/api/v1/projects/rhoai-observability/dashboards" \
            -H "Content-Type: application/json" \
            -d @"$dashboard_file")

        if echo "$response" | grep -q "error"; then
            echo "   ⚠️  Dashboard may already exist, trying update..."
            curl -s -X PUT "$PERSES_URL/api/v1/projects/rhoai-observability/dashboards/$dashboard_name" \
                -H "Content-Type: application/json" \
                -d @"$dashboard_file" > /dev/null
            echo "   ✅ Updated: $dashboard_name"
        else
            echo "   ✅ Imported: $dashboard_name"
        fi
    fi
done

echo ""
echo "🎉 Dashboard import complete!"
echo ""
echo "🌐 Access your dashboards at:"
echo "   $PERSES_URL"
echo ""
echo "📊 Available dashboards:"
echo "   - Cluster Admin - Infrastructure Observability"
echo ""
