<!-- order: 25 -->
# AI Infrastructure Engineer: Hands-On Project Tutorials

This course is a series of hands-on projects. You learn each idea at the moment you need it, while building the thing.

Follow the projects in order. Each one hands off a skill or artifact to the next.


## Before you start: your terminal

**Time: about 15 minutes**

Unlike the other AI courses, this one works in a **terminal** on purpose: infrastructure is built, deployed, and monitored from the command line, so practising there is part of the skill. None of these projects run in Google Colab. You work in files and a terminal.

**Which terminal to use.** The commands in this course are Linux commands. Use one of these:
- **Linux**, or **WSL** on Windows (open PowerShell as administrator, run `wsl --install`, restart, then use the Ubuntu terminal).
- **[Google Cloud Shell](https://shell.cloud.google.com)**: a free Linux terminal in your browser, with Docker and the `gcloud` tool already installed.
- **Terminal on a Mac** works for most projects, but some Linux commands in Project 2 (`top -bn1`, `free`, `ss`) don't exist on macOS. Mac users should do Project 2 in Cloud Shell (Project 2 lists Mac equivalents too).

**Where each project runs:**

| Project | Where it runs | Cost |
|---|---|---|
| 1. Stack map | Anywhere (planning documents) | Free |
| 2. Monitoring scripts | Linux, WSL, or Cloud Shell | Free |
| 3. Cloud instance | Cloud Shell, creating a Google Cloud VM | Free tier VM; small charges possible |
| 4. Containers | Your computer with Docker (or Cloud Shell), plus the Project 3 VM | Free tier VM; small charges possible |
| 5. Benchmarking | Your computer or Cloud Shell, plus cloud VMs | A few cents for a short-lived second VM |
| 6. Autoscaling | Your computer: Docker plus a local Kubernetes cluster (kind) | Free |
| 7. Monitoring and alerting | Your computer, same cluster as Project 6 | Free |

**Cloud costs.** Projects 3 to 5 create real cloud resources, which can cost money. Google Cloud needs a billing account even for free-tier use. Before Project 3, set a **budget alert** (Google Cloud console → **Billing → Budgets & alerts**, for example $5), and always do each project's shutdown step when you finish.

---

## Project 1 (Module 1): Map the Infrastructure Stack for an AI System

**Time: about 1.5 hours**

**Goal:** Before deploying anything, learn to see an AI system as a stack of layers, so every later project has a place to plug into.

**Step 1: Set up a project folder for your planning docs.**
```bash
mkdir infra_stack_project
cd infra_stack_project
```

**Step 2: Define what the system needs to do.**
Write one sentence in a file named `requirements.md`: what model are you serving, and who's using it? Example: "Serve an image-classification model to a mobile app, expecting 50 requests per second."

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

### Quiz

1. What is the difference between training and inference infrastructure needs?
2. When does a model need a GPU rather than a CPU?
3. What does a load balancer do?
4. What is the difference between a container and an orchestrator?

*Answers: 1) Training is heavy, GPU-hungry, and happens occasionally; inference is lighter per request but must be fast and happen often. 2) When it's a large deep learning model whose math benefits from many calculations in parallel; small, light models run fine on CPUs. 3) It spreads incoming traffic across several copies of a service so no single machine is overwhelmed. 4) A container is one packaged app with everything it needs; an orchestrator such as Kubernetes starts, stops, and scales many containers automatically.*

---

## Project 2 (Module 2): Write Shell Scripts to Monitor System Resources

**Time: about 3 hours**

**Goal:** See what a machine is doing under the hood, the skill every later deployment and monitoring project depends on.

**Where this runs:** a Linux terminal, WSL, or Google Cloud Shell. The scripts use Linux-only commands. On a Mac, use Cloud Shell for this project; if you want to try the commands on your Mac anyway, the equivalents are `top -l 1 | grep "CPU usage"` (instead of `top -bn1`), `vm_stat` (instead of `free`), and `netstat -an | grep LISTEN` (instead of `ss -tulwn`).

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
This step only works on a machine with an NVIDIA GPU and its drivers installed. Cloud Shell and most laptops don't have one, so if `nvidia-smi` says "command not found," read the step and move on.
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
Open `monitor.sh` again (`nano monitor.sh`) and add these lines at the end. They use `bc`, a calculator for decimals; if you get "bc: command not found," install it with `sudo apt install -y bc`.
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
Template: replace `/full/path/to` with the folder `pwd` printed in Step 2. Add:
```bash
*/5 * * * * /full/path/to/monitoring_project/monitor.sh >> /full/path/to/monitoring_project/monitor.log
```
**cron** is Linux's built-in scheduler; this line runs `monitor.sh` every 5 minutes and appends the result to your log. Cron needs a machine that stays on: it works on Linux, and on WSL after you start it with `sudo service cron start`. Cloud Shell shuts down when you close it, so scheduled jobs there won't keep running.

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

### Quiz

