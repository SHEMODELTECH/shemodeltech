<!-- order: 26 -->
# AI Infrastructure Engineer — Advanced Module: Modern IaC, GPU Scheduling & Multi-Tenant IAM

This is a bonus, advanced module extending the **AI Infrastructure Engineer Foundations Course**. It covers four skills that aren't in the original 7-project course: **Pulumi** (infrastructure as code written in general-purpose languages), **OpenTofu** (the open-source fork of Terraform), **GPU scheduling** for AI workloads, and **multi-tenant identity and access management (IAM)**. Complete the original 7 projects first — this module builds directly on your Project 3 cloud instance, Project 4 containers, and Project 6 autoscaling deployment.

**By the end of this course, you'll be able to:**
- Provision, change, and tear down a cloud VM as code with Pulumi in Python
- Define the same VM in OpenTofu (HCL) and compare the two tools' workflows and state handling
- Run a local multi-node Kubernetes cluster with kind and share (simulated) GPUs between teams using namespaces, ResourceQuotas, PriorityClasses, preemption, taints, and node affinity
- Control who can do what in that cluster with Kubernetes RBAC (ServiceAccounts, Roles, RoleBindings, ClusterRoles), short-lived tokens, and least privilege for Secrets
- Test permission boundaries with `kubectl auth can-i`, read the API server's audit log, and map these ideas to AWS, Google Cloud, and Azure IAM

Every step follows the same format as the rest of the course: what you're doing, what the term means, how to do it, and why it matters.


## Before you start: your terminal

**Time: about 15 minutes**

Unlike the other AI courses, this one works in a **terminal** on purpose: infrastructure is built, deployed, and monitored from the command line, so practising there is part of the skill. Use Terminal on a Mac, a Linux shell, or WSL on Windows. If you'd rather not set anything up locally, [Google Cloud Shell](https://shell.cloud.google.com) gives you a free Linux terminal in your browser for Projects 9 and 10 (Projects 11 and 12 need Docker on your own computer).

**Where each project runs:**
- **Projects 9 and 10** run in your terminal and create real virtual machines on **AWS**. They need an AWS account, and **they can cost money**: each one has a cost warning and ends with a step that destroys everything it created.
- **Projects 11 and 12** run a real Kubernetes cluster on your own computer with **kind** (Kubernetes in Docker). They need Docker and about 8 GB of RAM, but no GPU and no cloud account, and they are free. Each one ends by deleting the cluster.

None of these projects run in Google Colab or on a Chromebook.

---

## Project 9 (Bonus Module 1): Provision AI Infrastructure as Code with Pulumi

**Time: about 4 hours**

**Goal:** Replace manual setup (Project 3) with infrastructure defined in real code, using a general-purpose programming language instead of a domain-specific config format.

**Where this runs:** a terminal on macOS, Linux, or WSL, creating a VM on **AWS** (Amazon Web Services).

> **Cost warning.** This project creates a real AWS EC2 instance. A `t3.micro` costs about $0.01 an hour and a `t3.small` about $0.02 an hour at the time of writing (new AWS accounts may get free-plan credits that cover this; check current pricing and your account's free-plan status). Set a budget alert first (AWS console → **Billing and Cost Management → Budgets**, for example $5), and always finish with Step 10, which deletes everything.

### Why This Project Matters

In Project 3 you created a VM by typing one-off commands. That doesn't scale, isn't repeatable, and isn't reviewable the way code is. Pulumi lets you define infrastructure in Python, the same language you've used throughout this course, instead of learning an entirely separate templating language.

**Step 1 — Install the Pulumi CLI and the AWS CLI.**
Pulumi has two parts: the **Pulumi CLI** (the `pulumi` command, which plans and applies changes) and a Python library your code imports. `pip install pulumi` only gives you the library, so install the CLI with the official installer:

```bash
curl -fsSL https://get.pulumi.com | sh
```

On a Mac you can use `brew install pulumi/tap/pulumi` instead. Close and reopen your terminal, then check:

```bash
pulumi version
```

Install the AWS CLI by following the official AWS guide for your OS ("Installing or updating to the latest version of the AWS CLI"), then check with `aws --version`.
*Why:* The CLI is the engine that compares your code with what exists in the cloud; the Python library only describes what you want.

**Step 2 — Connect your AWS account (keys stay out of your code).**
In the AWS console, create an IAM user for yourself (not the root account), give it permission to manage EC2 (for practice, the `AmazonEC2FullAccess` policy), and create an **access key** for it. Then run:

```bash
aws configure
```

Paste the access key ID and secret when asked, and choose `us-east-1` as the default region. The keys are saved in `~/.aws/credentials` on your computer, where Pulumi and OpenTofu find them automatically. Never paste them into `__main__.py`, `main.tf`, or any file you might share.
*Why:* Tools read credentials from your local configuration or environment variables, so the infrastructure code itself never contains secrets.

**Step 3 — Understand infrastructure as code (IaC).**
Learn: **infrastructure as code** means defining servers, networks, and other resources in version-controlled files instead of manually configuring them through a console — so infrastructure can be reviewed, reused, and reproduced exactly.
*Why:* Manual setup (Project 3) can't be code-reviewed, can't be easily replicated for a second environment, and leaves no record of *why* a setting was chosen.

**Step 4 — Log in locally and create the project.**

```bash
mkdir pulumi_iac_project
cd pulumi_iac_project
pulumi login --local
pulumi new aws-python
```

`pulumi login --local` keeps Pulumi's records (its **state**) in a folder on your computer instead of a Pulumi Cloud account. `pulumi new` asks a few questions: accept the default project name, use `dev` as the stack name, choose **pip** if asked for a toolchain, and pick `us-east-1` as the region. It also asks for a **passphrase** that protects any secrets in your stack; choose one and remember it (Pulumi asks for it on later commands; you can set it for the session with `export PULUMI_CONFIG_PASSPHRASE="your-passphrase"`).

Pulumi creates a **virtual environment** in a `venv/` folder and installs the `pulumi` and `pulumi-aws` Python libraries into it, so nothing is installed into your system Python. If you ever need to run Python against this project yourself, activate it first with `source venv/bin/activate`.

Learn: this scaffolds a Pulumi **stack**, an isolated, deployable instance of your infrastructure definition (e.g., "dev" or "prod").
*Why:* Stacks let you maintain separate, independently deployable environments from the same codebase — critical for testing infrastructure changes safely before they hit production.

**Step 5 — Define a compute instance in code.**
Replace the contents of `__main__.py` with:

```python
import pulumi
import pulumi_aws as aws

# Look up the newest official Ubuntu 24.04 image in your region.
ami = aws.ec2.get_ami(
    most_recent=True,
    owners=["099720109477"],  # Canonical, the company that publishes Ubuntu
    filters=[
        aws.ec2.GetAmiFilterArgs(
            name="name",
            values=["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"],
        ),
    ],
)

instance = aws.ec2.Instance(
    "ai-service-instance",
    instance_type="t3.micro",
    ami=ami.id,
    tags={"Name": "ai-inference-server"},
)

pulumi.export("ami_id", ami.id)
pulumi.export("public_ip", instance.public_ip)
```

Learn: an **AMI** (Amazon Machine Image) is the starting disk image for an EC2 instance, and AMI IDs differ by region and change whenever a new image is published. Instead of pasting an ID that will go stale, `get_ami` is a **lookup**: it asks AWS for the newest image matching the filter at deploy time.
*Why:* This is the same kind of small Ubuntu VM you created by hand in Project 3, now defined as reviewable, repeatable code instead of one-time commands.

**Step 6 — Preview before deploying.**

```bash
pulumi preview
```

Learn: `preview` shows exactly what Pulumi would create, change, or destroy, without actually doing it.
*Why:* This is the IaC equivalent of `docker build` before `docker run` — checking your plan before committing to it prevents costly, unintended infrastructure changes.

**Step 7 — Deploy the infrastructure.**

```bash
pulumi up
```

Pulumi shows the preview again and asks for confirmation; choose **yes**. When it finishes, it prints the `ami_id` and `public_ip` outputs.
*Why:* This single command replaces every manual step from Project 3 — and importantly, running it again later will only change what's actually different, not recreate everything from scratch.

**Step 8 — Modify and redeploy.**
Change `instance_type` to `"t3.small"` and run `pulumi up` again.
Learn: Pulumi calculates a **diff** — only the changed resource gets modified, everything else stays untouched.
*Why:* This diff-based approach is what makes IaC safe for ongoing changes — you're not redeploying your entire infrastructure every time one setting changes.

**Step 9 — Destroy and recreate to prove reproducibility.**

```bash
pulumi destroy
pulumi up
```

*Why:* If your infrastructure comes back identical after a full destroy/recreate cycle, you've proven it's genuinely defined in code — not accidentally dependent on manual tweaks you forgot you made in the console.

**Step 10 — Tear everything down.**

```bash
pulumi destroy
pulumi stack rm dev
```

`pulumi destroy` deletes the EC2 instance (confirm with **yes**); `pulumi stack rm` removes the stack's local records. Check the EC2 page of the AWS console to confirm no instances are left running.
*Why:* Ending every cloud project with a teardown is a habit that prevents surprise bills.

### Final Project Structure

```text
pulumi_iac_project/
│
├── __main__.py
├── Pulumi.yaml
├── Pulumi.dev.yaml
├── requirements.txt
├── venv/
```

### What You Learned
- ✅ What infrastructure as code solves that manual provisioning doesn't
- ✅ Installing the Pulumi CLI and keeping cloud credentials out of code
- ✅ Pulumi stacks as isolated, deployable environments
- ✅ Defining cloud resources in Python, with an AMI lookup instead of a hardcoded ID
- ✅ Previewing changes before applying them
- ✅ Making incremental changes via diffs
- ✅ Proving reproducibility through destroy/recreate, then tearing down

### Portfolio Project
**Infrastructure as Code with Pulumi** — Defined and deployed cloud compute infrastructure using Pulumi's Python SDK, with previewed changes, incremental diffs, and verified reproducibility via a full destroy/recreate cycle.
**Skills:** Pulumi, Infrastructure as Code, Python, Cloud Provisioning, AI Infrastructure.

**Deliverable:** A Pulumi project provisioning a compute instance, with a documented preview/deploy/modify/destroy cycle.

### Quiz

1. Why doesn't `pip install pulumi` alone let you run `pulumi up`?
2. What does `pulumi login --local` change?
3. Why look up the AMI with `get_ami` instead of pasting an AMI ID?
4. What does `pulumi preview` do that `pulumi up` doesn't?
5. Where do your AWS keys live, and why not in `__main__.py`?

*Answers: 1) pip installs only the Python library; the `pulumi` command is the separate Pulumi CLI, installed with the official installer. 2) Pulumi stores its state in a folder on your computer instead of a Pulumi Cloud account. 3) AMI IDs differ by region and go out of date when new images are published; the lookup finds the current matching image at deploy time. 4) It only shows what would be created, changed, or destroyed, without making any change. 5) In `~/.aws/credentials`, created by `aws configure`; code gets shared and committed, so secrets in it can leak.*

