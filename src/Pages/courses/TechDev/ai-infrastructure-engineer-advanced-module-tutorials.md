<!-- order: 26 -->
# AI Infrastructure Engineer — Advanced Module: Modern IaC, GPU Scheduling & Multi-Tenant IAM

This is a bonus, advanced module extending the **AI Infrastructure Engineer Foundations Course**. It covers four skills that aren't in the original 7-project course: **Pulumi** (infrastructure as code written in general-purpose languages), **OpenTofu** (the open-source fork of Terraform), **GPU scheduling** for AI workloads, and **multi-tenant identity and access management (IAM)**. Complete the original 7 projects first — this module builds directly on your Project 3 cloud instance, Project 4 containers, and Project 6 autoscaling deployment.

Every step follows the same format as the rest of the course: what you're doing, what the term means, how to do it, and why it matters.


## Before you start: your terminal

**Time: about 15 minutes**

Unlike the other AI courses, this one works in a **terminal** on purpose: infrastructure is built, deployed, and monitored from the command line, so practising there is part of the skill. Use Terminal on a Mac, a Linux shell, or WSL on Windows. If you'd rather not set anything up locally, [Google Cloud Shell](https://shell.cloud.google.com) gives you a free Linux terminal in your browser.

**Where each project runs:**
- **Projects 9 and 10** run in your terminal and create real virtual machines on **AWS**. They need an AWS account, and **they can cost money**: each one has a cost warning and ends with a step that destroys everything it created.
- **Projects 11 and 12** are plain Python 3.12+ files you write and run on your own computer (or in Cloud Shell). They don't touch any cloud and are free.

None of these projects run in Google Colab.

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

**Time: about 4 hours**

**Goal:** Manage the most expensive, most contested resource in AI infrastructure — GPUs — when multiple teams or workloads need to share a limited pool of them.

**Where this runs:** a Python 3.12+ file on your own computer or in Cloud Shell. No GPU or cloud account is needed: you model the GPUs in code.

### Why This Project Matters

Your Project 6 autoscaling handled generic compute. GPUs are different: they're expensive, often in short supply, and can't simply be "added" the way CPU instances can. This project builds the scheduling logic that makes shared GPU infrastructure usable by more than one team without chaos.

**Step 1 — Set up a project folder.**
```bash
mkdir gpu_scheduling_project
cd gpu_scheduling_project
```
*Why:* This models the scheduling logic independently before wiring it into a full orchestrator, so you can reason about it clearly.

**Step 2 — Understand why GPU scheduling is different from CPU scheduling.**
Learn: unlike CPU, GPUs are often **not easily subdivided** — a workload frequently needs an entire GPU (or a specific fraction via technologies like MIG — Multi-Instance GPU), and GPUs are far more expensive and scarce than CPU cores.
*Why:* This scarcity is exactly why naive "just autoscale more replicas" thinking from Project 6 doesn't directly transfer to GPU workloads — you can't always just spin up more.

**Step 3 — Model a GPU resource pool.**
```bash
nano gpu_scheduler.py
```
```python
class GPUPool:
    def __init__(self, total_gpus):
        self.total_gpus = total_gpus
        self.allocated = {}  # job_id -> gpu_count

    def available(self):
        return self.total_gpus - sum(self.allocated.values())
```
*Why:* Modeling the pool explicitly, rather than assuming infinite capacity, is the foundation every scheduling decision below builds on.

