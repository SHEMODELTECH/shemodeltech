# AI Infrastructure Engineer: Hands-On Project Tutorials

This document turns every project in the **AI Infrastructure Engineer Foundations Course** into a step-by-step, hands-on tutorial. You learn each idea at the moment you need it, while building the thing.

Follow the projects in order. Each one hands off a skill or artifact to the next, ending in the Final Capstone.

---

## Project 1 (Module 1): Map the Infrastructure Stack for an AI System

**Goal:** Before deploying anything, learn to see an AI system as a stack of layers, so every later project has a place to plug into.

**Step 1: Set up a project folder for your planning docs.**
```bash
mkdir infra_stack_project
cd infra_stack_project
```

**Step 2: Define what the system needs to do.**
Write one sentence in a file `requirements.txt` (or `requirements.md`): what model are you serving, and who's using it? Example: "Serve an image-classification model to a mobile app, expecting 50 requests per second."

**Step 3: Understand the two infrastructure modes: training vs. inference.**
*Training* is the (usually one-time or periodic) process of teaching a model from data, heavy, GPU-hungry, can take hours. *Inference* is running the trained model to get predictions, lighter per-request, but needs to happen fast and often.

**Step 4: List the six core layers of an AI infrastructure stack.**
- **Compute**: the machines (CPU/GPU) that run your code.
- **Storage**: where your model files and data live.
- **Networking**: how requests reach your service.
- **Containerization/Orchestration**: how your app is packaged and kept running.
- **Serving**: the layer that turns "a model file" into "an API you can call."
- **Monitoring/Observability**: how you know it's working.

**Step 5: Choose compute type for your example system.**
Learn the difference: **CPU** (general-purpose, cheap, fine for small/light models), **GPU** (parallel processing, needed for large deep learning models), **hardware accelerator** (any specialized chip, GPU, TPU, built for ML math).

**Step 6: Choose a storage approach.**
**object storage** (e.g., a bucket-style store for large files like model weights), **model registry** (a versioned catalog of trained models, so you always know which version is live).

**Step 7: Choose a networking approach.**
**API gateway** (a front door that routes external requests to the right internal service), **load balancer** (spreads incoming traffic across multiple copies of your service so no single machine gets overwhelmed).

**Step 8: Choose an orchestration approach.**
**container** (a lightweight, self-contained package of your app plus everything it needs to run), **orchestrator** (a system, like Kubernetes, that starts, stops, and scales containers automatically).

**Step 9: The infrastructure stack.**
A request enters at the serving layer and a prediction flows back out, with every layer watched by monitoring:

```mermaid
flowchart TB
    REQ(["Request in"]) --> SRV["Serving"]
    SRV --> ORCH["Orchestration"]
    ORCH --> CMP["Compute"]
    CMP --> STOR["Storage"]
    CMP --> NET["Networking"]
    CMP --> PRED(["Prediction out"])
    MON["Monitoring"] -.->|observes| SRV
    MON -.->|observes| CMP
```

### Final Project Structure
```text
infra_stack_project/
│
├── requirements.md
├── stack_diagram.png
```

### What You Learned
- ✅ Training vs. inference infrastructure
- ✅ The six core layers of an AI infrastructure stack
- ✅ Compute type tradeoffs (CPU vs. GPU vs. accelerator)
- ✅ Storage concepts (object storage, model registry)
- ✅ Networking concepts (API gateway, load balancer)
- ✅ Orchestration concepts (container, orchestrator)
- ✅ Turning requirements into an architecture diagram

### Portfolio Project
**AI System Infrastructure Stack Map**: Translated a business requirement into a labeled, six-layer infrastructure architecture diagram covering compute, storage, networking, orchestration, serving, and monitoring.
**Skills:** Systems Thinking, Cloud Architecture Fundamentals, Technical Documentation, AI Infrastructure.

**Deliverable:** A one-page infrastructure stack map for your example AI system, labeled with your choices from Steps 5–8.

---

## Project 2 (Module 2): Write Shell Scripts to Monitor System Resources

**Goal:** See what a machine is doing under the hood, the skill every later deployment and monitoring project depends on.

**Step 1: Open a terminal and confirm you're in a shell.**
A **shell** is a program that takes typed commands and runs them on the machine (e.g., `bash`). A **command** is a single instruction to the operating system (e.g., "show me my files," "tell me where I am"). A **script** is a saved file of commands the computer runs automatically, instead of you typing them one by one every time.

