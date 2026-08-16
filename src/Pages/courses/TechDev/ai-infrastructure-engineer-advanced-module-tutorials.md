# AI Infrastructure Engineer — Advanced Module: Modern IaC, GPU Scheduling & Multi-Tenant IAM

This is a bonus, advanced module extending the **AI Infrastructure Engineer Foundations Course**. It covers four skills that have grown fastest in 2025–2026 but aren't in the original 8-project course: **Pulumi** (general-purpose-language infrastructure as code), **OpenTofu** (the open-source Terraform fork now holding roughly 40% of the IaC market), **GPU scheduling** for AI workloads, and **multi-tenant identity and access management (IAM)**. Complete the original 8 projects first — this module builds directly on your Project 3 cloud instance, Project 4 containers, and Project 6 autoscaling deployment.

Every step follows the same format as the rest of the course: what you're doing, what the term means, how to do it, and why it matters.

---

## Project 9 (Bonus Module 1): Provision AI Infrastructure as Code with Pulumi

**Goal:** Replace manual console clicking (Project 3) with infrastructure defined in real code — using a general-purpose programming language instead of a domain-specific config format.

### Why This Project Matters

Every prior project in this course provisioned infrastructure by hand, through a cloud console. That doesn't scale, isn't repeatable, and isn't reviewable the way code is. Pulumi lets you define infrastructure in Python — the same language you've used throughout this course — instead of learning an entirely separate templating language.

**Step 1 — Set up a project folder.**
```bash
mkdir pulumi_iac_project
cd pulumi_iac_project
pip install --break-system-packages pulumi pulumi-aws
```
*Why:* Pulumi's Python SDK lets you write infrastructure definitions as regular Python — reusing skills you already have from every prior project in this course.

**Step 2 — Understand infrastructure as code (IaC).**
Learn: **infrastructure as code** means defining servers, networks, and other resources in version-controlled files instead of manually configuring them through a console — so infrastructure can be reviewed, reused, and reproduced exactly.
*Why:* Manual console setup (Project 3) can't be code-reviewed, can't be easily replicated for a second environment, and leaves no record of *why* a setting was chosen.

**Step 3 — Initialize a Pulumi project.**
```bash
pulumi new aws-python
```
Learn: this scaffolds a Pulumi **stack** — an isolated, deployable instance of your infrastructure definition (e.g., "dev" or "prod").
*Why:* Stacks let you maintain separate, independently deployable environments from the same codebase — critical for testing infrastructure changes safely before they hit production.

**Step 4 — Define a compute instance in code.**
```bash
nano __main__.py
```
```python
import pulumi
import pulumi_aws as aws

instance = aws.ec2.Instance("ai-service-instance",
    instance_type="t3.medium",
    ami="ami-0abcdef1234567890",
    tags={"Name": "ai-inference-server"}
)

pulumi.export("public_ip", instance.public_ip)
```
*Why:* This is the exact same instance you manually created in Project 3, Step 2 — but now defined as reviewable, repeatable code instead of a one-time console action.

**Step 5 — Preview before deploying.**
```bash
pulumi preview
```
Learn: `preview` shows exactly what Pulumi would create, change, or destroy, without actually doing it.
*Why:* This is the IaC equivalent of `docker build` before `docker run` — checking your plan before committing to it prevents costly, unintended infrastructure changes.

**Step 6 — Deploy the infrastructure.**
```bash
pulumi up
```
*Why:* This single command replaces every manual console click from Project 3 — and importantly, running it again later will only change what's actually different, not recreate everything from scratch.

**Step 7 — Modify and redeploy.**
Change `instance_type` to `"t3.large"` and run `pulumi up` again.
Learn: Pulumi calculates a **diff** — only the changed resource gets modified, everything else stays untouched.
*Why:* This diff-based approach is what makes IaC safe for ongoing changes — you're not redeploying your entire infrastructure every time one setting changes.

**Step 8 — Destroy and recreate to prove reproducibility.**
```bash
pulumi destroy
pulumi up
```
*Why:* If your infrastructure comes back identical after a full destroy/recreate cycle, you've proven it's genuinely defined in code — not accidentally dependent on manual tweaks you forgot you made in the console.

### Final Project Structure
```text
pulumi_iac_project/
│
├── __main__.py
├── Pulumi.yaml
├── Pulumi.dev.yaml
```