---

## Project 10 (Bonus Module 2): Compare and Migrate Infrastructure with OpenTofu

**Time: about 3.5 hours**

**Goal:** Learn OpenTofu, the open-source, community-governed fork of Terraform that was created after Terraform's 2023 licensing change.

**Where this runs:** a terminal on macOS, Linux, or WSL, using the AWS account and `aws configure` setup from Project 9.

> **Cost warning.** This project creates the same small EC2 instance as Project 9, with the same costs. Keep your budget alert on and finish with Step 9, which destroys everything.

### Why This Project Matters

Pulumi (Project 9) uses a general-purpose language. Many organizations instead use a domain-specific configuration language, and OpenTofu (along with Terraform, which it stays largely compatible with) is a widely used choice in that category. Knowing both approaches, and being able to move between them, is a practical skill.

**Step 1 — Set up a project folder and install OpenTofu.**

```bash
mkdir opentofu_project
cd opentofu_project
```

Install OpenTofu following the official instructions for your OS at [opentofu.org/docs/intro/install](https://opentofu.org/docs/intro/install/) (on a Mac, `brew install opentofu`). Check it with `tofu version`.
*Why:* OpenTofu is a drop-in-compatible fork, so most existing Terraform knowledge and configuration transfers directly.

**Step 2 — Understand what's different from Pulumi.**
Learn: both tools are **declarative**: you describe the end state you want (for example, "one t3.micro instance should exist"), and the tool works out what to create, change, or delete to get there. The difference is the language. Pulumi lets you describe that end state in a **general-purpose language** like Python, with loops, functions, and libraries. OpenTofu uses **HCL**, a configuration language built only for describing infrastructure.
*Why:* HCL's limited, predictable syntax is often preferred for large, standardized infrastructure, while Pulumi's general-purpose languages offer more flexibility for complex logic.

**Step 3 — Write a minimal OpenTofu configuration.**

```bash
nano main.tf
```

```hcl
terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Look up the newest official Ubuntu 24.04 image.
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical, the company that publishes Ubuntu

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

resource "aws_instance" "ai_service" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  tags          = { Name = "ai-inference-server" }
}

output "public_ip" {
  value = aws_instance.ai_service.public_ip
}
```

Learn: **HCL (HashiCorp Configuration Language)** is a declarative syntax purpose-built for describing infrastructure. A `data` block is a **data source**: it reads something that already exists (here, the newest Ubuntu image) instead of creating it, the HCL equivalent of Pulumi's `get_ami`. The `terraform { }` block name is kept for compatibility; OpenTofu reads it as-is.
*Why:* This defines the exact same instance as Project 9, letting you directly compare the two approaches for the identical resource.

**Step 4 — Initialize and plan.**

```bash
tofu init
tofu plan
```

Learn: `tofu init` downloads the AWS provider plugin. `tofu plan` is OpenTofu's equivalent of Pulumi's `preview`, showing what would change before applying it.
*Why:* This confirms both tools follow the same safety principle (preview before apply), even though their syntax differs significantly.

**Step 5 — Apply the configuration.**

```bash
tofu apply
```

Type `yes` to confirm.
*Why:* This is the OpenTofu equivalent of `pulumi up` — deploying the described infrastructure.

**Step 6 — Understand state management.**
Learn: OpenTofu keeps a **state file** (`terraform.tfstate` in this folder) tracking what infrastructure it created and manages. That's how it knows what to change (or leave alone) on the next `apply`. State files can contain sensitive values, so never commit them to a public repository.
*Why:* Losing or corrupting the state file is one of the most common real-world OpenTofu/Terraform incidents — understanding it exists, and where it lives, matters from day one.

**Step 7 — Make an incremental change.**
Change `instance_type` to `"t3.small"` and run `tofu plan` again to see the diff, then `tofu apply` to make the change.
*Why:* Same discipline as Project 9's incremental change — confirming you understand exactly what will change before committing to it.

**Step 8 — Write a comparison note.**

```bash
nano pulumi_vs_opentofu.md
```

Compare your Project 9 and Project 10 experience: syntax, workflow, and when you'd choose one over the other.
*Why:* Real infrastructure teams have to make this exact choice — having hands-on experience with both, and a documented opinion, is more valuable than knowing only one tool by default.

**Step 9 — Destroy everything.**

```bash
tofu destroy
```

Type `yes` to confirm, then check the EC2 page of the AWS console to confirm no instances are left running. If you no longer need the access key from Project 9, delete it in the IAM console too.
*Why:* `destroy` removes everything in the state file in one step, which is also proof that the tool tracked every resource it created.

### Final Project Structure

```text
opentofu_project/
│
├── main.tf
├── terraform.tfstate
├── pulumi_vs_opentofu.md
```

### What You Learned
- ✅ Declarative IaC in a configuration language vs. a general-purpose language
- ✅ Writing HCL configuration, including a data source lookup
- ✅ The init/plan/apply/destroy OpenTofu workflow
- ✅ State file management and its importance
- ✅ Making and previewing incremental changes
- ✅ Comparing Pulumi and OpenTofu firsthand

### Portfolio Project
**Infrastructure as Code with OpenTofu** — Provisioned cloud compute infrastructure using OpenTofu's declarative HCL configuration, with a documented comparison against an equivalent Pulumi implementation.
**Skills:** OpenTofu, Terraform/HCL, Infrastructure as Code, Cloud Provisioning, AI Infrastructure.

**Deliverable:** An OpenTofu configuration provisioning the same infrastructure as Project 9, with a written tool comparison and a completed teardown.

### Quiz

1. Pulumi and OpenTofu are both declarative. What is the main difference between them?
2. What does the `data "aws_ami"` block do?
3. What is the state file for, and why shouldn't it go in a public repository?
4. Which OpenTofu command matches `pulumi preview`?

*Answers: 1) The language: Pulumi describes infrastructure in general-purpose languages like Python, while OpenTofu uses HCL, a configuration language made only for infrastructure. 2) It looks up the newest matching Ubuntu image that already exists, so the configuration never hardcodes an AMI ID. 3) It records which real resources OpenTofu created and manages, so it knows what to change next time; it can contain sensitive values. 4) `tofu plan`.*