1. What does `chmod +x` do, and why is it needed before `./monitor.sh`?
2. What is the difference between `>` and `>>` when saving output to a file?
3. What does the cron line `*/5 * * * *` mean?
4. Which command would you use to find the program responsible for high CPU usage?
5. Why don't `free` and `ss` work in the Mac Terminal?

*Answers: 1) It gives the file execute permission; without it, the system refuses to run the script as a program. 2) `>` replaces the file's contents each time, while `>>` adds the new output to the end. 3) Run the command every 5 minutes. 4) `ps -eo pid,comm,%cpu --sort=-%cpu | head`, which lists processes sorted by CPU use. 5) They are Linux tools; macOS has different equivalents, which is why this project uses Linux, WSL, or Cloud Shell.*

---

## Project 3 (Module 3): Deploy a Service to a Cloud Compute Instance

**Time: about 3.5 hours**

**Goal:** Move from your local machine to a real cloud server, the foundation every later deployment builds on.

**Where this runs:** [Google Cloud Shell](https://shell.cloud.google.com), which already has the `gcloud` command-line tool. You'll create a small virtual machine on **Google Cloud Compute Engine**.

> **Cost warning.** This project creates a real cloud server. Google Cloud's Always Free tier includes one `e2-micro` VM per month in the `us-central1`, `us-west1`, or `us-east1` regions, with up to 30 GB of standard disk. The commands below stay inside those limits, but free-tier rules change and some items (such as the public IP address) may add small charges. Check the current terms at [cloud.google.com/free](https://cloud.google.com/free), keep the budget alert from "Before you start" switched on, and do Step 12 when you finish. Never create a GPU VM by accident: those cost dollars per hour.

**Step 1: Set up a project folder and pick your Google Cloud project.**
In Cloud Shell:
```bash
mkdir cloud_deploy_project
cd cloud_deploy_project
gcloud projects list
```
Template: replace `YOUR_PROJECT_ID` with a project ID from that list (create one in the console under **IAM & Admin → Create a project** if the list is empty, and link a billing account to it).
```bash
gcloud config set project YOUR_PROJECT_ID
gcloud services enable compute.googleapis.com
```

**Step 2: Understand what a cloud provider gives you.**
**IaaS (Infrastructure as a Service)** means renting raw compute (a virtual machine) by the hour/second instead of buying physical hardware.

**Step 3: Create a compute instance.**
An **instance** is a virtual machine (VM), an emulated computer running on shared physical hardware. **Instance type** (Google calls it **machine type**) describes its specs. `e2-micro` has 2 shared virtual CPUs and 1 GB of RAM: small, but enough for a test service.
```bash
gcloud compute instances create ai-service-vm \
  --zone=us-central1-a \
  --machine-type=e2-micro \
  --image-family=ubuntu-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=30GB \
  --boot-disk-type=pd-standard \
  --tags=ai-service
```
The output shows the VM's `EXTERNAL_IP`. Write it down; this is its **public IP**.

**Step 4: Configure network access.**
A **firewall rule** (AWS calls it a **security group**) controls which **ports** are allowed to receive traffic from the outside world. This rule opens port 8000, only on VMs tagged `ai-service`:
```bash
gcloud compute firewall-rules create allow-ai-service-8000 \
  --allow=tcp:8000 \
  --target-tags=ai-service \
  --source-ranges=0.0.0.0/0
```
`0.0.0.0/0` means "from anywhere on the internet," which is fine for a short test but is why you delete this rule in Step 12.

**Step 5: Write a minimal "hello world" service.**
Still in Cloud Shell, in your `cloud_deploy_project` folder:
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
Save with **Ctrl + O**, **Enter**, then exit with **Ctrl + X**.

**Step 6: Copy the file to the server.**
```bash
gcloud compute scp main.py ai-service-vm:~ --zone=us-central1-a
```
**scp** (secure copy) sends files over the same encrypted connection SSH uses. The first time, `gcloud` creates an SSH **key pair** for you (press **Enter** to accept the defaults). On other providers you'd do the same with plain `scp -i your-key.pem main.py user@<public-ip>:~`.

**Step 7: Connect to the instance.**
**SSH (Secure Shell)** is an encrypted remote-login protocol; a **key pair** (public/private key) proves your identity instead of a password. `gcloud` copies your public key to the VM and keeps the private key in Cloud Shell.
```bash
gcloud compute ssh ai-service-vm --zone=us-central1-a
```
Your prompt changes to show you're now on the VM. Run `ls` to confirm `main.py` arrived.

**Step 8: Install what your service needs, in a virtual environment.**
On the VM:
```bash
sudo apt update
sudo apt install -y python3-venv
python3 -m venv ~/venv
source ~/venv/bin/activate
pip install fastapi uvicorn
```
A **package manager** (`apt`, `pip`) installs and tracks software so you don't do it by hand. Ubuntu 24.04 blocks `pip install` into the system Python (you'd see an "externally-managed-environment" error), so you create a **virtual environment** (`~/venv`): a private Python just for this service.