### What You Learned
- ✅ What infrastructure as code solves that manual provisioning doesn't
- ✅ Pulumi stacks as isolated, deployable environments
- ✅ Defining cloud resources in Python
- ✅ Previewing changes before applying them
- ✅ Making incremental changes via diffs
- ✅ Proving reproducibility through destroy/recreate

### Portfolio Project
**Infrastructure as Code with Pulumi** — Defined and deployed cloud compute infrastructure using Pulumi's Python SDK, with previewed changes, incremental diffs, and verified reproducibility via a full destroy/recreate cycle.
**Skills:** Pulumi, Infrastructure as Code, Python, Cloud Provisioning, AI Infrastructure.

**Deliverable:** A Pulumi project provisioning a compute instance, with a documented preview/deploy/modify/destroy cycle.

---

## Project 10 (Bonus Module 2): Compare and Migrate Infrastructure with OpenTofu

**Goal:** Learn the open-source, community-governed alternative to Terraform — now holding roughly 40% of the infrastructure-as-code market after Terraform's licensing change pushed much of the ecosystem toward it.

### Why This Project Matters

Pulumi (Project 9) uses a general-purpose language. Many organizations instead use declarative, domain-specific IaC — and OpenTofu is now the dominant open-source choice in that category. Knowing both approaches, and being able to migrate between them, is a practical, in-demand skill.

**Step 1 — Set up a project folder.**
```bash
mkdir opentofu_project
cd opentofu_project
```
Install OpenTofu following the official installer for your OS.
*Why:* OpenTofu is a drop-in-compatible fork, so most existing Terraform knowledge and configuration transfers directly.

**Step 2 — Understand declarative vs. imperative IaC.**
Learn: Pulumi (Project 9) is **imperative-adjacent** — you write code that constructs resources. OpenTofu is fully **declarative** — you describe the desired end state in a configuration file (HCL), and the tool figures out how to get there.
*Why:* This is a meaningfully different mental model — declarative tools are often preferred for their simplicity and predictability in large, standardized infrastructure, while general-purpose-language tools like Pulumi offer more flexibility for complex logic.

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

resource "aws_instance" "ai_service" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t3.medium"
  tags = { Name = "ai-inference-server" }
}
```
Learn: **HCL (HashiCorp Configuration Language)** is a declarative syntax purpose-built for describing infrastructure.
*Why:* This defines the exact same instance as Project 9, letting you directly compare the two approaches for the identical resource.

**Step 4 — Initialize and plan.**
```bash
tofu init
tofu plan
```
Learn: `tofu plan` is OpenTofu's equivalent of Pulumi's `preview` — showing what would change before applying it.
*Why:* This confirms both tools follow the same safety principle (preview before apply), even though their syntax differs significantly.

**Step 5 — Apply the configuration.**
```bash
tofu apply
```
*Why:* This is the OpenTofu equivalent of `pulumi up` — deploying the described infrastructure.

**Step 6 — Understand state management.**
Learn: OpenTofu keeps a **state file** tracking what infrastructure it created and manages — critical because it's how the tool knows what to change (or leave alone) on the next `apply`.
*Why:* Losing or corrupting the state file is one of the most common real-world OpenTofu/Terraform incidents — understanding it exists, and where it lives, matters from day one.

**Step 7 — Make an incremental change.**
Change `instance_type` to `"t3.large"` and run `tofu plan` again to see the diff before applying.
*Why:* Same discipline as Project 9's incremental change — confirming you understand exactly what will change before committing to it.

**Step 8 — Write a comparison note.**
```bash
nano pulumi_vs_opentofu.md
```
Compare your Project 9 and Project 10 experience: syntax, workflow, and when you'd choose one over the other.
*Why:* Real infrastructure teams have to make this exact choice — having hands-on experience with both, and a documented opinion, is more valuable than knowing only one tool by default.

### Final Project Structure
```text
opentofu_project/
│
├── main.tf
├── pulumi_vs_opentofu.md
```

### What You Learned
- ✅ Declarative vs. imperative infrastructure as code
- ✅ Writing HCL configuration for cloud resources
- ✅ The init/plan/apply OpenTofu workflow
- ✅ State file management and its importance
- ✅ Making and previewing incremental changes
- ✅ Comparing Pulumi and OpenTofu firsthand

### Portfolio Project
**Infrastructure as Code with OpenTofu** — Provisioned cloud compute infrastructure using OpenTofu's declarative HCL configuration, with a documented comparison against an equivalent Pulumi implementation.
**Skills:** OpenTofu, Terraform/HCL, Infrastructure as Code, Cloud Provisioning, AI Infrastructure.

**Deliverable:** An OpenTofu configuration provisioning the same infrastructure as Project 9, with a written tool comparison.

---

## Project 11 (Bonus Module 3): Schedule GPU Workloads for Multi-Tenant AI Infrastructure

**Goal:** Manage the most expensive, most contested resource in AI infrastructure — GPUs — when multiple teams or workloads need to share a limited pool of them.

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
```python
import heapq