**Step 4 — Implement a request queue with priority.**
Add this below the `GPUPool` class in `gpu_scheduler.py`:
```python
import heapq

class GPUScheduler:
    def __init__(self, pool):
        self.pool = pool
        self.queue = []  # (priority, job_id, gpu_count)

    def request(self, job_id, gpu_count, priority=5):
        heapq.heappush(self.queue, (priority, job_id, gpu_count))
```
Learn: a **priority queue** (Python's `heapq` module, the same structure pathfinding algorithms like A* use, which you may have met in the Robotics course) lets higher-priority jobs (e.g., production inference) be scheduled ahead of lower-priority ones (e.g., experimental training runs), instead of strict first-come-first-served.
*Why:* Real AI infrastructure teams constantly face this exact tradeoff — a training job and a production inference request competing for the same limited GPUs.

**Step 5 — Implement the scheduling loop.**
Add this method inside the `GPUScheduler` class, below `request`. Keep the 4-space indent: it's what makes the method part of the class.
```python
    def schedule(self):
        while self.queue and self.pool.available() > 0:
            priority, job_id, gpu_count = heapq.heappop(self.queue)
            if gpu_count <= self.pool.available():
                self.pool.allocated[job_id] = gpu_count
                print(f"Scheduled {job_id}: {gpu_count} GPUs")
            else:
                heapq.heappush(self.queue, (priority, job_id, gpu_count))
                break  # not enough capacity right now, wait
```
*Why:* This is the actual allocation decision — granting GPUs to the highest-priority job that currently fits, and leaving others queued rather than failing them outright.

**Step 6 — Implement job completion and release.**
Add this method inside the `GPUScheduler` class too, below `schedule`:
```python
    def release(self, job_id):
        if job_id in self.pool.allocated:
            del self.pool.allocated[job_id]
            self.schedule()  # try to schedule queued jobs with newly freed capacity
```
*Why:* Without releasing and re-triggering scheduling, GPUs would stay "allocated" forever even after a job finishes — starving every job queued behind it.

**Step 7 — Test with contention.**
Add this at the very bottom of the file, with no indent. The `if __name__ == "__main__":` line means the test runs when you run this file directly, but not when another file imports it (Project 12 will).
```python
if __name__ == "__main__":
    pool = GPUPool(total_gpus=4)
    scheduler = GPUScheduler(pool)
    scheduler.request("training_job", gpu_count=3, priority=8)
    scheduler.request("inference_job", gpu_count=2, priority=2)
    scheduler.schedule()
    print("Allocated:", pool.allocated, "| Still queued:", scheduler.queue)

    scheduler.release("inference_job")
    print("After release:", pool.allocated)
```
Run it:
```bash
python3 gpu_scheduler.py
```
*Why:* With only 4 GPUs and 5 requested, this test proves the priority ordering actually works — the higher-priority inference job (lower number = higher priority) should be scheduled, and the lower-priority training job should wait.

**Step 8 — Add starvation prevention.**
Add this method inside the `GPUScheduler` class, below `release` (indented like the other methods, and above the `if __name__ == "__main__":` test block):
```python
    def age_priorities(self):
        self.queue = [(max(0, p - 1), jid, gc) for p, jid, gc in self.queue]
        heapq.heapify(self.queue)
```
Then add these lines to the end of the test block (indented by 4 spaces) and run the file again. The waiting job's priority number drops by one each time aging runs:
```python
    scheduler.request("experiment_job", gpu_count=4, priority=9)
    for _ in range(3):
        scheduler.age_priorities()
    print("Queue after aging:", scheduler.queue)
```
Learn: **starvation** happens when a low-priority job waits indefinitely because higher-priority jobs keep arriving; **priority aging** gradually increases a waiting job's priority the longer it waits.
*Why:* Without this safeguard, a constant stream of high-priority jobs could leave a legitimate but lower-priority job waiting forever — aging guarantees it eventually gets scheduled.

### Final Project Structure
```text
gpu_scheduling_project/
│
├── gpu_scheduler.py
├── contention_test_notes.md
```

### What You Learned
- ✅ Why GPU scheduling differs fundamentally from CPU autoscaling
- ✅ Modeling a finite, shared GPU resource pool
- ✅ Priority-based job queuing
- ✅ Implementing an allocation scheduling loop
- ✅ Releasing resources and re-triggering scheduling
- ✅ Preventing starvation with priority aging

### Portfolio Project
**GPU Scheduling System for Multi-Tenant AI Infrastructure** — Built a priority-based GPU scheduler with resource pooling, allocation, release, and starvation prevention, tested under simulated multi-team contention.
**Skills:** Resource Scheduling, Python, GPU Infrastructure, Multi-Tenant Systems, AI Infrastructure.

**Deliverable:** A working GPU scheduler tested under contention, with priority ordering and starvation prevention verified.

### Quiz

1. Why can't GPU workloads simply be autoscaled the way the Project 6 CPU service was?
2. In this scheduler, does priority 2 or priority 8 run first?
3. Why does `release` call `schedule` again?
4. What is starvation, and how does priority aging prevent it?

*Answers: 1) GPUs are expensive, scarce, and hard to subdivide, so you often can't just add more; the existing pool has to be shared. 2) Priority 2, because the heap pops the lowest number first and lower numbers mean higher priority. 3) Freed GPUs should go straight to queued jobs; otherwise waiting jobs would stay stuck even though capacity is available. 4) Starvation is a low-priority job waiting forever while higher-priority jobs keep arriving; aging lowers its priority number over time until it reaches the front.*