**Step 9: Run your service.**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
Binding to `0.0.0.0` (not `127.0.0.1`) means "accept traffic from any address," which is required for external access. Leave this running.

**Step 10: Test it from outside the server.**
Open a second Cloud Shell tab (the **+** icon) and run, with the IP from Step 3:
```bash
curl http://<public-ip>:8000
```
You should see `{"message":"Hello from the cloud!"}`. You can also open `http://<public-ip>:8000` in your browser. **curl** is a command-line tool for sending HTTP requests, the same kind of request a browser or app would send.

**Step 11: Stop the service.**
In the first tab, press **Ctrl + C** to stop uvicorn, then type `exit` to leave the VM.

**Step 12: Shut down or delete what you created.**
Project 4 reuses this VM. If you'll do Project 4 soon, stop the VM (a stopped VM doesn't use CPU time; its disk stays within the free tier):
```bash
gcloud compute instances stop ai-service-vm --zone=us-central1-a
```
Start it again later with `gcloud compute instances start ai-service-vm --zone=us-central1-a` (the public IP may change; `gcloud compute instances list` shows the new one).

When you're completely done with Projects 3 to 5, delete everything:
```bash
gcloud compute instances delete ai-service-vm --zone=us-central1-a
gcloud compute firewall-rules delete allow-ai-service-8000
```

### Final Project Structure
```text
cloud_deploy_project/
│
├── main.py           # written in Cloud Shell, copied to the VM
```

### What You Learned
- ✅ IaaS and virtual machine fundamentals
- ✅ Instance (machine) types and cost/performance tradeoffs
- ✅ Firewall rules and security groups
- ✅ SSH, scp, and key-pair authentication
- ✅ Installing dependencies on a remote server in a virtual environment
- ✅ Running a service bound to all network interfaces
- ✅ Verifying a deployment from outside the server
- ✅ Stopping and deleting cloud resources to control cost

### Portfolio Project
**Cloud-Deployed Web Service**: Provisioned a cloud compute instance, configured network access and SSH authentication, and deployed a live FastAPI service reachable from the public internet.
**Skills:** Cloud Computing, Linux Server Administration, Networking, SSH, Python, AI Infrastructure.

**Deliverable:** A live, publicly reachable service running on a cloud compute instance, confirmed with `curl` from outside the server, and then shut down.

### Quiz

1. What does a firewall rule (security group) control?
2. Why does uvicorn bind to `0.0.0.0` instead of `127.0.0.1`?
3. Why did you install FastAPI inside a virtual environment on the VM?
4. How did `main.py` get from Cloud Shell onto the VM?
5. Why is the final shutdown step part of the project, not an optional extra?

*Answers: 1) Which ports can receive traffic, and from which addresses. 2) `0.0.0.0` accepts connections from any network address, while `127.0.0.1` only accepts connections from the server itself. 3) Ubuntu 24.04 blocks pip installs into the system Python, and a virtual environment keeps the service's packages separate. 4) With `gcloud compute scp`, which copies files over an encrypted SSH connection. 5) Cloud resources keep running, and can keep costing money, until you stop or delete them.*

---

## Project 4 (Module 4): Containerize and Deploy an Application

**Time: about 3 hours**

**Goal:** Package your service so it runs identically anywhere, the single most important habit in modern infrastructure.

**Where this runs:** Steps 1 to 7 run on your computer with **Docker Desktop** installed (free for personal use, from docker.com), or in Cloud Shell, which has Docker already. Steps 8 to 11 run on your Project 3 VM. You also need a free **Docker Hub** account (hub.docker.com) to store your image.

> **Cost warning.** This project restarts your Project 3 VM. The same free-tier limits and possible small charges apply. Stop the VM in Step 11.

**Step 1: Set up a project folder.**
```bash
mkdir container_project
cd container_project
```
Create `main.py` with the same code as Project 3 Step 5 (`nano main.py` and paste it in).

**Step 2: Understand why containers exist.**
A **container** bundles your app, its dependencies, and a minimal OS layer into one portable unit. Unlike a VM, it shares the host's kernel, so it's much lighter and faster to start.

**Step 3: List your dependencies.**
```bash
printf "fastapi\nuvicorn\n" > requirements.txt
cat requirements.txt
```

**Step 4: Write a Dockerfile.**
```bash
nano Dockerfile
```
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
A **base image** (`python:3.12-slim`) is a pre-built starting environment; each instruction (`RUN`, `COPY`) adds a **layer**, cached for faster rebuilds.

**Step 5: Build the image.**
Template: replace `YOUR_DOCKERHUB_USERNAME` with your Docker Hub username, here and in later steps.
```bash
docker build --platform linux/amd64 -t YOUR_DOCKERHUB_USERNAME/my-ai-service:v1 .
```
**Building** turns the Dockerfile into a runnable **image** (a snapshot); the `:v1` is a **tag**, used for versioning. `--platform linux/amd64` builds for the VM's processor type. It matters on Apple Silicon Macs, whose own chips are a different type (arm64); without it, the image would fail on the VM with an "exec format error."

