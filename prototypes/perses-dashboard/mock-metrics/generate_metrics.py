#!/usr/bin/env python3
"""
Mock Metrics Generator for RHOAI Observability Dashboard
Generates realistic Prometheus metrics for GPU, Kubernetes, KServe, and Istio
"""

import os
import time
import random
import math
from http.server import HTTPServer, BaseHTTPRequestHandler
from prometheus_client import Gauge, Counter, Histogram, REGISTRY, generate_latest

# Configuration from environment
NUM_NODES = int(os.getenv('NUM_NODES', '5'))
NUM_GPUS_PER_NODE = int(os.getenv('NUM_GPUS_PER_NODE', '4'))
NUM_NAMESPACES = int(os.getenv('NUM_NAMESPACES', '8'))
NUM_MODELS = int(os.getenv('NUM_MODELS', '12'))

# Generate static labels
CLUSTER = "prod-cluster-01"
NODES = [f"gpu-node-{i:02d}" for i in range(NUM_NODES)]
NAMESPACES = [f"ds-team-{i}" for i in range(1, NUM_NAMESPACES + 1)]
MODELS = [
    "llama-2-7b", "llama-2-13b", "mistral-7b", "falcon-7b",
    "gpt-j-6b", "bloom-7b", "mpt-7b", "vicuna-13b",
    "codellama-7b", "stable-diffusion", "whisper-large", "bert-base"
][:NUM_MODELS]

# GPU Metrics (DCGM Exporter)
gpu_utilization = Gauge('DCGM_FI_DEV_GPU_UTIL', 'GPU utilization',
                        ['cluster', 'node', 'gpu', 'namespace', 'pod'])
gpu_temperature = Gauge('DCGM_FI_DEV_GPU_TEMP', 'GPU temperature in Celsius',
                        ['cluster', 'node', 'gpu'])
gpu_power = Gauge('DCGM_FI_DEV_POWER_USAGE', 'GPU power usage in watts',
                  ['cluster', 'node', 'gpu'])
gpu_memory_used = Gauge('DCGM_FI_DEV_FB_USED', 'GPU framebuffer memory used in MiB',
                        ['cluster', 'node', 'gpu'])
gpu_memory_total = Gauge('DCGM_FI_DEV_FB_FREE', 'GPU framebuffer memory total in MiB',
                         ['cluster', 'node', 'gpu'])

# Kubernetes Node Metrics
kube_node_info = Gauge('kube_node_info', 'Node information',
                       ['cluster', 'node', 'kernel_version', 'os_image', 'container_runtime_version'])
kube_node_status = Gauge('kube_node_status_condition', 'Node status condition',
                         ['cluster', 'node', 'condition', 'status'])

# Kubernetes Resource Metrics
kube_pod_resource_requests = Gauge('kube_pod_container_resource_requests', 'Pod resource requests',
                                   ['cluster', 'namespace', 'pod', 'container', 'resource', 'node'])

# KServe Model Metrics
kserve_model_info = Gauge('kserve_model_info', 'KServe model information',
                         ['cluster', 'namespace', 'model_name', 'model_version', 'runtime'])
kserve_request_latency = Histogram('kserve_request_duration_seconds', 'Request latency',
                                   ['cluster', 'namespace', 'model_name', 'model_version'])

# Istio Metrics
istio_requests_total = Counter('istio_requests_total', 'Total Istio requests',
                               ['cluster', 'namespace', 'destination_service', 'response_code'])

# Node Exporter Metrics
node_cpu_seconds = Counter('node_cpu_seconds_total', 'CPU seconds',
                          ['cluster', 'node', 'cpu', 'mode'])
node_memory_available = Gauge('node_memory_MemAvailable_bytes', 'Available memory',
                             ['cluster', 'node'])
node_memory_total = Gauge('node_memory_MemTotal_bytes', 'Total memory',
                         ['cluster', 'node'])

# LLM-specific metrics
llm_time_to_first_token = Histogram('vllm_time_to_first_token_seconds', 'Time to first token',
                                    ['cluster', 'namespace', 'model_name'])
llm_token_generation_rate = Gauge('vllm_generation_tokens_per_second', 'Token generation rate',
                                  ['cluster', 'namespace', 'model_name'])
llm_queue_depth = Gauge('vllm_num_requests_waiting', 'Queue depth',
                       ['cluster', 'namespace', 'model_name'])