---

## Project 12 (Bonus Module 4): Implement Identity and Access Management (IAM) for AI Infrastructure

**Time: about 4.5 hours**

**Goal:** Control who and what can access your infrastructure — extending beyond the network-level firewall rules from Project 3 into identity-based access control across multiple teams.

**Where this runs:** a Python 3.12+ file on your own computer or in Cloud Shell. It's free and doesn't touch any cloud.

### Why This Project Matters

Project 3's firewall rules controlled network access (which ports, from where). They don't address a different, equally critical question: once someone or something reaches your infrastructure, what are they actually allowed to do? IAM answers that — and becomes essential the moment more than one team shares the same infrastructure.

**Step 1 — Set up a project folder.**
```bash
mkdir iam_project
cd iam_project
```
*Why:* IAM policy definitions deserve their own reviewable, versioned home — they're security-critical documents, not throwaway scripts.

**Step 2 — Understand IAM's core concepts.**
Learn: an **identity** is a user, team, or service that needs access; a **role** groups a set of permissions; a **policy** defines exactly what actions a role is allowed to perform on which resources.
*Why:* This three-part model (identity → role → policy) is how essentially every cloud provider's IAM system works — understanding the pattern transfers directly regardless of which specific cloud you use.

**Step 3 — Define roles for your multi-tenant platform.**
```bash
nano iam_policies.py
```
```python
ROLES = {
    "ml_researcher": {
        "can_launch_instances": True,
        "can_access_gpu_pool": True,
        "can_delete_production_resources": False,
    },
    "platform_admin": {
        "can_launch_instances": True,
        "can_access_gpu_pool": True,
        "can_delete_production_resources": True,
    },
    "read_only_viewer": {
        "can_launch_instances": False,
        "can_access_gpu_pool": False,
        "can_delete_production_resources": False,
    },
}
```
Learn: this reflects **least privilege**, the same principle from the AI Solutions Architect course's data layer design and the AI Agent Platform course's tool permissions — applied here to infrastructure actions.
*Why:* An ML researcher who can accidentally delete production infrastructure is a real, common cause of costly incidents — role separation prevents this by design, not by hoping people are careful.

**Step 4 — Implement a permission check function.**
```python
def check_permission(role, action):
    return ROLES.get(role, {}).get(action, False)

def require_permission(role, action):
    if not check_permission(role, action):
        raise PermissionError(f"Role '{role}' cannot perform '{action}'")
```
*Why:* Centralizing the check in one function means every part of your infrastructure tooling enforces permissions consistently, instead of each script implementing its own (possibly inconsistent) logic.

**Step 5 — Wire IAM checks into your Project 11 GPU scheduler.**
Copy `gpu_scheduler.py` from your Project 11 folder into `iam_project` (`cp ../gpu_scheduling_project/gpu_scheduler.py .`). Add this import as the first line of `iam_policies.py`:
```python
from gpu_scheduler import GPUPool, GPUScheduler
```
Then add this function at the end of the file:
```python
def request_gpu_with_iam(scheduler, role, job_id, gpu_count, priority):
    require_permission(role, "can_access_gpu_pool")
    scheduler.request(job_id, gpu_count, priority)
```
*Why:* This connects your two bonus projects — a `read_only_viewer` role should never be able to request GPU allocation, and now that's enforced, not just assumed.

**Step 6 — Add scoped, temporary credentials.**
```python
import time

def issue_temporary_credential(role, ttl_seconds=3600):
    return {
        "role": role,
        "issued_at": time.time(),
        "expires_at": time.time() + ttl_seconds,
    }

def is_credential_valid(credential):
    return time.time() < credential["expires_at"]
```
Learn: **temporary credentials** expire automatically after a set time, unlike long-lived credentials that remain valid indefinitely until manually revoked.
*Why:* A leaked temporary credential is a much smaller risk than a leaked permanent one — this is standard cloud security practice, especially for service-to-service access.