**Step 6: Run the container locally.**
```bash
docker run --rm -p 8000:8000 YOUR_DOCKERHUB_USERNAME/my-ai-service:v1
```
`-p 8000:8000` **maps** a port on your machine to a port inside the container. In another terminal, run `curl http://localhost:8000` (in Cloud Shell, use a second tab). Stop the container with **Ctrl + C**.

**Step 7: Push the image to a registry.**
```bash
docker login
docker push YOUR_DOCKERHUB_USERNAME/my-ai-service:v1
```
A **container registry** (like Docker Hub or a cloud provider's registry) stores images so other machines can pull and run them. New Docker Hub repositories are public by default, so the VM can pull without logging in. Don't put secrets inside images you push to a public repository.

**Step 8: Start your VM and install Docker on it.**
From Cloud Shell:
```bash
gcloud compute instances start ai-service-vm --zone=us-central1-a
gcloud compute ssh ai-service-vm --zone=us-central1-a
```
Then, on the VM:
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
sudo docker --version
```
`docker.io` is Ubuntu's Docker package. `systemctl enable --now` starts Docker and makes it start again after a reboot. On the VM you run Docker with `sudo` because Docker needs administrator rights.

**Step 9: Pull and run the image on the VM.**
```bash
sudo docker pull YOUR_DOCKERHUB_USERNAME/my-ai-service:v1
sudo docker run -d --name my-ai-service -p 8000:8000 YOUR_DOCKERHUB_USERNAME/my-ai-service:v1
```
`-d` runs the container **detached** (in the background), so it keeps running after you disconnect.

**Step 10: Verify it's running.**
Run `sudo docker ps` to confirm the container is up. Then `exit` the VM and, from Cloud Shell or your computer, `curl http://<public-ip>:8000` (get the current IP with `gcloud compute instances list`). Notice you didn't install Python or FastAPI on the VM this time: everything came inside the image.

**Step 11: Shut down.**
If you're doing Project 5 straight away, leave the container running. Otherwise, stop the VM from Cloud Shell:
```bash
gcloud compute instances stop ai-service-vm --zone=us-central1-a
```
The container is set to stay stopped; after you start the VM again, run `sudo docker start my-ai-service` on it.

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
- ✅ Building and tagging images for the right processor type
- ✅ Running containers with port mapping
- ✅ Pushing images to a container registry
- ✅ Installing Docker on a server, then pulling and running images there

### Portfolio Project
**Containerized Service Deployment**: Packaged a Python API into a Docker container, published it to a container registry, and deployed the exact same image to a cloud server.
**Skills:** Docker, Containerization, Container Registries, DevOps Fundamentals, AI Infrastructure.

**Deliverable:** A containerized version of your service, pushed to a registry and running on your cloud instance via Docker.

### Quiz

1. How is a container different from a virtual machine?
2. What does `-p 8000:8000` do in `docker run`?
3. Why build with `--platform linux/amd64` on an Apple Silicon Mac?
4. Why didn't you need to install Python or FastAPI on the VM in this project?

*Answers: 1) A container shares the host's operating system kernel and packages only the app and its dependencies, so it's lighter and starts faster than a VM, which emulates a whole computer. 2) It maps port 8000 on the host to port 8000 inside the container, so requests to the host reach the app. 3) The VM uses amd64 processors, and an image built for the Mac's arm64 chip would fail there with an "exec format error." 4) The image already contains Python, FastAPI, uvicorn, and your code; the VM only needs Docker.*

---

## Project 5 (Module 5): Benchmark Inference Performance Across Hardware Configurations

**Time: about 3 hours**

**Goal:** Measure, not guess, whether your infrastructure choices are actually good ones.

**Where this runs:** the benchmark script runs in Cloud Shell or on your computer (Python 3.12+). It sends requests to the container from Project 4 running on two different Google Cloud VMs.

> **Cost warning.** Step 3 creates a second, larger VM (`e2-standard-2`) that is **not** free. It costs roughly $0.07 an hour at the time of writing (check the current price on the Compute Engine pricing page). Delete it as soon as you've finished benchmarking (Step 8). Don't use a GPU VM for this project: GPUs cost dollars per hour, need extra quota, and this small service wouldn't use one anyway.

**Step 1: Set up a project folder.**
```bash
mkdir benchmark_project
cd benchmark_project
python3 -m venv .venv
source .venv/bin/activate
pip install requests
```

**Step 2: Define what "fast" and "efficient" mean.**
**Latency** is how long one request takes; **throughput** is how many requests can be handled per second; **P50/P95/P99** are percentiles: P95 latency means 95% of requests were faster than this number.