**Step 2: Set up a project folder.**
```bash
pwd
mkdir monitoring_project
cd monitoring_project
pwd
```
`pwd` (print working directory) shows where you are; `mkdir` creates a folder; `cd` moves into it.

**Step 3: Write and run your first script.**
```bash
nano hello.sh
```
Paste:
```bash
#!/bin/bash
echo "Hello AI Infrastructure Engineer!"
```
Save, then make it runnable and run it:
```bash
chmod +x hello.sh
./hello.sh
```
`#!/bin/bash` is a **shebang**: it tells Linux which program should execute this file. `chmod +x` grants the file **execute permission**, without which Linux refuses to run it as a program.

**Step 4: Build a standalone CPU monitor.**
```bash
nano cpu_monitor.sh
```
```bash
#!/bin/bash
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
echo "CPU Usage: $CPU%"
```
```bash
chmod +x cpu_monitor.sh
./cpu_monitor.sh
```
**CPU utilization** is the percentage of processing capacity currently in use; `top -bn1` takes a single, non-interactive snapshot instead of the live-updating view.

**Step 5: Build a standalone memory monitor.**
```bash
nano memory_monitor.sh
```
```bash
#!/bin/bash
MEMORY=$(free | awk '/Mem:/ {printf("%.2f"), $3/$2 * 100}')
echo "Memory Usage: $MEMORY%"
```
```bash
chmod +x memory_monitor.sh
./memory_monitor.sh
```
**RAM** is short-term working memory; when it fills up, the system slows dramatically or crashes the process (an **out-of-memory / OOM error**).

**Step 6: Build a standalone disk monitor.**
```bash
nano disk_monitor.sh
```
```bash
#!/bin/bash
DISK=$(df / | tail -1 | awk '{print $5}')
echo "Disk Usage: $DISK"
```
```bash
chmod +x disk_monitor.sh
./disk_monitor.sh
```
This reads how much space is used vs. free on the root partition.

**Step 7: Check running processes.**
```bash
ps aux
ps -eo pid,comm,%cpu --sort=-%cpu | head
```
`ps aux` lists every running **process**; sorting by `%cpu` shows which specific program is responsible for high usage.

**Step 8: Build a standalone network monitor.**
```bash
nano network_monitor.sh
```
```bash
#!/bin/bash
NETWORK=$(ss -tulwn | wc -l)
echo "Network Connections: $NETWORK"
```
```bash
chmod +x network_monitor.sh
./network_monitor.sh
```
`ss -tulwn` lists which **ports** (numbered network doors) are open and listening for traffic.

**Step 9: Build a standalone GPU monitor (if available).**
```bash
nano gpu_monitor.sh
```
```bash
#!/bin/bash
nvidia-smi
```
```bash
chmod +x gpu_monitor.sh
./gpu_monitor.sh
```
`nvidia-smi` reports GPU utilization, memory, temperature, and which processes are using the GPU.

**Step 10: Combine everything into one dashboard script.**
```bash
nano monitor.sh
```
```bash
#!/bin/bash
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}')
MEMORY=$(free | awk '/Mem:/ {printf("%.2f"), $3/$2 * 100}')
DISK=$(df / | tail -1 | awk '{print $5}')
NETWORK=$(ss -tulwn | wc -l)

echo "=========================="
echo "AI SERVER MONITOR"
echo "=========================="
echo "CPU Usage: $CPU%"
echo "Memory Usage: $MEMORY%"
echo "Disk Usage: $DISK"
echo "Network Connections: $NETWORK"
echo "=========================="
```
```bash
chmod +x monitor.sh
./monitor.sh
```
Bundling checks into one script turns five separate manual routines into a single reusable tool.

**Step 11: Add a threshold alert.**
```bash
CPU_VALUE=$(echo $CPU | cut -d'%' -f1)
if (( $(echo "$CPU_VALUE > 80" | bc -l) )); then
  echo "WARNING: CPU usage above 80%"
fi
```
A **threshold alert** fires when a metric crosses a defined line, the simplest form of monitoring.

**Step 12: Add a live, auto-refreshing dashboard.**
```bash
watch -n 1 ./monitor.sh
```
`watch -n 1` re-runs a command every 1 second and redraws the terminal.

**Step 13: Add logging.**
```bash
./monitor.sh >> monitor.log
cat monitor.log
```
`>>` **appends** command output to a file instead of just printing it to the screen.

**Step 14: Schedule it to run automatically.**
```bash
crontab -e
```
Add:
```bash
*/5 * * * * /path/monitoring_project/monitor.sh >> /path/monitoring_project/monitor.log
```
**cron** is Linux's built-in scheduler; this line runs `monitor.sh` every 5 minutes and appends the result to your log.