---

## Project 11 (Bonus Module 3): Schedule GPU Workloads for Multi-Tenant AI Infrastructure

**Time: about 5 hours**

**Goal:** Share the most expensive, most contested resource in AI infrastructure, GPUs, between two teams on a real Kubernetes cluster: per-team limits, priorities that let production inference push batch training aside, and rules that keep ordinary work off GPU machines.

**Where this runs:** a local Kubernetes cluster (1 control-plane node and 2 worker nodes) that **kind** runs as Docker containers on your own computer. No GPU or cloud account is needed: you'll advertise *simulated* GPUs on the worker nodes, and Kubernetes schedules them exactly like real ones.

> **What you need:** macOS, Linux, or Windows with **WSL 2** (run every command inside your WSL Ubuntu terminal). **Docker Desktop** (macOS or Windows, with WSL integration turned on) or **Docker Engine** (Linux), installed and running. At least 8 GB of RAM (give Docker Desktop at least 4 GB under Settings → Resources) and about 10 GB of free disk. Everything used is free; kind, kubectl, and Kubernetes are open source. This won't run in Google Colab or on a Chromebook.
>
> **Can't run it?** Read along: follow each step and study the expected output shown, then take the quiz. You'll still learn every idea.

### Why This Project Matters

Your Project 6 autoscaling handled generic compute. GPUs are different: they're expensive, often in short supply, and can't simply be "added" the way CPU instances can. When several teams share a GPU cluster, someone has to decide who gets GPUs, how many, and who waits. On Kubernetes, the platform most AI teams use to run training and inference, those decisions are made by the scheduler using the objects you'll build here.

**Step 1 — Install kind and kubectl.**
Learn: **kind** creates a Kubernetes cluster whose "machines" (nodes) are Docker containers. **kubectl** is the command-line tool for talking to any Kubernetes cluster.

On **macOS** with Homebrew:

```bash
brew install kind kubectl
```