**Step 3: Set up two hardware configurations to compare.**
Configuration A is your Project 4 VM (`e2-micro`), with the container running. For configuration B, create a bigger VM, install Docker, and run the same image:
```bash
gcloud compute instances create ai-service-vm-large \
  --zone=us-central1-a \
  --machine-type=e2-standard-2 \
  --image-family=ubuntu-2404-lts-amd64 \
  --image-project=ubuntu-os-cloud \
  --tags=ai-service
gcloud compute ssh ai-service-vm-large --zone=us-central1-a
```
On the new VM, repeat Project 4 Steps 8 and 9 (install Docker, pull, and run your image), then `exit`. Run `gcloud compute instances list` to get both public IPs. Running the identical image on both is what makes this a fair, like-for-like comparison.

**Step 4: Write a simple benchmarking script.**
```bash
nano benchmark.py
```
```python
import sys
import time

import requests

url = sys.argv[1]          # for example http://34.1.2.3:8000/
num_requests = 100

latencies = []
start_all = time.perf_counter()
for _ in range(num_requests):
    start = time.perf_counter()
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    latencies.append(time.perf_counter() - start)
total_time = time.perf_counter() - start_all

latencies.sort()
print(f"URL: {url}")
print(f"P50 latency: {latencies[49] * 1000:.1f} ms")
print(f"P95 latency: {latencies[94] * 1000:.1f} ms")
print(f"Total time for {num_requests} requests: {total_time:.2f} s")
print(f"Throughput: {num_requests / total_time:.1f} requests per second")
```
This is a minimal **load-testing** script: it calls the service's `GET /` endpoint (the only endpoint the Project 4 container has) 100 times in a row and records each response time. Because it sends one request at a time, its throughput figure is a lower bound, not the server's maximum.

**Step 5: Run the benchmark against each configuration.**
Template: replace the IPs with your two VMs' public IPs.
```bash
python benchmark.py http://<small-vm-ip>:8000/ > cpu_small_results.txt
python benchmark.py http://<large-vm-ip>:8000/ > cpu_large_results.txt
cat cpu_small_results.txt cpu_large_results.txt
```
Run each a couple of times: the first run can be slower while connections warm up.

**Step 6: Compare cost against performance.**
Use this formula for each configuration:

cost per 1,000 requests = hourly cost ÷ (requests per second × 3600) × 1000

Example: a VM costing $0.07 an hour that handles 20 requests per second serves 20 × 3600 = 72,000 requests an hour, so 1,000 requests cost $0.07 ÷ 72,000 × 1000 ≈ $0.001. For the free-tier `e2-micro`, use its normal list price, so the comparison reflects what you'd pay at scale.

**Step 7: Write up your findings.**
```bash
nano benchmark_report.md
```
One paragraph: which configuration wins, under what conditions, and why. Mention that most of the latency for this tiny service is network time between you and the VM, which is why a bigger VM may barely help. A real model doing heavy computation per request would show a bigger difference.

**Step 8: Delete the large VM.**
```bash
gcloud compute instances delete ai-service-vm-large --zone=us-central1-a
```
If you're finished with the cloud part of the course, also delete the Project 3 VM and firewall rule (Project 3 Step 12). Projects 6 and 7 run on your own computer.

### Final Project Structure
```text
benchmark_project/
│
├── benchmark.py
├── cpu_small_results.txt
├── cpu_large_results.txt
├── benchmark_report.md
```

### What You Learned
- ✅ Latency, throughput, and percentile metrics (P50/P95/P99)
- ✅ Designing a fair, like-for-like hardware comparison
- ✅ Writing a load-testing script
- ✅ Calculating cost per 1,000 requests across configurations
- ✅ Documenting benchmark results for future decisions
- ✅ Deleting paid resources as soon as the test is done

### Portfolio Project
**Inference Hardware Benchmark Report**: Designed and ran a load-testing script comparing latency, throughput, and cost-efficiency across two cloud machine types for a deployed API.
**Skills:** Performance Benchmarking, Python, Load Testing, Cost Analysis, AI Infrastructure.

**Deliverable:** A short benchmark report comparing latency, throughput, and cost across at least two hardware configurations.

### Quiz

1. What is the difference between latency and throughput?
2. What does a P95 latency of 200 ms mean?
3. A VM costs $0.10 an hour and handles 50 requests per second. Roughly what do 1,000 requests cost?
4. Why must both configurations run the identical container image?

*Answers: 1) Latency is how long one request takes; throughput is how many requests are handled per second. 2) 95% of requests finished in less than 200 ms, and the slowest 5% took longer. 3) It serves 50 × 3600 = 180,000 requests an hour, so 1,000 requests cost $0.10 ÷ 180,000 × 1000, about $0.00056. 4) So that any difference in results comes from the hardware, not from different code or dependencies.*

---

## Project 6 (Module 6): Deploy a Model Behind a Serving API with Autoscaling

**Time: about 5 hours**

**Goal:** The centerpiece project: turn a model into an API that runs on Kubernetes and grows and shrinks with demand automatically.

**Where this runs:** your own computer (macOS, Linux, or Windows with WSL), using a free local Kubernetes cluster made with **kind** ("Kubernetes in Docker"). Nothing here costs money. You need **Docker Desktop** running with at least 4 GB of memory available to it (Docker Desktop → **Settings → Resources**). On Windows, turn on WSL integration in Docker Desktop and run every command in the Ubuntu terminal.