### Final Project Structure
```text
monitoring_project/
│
├── hello.sh
├── cpu_monitor.sh
├── memory_monitor.sh
├── disk_monitor.sh
├── network_monitor.sh
├── gpu_monitor.sh
├── monitor.sh
├── monitor.log
```

### What You Learned
- ✅ Terminal and shell fundamentals
- ✅ Linux commands (`pwd`, `ls`, `mkdir`, `cd`, `ps`, `top`, `free`, `df`, `ss`)
- ✅ Bash scripting and permissions (`chmod +x`)
- ✅ CPU, memory, disk, process, network, and GPU monitoring
- ✅ Threshold alerting
- ✅ Live dashboards (`watch`)
- ✅ Logging (`>>`)
- ✅ Scheduling with cron

### Portfolio Project
**Linux Resource Monitoring Toolkit**: Built a Linux monitoring toolkit using Bash scripting to monitor CPU, memory, disk, network, process, and GPU utilization, with live dashboard viewing, logging, and scheduled execution via cron.
**Skills:** Linux, Bash, System Administration, Automation, Monitoring, AI Infrastructure.

**Deliverable:** A full `monitoring_project/` folder with individual and combined monitoring scripts, a threshold alert, a live dashboard mode, logging, and a cron schedule.

---

## Project 3 (Module 3): Deploy a Service to a Cloud Compute Instance

**Goal:** Move from your local machine to a real cloud server, the foundation every later deployment builds on.

**Step 1: Set up a local project folder for your service code.**
```bash
mkdir cloud_deploy_project
cd cloud_deploy_project
```

**Step 2: Understand what a cloud provider gives you.**
**IaaS (Infrastructure as a Service)** means renting raw compute (a virtual machine) by the hour/second instead of buying physical hardware.

**Step 3: Create a compute instance.**
An **instance** is a virtual machine (VM), an emulated computer running on shared physical hardware. **Instance type** describes its specs (e.g., how much CPU/RAM/GPU it has).

**Step 4: Configure network access.**
A **security group** (or firewall rule) controls which **ports** are allowed to receive traffic from the outside world.

**Step 5: Connect to the instance.**
**SSH (Secure Shell)** is an encrypted remote-login protocol; a **key pair** (public/private key) proves your identity instead of a password.
```bash
ssh -i your-key.pem user@<public-ip>
```

**Step 6: Write a minimal "hello world" service first.**
```bash
nano main.py
```
```python
from fastapi import FastAPI
app = FastAPI()

@app.get("/")
def hello():
    return {"message": "Hello from the cloud!"}
```

**Step 7: Install what your service needs.**
```bash
sudo apt update && sudo apt install -y python3-pip
pip3 install fastapi uvicorn
```
A **package manager** (`apt`, `pip`) installs and tracks software so you don't do it by hand.

**Step 8: Run your service.**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
Binding to `0.0.0.0` (not `127.0.0.1`) means "accept traffic from any address," which is required for external access.

**Step 9: Expose the service publicly.**
Confirm the security group allows port 8000, and note the instance's public IP.

**Step 10: Test it from your own laptop.**
```bash
curl http://<public-ip>:8000
```
**curl** is a command-line tool for sending HTTP requests, the same kind of request a browser or app would send.

### Final Project Structure
```text
cloud_deploy_project/
│
├── main.py           # runs on the cloud instance
```

### What You Learned
- ✅ IaaS and virtual machine fundamentals
- ✅ Instance types and cost/performance tradeoffs
- ✅ Security groups and firewall rules
- ✅ SSH and key-pair authentication
- ✅ Installing dependencies on a remote server
- ✅ Running a service bound to all network interfaces
- ✅ Verifying a deployment from outside the server

### Portfolio Project
**Cloud-Deployed Web Service**: Provisioned a cloud compute instance, configured network access and SSH authentication, and deployed a live FastAPI service reachable from the public internet.
**Skills:** Cloud Computing, Linux Server Administration, Networking, SSH, Python, AI Infrastructure.

**Deliverable:** A live, publicly reachable service running on a cloud compute instance, confirmed with `curl` from your own machine.

---

## Project 4 (Module 4): Containerize and Deploy an Application

**Goal:** Package your service so it runs identically anywhere, the single most important habit in modern infrastructure.

**Step 1: Set up a project folder.**
```bash
mkdir container_project
cd container_project
```
Copy in your `main.py` and dependencies from Project 3.