llm_throughput = Gauge('vllm_request_success_total', 'Request throughput',
                      ['cluster', 'namespace', 'model_name'])


class MetricsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/metrics':
            self.send_response(200)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.end_headers()
            self.wfile.write(generate_latest(REGISTRY))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Suppress default logging
        pass


def update_metrics():
    """Update all metrics with realistic mock values"""
    current_time = time.time()

    # Generate sinusoidal patterns for realistic variation
    # Base patterns with different periods for variety
    daily_cycle = math.sin(current_time / 3600)  # Hourly cycle
    weekly_cycle = math.sin(current_time / 86400)  # Daily cycle

    # GPU Metrics - simulate utilization patterns
    for node_idx, node in enumerate(NODES):
        for gpu_idx in range(NUM_GPUS_PER_NODE):
            gpu_id = f"{gpu_idx}"

            # Assign GPUs to namespaces/pods
            namespace = NAMESPACES[gpu_idx % len(NAMESPACES)]
            pod = f"inference-pod-{node_idx}-{gpu_idx}"

            # GPU utilization (30-95%, with patterns)
            base_util = 60 + 25 * daily_cycle + 10 * random.random()
            # Some GPUs are busier than others
            if gpu_idx == 0:
                base_util += 20  # Primary GPU is busier
            util = max(15, min(98, base_util))

            gpu_utilization.labels(
                cluster=CLUSTER, node=node, gpu=gpu_id, namespace=namespace, pod=pod
            ).set(util)

            # Temperature (50-85°C, correlates with utilization)
            temp = 45 + (util / 2.5) + random.uniform(-3, 3)
            gpu_temperature.labels(
                cluster=CLUSTER, node=node, gpu=gpu_id
            ).set(temp)

            # Power (150-350W, correlates with utilization)
            power = 150 + (util * 2) + random.uniform(-20, 20)
            gpu_power.labels(
                cluster=CLUSTER, node=node, gpu=gpu_id
            ).set(power)

            # GPU Memory (20GB total, 8-18GB used)
            memory_used = 8000 + (util / 100) * 10000 + random.uniform(-500, 500)
            gpu_memory_used.labels(
                cluster=CLUSTER, node=node, gpu=gpu_id
            ).set(memory_used)

            gpu_memory_total.labels(
                cluster=CLUSTER, node=node, gpu=gpu_id
            ).set(20480)  # 20GB

    # Kubernetes Node Status
    for node in NODES:
        kube_node_info.labels(
            cluster=CLUSTER,
            node=node,
            kernel_version="5.14.0-284.el9.x86_64",
            os_image="Red Hat Enterprise Linux CoreOS",
            container_runtime_version="cri-o://1.28.0"
        ).set(1)

        # Most nodes are Ready, occasionally one has pressure
        ready_status = 1 if random.random() > 0.1 else 0
        kube_node_status.labels(
            cluster=CLUSTER, node=node, condition="Ready", status="true"
        ).set(ready_status)

        # Occasional memory pressure
        memory_pressure = 1 if random.random() > 0.9 else 0
        kube_node_status.labels(
            cluster=CLUSTER, node=node, condition="MemoryPressure", status="true"
        ).set(memory_pressure)

    # Kubernetes Resource Requests
    for namespace in NAMESPACES:
        num_pods = random.randint(3, 8)
        for pod_idx in range(num_pods):
            pod = f"inference-{pod_idx}"
            node = random.choice(NODES)

            # GPU requests
            gpu_request = random.choice([1, 2, 4])
            kube_pod_resource_requests.labels(
                cluster=CLUSTER,
                namespace=namespace,
                pod=pod,
                container="inference",
                resource="nvidia_com_gpu",
                node=node
            ).set(gpu_request)

            # Memory requests
            memory_request = gpu_request * 16 * 1024 * 1024 * 1024  # 16GB per GPU
            kube_pod_resource_requests.labels(
                cluster=CLUSTER,
                namespace=namespace,
                pod=pod,
                container="inference",
                resource="memory",
                node=node
            ).set(memory_request)

    # KServe Model Metrics
    for model_idx, model_name in enumerate(MODELS):
        namespace = NAMESPACES[model_idx % len(NAMESPACES)]
        runtime = "vllm" if "llama" in model_name or "mistral" in model_name else "triton"

        kserve_model_info.labels(
            cluster=CLUSTER,
            namespace=namespace,
            model_name=model_name,
            model_version="v1",
            runtime=runtime
        ).set(1)

        # Request latency (50ms-2s with variation)
        base_latency = 0.1 + (model_idx * 0.05)
        for _ in range(int(10 * (1 + daily_cycle))):  # Varying request rate
            latency = base_latency + random.uniform(-0.02, 0.1)
            kserve_request_latency.labels(
                cluster=CLUSTER,
                namespace=namespace,
                model_name=model_name,
                model_version="v1"
            ).observe(latency)

    # Istio Request Metrics
    for model_name in MODELS:
        namespace = NAMESPACES[MODELS.index(model_name) % len(NAMESPACES)]
        service = f"{model_name}-predictor"

        # Generate request patterns (mostly 200s, some 4xx, rare 5xx)
        num_requests = int(100 * (1 + daily_cycle + random.random()))

        for _ in range(num_requests):
            rand = random.random()
            if rand < 0.95:
                response_code = "200"
            elif rand < 0.98:
                response_code = "400"
            elif rand < 0.995:
                response_code = "429"
            else:
                response_code = "500"

            istio_requests_total.labels(
                cluster=CLUSTER,
                namespace=namespace,
                destination_service=service,
                response_code=response_code
            ).inc()

    # Node CPU and Memory
    for node in NODES:
        # CPU usage per core
        for cpu in range(64):  # 64 cores per node
            for mode in ['idle', 'user', 'system']:
                if mode == 'idle':
                    value = 0.3 + 0.2 * daily_cycle
                elif mode == 'user':
                    value = 0.5 + 0.3 * daily_cycle
                else:
                    value = 0.1 + 0.05 * daily_cycle

                node_cpu_seconds.labels(
                    cluster=CLUSTER, node=node, cpu=str(cpu), mode=mode
                ).inc(value)

        # Memory (512GB total, 200-400GB available)
        total_memory = 512 * 1024 * 1024 * 1024
        available = total_memory * (0.3 + 0.2 * daily_cycle + 0.1 * random.random())

        node_memory_total.labels(cluster=CLUSTER, node=node).set(total_memory)
        node_memory_available.labels(cluster=CLUSTER, node=node).set(available)

    # LLM-specific metrics (for vLLM models)
    llm_models = [m for m in MODELS if any(x in m for x in ['llama', 'mistral', 'falcon'])]
    for model_name in llm_models:
        namespace = NAMESPACES[MODELS.index(model_name) % len(NAMESPACES)]

        # Time to first token (20-200ms)
        for _ in range(5):
            ttft = 0.02 + 0.18 * random.random()
            llm_time_to_first_token.labels(
                cluster=CLUSTER, namespace=namespace, model_name=model_name
            ).observe(ttft)

        # Token generation rate (20-80 tokens/sec)
        token_rate = 30 + 40 * (1 + daily_cycle) / 2 + random.uniform(-5, 5)
        llm_token_generation_rate.labels(
            cluster=CLUSTER, namespace=namespace, model_name=model_name
        ).set(token_rate)

        # Queue depth (0-20 requests)
        queue = max(0, int(10 * daily_cycle + random.randint(-2, 5)))
        llm_queue_depth.labels(
            cluster=CLUSTER, namespace=namespace, model_name=model_name
        ).set(queue)

        # Throughput (requests/sec)
        throughput = 5 + 10 * (1 + daily_cycle) / 2
        llm_throughput.labels(
            cluster=CLUSTER, namespace=namespace, model_name=model_name
        ).set(throughput)


def run_server():
    """Run the metrics server"""
    port = 8000
    server = HTTPServer(('0.0.0.0', port), MetricsHandler)
    print(f"🚀 Mock Metrics Server starting on port {port}")
    print(f"📊 Generating metrics for:")
    print(f"   - {NUM_NODES} nodes with {NUM_GPUS_PER_NODE} GPUs each")
    print(f"   - {NUM_NAMESPACES} namespaces")
    print(f"   - {NUM_MODELS} models")
    print(f"\n✅ Metrics available at http://localhost:{port}/metrics")

    # Update metrics continuously in background
    def update_loop():
        while True:
            update_metrics()
            time.sleep(10)  # Update every 10 seconds

    import threading
    update_thread = threading.Thread(target=update_loop, daemon=True)
    update_thread.start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Shutting down metrics server")
        server.shutdown()


if __name__ == '__main__':
    run_server()