**Step 1: Set up a project folder.**
```bash
mkdir autoscaling_api_project
cd autoscaling_api_project
```

**Step 2: Wrap a model in an API.**
```bash
nano main.py
```
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

POSITIVE = {"good", "great", "love", "excellent", "happy"}
NEGATIVE = {"bad", "terrible", "hate", "awful", "sad"}


class PredictRequest(BaseModel):
    text: str


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(request: PredictRequest):
    # Simulate the CPU work a real model does for each prediction.
    total = 0
    for i in range(300_000):
        total += i * i

    words = request.text.lower().split()
    score = sum(w in POSITIVE for w in words) - sum(w in NEGATIVE for w in words)
    if score > 0:
        label = "positive"
    elif score < 0:
        label = "negative"
    else:
        label = "neutral"
    return {"label": label, "score": score}
```
The "model" is a tiny word-counting sentiment classifier, plus a loop that burns CPU the way real inference does, so autoscaling has something to react to. A **serving framework** (FastAPI, Flask) turns raw Python code into an **HTTP endpoint**: a URL other programs can call. **Request/response** is the pattern: the caller sends input, the service sends back a prediction.

**Step 3: Containerize the API.**
```bash
printf "fastapi\nuvicorn\n" > requirements.txt
nano Dockerfile
```
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
```bash
docker build -t sentiment-api:v1 .
```
This time you don't add `--platform`: the image runs on your own computer, so Docker builds it for your processor automatically.

**Step 4: Install kind and kubectl.**
**kubectl** is the command-line tool for controlling any Kubernetes cluster; **kind** creates a practice cluster inside Docker.
- **Mac:** `brew install kind kubectl` (install Homebrew from brew.sh first if you don't have it).
- **Linux or WSL:** install kubectl with the official commands:
  ```bash
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  sudo install -m 0755 kubectl /usr/local/bin/kubectl
  ```
  For kind, copy the Linux commands from the "Installing From Release Binaries" section of the [kind Quick Start](https://kind.sigs.k8s.io/docs/user/quick-start/) page, which always has the current version.

Check both work:
```bash
kubectl version --client
kind version
```

**Step 5: Create a cluster and load your image into it.**
```bash
kind create cluster --name ai-serving
kubectl get nodes
kind load docker-image sentiment-api:v1 --name ai-serving
```
An **orchestrator** like Kubernetes runs multiple copies (**replicas**) of your container and restarts them if they crash. A **cluster** is the set of machines it manages; here it's one "node" running inside Docker. `kind load` copies your image straight into the cluster, so you don't need a registry for this project.

**Step 6: Install the metrics server.**
Autoscaling decisions need CPU measurements, which come from the **metrics server**:
```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl patch -n kube-system deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```
The patch is needed on kind only, because a practice cluster's internal certificates aren't signed the way the metrics server expects. Wait a minute, then run `kubectl top nodes`; when it shows CPU numbers instead of an error, metrics are working.

**Step 7: Deploy the API with a Deployment and a Service.**
```bash
nano deployment.yaml
```
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sentiment-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: sentiment-api
  template:
    metadata:
      labels:
        app: sentiment-api
    spec:
      containers:
        - name: sentiment-api
          image: sentiment-api:v1
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 256Mi
---
apiVersion: v1
kind: Service
metadata:
  name: sentiment-api
spec:
  selector:
    app: sentiment-api
  ports:
    - port: 80
      targetPort: 8000
```
```bash
kubectl apply -f deployment.yaml
kubectl get pods
```
A **Deployment** tells Kubernetes which image to run and how many replicas to keep alive. Each running copy is a **pod**. The **Service** gives all the pods one stable name (`sentiment-api`) and acts as the **load balancer**, spreading requests across every running replica so no single one is overwhelmed. `requests: cpu: 100m` reserves one tenth of a CPU core per pod; autoscaling percentages are measured against this number. Wait until the pod's status is `Running`.

**Step 8: Test the API.**
In a second terminal:
```bash
kubectl port-forward service/sentiment-api 8080:80
```
Back in the first terminal:
```bash
curl -X POST http://localhost:8080/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this great course"}'
```
You should get `{"label":"positive","score":2}`. `port-forward` connects a port on your computer to the Service, for testing only. Stop it with **Ctrl + C** when you're done.

**Step 9: Configure autoscaling.**
**Autoscaling** automatically adds or removes replicas based on a metric, commonly **CPU utilization** or **request count**. In Kubernetes this is a **HorizontalPodAutoscaler** (HPA).
```bash
nano hpa.yaml
```
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sentiment-api
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sentiment-api
  minReplicas: 1
  maxReplicas: 5
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
```
```bash
kubectl apply -f hpa.yaml
kubectl get hpa
```
The rule reads: "keep average CPU across the pods near 50% of what each pod requested; use between 1 and 5 replicas." The one-line command `kubectl autoscale deployment sentiment-api --cpu-percent=50 --min=1 --max=5` creates the same autoscaler. Use one or the other, not both; the YAML file is better because you can save and review it. After a minute, the `TARGETS` column should show a percentage instead of `<unknown>`.

**Step 10: Load test the deployment to trigger scaling.**
Start a load generator inside the cluster, so traffic goes through the Service's load balancing:
```bash
kubectl run load-generator --image=curlimages/curl --restart=Never -- \
  sh -c 'while true; do curl -s -X POST -H "Content-Type: application/json" -d "{\"text\": \"good day\"}" http://sentiment-api/predict > /dev/null; done'