class GPUScheduler:
    def __init__(self, pool):
        self.pool = pool
        self.queue = []  # (priority, job_id, gpu_count)

    def request(self, job_id, gpu_count, priority=5):
        heapq.heappush(self.queue, (priority, job_id, gpu_count))
```
Learn: a **priority queue** (reused from Project 5's A* algorithm pattern) lets higher-priority jobs (e.g., production inference) be scheduled ahead of lower-priority ones (e.g., experimental training runs), instead of strict first-come-first-served.
*Why:* Real AI infrastructure teams constantly face this exact tradeoff — a training job and a production inference request competing for the same limited GPUs.

**Step 5 — Implement the scheduling loop.**
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
```python
    def release(self, job_id):
        if job_id in self.pool.allocated:
            del self.pool.allocated[job_id]
            self.schedule()  # try to schedule queued jobs with newly freed capacity
```
*Why:* Without releasing and re-triggering scheduling, GPUs would stay "allocated" forever even after a job finishes — starving every job queued behind it.

**Step 7 — Test with contention.**
```python
pool = GPUPool(total_gpus=4)
scheduler = GPUScheduler(pool)
scheduler.request("training_job", gpu_count=3, priority=8)
scheduler.request("inference_job", gpu_count=2, priority=2)
scheduler.schedule()
```
*Why:* With only 4 GPUs and 5 requested, this test proves the priority ordering actually works — the higher-priority inference job (lower number = higher priority) should be scheduled, and the lower-priority training job should wait.

**Step 8 — Add starvation prevention.**
```python
def age_priorities(self):
    self.queue = [(max(0, p - 1), jid, gc) for p, jid, gc in self.queue]
    heapq.heapify(self.queue)
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

---

## Project 12 (Bonus Module 4): Implement Identity and Access Management (IAM) for AI Infrastructure

**Goal:** Control who and what can access your infrastructure — extending beyond the network-level security groups from Project 3 into identity-based access control across multiple teams.

### Why This Project Matters

Project 3's security groups controlled network access (which ports, from where). They don't address a different, equally critical question: once someone or something reaches your infrastructure, what are they actually allowed to do? IAM answers that — and becomes essential the moment more than one team shares the same infrastructure.

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
```python
try:
    require_permission("read_only_viewer", "can_delete_production_resources")
except PermissionError as e:
    print(f"Correctly blocked: {e}")

require_permission("platform_admin", "can_delete_production_resources")
print("Correctly allowed")
```
*Why:* Testing both the denial and the allowed case — the same discipline from Project 7's access control work — confirms the system discriminates correctly rather than either blocking or allowing everything.

**Step 8 — Add IAM audit logging.**
```python
def log_iam_decision(role, action, allowed):
    with open("iam_audit.log", "a") as f:
        f.write(f"{time.time()} | role={role} action={action} allowed={allowed}\n")
```
*Why:* Just like Project 7's tool access audit log, every permission decision — especially denials — needs a record for later security review, particularly ahead of the kind of compliance audit covered in the AI Governance course's advanced module.

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

---

## Advanced Module Summary

These four bonus projects extend your Final Capstone platform with the infrastructure skills that have grown fastest since the original course was built:

| Project | Core Skill | Extends |
|---|---|---|
| 9. Pulumi | General-purpose-language IaC | Project 3 (cloud instance) |
| 10. OpenTofu | Declarative, open-source IaC | Project 3 (cloud instance) |
| 11. GPU Scheduling | Priority-based shared resource allocation | Project 6 (autoscaling) |
| 12. Multi-Tenant IAM | Role-based access control | Project 7 (access control patterns from Agent Platform course) |

### Updated Portfolio Project
**Production-Grade AI Infrastructure Platform (Advanced)** — Extended a scalable, monitored infrastructure platform with code-defined provisioning (Pulumi and OpenTofu), priority-based GPU scheduling for multi-team contention, and role-based IAM with audit logging.
**Skills:** Pulumi, OpenTofu, GPU Scheduling, IAM, Infrastructure as Code, Python, AI Infrastructure Engineering.