**Step 2: Understand why containers exist.**
A **container** bundles your app, its dependencies, and a minimal OS layer into one portable unit. Unlike a VM, it shares the host's kernel, so it's much lighter and faster to start.

**Step 3: List your dependencies.**
```bash
echo "fastapi
uvicorn" > requirements.txt
```

**Step 4: Write a Dockerfile.**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
A **base image** (`python:3.11-slim`) is a pre-built starting environment; each instruction (`RUN`, `COPY`) adds a **layer**, cached for faster rebuilds.

**Step 5: Build the image.**
```bash
docker build -t my-ai-service:v1 .
```
**building** turns the Dockerfile into a runnable **image** (a snapshot); the `:v1` is a **tag**, used for versioning.

**Step 6: Run the container locally.**
```bash
docker run -p 8000:8000 my-ai-service:v1
```
`-p 8000:8000` **maps** a port on your machine to a port inside the container.

**Step 7: Push the image to a registry.**
```bash
docker tag my-ai-service:v1 <registry>/my-ai-service:v1
docker push <registry>/my-ai-service:v1
```
A **container registry** (like Docker Hub or a cloud provider's registry) stores images so other machines can pull and run them.

**Step 8: Pull and run the image on your cloud instance from Project 3.**
```bash
docker pull <registry>/my-ai-service:v1
docker run -d -p 8000:8000 <registry>/my-ai-service:v1
```
`-d` runs the container **detached** (in the background), so it keeps running after you disconnect.

**Step 9: Verify it's running.**
Run `docker ps` to confirm the container is up, then `curl` the public IP and port again.

### Final Project Structure
```text
container_project/
│
├── main.py
├── requirements.txt
├── Dockerfile
```

### What You Learned
- ✅ Why containers exist vs. VMs
- ✅ Writing a Dockerfile (base images, layers, instructions)
- ✅ Building and tagging images
- ✅ Running containers with port mapping
- ✅ Pushing images to a container registry
- ✅ Pulling and running images on a remote server

### Portfolio Project
**Containerized Service Deployment**: Packaged a Python API into a Docker container, published it to a container registry, and deployed the exact same image to a cloud server.
**Skills:** Docker, Containerization, Container Registries, DevOps Fundamentals, AI Infrastructure.

**Deliverable:** A containerized version of your service, pushed to a registry and running on your cloud instance via Docker.

---

## Project 5 (Module 5): Benchmark Inference Performance Across Hardware Configurations

**Goal:** Measure, not guess, whether your infrastructure choices are actually good ones.

**Step 1: Set up a project folder.**
```bash
mkdir benchmark_project
cd benchmark_project
```

**Step 2: Define what "fast" and "efficient" mean.**
**latency** is how long one request takes; **throughput** is how many requests can be handled per second; **P50/P95/P99** are percentiles, P95 latency means 95% of requests were faster than this number.

**Step 3: Set up two (or more) hardware configurations to compare.**
Example: run the same containerized service (Project 4) on a CPU-only instance and a GPU-enabled instance.

**Step 4: Write a simple benchmarking script.**
```bash
nano benchmark.py
```
```python
import time, requests

latencies = []
for _ in range(100):
    start = time.time()
    requests.post("http://<ip>:8000/predict", json={"input": "test"})
    latencies.append(time.time() - start)

latencies.sort()
print("P50:", latencies[49])
print("P95:", latencies[94])
```
This is a minimal **load-testing** script, repeatedly hitting your service and recording response times.

**Step 5: Run the benchmark against each hardware configuration.**
```bash
python3 benchmark.py
```
Record P50, P95, and total time for 100 requests on each setup, save each run's output to a file (`cpu_results.txt`, `gpu_results.txt`).

**Step 6: Compare cost against performance.**
Divide each instance's hourly cost by its throughput to get a rough cost-per-1000-requests figure.

**Step 7: Write up your findings.**
```bash
nano benchmark_report.md
```
One paragraph: which configuration wins, under what conditions, and why.

### Final Project Structure
```text
benchmark_project/
│
├── benchmark.py
├── cpu_results.txt
├── gpu_results.txt
├── benchmark_report.md
```

### What You Learned
- ✅ Latency, throughput, and percentile metrics (P50/P95/P99)
- ✅ Designing a fair, like-for-like hardware comparison
- ✅ Writing a load-testing script
- ✅ Calculating cost-per-request across configurations
- ✅ Documenting benchmark results for future decisions

### Portfolio Project
**Inference Hardware Benchmark Report**: Designed and ran a load-testing script comparing latency, throughput, and cost-efficiency across CPU and GPU hardware configurations for a deployed model API.
**Skills:** Performance Benchmarking, Python, Load Testing, Cost Analysis, AI Infrastructure.

**Deliverable:** A short benchmark report comparing latency, throughput, and cost across at least two hardware configurations.

---

## Project 6 (Module 6): Deploy a Model Behind a Serving API with Autoscaling

**Goal:** The centerpiece project, turn a model into a production API that grows and shrinks with demand automatically.

**Step 1: Set up a project folder.**
```bash
mkdir autoscaling_api_project
cd autoscaling_api_project
```

**Step 2: Wrap your model in an API.**
```bash
nano main.py
```
```python
from fastapi import FastAPI
app = FastAPI()

@app.post("/predict")
def predict(input: dict):
    # load model once at startup, run inference here
    return {"prediction": "result"}
```
A **serving framework** (FastAPI, Flask) turns raw Python code into an **HTTP endpoint**: a URL other programs can call. **Request/response** is the pattern: caller sends input, service sends back a prediction.

**Step 3: Containerize the API.**
Reuse the Dockerfile pattern from Project 4, but load the model file inside the container.

**Step 4: Push the image and deploy it via an orchestrator.**
An **orchestrator** (e.g., Kubernetes, or a managed container service) runs multiple copies (**replicas**) of your container and restarts them if they crash.

**Step 5: Put a load balancer in front of it.**
A **load balancer** distributes incoming requests evenly across all running replicas, so no single one is overwhelmed while others sit idle.

**Step 6: Configure autoscaling.**
**autoscaling** automatically adds or removes replicas based on a metric, commonly **CPU utilization** or **request count**. A typical rule: "if average CPU across replicas exceeds 70%, add a replica; if it drops below 30%, remove one."

**Step 7: Load test the deployment to trigger scaling.**
Reuse (and scale up) your benchmarking script from Project 5, send a high volume of concurrent requests.

**Step 8: Watch it scale in real time.**
Check replica count before, during, and after the load test (e.g., `kubectl get pods` if using Kubernetes, or your platform's equivalent).

**Step 9: Review cost and clean up.**
Scale back down (or delete test resources) and note what the load test cost you in compute time.

### Final Project Structure
```text
autoscaling_api_project/
│
├── main.py
├── requirements.txt
├── Dockerfile
├── autoscaling_config.yaml   # or your platform's equivalent
```

### What You Learned
- ✅ Wrapping a model in a serving API
- ✅ Orchestration, replicas, and resilience
- ✅ Load balancing across replicas
- ✅ Configuring autoscaling rules
- ✅ Load testing to trigger and verify scaling
- ✅ Watching scaling behavior in real time
- ✅ Cost cleanup after testing

### Portfolio Project
**Autoscaling Model-Serving API**: Deployed a containerized model API behind a load balancer with autoscaling, and verified scale-up and scale-down behavior under simulated load.
**Skills:** API Development, Container Orchestration, Load Balancing, Autoscaling, Load Testing, AI Infrastructure.

**Deliverable:** A model-serving API, containerized, deployed behind a load balancer, with autoscaling verified under real load, plus a note on cost.

---

## Project 7 (Module 7): Set Up Monitoring and Alerting for a Deployed Model

**Goal:** Give your Project 6 deployment eyes, know it's healthy without having to check manually.

**Step 1: Set up a project folder.**
```bash
mkdir monitoring_alerting_project
cd monitoring_alerting_project
```

**Step 2: Decide what's worth monitoring.**
Learn the four categories: **latency** (is it fast?), **error rate** (is it failing?), **resource usage** (is it about to run out of CPU/memory?), and **traffic volume** (is demand normal?).

**Step 3: Instrument your API to expose metrics.**
Add a metrics endpoint, e.g. using `prometheus_client` in Python:
```python
from prometheus_client import Counter, make_asgi_app
REQUEST_COUNT = Counter("predict_requests_total", "Total prediction requests")

@app.post("/predict")
def predict(input: dict):
    REQUEST_COUNT.inc()
    ...
```
**instrumentation** means adding code whose only job is to record what's happening, so it can be measured later.

**Step 4: Set up a metrics collector.**
**Prometheus** is a common open-source tool that periodically pulls (**scrapes**) metrics from your service and stores them as a time series.

**Step 5: Build a dashboard.**
**Grafana** (often paired with Prometheus) turns stored metrics into visual charts.

**Step 6: Define alert rules.**
```bash
nano alert_rules.yaml
```
Example rule: "if error rate > 5% over 5 minutes, fire an alert."
An **alert rule** is a threshold plus a time window, this avoids false alarms from single, momentary blips.

**Step 7: Configure where alerts go.**
An **alertmanager** (or equivalent) routes firing alerts to a **notification channel**: email, Slack, SMS, etc.

**Step 8: Test the alert by simulating a failure.**
Temporarily make the service return errors (or artificially spike load) and confirm the alert actually fires and arrives.

**Step 9: Review the dashboard after a day of normal traffic.**
Adjust thresholds if they're too sensitive or too loose.

### Final Project Structure
```text
monitoring_alerting_project/
│
├── prometheus.yml
├── alert_rules.yaml
├── grafana_dashboard.json
```

### What You Learned
- ✅ Choosing meaningful metrics (latency, error rate, resource usage, traffic)
- ✅ Instrumenting an API to expose metrics
- ✅ Collecting metrics with Prometheus
- ✅ Visualizing metrics with Grafana
- ✅ Writing alert rules with thresholds and time windows
- ✅ Routing alerts to a notification channel
- ✅ Testing alerts against a simulated failure

### Portfolio Project
**Model Deployment Monitoring & Alerting System**: Instrumented a production API, built a Prometheus/Grafana monitoring dashboard, and configured and tested a working alert rule for error-rate spikes.
**Skills:** Observability, Prometheus, Grafana, Alerting, Site Reliability Fundamentals, AI Infrastructure.

**Deliverable:** A monitoring dashboard and at least one tested, working alert for your Project 6 deployment.

---

## Final Capstone: Deploy a Scalable, Monitored Model-Serving Infrastructure on a Containerized Cloud Environment

**Goal:** Combine every project above into one system, this is an integration exercise, not a new build.

**Step 1: Set up your capstone project folder.**
```bash
mkdir capstone_project
cd capstone_project
```
Copy in the final versions of your code from Projects 4, 6, and 7.

**Step 2: Start from your Project 1 stack map.**
Confirm each layer (compute, storage, networking, orchestration, serving, monitoring) has a concrete answer from the projects you've already built.

**Step 3: Containerize the final version of your model API (Projects 4 & 6).**
Rebuild and push a clean, versioned image.

**Step 4: Deploy to your cloud instance/orchestrator with autoscaling configured (Projects 3 & 6).**
Re-verify the autoscaling rule from Project 6 is active.

**Step 5: Put your load balancer in front of it (Project 6).**
Confirm traffic is distributed, not hitting one replica.

**Step 6: Attach monitoring and alerting (Project 7).**
Confirm the dashboard shows live traffic and at least one alert is configured and tested.

**Step 7: Run your benchmark suite against the full system (Project 5).**
Record final latency/throughput/cost numbers for the complete, assembled infrastructure, not just the raw model.

**Step 8: Load test the whole system end-to-end.**
Send sustained traffic and confirm: autoscaling triggers, the load balancer distributes load, and the dashboard reflects it in real time.

**Step 9: Write the final infrastructure document.**
Combine your Project 1 map, benchmark results, and monitoring dashboard screenshots into one short write-up: what you built, how it scales, how you'd know if it broke.

### Final Project Structure
```text
capstone_project/
│
├── main.py
├── requirements.txt
├── Dockerfile
├── autoscaling_config.yaml
├── prometheus.yml
├── alert_rules.yaml
├── grafana_dashboard.json
├── benchmark_results.md
├── stack_diagram.png
├── infrastructure_writeup.md
```

### What You Learned
- ✅ Integrating seven separate infrastructure projects into one system
- ✅ Verifying an architecture map against a real, running deployment
- ✅ End-to-end load testing across autoscaling, load balancing, and monitoring together
- ✅ Writing infrastructure documentation for a non-technical or future audience

### Portfolio Project
**End-to-End AI Infrastructure Platform**: Designed, built, and documented a complete AI infrastructure system: a containerized, autoscaling model-serving API behind a load balancer, with full monitoring and alerting, benchmarked under real load on cloud infrastructure.
**Skills:** Cloud Computing, Docker, Container Orchestration, Autoscaling, Load Balancing, Observability (Prometheus/Grafana), Performance Benchmarking, Technical Documentation, AI Infrastructure Engineering.

**Deliverable:** A live, containerized, autoscaling, monitored model-serving system, plus a written summary connecting it back to every project that built it.