```
This runs a pod that sends requests to `http://sentiment-api/predict` nonstop.

**Step 11: Watch it scale in real time.**
```bash
kubectl get hpa sentiment-api --watch
```
Within a few minutes, the CPU percentage climbs above 50% and `REPLICAS` rises. Press **Ctrl + C**, then run `kubectl get pods` to see the extra `sentiment-api` pods. If it doesn't scale, start a second generator with the same command, named `load-generator-2`.

**Step 12: Stop the load and watch it scale down.**
```bash
kubectl delete pod load-generator
kubectl get hpa sentiment-api --watch
```
Kubernetes waits about 5 minutes after load drops before removing replicas, so a brief dip doesn't cause flapping. Watch the replica count fall back to 1.

**Step 13: Clean up.**
```bash
kind delete cluster --name ai-serving
```
This deletes the whole practice cluster. Nothing here was billed, but on a real cloud cluster, scaling to 5 replicas means paying for 5 replicas' worth of compute: write down in your notes how many pod-minutes the load test used, as if each cost money.

### Final Project Structure
```text
autoscaling_api_project/
│
├── main.py
├── requirements.txt
├── Dockerfile
├── deployment.yaml
├── hpa.yaml
```

### What You Learned
- ✅ Wrapping a model in a serving API
- ✅ Running a local Kubernetes cluster with kind
- ✅ Deployments, pods, replicas, and resource requests
- ✅ Load balancing across replicas with a Service
- ✅ Configuring a HorizontalPodAutoscaler
- ✅ Load testing to trigger and verify scaling
- ✅ Watching scale-up and scale-down in real time
- ✅ Cleaning up after testing

### Portfolio Project
**Autoscaling Model-Serving API**: Deployed a containerized model API to Kubernetes behind a load-balancing Service with a HorizontalPodAutoscaler, and verified scale-up and scale-down behavior under simulated load.
**Skills:** API Development, Kubernetes, Container Orchestration, Load Balancing, Autoscaling, Load Testing, AI Infrastructure.

**Deliverable:** A model-serving API, containerized, deployed behind a Kubernetes Service, with autoscaling verified under real load, plus a note on what it would cost in the cloud.

### Quiz

1. What is the difference between a Deployment and a Service in Kubernetes?
2. Why does the HPA need the metrics server?
3. With a CPU request of 100m and a target of 50%, roughly when will the HPA add pods?
4. Why does Kubernetes wait several minutes before scaling back down?
5. Why was the load generator run inside the cluster instead of through `kubectl port-forward`?

*Answers: 1) A Deployment runs and maintains a set number of pod replicas; a Service gives those pods one stable address and spreads requests across them. 2) The HPA decides based on measured CPU use, and the metrics server is what collects those measurements from the pods. 3) When the pods' average CPU use goes above about 50m, half of what each pod requested. 4) To avoid flapping, where replicas are removed during a short dip and then needed again moments later. 5) Traffic sent to the Service name inside the cluster is spread across all pods, while port-forward is a testing tunnel that connects to just one pod.*

---

## Project 7 (Module 7): Set Up Monitoring and Alerting for a Deployed Model

**Time: about 3.5 hours**

**Goal:** Give your Project 6 deployment eyes: know it's healthy without having to check manually.

**Where this runs:** your own computer, using the kind cluster from Project 6 (if you deleted it, recreate it with Project 6 Steps 5 to 7). Steps 4 to 9 describe how Prometheus, Grafana, and alert routing fit together; installing them on the cluster is optional extra practice.

**Step 1: Set up a project folder.**
```bash
mkdir monitoring_alerting_project
cd monitoring_alerting_project
```

**Step 2: Decide what's worth monitoring.**
Learn the four categories: **latency** (is it fast?), **error rate** (is it failing?), **resource usage** (is it about to run out of CPU/memory?), and **traffic volume** (is demand normal?).