**Step 7 — Test permission boundaries.**
Add this test block at the end of the file and run `python3 iam_policies.py`:
```python
if __name__ == "__main__":
    try:
        require_permission("read_only_viewer", "can_delete_production_resources")
    except PermissionError as e:
        print(f"Correctly blocked: {e}")

    require_permission("platform_admin", "can_delete_production_resources")
    print("Correctly allowed")

    scheduler = GPUScheduler(GPUPool(total_gpus=4))
    request_gpu_with_iam(scheduler, "ml_researcher", "train_job", gpu_count=2, priority=5)
    try:
        request_gpu_with_iam(scheduler, "read_only_viewer", "sneaky_job", gpu_count=1, priority=1)
    except PermissionError as e:
        print(f"Correctly blocked: {e}")
    print("Queued jobs:", scheduler.queue)

    credential = issue_temporary_credential("ml_researcher", ttl_seconds=60)
    print("Credential valid now:", is_credential_valid(credential))
```
*Why:* Testing both the denial and the allowed case — the same discipline from the AI Agent Platform course's Project 7 access control work — confirms the system discriminates correctly rather than either blocking or allowing everything.

**Step 8 — Add IAM audit logging.**
Add this function above `require_permission`, then make `require_permission` record every decision by replacing it with the version below. Run the file again and open `iam_audit.log`.
```python
def log_iam_decision(role, action, allowed):
    with open("iam_audit.log", "a") as f:
        f.write(f"{time.time()} | role={role} action={action} allowed={allowed}\n")


def require_permission(role, action):
    allowed = check_permission(role, action)
    log_iam_decision(role, action, allowed)
    if not allowed:
        raise PermissionError(f"Role '{role}' cannot perform '{action}'")
```
*Why:* Just like the AI Agent Platform course's Project 7 tool access audit log, every permission decision — especially denials — needs a record for later security review, particularly ahead of the kind of compliance audit covered in the AI Governance course's advanced module.

### Final Project Structure
```text
iam_project/
│
├── iam_policies.py
├── iam_audit.log
```

### What You Learned
- ✅ The identity → role → policy IAM model
- ✅ Defining roles under least privilege
- ✅ Implementing centralized permission checks
- ✅ Wiring IAM into existing infrastructure tooling (GPU scheduler)
- ✅ Issuing scoped, temporary credentials
- ✅ Testing permission boundaries and audit logging IAM decisions

### Portfolio Project
**Multi-Tenant IAM for AI Infrastructure** — Implemented role-based access control with least-privilege policies, temporary scoped credentials, and audit logging, integrated with a GPU scheduling system to enforce access at the resource level.
**Skills:** Identity and Access Management, Security Engineering, Python, Multi-Tenant Systems, AI Infrastructure.

**Deliverable:** A working IAM system with defined roles, permission enforcement wired into infrastructure tooling, and a tested audit log.

### Quiz

1. In the identity → role → policy model, what does each part mean?
2. What does `check_permission` return for a role or action it doesn't know, and why is that safe?
3. Why are temporary credentials safer than long-lived ones?
4. How is IAM different from the firewall rules in Project 3?

*Answers: 1) An identity is the user, team, or service; a role groups permissions; a policy defines exactly which actions a role may perform on which resources. 2) `False`, because unknown requests are denied by default, which follows least privilege. 3) They expire automatically, so a leaked one stops working soon instead of staying valid until someone revokes it. 4) Firewall rules control which network traffic can reach a machine; IAM controls what an identity is allowed to do once it reaches the infrastructure.*

---

## Advanced Module Summary

These four bonus projects extend the model-serving platform you built in the main course with the infrastructure skills that have grown fastest since the original course was built:

| Project | Core Skill | Extends |
|---|---|---|
| 9. Pulumi | General-purpose-language IaC | Project 3 (cloud instance) |
| 10. OpenTofu | Declarative, open-source IaC | Project 3 (cloud instance) |
| 11. GPU Scheduling | Priority-based shared resource allocation | Project 6 (autoscaling) |
| 12. Multi-Tenant IAM | Role-based access control | Project 11 (GPU scheduler), using access control patterns from the AI Agent Platform course's Project 7 |

### Updated Portfolio Project
**Production-Grade AI Infrastructure Platform (Advanced)** — Extended a scalable, monitored infrastructure platform with code-defined provisioning (Pulumi and OpenTofu), priority-based GPU scheduling for multi-team contention, and role-based IAM with audit logging.
**Skills:** Pulumi, OpenTofu, GPU Scheduling, IAM, Infrastructure as Code, Python, AI Infrastructure Engineering.