On **Linux or WSL 2** (this lab was written against kind **v0.33.0**; check the [kind releases page](https://github.com/kubernetes-sigs/kind/releases) for a newer one and change the version in the URL):

```bash
# kind
[ "$(uname -m)" = x86_64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.33.0/kind-linux-amd64
[ "$(uname -m)" = aarch64 ] && curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.33.0/kind-linux-arm64
chmod +x ./kind && sudo mv ./kind /usr/local/bin/kind

# kubectl (latest stable release, from the official Kubernetes download site)
ARCH=$(uname -m | sed 's/x86_64/amd64/; s/aarch64/arm64/')
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/$ARCH/kubectl"
sudo install -m 0755 kubectl /usr/local/bin/kubectl && rm kubectl
```

Check both, and check that Docker is running:

```bash
kind version
kubectl version --client
docker info --format '{{.ServerVersion}}'
```

You should see something like `kind v0.33.0 go1.x linux/amd64`, `Client Version: v1.37.x`, and a Docker version number. If `docker info` fails, start Docker Desktop (or `sudo systemctl start docker` on Linux) and try again.
*Why:* kind gives you a real Kubernetes API server, scheduler, and nodes for free on a laptop, so everything you practise here works the same way on a cloud GPU cluster.

**Step 2 — Create a 3-node cluster.**

```bash
mkdir gpu_k8s_lab
cd gpu_k8s_lab
nano kind-config.yaml
```

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: gpu-lab
nodes:
  - role: control-plane
  - role: worker
  - role: worker
```

```bash
kind create cluster --config kind-config.yaml
kubectl get nodes
```

The first run downloads the `kindest/node` image (about 1 GB), so it can take a few minutes. kind prints each step and ends with `Set kubectl context to "kind-gpu-lab"`. Then you should see:

```text
NAME                    STATUS   ROLES           AGE   VERSION
gpu-lab-control-plane   Ready    control-plane   60s   v1.37.0
gpu-lab-worker          Ready    <none>          40s   v1.37.0
gpu-lab-worker2         Ready    <none>          40s   v1.37.0
```

Your version may be newer: each kind release uses its own default `kindest/node` image (kind v0.33.0 uses Kubernetes v1.37.0), and its release notes list the images built for it. If a node shows `NotReady`, wait 30 seconds and run `kubectl get nodes` again.
Learn: the **control-plane** node runs the API server and the **scheduler** (the component that picks a node for each pod). The two **workers** will be your "GPU machines."
*Why:* Scheduling only becomes interesting when there's more than one machine to choose from and not enough capacity for everyone.

**Step 3 — Advertise simulated GPUs on the worker nodes.**
Learn: in a real cluster, the **NVIDIA device plugin** (usually installed by the NVIDIA GPU Operator) runs on each GPU machine and tells Kubernetes how many GPUs it has, as a resource called `nvidia.com/gpu`. Anything that isn't CPU or memory is an **extended resource**. Kubernetes doesn't care what an extended resource physically is: it just counts it. So you can advertise a made-up one, `example.com/gpu`, by adding it to each worker's **status** (the part of a node object that describes its capacity):

```bash
for node in gpu-lab-worker gpu-lab-worker2; do
  kubectl patch node "$node" --subresource=status --type=json \
    -p '[{"op": "add", "path": "/status/capacity/example.com~1gpu", "value": "2"}]'
done
```

You should see `node/gpu-lab-worker patched` and `node/gpu-lab-worker2 patched`. In the patch path, `~1` stands for the `/` inside `example.com/gpu`. After a few seconds, the kubelet (the agent on each node) copies the new capacity into **allocatable** (what pods may use). Check it:

```bash
kubectl get nodes -o custom-columns='NAME:.metadata.name,GPUS:.status.allocatable.example\.com/gpu'
```

```text
NAME                    GPUS
gpu-lab-control-plane   <none>
gpu-lab-worker          2
gpu-lab-worker2         2
```

Your cluster now has 4 "GPUs", 2 per worker. If you restart Docker or your computer, run the patch loop again.
*Why:* The scheduler's GPU decisions are exactly the same for `example.com/gpu` and `nvidia.com/gpu`; only the device plugin and the real hardware differ. Kubernetes also has a newer, more flexible API for devices called Dynamic Resource Allocation (DRA), but the device-plugin model you're simulating is still the most common.

**Step 4 — Label and taint the GPU nodes.**

```bash
for node in gpu-lab-worker gpu-lab-worker2; do
  kubectl label node "$node" accelerator=fake-gpu
  kubectl taint node "$node" example.com/gpu=present:NoSchedule
done
kubectl get nodes -L accelerator
```

You should see `labeled` and `tainted` for each node, and an `ACCELERATOR` column showing `fake-gpu` on both workers.
Learn: a **label** is a tag a pod can ask for (with a **nodeSelector** or **node affinity**: "put me on a node with `accelerator=fake-gpu`"). A **taint** works the other way: it repels every pod that doesn't carry a matching **toleration**. `NoSchedule` means "don't place new pods here unless they tolerate this."
*Why:* GPU machines are too expensive to fill with ordinary web servers or cron jobs. Taints keep other work off them; labels and affinity steer GPU work onto them. Cloud GPU node pools (for example on GKE or EKS) come with a similar taint already applied.

**Step 5 — Create one namespace per tenant.**

```bash
nano tenants.yaml
```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: team-a
  labels:
    tenant: team-a
---
apiVersion: v1
kind: Namespace
metadata:
  name: team-b
  labels:
    tenant: team-b
```

```bash
kubectl apply -f tenants.yaml
```

You should see `namespace/team-a created` and `namespace/team-b created`.
Learn: a **namespace** is a named section of a cluster. Quotas, limits, and (in Project 12) permissions are attached per namespace, so one namespace per team (a **tenant**) is the usual starting point for a shared cluster. In this lab, team-a runs **production inference** and team-b runs **research training**.
*Why:* Without a boundary per team, there's nothing to hang "team-b may use at most 4 GPUs" on.

**Step 6 — Limit each team with a ResourceQuota and a LimitRange.**

```bash
nano quotas.yaml
```

```yaml
# team-a runs production inference: at most 2 GPUs in total.
apiVersion: v1
kind: ResourceQuota
metadata:
  name: gpu-quota
  namespace: team-a
spec:
  hard:
    requests.example.com/gpu: "2"
    requests.cpu: "2"
    requests.memory: 2Gi
    pods: "10"
---
# team-b runs research training: at most 4 GPUs in total.
apiVersion: v1
kind: ResourceQuota
metadata:
  name: gpu-quota
  namespace: team-b
spec:
  hard:
    requests.example.com/gpu: "4"
    requests.cpu: "2"
    requests.memory: 2Gi
    pods: "10"
---
# Default CPU/memory for containers that don't set them, and a per-container ceiling.
apiVersion: v1
kind: LimitRange
metadata:
  name: container-defaults
  namespace: team-a
spec:
  limits:
    - type: Container
      defaultRequest:
        cpu: 100m
        memory: 64Mi
      default:
        cpu: 250m
        memory: 128Mi
      max:
        cpu: "1"
        memory: 1Gi
---
apiVersion: v1
kind: LimitRange
metadata:
  name: container-defaults
  namespace: team-b
spec:
  limits:
    - type: Container
      defaultRequest:
        cpu: 100m
        memory: 64Mi
      default:
        cpu: 250m
        memory: 128Mi
      max:
        cpu: "1"
        memory: 1Gi
```

```bash
kubectl apply -f quotas.yaml
kubectl describe resourcequota gpu-quota -n team-a
```

The `describe` output lists each resource with `Used` and `Hard` columns, for example `requests.example.com/gpu   0     2`.
Learn: a **ResourceQuota** caps the total a namespace may request. For extended resources like GPUs, only the `requests.` form is allowed (`requests.example.com/gpu`). A **LimitRange** fills in default CPU and memory for containers that don't set them, and rejects any single container above `max`. The two work together: once a quota covers `requests.cpu`, every pod must declare a CPU request, and the LimitRange supplies one automatically.
*Why:* Together the quotas promise 6 GPUs while the cluster has only 4. That's normal (teams rarely all peak at once), and it's exactly why you also need priorities (Step 9).

**Step 7 — Run a pod that requests a GPU.**

```bash
nano gpu-test-pod.yaml
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-smoke-test
  namespace: team-a
spec:
  restartPolicy: Never
  nodeSelector:
    accelerator: fake-gpu
  tolerations:
    - key: example.com/gpu
      operator: Equal
      value: present
      effect: NoSchedule
  containers:
    - name: main
      image: busybox:1.37
      command: ["sh", "-c", "echo 'Pretending to use 1 GPU'; sleep 3600"]
      resources:
        requests:
          example.com/gpu: "1"
        limits:
          example.com/gpu: "1"
```

```bash
kubectl apply -f gpu-test-pod.yaml
kubectl get pod gpu-smoke-test -n team-a -o wide
kubectl describe resourcequota gpu-quota -n team-a
```

After the image downloads, the pod shows `Running` on `gpu-lab-worker` or `gpu-lab-worker2`, and the quota shows `requests.example.com/gpu   1     2`.
Learn: GPUs (real or simulated) are handed out in **whole units** and can't be overcommitted or shared between containers, so Kubernetes requires a container's **request to equal its limit** for an extended resource (if you set only the limit, the request is copied from it). A pod asking for `requests: 1, limits: 2` is rejected when you create it.

Now prove the taint works. Start an ordinary pod with no toleration:

```bash
kubectl run no-toleration --image=busybox:1.37 -n team-a --restart=Never -- sleep 3600
kubectl get pod no-toleration -n team-a
kubectl describe pod no-toleration -n team-a
```

It stays `Pending`. The **Events** section at the bottom of `describe` explains why, with a message like `0/3 nodes are available: 1 node(s) had untolerated taint {node-role.kubernetes.io/control-plane: }, 2 node(s) had untolerated taint {example.com/gpu: present}`. In a real cluster, this pod would run on separate CPU-only nodes. Clean up both test pods:

```bash
kubectl delete pod gpu-smoke-test no-toleration -n team-a
```

*Why:* `kubectl describe` and its Events are the first place to look whenever a pod won't start; reading them is a core infrastructure skill.

**Step 8 — Create PriorityClasses.**

```bash
nano priorityclasses.yaml
```

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: inference-high
value: 100000
globalDefault: false
preemptionPolicy: PreemptLowerPriority
description: "Production inference. May preempt lower-priority pods."
---
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: training-low
value: 1000
globalDefault: false
preemptionPolicy: Never
description: "Batch training. Waits for free GPUs and never preempts other pods."
```

```bash
kubectl apply -f priorityclasses.yaml
kubectl get priorityclasses
```

You'll see your two classes next to Kubernetes' built-in `system-cluster-critical` and `system-node-critical`.
Learn: a **PriorityClass** gives pods a number; a higher number means more important. The scheduler keeps waiting pods in a queue sorted by that number, and if a high-priority pod can't fit anywhere, it may **preempt** (evict) lower-priority pods to make room. `preemptionPolicy: Never` lets training wait politely without ever evicting anyone.
*Why:* "A production chatbot is down because a research experiment is using the GPUs" is exactly the incident priorities prevent.

**Step 9 — Fill every GPU with low-priority training.**

```bash
nano training-job.yaml
```

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: llm-finetune
  namespace: team-b
spec:
  parallelism: 4
  completions: 4
  backoffLimit: 6
  podFailurePolicy:
    rules:
      # A pod removed by preemption is not the job's fault: don't count it as a failure.
      - action: Ignore
        onPodConditions:
          - type: DisruptionTarget
  template:
    metadata:
      labels:
        app: llm-finetune
    spec:
      priorityClassName: training-low
      restartPolicy: Never
      terminationGracePeriodSeconds: 5
      nodeSelector:
        accelerator: fake-gpu
      tolerations:
        - key: example.com/gpu
          operator: Equal
          value: present
          effect: NoSchedule
      containers:
        - name: trainer
          image: busybox:1.37
          command: ["sh", "-c", "i=0; while [ $i -lt 360 ]; do echo \"training step $i\"; i=$((i+1)); sleep 10; done"]
          resources:
            requests:
              example.com/gpu: "1"
            limits:
              example.com/gpu: "1"
```

```bash
kubectl apply -f training-job.yaml
kubectl get pods -n team-b -o wide
kubectl describe node gpu-lab-worker | grep -A 12 "Allocated resources"
```

All 4 training pods should be `Running`, 2 on each worker, and the node shows `example.com/gpu  2  2` under Allocated resources: every GPU in the cluster is busy. Each "training" pod just prints a step every 10 seconds for an hour (try `kubectl logs job/llm-finetune -n team-b`).
Learn: a **Job** runs pods until they finish; `parallelism: 4` runs 4 at once. The `podFailurePolicy` tells the Job that a pod evicted by preemption shouldn't count against `backoffLimit`, so the Job simply makes a replacement.
*Why:* This is the realistic starting point: batch training happily soaks up every idle GPU.

**Step 10 — Deploy high-priority inference and watch preemption.**

```bash
nano inference.yaml
```

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: llm-inference
  namespace: team-a
spec:
  replicas: 2
  selector:
    matchLabels:
      app: llm-inference
  template:
    metadata:
      labels:
        app: llm-inference
    spec:
      priorityClassName: inference-high
      tolerations:
        - key: example.com/gpu
          operator: Equal
          value: present
          effect: NoSchedule
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - key: accelerator
                    operator: In
                    values: ["fake-gpu"]
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                topologyKey: kubernetes.io/hostname
                labelSelector:
                  matchLabels:
                    app: llm-inference
      containers:
        - name: server
          image: busybox:1.37
          command: ["sh", "-c", "echo 'model server ready'; while true; do sleep 3600; done"]
          resources:
            requests:
              example.com/gpu: "1"
            limits:
              example.com/gpu: "1"
```

Learn: **node affinity** is a more expressive nodeSelector (here: "only nodes whose `accelerator` label is `fake-gpu`"). The **pod anti-affinity** is a preference to put the two replicas on different nodes, so one node failing doesn't take down both.

Apply it and watch team-b (press Ctrl+C to stop watching):

```bash
kubectl apply -f inference.yaml
kubectl get pods -n team-b -w
```

Within about 15 seconds, two training pods go to `Terminating`, two replacement pods appear as `Pending`, and the other two keep `Running`. Then look at what happened:

```bash
kubectl get pods -n team-a -o wide
kubectl get events -n team-b --field-selector reason=Preempted
kubectl describe pod -n team-b $(kubectl get pods -n team-b --field-selector=status.phase=Pending -o name | head -n 1 | cut -d/ -f2)
```

You should see both inference pods `Running` (normally one on each worker), `Preempted` events with a message like `Preempted by pod ... on node gpu-lab-worker`, and, at the bottom of the pending pod's description, `0/3 nodes are available: ... 2 Insufficient example.com/gpu`. The pending training pods will start on their own as soon as GPUs free up.
*Why:* This is the core trade-off of shared GPU infrastructure, shown live: production inference got GPUs within seconds, and training wasn't lost, it just waits.

**Step 11 — Watch the quota stop a team from taking more.**

```bash
kubectl scale deployment llm-inference -n team-a --replicas=3
kubectl get pods -n team-a
kubectl get events -n team-a --field-selector reason=FailedCreate
```

Only 2 inference pods exist. The event says something like `Error creating: pods "llm-inference-..." is forbidden: exceeded quota: gpu-quota, requested: requests.example.com/gpu=1, used: requests.example.com/gpu=2, limited: requests.example.com/gpu=2`. Scale back down:

```bash
kubectl scale deployment llm-inference -n team-a --replicas=2
```

Learn: priority decides who goes first; the quota decides how much each team may hold at most. Preemption never lets a team go over its quota. (In larger clusters, admins also use a quota `scopeSelector` so only production namespaces may use `inference-high` at all.)
*Why:* Without quotas, a high-priority team could preempt everyone and take the whole cluster.

**Step 12 — Connect it to the scheduling ideas, and to Kueue.**
If you've built a scheduler by hand, every idea maps directly onto something Kubernetes already does:

| Scheduling idea | Where it lives in Kubernetes |
|---|---|
| A fixed pool of GPUs | Node `allocatable` for `example.com/gpu` (`nvidia.com/gpu` on real nodes) |
| Who holds which GPUs | "Allocated resources" in `kubectl describe node` |
| A priority queue (like Python's `heapq`) | PriorityClass values; the scheduler's queue of pending pods is sorted by priority |
| Releasing capacity, then retrying the queue | A pod finishes or is deleted, and pending pods are retried automatically |
| A per-team cap | ResourceQuota per namespace |
| Preventing **starvation** (a job waiting forever) | Not built in: quotas, `preemptionPolicy: Never`, and Kueue's fair sharing help |

Learn: the plain scheduler places pods one at a time and doesn't understand "this training run needs all 4 workers at once" or "team-b may borrow team-a's idle GPUs." For production, teams add **Kueue**, an official Kubernetes project for job queueing. With Kueue, you submit Jobs to a **LocalQueue** in your namespace; a **ClusterQueue** holds each team's GPU quota; Kueue keeps Jobs suspended until their whole request fits, lets teams in a **cohort** borrow each other's unused quota, and supports fair sharing and preemption between queues. You don't need to install it for this project; read its overview at [kueue.sigs.k8s.io](https://kueue.sigs.k8s.io).

Write down what you observed (which pods were preempted, which events you saw, and what Kueue would add) in a short note:

```bash
nano scheduling-notes.md
```

*Why:* Being able to explain why a pod is pending, and what tool fixes the gap, is what platform teams are asked to do every day.

**Step 13 — Clean up.**

```bash
kind delete cluster --name gpu-lab
docker ps
```

You should see `Deleting cluster "gpu-lab" ...`, and `docker ps` should no longer list any `gpu-lab-*` containers. Keep the `gpu_k8s_lab` folder: Project 12 reuses its files. To free disk space as well, `docker image rm kindest/node:v1.37.0` (use the version you saw in Step 2), though Project 12 would then download it again.
*Why:* A kind cluster keeps using memory and CPU until you delete it.

> **Troubleshooting.** On Linux, if a node stays `NotReady` or kind fails with "too many open files", raise the file-watch limits (from kind's known-issues page) and recreate the cluster: `sudo sysctl fs.inotify.max_user_watches=524288 fs.inotify.max_user_instances=512`. If `kubectl` says it can't connect, check that Docker is running and the context is right: `kubectl config current-context` should print `kind-gpu-lab`.

### Final Project Structure

```text
gpu_k8s_lab/
│
├── kind-config.yaml
├── tenants.yaml
├── quotas.yaml
├── gpu-test-pod.yaml
├── priorityclasses.yaml
├── training-job.yaml
├── inference.yaml
├── scheduling-notes.md
```

### What You Learned
- ✅ Why GPU scheduling differs from CPU autoscaling, and how GPUs appear in Kubernetes as extended resources
- ✅ Running a multi-node Kubernetes cluster locally with kind
- ✅ Requesting whole GPUs with requests equal to limits
- ✅ Per-team limits with namespaces, ResourceQuotas, and LimitRanges
- ✅ Keeping ordinary work off GPU nodes with taints, tolerations, labels, and node affinity
- ✅ PriorityClasses, preemption, and reading pending pods with `kubectl describe` and events
- ✅ Where Kueue fits for production job queueing and fair sharing

### Portfolio Project
**GPU Scheduling for Multi-Tenant AI Infrastructure on Kubernetes** — Built a multi-node Kubernetes cluster with simulated GPU capacity and configured per-team ResourceQuotas, LimitRanges, PriorityClasses, taints, tolerations, and node affinity; demonstrated production inference preempting batch training and quotas blocking over-allocation.
**Skills:** Kubernetes, kind, GPU Scheduling, Resource Quotas, Pod Priority and Preemption, Multi-Tenant Systems, AI Infrastructure.

**Deliverable:** The `gpu_k8s_lab` manifests plus a short note (with `kubectl` output) showing preemption events, a quota rejection, and a pod kept off GPU nodes by a taint.

### Quiz

1. Why does this lab patch `example.com/gpu` into the worker nodes' status, and what does a real GPU cluster use instead?
2. Why must a container's request for an extended resource like `example.com/gpu` equal its limit?
3. When you scaled the inference Deployment to 3 replicas, what stopped the third pod, and where did you see the reason?
4. What happened to the training pods when the inference Deployment arrived, and why?
5. The GPU nodes have a taint. Why do GPU pods need a nodeSelector or node affinity as well as a toleration?

*Answers: 1) kind nodes have no GPUs, so we advertise a made-up extended resource that the scheduler counts like any other; a real cluster runs the NVIDIA device plugin (often through the GPU Operator), which advertises `nvidia.com/gpu`. 2) GPUs are handed out in whole units that can't be overcommitted or shared, so Kubernetes only accepts extended resources when the request equals the limit. 3) team-a's ResourceQuota allows only 2 GPUs in total; the "exceeded quota" message appeared in the namespace's FailedCreate events. 4) The scheduler preempted two of them because `inference-high` has a higher priority value and may preempt; the Job recreated them and they waited as Pending with "Insufficient example.com/gpu". 5) A toleration only allows a pod onto a tainted node and doesn't send it there; the nodeSelector or affinity is what steers the pod to the GPU nodes.*

---

## Project 12 (Bonus Module 4): Implement Identity and Access Management (IAM) for AI Infrastructure

**Time: about 5 hours**

**Goal:** Control who and what can act on your shared GPU cluster: data scientists who can run training Jobs and read logs only in their own team's namespace, platform admins who manage the whole cluster, least-privilege access to Secrets, short-lived credentials, and an audit log of every decision.

**Where this runs:** the same kind setup as Project 11, on your own computer, recreated with audit logging switched on. No cloud account is needed: a final section maps everything to AWS, Google Cloud, and Azure IAM.

> **What you need:** the same as Project 11: macOS, Linux, or Windows with WSL 2; Docker Desktop or Docker Engine running; kind and kubectl installed (Project 11, Step 1); at least 8 GB of RAM and about 10 GB of free disk. Optional: `jq` for reading the audit log (`brew install jq` or `sudo apt install jq`). This won't run in Google Colab or on a Chromebook.
>
> **Can't run it?** Read along: follow each step and study the expected output shown, then take the quiz.

### Why This Project Matters

Project 3's firewall rules controlled network access (which ports, from where). They don't answer a different, equally critical question: once someone or something reaches your infrastructure, what are they actually allowed to do? IAM answers that, and becomes essential the moment more than one team shares the same cluster. Kubernetes has its own IAM system, **RBAC** (role-based access control), and it follows the same pattern as every cloud provider's.

**Step 1 — Understand the RBAC model.**
Learn: IAM always has three parts. An **identity** (who is asking), a **role** (a named set of permissions), and a **binding** (which identity gets which role, and where). In Kubernetes:
- Identities are **users** (people, usually from your company's login system) or **ServiceAccounts** (identities for programs and pipelines, created inside the cluster). In this lab, ServiceAccounts stand in for people because kind has no login system.
- A **Role** lists allowed actions (`verbs` such as `get`, `list`, `create`, `delete`) on resources (such as `pods` or `jobs`) **inside one namespace**. A **ClusterRole** does the same cluster-wide.
- A **RoleBinding** grants a Role to identities in one namespace; a **ClusterRoleBinding** grants a ClusterRole everywhere.

RBAC only has *allow* rules. Anything not explicitly allowed is denied.
*Why:* An ML researcher who can accidentally delete production resources, or read another team's data, is a real and common cause of incidents. RBAC prevents it by design, not by hoping people are careful. This is **least privilege**, the same principle as the AI Solutions Architect course's data layer design and the AI Agent Platform course's tool permissions.

**Step 2 — Write an audit policy.**
Learn: the **audit log** is the API server's record of every request: who, what, where, when, and whether it was allowed. An **audit policy** decides how much detail to record for each kind of request. Work in your Project 11 folder:

```bash
cd gpu_k8s_lab
nano audit-policy.yaml
```

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
# Don't write a separate "request received" entry for every call.
omitStages:
  - RequestReceived
rules:
  # 1. Skip noisy health checks and leader-election heartbeats.
  - level: None
    nonResourceURLs: ["/healthz*", "/livez*", "/readyz*", "/version"]
  - level: None
    resources:
      - group: coordination.k8s.io
        resources: ["leases"]
  - level: None
    userGroups: ["system:nodes"]
  - level: None
    users: ["system:kube-scheduler", "system:kube-controller-manager"]
    verbs: ["get", "list", "watch"]
  # 2. Secrets: record who touched them, never their contents.
  - level: Metadata
    resources:
      - group: ""
        resources: ["secrets"]
  # 3. RBAC changes: also record the request body (which permission was granted).
  - level: Request
    resources:
      - group: rbac.authorization.k8s.io
  # 4. Everything else: who, what, where, when, and the result.
  - level: Metadata
```

Rules are checked from top to bottom and the first match wins. `Metadata` records the request's details but not its body, which matters for Secrets: you want to know who read a token, never to copy the token into a log file.
*Why:* Security reviews and compliance audits (like the one in the AI Governance course's advanced module) start with the question "show me who did what."

**Step 3 — Recreate the cluster with audit logging turned on.**
Audit logging is a setting of the API server, so it must be configured when the cluster is created. If your Project 11 cluster still exists, delete it first with `kind delete cluster --name gpu-lab`. Then:

```bash
nano kind-audit.yaml
```

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: gpu-lab
nodes:
  - role: control-plane
    kubeadmConfigPatches:
      - |
        kind: ClusterConfiguration
        apiServer:
          extraArgs:
            audit-log-path: /var/log/kubernetes/kube-apiserver-audit.log
            audit-policy-file: /etc/kubernetes/policies/audit-policy.yaml
          extraVolumes:
            - name: audit-policies
              hostPath: /etc/kubernetes/policies
              mountPath: /etc/kubernetes/policies
              readOnly: true
              pathType: DirectoryOrCreate
            - name: audit-logs
              hostPath: /var/log/kubernetes
              mountPath: /var/log/kubernetes
              readOnly: false
              pathType: DirectoryOrCreate
    extraMounts:
      - hostPath: ./audit-policy.yaml
        containerPath: /etc/kubernetes/policies/audit-policy.yaml
        readOnly: true
  - role: worker
  - role: worker
```

Learn: there are two layers of "mounting" here. **extraMounts** copies your `audit-policy.yaml` from your computer into the control-plane node container. The **kubeadmConfigPatches** block changes the configuration kind passes to kubeadm (the tool that sets up the control plane): it adds the two audit flags to the API server and mounts the policy folder and log folder into the API server itself. (Since kind v0.32, kind converts this `extraArgs` format automatically for newer Kubernetes versions, which use a list format.)

Create the cluster from inside `gpu_k8s_lab` (the `./audit-policy.yaml` path is relative to where you run the command) and check the log exists:

```bash
kind create cluster --config kind-audit.yaml
docker exec gpu-lab-control-plane ls -l /var/log/kubernetes/
```

You should see `kube-apiserver-audit.log` with a non-zero size. On macOS with Docker Desktop, keep the project folder under your home folder so Docker can share the file.
*Why:* Turning audit logging on from the very first command means nothing that happens in the cluster goes unrecorded.

**Step 4 — Restore the Project 11 tenant setup.**

```bash
for node in gpu-lab-worker gpu-lab-worker2; do
  kubectl patch node "$node" --subresource=status --type=json \
    -p '[{"op": "add", "path": "/status/capacity/example.com~1gpu", "value": "2"}]'
  kubectl label node "$node" accelerator=fake-gpu
  kubectl taint node "$node" example.com/gpu=present:NoSchedule
done
kubectl apply -f tenants.yaml -f quotas.yaml -f priorityclasses.yaml
```

You should see each node `patched`, `labeled`, and `tainted`, then the namespaces, quotas, LimitRanges, and PriorityClasses `created`.
*Why:* Declarative files mean a fresh cluster is back to the same state in seconds, the same reproducibility lesson as Projects 9 and 10.

**Step 5 — Give each team's data scientist a namespace-scoped Role.**

```bash
nano rbac-tenants.yaml
```

```yaml
# --- team-a: one data scientist identity, one Role, one RoleBinding ---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ds-alice
  namespace: team-a
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: data-scientist
  namespace: team-a
rules:
  - apiGroups: ["batch"]
    resources: ["jobs"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: [""]
    resources: ["events", "resourcequotas"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: data-scientist-ds-alice
  namespace: team-a
subjects:
  - kind: ServiceAccount
    name: ds-alice
    namespace: team-a
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: data-scientist
---
# --- team-b: the same pattern for a second tenant ---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: ds-bob
  namespace: team-b
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: data-scientist
  namespace: team-b
rules:
  - apiGroups: ["batch"]
    resources: ["jobs"]
    verbs: ["create", "get", "list", "watch", "delete"]
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: [""]
    resources: ["events", "resourcequotas"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: data-scientist-ds-bob
  namespace: team-b
subjects:
  - kind: ServiceAccount
    name: ds-bob
    namespace: team-b
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: data-scientist
```

```bash
kubectl apply -f rbac-tenants.yaml
```

Learn: `apiGroups: [""]` means the core API group (pods, events, Secrets); Jobs live in the `batch` group. `pods/log` is a **subresource**: permission to read a pod's logs is separate from permission to see the pod. Notice what's missing: no Secrets, no Deployments, no editing of quotas or RoleBindings. (When many namespaces need identical rules, teams often define one ClusterRole and bind it with a RoleBinding in each namespace; the RoleBinding limits it to that namespace.)
*Why:* Data scientists get exactly what their work needs (submit training, see progress, read logs) and nothing that could affect another team or the platform.

**Step 6 — Give platform admins a ClusterRole.**

```bash
nano platform-admin.yaml
```

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: platform
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: platform-admin
  namespace: platform
---
# Cluster-wide permissions to run the shared GPU platform, but no access to Secrets.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: gpu-platform-admin
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list", "watch", "patch"]
  - apiGroups: [""]
    resources: ["nodes/status"]
    verbs: ["patch"]
  - apiGroups: [""]
    resources: ["namespaces", "resourcequotas", "limitranges"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: ["scheduling.k8s.io"]
    resources: ["priorityclasses"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: [""]
    resources: ["pods", "events"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["pods/log"]
    verbs: ["get"]
  - apiGroups: ["batch"]
    resources: ["jobs"]
    verbs: ["get", "list", "watch", "delete"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: gpu-platform-admin
subjects:
  - kind: ServiceAccount
    name: platform-admin
    namespace: platform
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: gpu-platform-admin
```

```bash
kubectl apply -f platform-admin.yaml
```

Learn: platform admins manage nodes (including the GPU capacity you patched in), namespaces, quotas, and priorities everywhere, and can see every team's pods and logs to debug them. Even so, they get no access to Secrets. Kubernetes also ships general-purpose ClusterRoles (`view`, `edit`, `admin`, `cluster-admin`; try `kubectl get clusterroles`), but `cluster-admin` can do anything, so it should be kept for emergencies.
*Why:* "Admin" shouldn't mean "everything." Splitting platform operations from data access limits the damage if an admin's credentials leak.

**Step 7 — Check permissions with `kubectl auth can-i`.**
Learn: your own kubectl identity from kind is a full cluster admin, which is allowed to **impersonate** others with `--as`. `kubectl auth can-i` asks the API server "would this identity be allowed to do this?" without doing it. A ServiceAccount's full name is `system:serviceaccount:<namespace>:<name>`.

```bash
kubectl auth can-i create jobs -n team-a --as=system:serviceaccount:team-a:ds-alice
kubectl auth can-i get pods --subresource=log -n team-a --as=system:serviceaccount:team-a:ds-alice
kubectl auth can-i create jobs -n team-b --as=system:serviceaccount:team-a:ds-alice
kubectl auth can-i get secrets -n team-a --as=system:serviceaccount:team-a:ds-alice
kubectl auth can-i --list -n team-a --as=system:serviceaccount:team-a:ds-alice
```

The answers are `yes`, `yes`, `no`, `no`, and then a table of everything alice may do in team-a. Now turn this into a repeatable test:

```bash
nano check-rbac.sh
```

```bash
#!/usr/bin/env bash
# Prints PASS or FAIL for every permission we expect to be allowed (yes) or denied (no).
ALICE=system:serviceaccount:team-a:ds-alice
BOB=system:serviceaccount:team-b:ds-bob
ADMIN=system:serviceaccount:platform:platform-admin
RUNNER=system:serviceaccount:team-a:inference-runner
failures=0

check() {  # usage: check EXPECTED IDENTITY kubectl-auth-can-i-arguments...
  expected=$1; who=$2; shift 2
  answer=$(kubectl auth can-i "$@" --as="$who" 2>/dev/null)
  answer=${answer%% *}   # keep only the first word: yes or no
  if [ "$answer" = "$expected" ]; then
    echo "PASS  ${who##*:} $* -> $answer"
  else
    echo "FAIL  ${who##*:} $* -> ${answer:-error} (expected $expected)"
    failures=$((failures + 1))
  fi
}

# Data scientists: Jobs and logs in their own namespace only.
check yes "$ALICE" create jobs -n team-a
check yes "$ALICE" get pods --subresource=log -n team-a
check no  "$ALICE" create jobs -n team-b
check no  "$ALICE" get pods -n team-b
check no  "$ALICE" get secrets -n team-a
check no  "$ALICE" create rolebindings -n team-a
check no  "$ALICE" delete resourcequotas -n team-a
check yes "$BOB"   create jobs -n team-b
check no  "$BOB"   get pods --subresource=log -n team-a

# Platform admin: runs the shared platform cluster-wide, but can't read Secrets.
check yes "$ADMIN" list pods --all-namespaces
check yes "$ADMIN" patch nodes --subresource=status
check yes "$ADMIN" create priorityclasses
check no  "$ADMIN" get secrets -n team-a

# Inference runner: exactly one named Secret, nothing else.
check yes "$RUNNER" get secret/hf-token -n team-a
check no  "$RUNNER" get secret/db-password -n team-a
check no  "$RUNNER" list secrets -n team-a

echo "Failures: $failures"
exit "$failures"
```

```bash
chmod +x check-rbac.sh
./check-rbac.sh
```

Every line should say `PASS` except one: `inference-runner get secret/hf-token` fails for now, because you'll create that permission in Step 10. Run the script again after Step 10 and you should see `Failures: 0`.
*Why:* Testing both the denials and the allowed cases (the same discipline as the AI Agent Platform course's Project 7 access control work) proves the rules discriminate correctly, rather than blocking or allowing everything. Rerun the script after every RBAC change.

**Step 8 — Act as a data scientist and test the namespace boundary.**

```bash
nano alice-job.yaml
```

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: alice-finetune
  namespace: team-a
spec:
  backoffLimit: 2
  ttlSecondsAfterFinished: 3600
  template:
    spec:
      restartPolicy: Never
      priorityClassName: training-low
      nodeSelector:
        accelerator: fake-gpu
      tolerations:
        - key: example.com/gpu
          operator: Equal
          value: present
          effect: NoSchedule
      containers:
        - name: trainer
          image: busybox:1.37
          command: ["sh", "-c", "for i in 1 2 3 4 5; do echo \"epoch $i: loss=0.$((10 - i))\"; sleep 5; done; echo 'training finished'"]
          resources:
            requests:
              example.com/gpu: "1"
            limits:
              example.com/gpu: "1"
```

```bash
ALICE=system:serviceaccount:team-a:ds-alice
kubectl create -f alice-job.yaml --as=$ALICE
kubectl get jobs -n team-a --as=$ALICE
```

Wait about 30 seconds, then read the logs as alice:

```bash
kubectl logs job/alice-finetune -n team-a --as=$ALICE
```

```text
epoch 1: loss=0.9
epoch 2: loss=0.8
epoch 3: loss=0.7
epoch 4: loss=0.6
epoch 5: loss=0.5
training finished
```

Now try to cross into team-b:

```bash
kubectl get pods -n team-b --as=$ALICE
kubectl create job sneaky --image=busybox:1.37 -n team-b --as=$ALICE -- echo hi
```

Both fail with `Error from server (Forbidden)`, for example `pods is forbidden: User "system:serviceaccount:team-a:ds-alice" cannot list resource "pods" in API group "" in the namespace "team-b"`.
*Why:* `can-i` answers hypothetical questions; this proves the real API enforces the same boundary.

**Step 9 — Use a short-lived token instead of impersonation.**
Learn: impersonation is an admin testing tool. A real person or pipeline would log in with its own credential. `kubectl create token` issues a **short-lived token** for a ServiceAccount that expires on its own (10 minutes is the shortest allowed).

```bash
TOKEN=$(kubectl create token ds-alice -n team-a --duration=10m)
kubectl config set-credentials ds-alice --token="$TOKEN"
kubectl config set-context alice --cluster=kind-gpu-lab --user=ds-alice --namespace=team-a
kubectl --context alice auth whoami
kubectl --context alice get jobs
kubectl --context alice get pods -n team-b
```

`auth whoami` shows `Username  system:serviceaccount:team-a:ds-alice`; listing jobs works; team-b is `Forbidden`. Your normal admin context (`kind-gpu-lab`) is unchanged. Come back after 10 minutes and run `kubectl --context alice get jobs` again: you'll get `error: You must be logged in to the server (Unauthorized)`.
*Why:* A leaked short-lived token stops working within minutes, while a long-lived key stays valid until someone notices and revokes it. Clouds use the same idea (see Step 12).

**Step 10 — Apply least privilege to Secrets.**
Create two Secrets with fake values (never put real keys in a lab):

```bash
kubectl create secret generic hf-token -n team-a --from-literal=token=not-a-real-token
kubectl create secret generic db-password -n team-a --from-literal=password=not-a-real-password
nano secret-access.yaml
```

```yaml
# The inference server needs one secret (a model-hub token) and nothing else.
apiVersion: v1
kind: ServiceAccount
metadata:
  name: inference-runner
  namespace: team-a
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: read-hf-token
  namespace: team-a
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    resourceNames: ["hf-token"]
    verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: inference-runner-read-hf-token
  namespace: team-a
subjects:
  - kind: ServiceAccount
    name: inference-runner
    namespace: team-a
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: read-hf-token
```

```bash
kubectl apply -f secret-access.yaml
./check-rbac.sh
```

The script now ends with `Failures: 0`: the runner can `get` exactly `hf-token`, but not `db-password`, and it can't `list` Secrets (a `resourceNames` rule can't allow listing, because a list returns every name).
Learn: two subtleties matter in real clusters. First, **`list` and `watch` on Secrets reveal their contents**, not just their names, so never grant them casually. Second, **anyone who can create pods or Jobs in a namespace can effectively read that namespace's Secrets**, because they can start a pod that mounts a Secret and prints it. That's why each team gets its own namespace, and why Secrets that a team must not see belong in a different namespace (or an external secret manager).
*Why:* Leaked credentials, such as model-hub, database, or cloud keys, are among the most common causes of breaches. Least privilege for Secrets limits how far one compromised identity can reach.

**Step 11 — Read the audit log.**
Look at the most recent entries:

```bash
docker exec gpu-lab-control-plane tail -n 2 /var/log/kubernetes/kube-apiserver-audit.log
```

Each line is one JSON event. Find the latest **denied** request and pretty-print it:

```bash
docker exec gpu-lab-control-plane grep '"forbid"' /var/log/kubernetes/kube-apiserver-audit.log | tail -n 1 | python3 -m json.tool
```

Look for `"verb"`, `"objectRef"` (resource and namespace), `"responseStatus"` with `"code": 403`, and the annotation `"authorization.k8s.io/decision": "forbid"`. For requests made with `--as`, `"user"` is you (the admin) and `"impersonatedUser"` is alice: the log records both. With `jq` installed, summarise everything alice did and save it:

```bash
docker exec gpu-lab-control-plane cat /var/log/kubernetes/kube-apiserver-audit.log \
  | jq -c 'select(.user.username == "system:serviceaccount:team-a:ds-alice" or .impersonatedUser.username == "system:serviceaccount:team-a:ds-alice") | {time: .requestReceivedTimestamp, verb, resource: .objectRef.resource, namespace: .objectRef.namespace, code: .responseStatus.code, decision: .annotations["authorization.k8s.io/decision"]}' \
  | tee alice-audit.jsonl
```

You'll see lines like `{"time":"...","verb":"list","resource":"pods","namespace":"team-b","code":403,"decision":"forbid"}` next to the allowed `create` of `jobs` in team-a. Also check the Secrets rule from Step 2: `docker exec gpu-lab-control-plane grep '"secrets"' /var/log/kubernetes/kube-apiserver-audit.log | tail -n 1` shows who created `hf-token`, but never its value.
*Why:* Every permission decision, especially every denial, now has a permanent record: the evidence a security review asks for, and the first place to look when something changes unexpectedly.

**Step 12 — Map Kubernetes RBAC to cloud IAM.**
Learn: everything you built has a direct equivalent in the big clouds' IAM systems, so the skill transfers even though the names change:

| Idea | Kubernetes (this lab) | AWS | Google Cloud | Azure |
|---|---|---|---|---|
| Identity for a person | User from your login system | IAM Identity Center user | Google account or group | Microsoft Entra ID user or group |
| Identity for a program | ServiceAccount | IAM role assumed by the workload | Service account | Managed identity |
| Set of permissions | Role / ClusterRole | IAM policy (JSON of actions and resources) | IAM role (predefined or custom) | Role definition |
| Granting it | RoleBinding / ClusterRoleBinding | Attaching a policy to a role, user, or group | IAM policy binding | Role assignment |
| Where it applies | Namespace or whole cluster | Resource ARNs within an account | Project, folder, or organization | Resource group or subscription |
| Temporary credentials | `kubectl create token` | STS AssumeRole | Short-lived service account tokens | Managed identity tokens |
| "Would this be allowed?" | `kubectl auth can-i` | IAM Policy Simulator | Policy Troubleshooter | "Check access" in the portal |
| Who did what | API server audit log | CloudTrail | Cloud Audit Logs | Azure Activity Log |

On managed Kubernetes, the two systems are joined: a pod's ServiceAccount can be linked to a cloud identity (EKS Pod Identity on AWS, Workload Identity Federation for GKE, Microsoft Entra Workload ID on AKS), so pods get short-lived cloud credentials without any stored keys. Add a few sentences on this to your notes.
*Why:* Interviews and real projects rarely use exactly the tools you practised on; knowing the shared pattern lets you pick up any IAM system quickly.

**Step 13 — Clean up.**

```bash
kind delete cluster --name gpu-lab
kubectl config delete-context alice
kubectl config delete-user ds-alice
docker ps
```

You should see `Deleting cluster "gpu-lab" ...`, then `deleted context alice` and `deleted user ds-alice` (this removes the token from your kubeconfig), and no `gpu-lab-*` containers in `docker ps`. If you want the disk space back, also remove the node image with `docker image rm kindest/node:v1.37.0` (use your version).
*Why:* Deleting the cluster also deletes its tokens, Secrets, and audit log, so nothing is left running or lying around.

> **Troubleshooting.** If `kind create cluster --config kind-audit.yaml` fails while starting the control plane, the API server usually couldn't find the policy file: check that you ran the command from the folder containing `audit-policy.yaml`, then delete the half-created cluster (`kind delete cluster --name gpu-lab`) and try again. If `kube-apiserver-audit.log` is missing, run `docker exec gpu-lab-control-plane ls /etc/kubernetes/policies` to confirm the policy file arrived.

### Final Project Structure

```text
gpu_k8s_lab/
│
├── (Project 11 files)
├── audit-policy.yaml
├── kind-audit.yaml
├── rbac-tenants.yaml
├── platform-admin.yaml
├── secret-access.yaml
├── check-rbac.sh
├── alice-job.yaml
├── alice-audit.jsonl
```

### What You Learned
- ✅ The identity → role → binding model, in Kubernetes RBAC and in cloud IAM
- ✅ Namespace-scoped Roles for data scientists and a ClusterRole for platform admins
- ✅ Testing permission boundaries with `kubectl auth can-i`, impersonation, and a repeatable test script
- ✅ Short-lived ServiceAccount tokens instead of long-lived credentials
- ✅ Least privilege for Secrets, including why pod creation implies Secret access
- ✅ Turning on and reading the Kubernetes API server audit log in kind

### Portfolio Project
**Multi-Tenant Access Control for a Kubernetes GPU Platform** — Designed least-privilege RBAC for two tenant teams and a platform admin group on a local multi-node Kubernetes cluster, verified allowed and denied actions with an automated `kubectl auth can-i` test script, used short-lived ServiceAccount tokens, restricted Secret access by name, and enabled API server audit logging; mapped the design to AWS, Google Cloud, and Azure IAM.
**Skills:** Kubernetes RBAC, Identity and Access Management, Audit Logging, Security Engineering, Multi-Tenant Systems, AI Infrastructure.

**Deliverable:** The RBAC manifests, `check-rbac.sh` output showing `Failures: 0`, an excerpt of the audit log (`alice-audit.jsonl`) with an allowed and a denied request, and your cloud IAM mapping notes.

### Quiz

1. What is the difference between a Role with a RoleBinding and a ClusterRole with a ClusterRoleBinding?
2. RBAC has no "deny" rules. How did it still block alice from listing pods in team-b?
3. How did you check alice's permissions without having her credentials?
4. Why does permission to create Jobs in a namespace come close to permission to read that namespace's Secrets?
5. In the audit log, how can you tell a request was denied, and what is the AWS service that plays the same role?

*Answers: 1) A Role and RoleBinding grant permissions inside one namespace only; a ClusterRole and ClusterRoleBinding grant them across the whole cluster. 2) Everything not explicitly allowed is denied, and no binding gave alice any permission in team-b. 3) With `kubectl auth can-i ... --as=system:serviceaccount:team-a:ds-alice`, using the admin's right to impersonate, and by running real commands with `--as`. 4) A Job's pod can mount any Secret in its namespace and print it, so whoever can create pods or Jobs there can effectively read those Secrets. 5) The event has `"authorization.k8s.io/decision": "forbid"` and a response code of 403; on AWS, CloudTrail records API activity in the same way.*

---

## Advanced Module Summary

These four bonus projects extend the model-serving platform you built in the main course with the infrastructure skills that have grown fastest since the original course was built:

| Project | Core Skill | Extends |
|---|---|---|
| 9. Pulumi | General-purpose-language IaC | Project 3 (cloud instance) |
| 10. OpenTofu | Declarative, open-source IaC | Project 3 (cloud instance) |
| 11. GPU Scheduling | Kubernetes quotas, priorities, preemption, taints, and affinity for shared (simulated) GPUs on a local kind cluster | Project 6 (autoscaling) |
| 12. Multi-Tenant IAM | Kubernetes RBAC, short-lived tokens, Secret least privilege, and audit logging, mapped to cloud IAM | Project 11 (GPU cluster), using access control patterns from the AI Agent Platform course's Project 7 |

### Updated Portfolio Project
**Production-Grade AI Infrastructure Platform (Advanced)** — Extended a scalable, monitored infrastructure platform with code-defined provisioning (Pulumi and OpenTofu), multi-tenant GPU scheduling on Kubernetes (quotas, priority-based preemption, taints, and node affinity), and least-privilege Kubernetes RBAC with short-lived credentials and API server audit logging.
**Skills:** Pulumi, OpenTofu, Kubernetes, kind, GPU Scheduling, RBAC, IAM, Audit Logging, Infrastructure as Code, AI Infrastructure Engineering.