**Step 3: Instrument your API to expose metrics.**
Copy `main.py`, `Dockerfile`, and `requirements.txt` from Project 6 into this folder. Add `prometheus_client` to `requirements.txt`, then replace `main.py` with this version, which counts requests and errors and measures latency:
```python
import time

from fastapi import FastAPI, HTTPException
from prometheus_client import Counter, Histogram, make_asgi_app
from pydantic import BaseModel

app = FastAPI()
app.mount("/metrics", make_asgi_app())

REQUEST_COUNT = Counter("predict_requests_total", "Total prediction requests")
ERROR_COUNT = Counter("predict_errors_total", "Prediction requests that failed")
LATENCY = Histogram("predict_latency_seconds", "Time spent handling a prediction")

POSITIVE = {"good", "great", "love", "excellent", "happy"}
NEGATIVE = {"bad", "terrible", "hate", "awful", "sad"}


class PredictRequest(BaseModel):
    text: str


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(request: PredictRequest):
    REQUEST_COUNT.inc()
    start = time.perf_counter()
    try:
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="text must not be empty")
        words = request.text.lower().split()
        score = sum(w in POSITIVE for w in words) - sum(w in NEGATIVE for w in words)
        label = "positive" if score > 0 else "negative" if score < 0 else "neutral"
        return {"label": label, "score": score}
    except Exception:
        ERROR_COUNT.inc()
        raise
    finally:
        LATENCY.observe(time.perf_counter() - start)
```
**Instrumentation** means adding code whose only job is to record what's happening, so it can be measured later. Rebuild and redeploy it to your cluster (as `v2`), port-forward as in Project 6 Step 8, send a few `/predict` requests (including one with `"text": ""`, which counts as an error), then open `http://localhost:8080/metrics/` in your browser to see the counters:
```bash
docker build -t sentiment-api:v2 .
kind load docker-image sentiment-api:v2 --name ai-serving
kubectl set image deployment/sentiment-api sentiment-api=sentiment-api:v2
```

**Step 4: Understand the metrics collector.**
**Prometheus** is a common open-source tool that periodically pulls (**scrapes**) metrics from endpoints like your `/metrics` and stores them as a time series.

**Step 5: Understand dashboards.**
**Grafana** (often paired with Prometheus) turns stored metrics into visual charts, such as requests per second and P95 latency over time.

**Step 6: Define an alert rule.**
```bash
nano alert_rules.yaml
```
```yaml
groups:
  - name: sentiment-api
    rules:
      - alert: HighErrorRate
        expr: rate(predict_errors_total[5m]) / rate(predict_requests_total[5m]) > 0.05
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "More than 5% of prediction requests are failing"
```
An **alert rule** is a threshold plus a time window: this one fires only if errors stay above 5% of requests for 5 minutes, which avoids false alarms from single, momentary blips. This is Prometheus's rule format; you'd load it into Prometheus with a `rule_files` entry in `prometheus.yml`.

**Step 7: Understand where alerts go.**
An **Alertmanager** (or equivalent) routes firing alerts to a **notification channel**: email, Slack, SMS, and so on.

**Step 8: Simulate a failure.**
With port-forward running, send a burst of bad requests, then check that `predict_errors_total` rose at `http://localhost:8080/metrics/`:
```bash
for i in $(seq 1 20); do
  curl -s -X POST http://localhost:8080/predict -H "Content-Type: application/json" -d '{"text": ""}' > /dev/null
done
```
With Prometheus and Alertmanager installed, this burst would push the error rate above 5% and fire `HighErrorRate`. Always test alerts this way: an alert that has never fired in a test may not fire in a real incident.

**Step 9: Plan the threshold review.**
In a `threshold_notes.md` file, write how you'd review the alert after a day of normal traffic, and what you'd change if it fired too often (raise the threshold or lengthen the window) or never fired during a real problem (lower it).

**Step 10: Clean up.**
```bash
kind delete cluster --name ai-serving
```

### Final Project Structure
```text
monitoring_alerting_project/
│
├── main.py
├── requirements.txt
├── Dockerfile
├── alert_rules.yaml
├── threshold_notes.md
```

### What You Learned
- ✅ Choosing meaningful metrics (latency, error rate, resource usage, traffic)
- ✅ Instrumenting an API to expose metrics
- ✅ How Prometheus collects metrics and Grafana visualizes them
- ✅ Writing alert rules with thresholds and time windows
- ✅ How alerts are routed to a notification channel
- ✅ Testing alerting with a simulated failure

### Portfolio Project
**Model Deployment Monitoring & Alerting System**: Instrumented a model-serving API with Prometheus metrics for requests, errors, and latency, wrote an error-rate alert rule, and verified the metrics respond to a simulated failure.
**Skills:** Observability, Prometheus, Alerting, Site Reliability Fundamentals, AI Infrastructure.

**Deliverable:** An instrumented API exposing `/metrics`, an alert rule for error-rate spikes, and notes from a simulated-failure test.

### Quiz

1. Name the four categories of things worth monitoring for a deployed model.
2. What does "instrumentation" mean?
3. Why does the alert rule include `for: 5m` instead of firing the moment errors appear?
4. Why should you deliberately trigger an alert in testing?

*Answers: 1) Latency, error rate, resource usage, and traffic volume. 2) Adding code whose only job is to record what the service is doing, such as request counts and response times, so it can be measured. 3) So a single momentary blip doesn't cause a false alarm; the problem must last 5 minutes. 4) To prove the rule, the metrics, and the notification route actually work before a real incident depends on them.*
