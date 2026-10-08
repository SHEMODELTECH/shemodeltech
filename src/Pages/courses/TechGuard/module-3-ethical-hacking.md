<!-- order: 3 -->
## Module 3: Ethical Hacking

**Time: about 7 hours** (about 2 hours for Kali setup, 2.5 hours for pen testing, 2.5 hours for reconnaissance).

**By the end of this module, you'll be able to:**
- Set up an isolated, updated Kali Linux VM with a clean snapshot and run a first scan against yourself
- Write a scope (rules of engagement) document before any testing starts
- Run recon and enumeration with `nmap` against your own local, intentionally vulnerable lab target
- Compare passive and active reconnaissance and assemble an attack-surface profile
- Write a short finding with impact and remediation, and explain why authorization is what makes testing legal

**Tools needed for this module:** a **Kali Linux** virtual machine (run in VirtualBox, VMware, or similar so it stays isolated), and a legal practice environment. For active exercises, use only targets you own that are built for learning: a local, intentionally vulnerable app like **OWASP Juice Shop** or **Metasploitable** on your own machine. Put Metasploitable on a **host-only** network adapter (never bridged to your home network or the internet), because it is deliberately insecure; run Juice Shop inside your Kali VM, bound to `127.0.0.1` (Topic 3.2 shows how).

> **Read this before anything else.** Ethical hacking means *authorized* testing. Running these tools against a system you don't own, without explicit written permission, is illegal in most countries and can carry serious criminal penalties. The only thing separating a penetration tester from an attacker is authorization. Every active lab in this module targets only your own Kali VM or your own local, intentionally vulnerable lab app. Never point these tools anywhere else, including public "practice" hosts.

### Topic 3.1: Kali Linux

Time: about 2 hours

#### Concept

**Kali Linux** is a Debian-based operating system built and maintained by OffSec specifically for penetration testing, security auditing, and digital forensics. Rather than installing tools one by one, Kali ships with hundreds of them pre-installed and organised by purpose, giving an authorized tester a ready-made workbench. It's a working environment, not a magic button, the skill is in knowing which tool fits which phase of a test and how to interpret what it tells you.

- Kali is a **distribution**, a full Debian-based OS preloaded with security tooling, usually run as a **virtual machine** or live USB to keep it isolated from your main system
- Its tools are grouped by **category**: information gathering, vulnerability analysis, exploitation, password attacks, wireless attacks, and forensics
- Well-known tools it bundles include **Nmap** (scanning), **Wireshark** (packet analysis), **Burp Suite** (web testing), **Metasploit** (exploitation framework), and **John the Ripper** (password cracking)
- Modern Kali runs as a **non-root default user** (you use `sudo` when needed), a deliberate move away from the old always-root setup, reflecting least-privilege habits
- The tools are **dual-use**, the same scanner an auditor uses is what an attacker uses, so authorization and scope are what make the work legitimate

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#3730a3', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    K["<b>Kali Linux</b><br/><br/>Debian-based tester's<br/>workbench"]
    INFO["<b>Info gathering</b><br/><br/>Nmap, whois,<br/>recon tools"]
    EXP["<b>Exploitation</b><br/><br/>Metasploit, Burp<br/>(authorized only)"]
    PW["<b>Password &<br/>forensics</b><br/><br/>John, hashcat,<br/>forensic tools"]

    K ==> INFO
    K ==> EXP
    K ==> PW

    style K fill:#4f46e5,color:#fff,stroke:#3730a3,stroke-width:4px
    style INFO fill:#e0e7ff,color:#1a202c,stroke:#4f46e5,stroke-width:4px
    style EXP fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    style PW fill:#e0e7ff,color:#1a202c,stroke:#4f46e5,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Running Kali in a VM (rather than as your main OS) keeps testing activity contained, lets you snapshot a clean state, and reduces the chance of a tool affecting systems you didn't intend
- Kali is a means, not an end, the same results are achievable on any Linux with the tools installed, what Kali provides is convenience and a curated, maintained toolset

#### Where you'd actually use this

Any authorized security assessment: a scheduled penetration test, a vulnerability assessment of infrastructure you're responsible for, a capture-the-flag learning exercise, or forensic analysis of a machine you're permitted to examine. Kali is the everyday environment a working tester operates from.

#### Lab

1. **Install Kali as a virtual machine** using the official image, and take a clean snapshot before you start.
2. **Update the system** so the toolset is current:
```bash
sudo apt update && sudo apt full-upgrade -y
```
3. **Explore the tool categories** from the applications menu, and note which tools map to information gathering versus exploitation.
4. **Run one information-gathering command against your own Kali VM** (`127.0.0.1` means "this machine", so you are scanning nothing but yourself):
```bash
sudo nmap 127.0.0.1
```
5. **Read the output**, identify which ports are reported open (a fresh Kali often has none, which is itself a result), and write one sentence explaining what that tells you about the host.

#### Checkpoint
You have an isolated, updated Kali VM with a clean snapshot, you can navigate its tool categories, and you've run a single information-gathering scan against your own VM, and you can explain why authorization and isolation matter.

#### Quiz
1. What is Kali Linux, and who maintains it?
2. Name three categories the tools in Kali are grouped into.
3. Why does modern Kali default to a non-root user instead of running as root?
4. Why is it recommended to run Kali as a virtual machine?
5. What single factor separates an ethical tester's use of these tools from an attacker's?

*Answers: 1) A Debian-based operating system preloaded with security and penetration-testing tools, maintained by OffSec. 2) For example: information gathering, vulnerability analysis, exploitation, password attacks, wireless attacks, and forensics (any three). 3) To follow least privilege, you operate as a limited user and elevate with sudo only when needed, which reduces the risk of accidental damage. 4) A VM keeps testing activity isolated from your main system, lets you snapshot and restore a clean state, and limits the chance of affecting unintended systems. 5) Authorization, explicit permission to test the target; without it, the same actions are illegal.*

---

### Topic 3.2: Pen Testing

Time: about 2.5 hours

#### Concept

**Penetration testing** is an authorized, simulated attack on a system carried out to find and safely demonstrate exploitable weaknesses before a real attacker does. What makes it a discipline rather than random poking is that it follows a defined **methodology** with agreed **scope**, and its true deliverable is not the break-in but the **report** that tells the organisation what's wrong and how to fix it. A pentest proves risk is real, a **vulnerability** is a weakness, an **exploit** is the demonstration that the weakness can actually be used.

- **Rules of engagement** and **scope** are the written authorization that defines exactly which systems may be tested, when, and how, agreed before any testing begins
- The work moves through **phases**: reconnaissance, scanning and enumeration, exploitation, post-exploitation, and reporting
- Tests are described as **black box** (tester knows nothing up front), **grey box** (partial knowledge, like a normal user's access), or **white box** (full knowledge and source access)
- A **vulnerability** is a flaw, an **exploit** is the act of using it, ethical testers demonstrate impact carefully and stop short of causing damage
- The **report** is the point of the whole exercise, findings, risk ratings, evidence, and clear remediation steps

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'20px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#7f1d1d', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 55, 'rankSpacing': 70, 'padding': 18}}}%%
flowchart LR
    S["<b>Scope</b><br/><br/>Rules of<br/>engagement"]
    R["<b>Recon</b><br/><br/>Gather<br/>information"]
    E["<b>Enumerate</b><br/><br/>Scan, map<br/>the surface"]
    X["<b>Exploit</b><br/><br/>Demonstrate<br/>impact"]
    REP["<b>Report</b><br/><br/>Findings +<br/>remediation"]

    S ==> R ==> E ==> X ==> REP

    style S fill:#c1121f,color:#fff,stroke:#7f1d1d,stroke-width:4px
    style R fill:#fde2e2,color:#1a202c,stroke:#c1121f,stroke-width:4px
    style E fill:#fde2e2,color:#1a202c,stroke:#c1121f,stroke-width:4px
    style X fill:#fde2e2,color:#1a202c,stroke:#c1121f,stroke-width:4px
    style REP fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- The scope document is not paperwork to rush past, it is your legal authorization and your protection, anything outside it is off-limits no matter how tempting the target
- A finding is only useful if it's reproducible and actionable, "I got in" is worth little, "this specific misconfiguration allowed this specific access, here's how to close it" is the real value

#### Where you'd actually use this

Assessing a company's web application or network before launch, meeting a compliance requirement that mandates regular testing, validating that a previous fix actually worked, or red-team exercises that test detection and response. Pentesting is how organisations find their weaknesses on their own terms.

#### Lab

> Do this only against a target you own, such as a local OWASP Juice Shop or Metasploitable VM on your own machine.

**First, set up your lab target** (pick one):

- **Juice Shop (simplest):** inside your Kali VM, install Docker and start Juice Shop so it listens only on that VM:
  ```bash
  sudo apt install -y docker.io
  sudo docker run --rm -p 127.0.0.1:3000:3000 bkimminich/juice-shop
  ```
  Leave it running and open a second terminal. Your target address is `127.0.0.1` (the app is on port 3000).
- **Metasploitable 2:** download it from its official source, import it into the same hypervisor as Kali, and attach **both** VMs to the same **host-only** network. Log in to Metasploitable (the login is shown on its console) and run `ifconfig` to get its address (Metasploitable 2 is an old Linux release, so `ifconfig` is the reliable command there).

Wherever the steps below say `<your-lab-VM-ip>`, use that address and nothing else.

1. **Write a one-page scope document** for your lab target: which host, which IP, what's in scope, what's explicitly out of scope, and the time window. This is your practice rules of engagement.
2. **Run the recon and enumeration phases** against your own lab target, mapping open ports and running services:
```bash
nmap -sV <your-lab-VM-ip>
```
(For Juice Shop, `nmap -sV -p 3000 127.0.0.1` is enough, since it serves one port.)
3. **Enumerate one service** further to identify its version and any obvious misconfiguration, staying within your scope document.
4. **Identify one documented vulnerability** in the target (intentionally-vulnerable apps ship with known issues) and note how it maps to a real risk, without weaponising anything beyond confirming it exists.
5. **Write a mini-report** with three sections for that one finding: what it is, why it matters (impact), and how to fix it (remediation).

#### Checkpoint
You have written a scope document, run recon and enumeration against a target you own, identified a single vulnerability, and produced a short finding with impact and remediation, and you can explain the difference between a vulnerability and an exploit.

#### Quiz
1. What is the true deliverable of a penetration test, and why?
2. Name the phases of a penetration test in order.
3. What is the difference between black-box, grey-box, and white-box testing?
4. What is the difference between a vulnerability and an exploit?
5. Why is the scope / rules-of-engagement document so important?

*Answers: 1) The report, because the point is to tell the organisation what's wrong and how to fix it; the break-in only matters as evidence of real risk. 2) Reconnaissance, scanning and enumeration, exploitation, post-exploitation, and reporting. 3) Black-box means the tester starts with no knowledge of the target, grey-box with partial knowledge (like a normal user), and white-box with full knowledge including source and architecture. 4) A vulnerability is a weakness or flaw in a system; an exploit is the act of actually using that weakness to achieve an effect. 5) It is the written authorization defining exactly what may be tested and how; it makes the work legal, protects the tester, and keeps testing away from systems that are off-limits.*

---

### Topic 3.3: Reconnaissance

Time: about 2.5 hours

#### Concept

**Reconnaissance** is the information-gathering first phase of any assessment, where you build a picture of the target's **attack surface** before touching anything sensitive. It splits into **passive** recon, learning about a target without directly interacting with it, and **active** recon, directly probing it. The better your recon, the more focused and less noisy every later step becomes. Recon is also a defensive skill: seeing what an attacker can easily learn about your organisation tells you what to lock down or hide.

- **Passive reconnaissance** gathers information without touching the target directly, using public sources like WHOIS records, DNS data, search engines, and other **OSINT** (open-source intelligence)
- **Active reconnaissance** interacts with the target directly, for example port scanning or grabbing service banners, which is more informative but also more detectable
- The **attack surface** is the total set of exposed points, hosts, open ports, services, subdomains, that an attacker could attempt to use
- **OSINT** draws on freely available public information: registration records, certificate transparency logs, code repositories, employee posts, and more
- **Footprinting** is the overall act of assembling this information into a profile of the target

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#155e75', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    T["<b>Target</b><br/><br/>Domain or host<br/>in scope"]
    PAS["<b>Passive recon</b><br/><br/>WHOIS, DNS,<br/>OSINT"]
    ACT["<b>Active recon</b><br/><br/>Port scan,<br/>banner grab"]
    SURF["<b>Attack surface</b><br/><br/>Profile of exposed<br/>points"]

    T ==> PAS ==> SURF
    T ==> ACT ==> SURF

    style T fill:#0891b2,color:#fff,stroke:#155e75,stroke-width:4px
    style PAS fill:#cffafe,color:#1a202c,stroke:#0891b2,stroke-width:4px
    style ACT fill:#cffafe,color:#1a202c,stroke:#0891b2,stroke-width:4px
    style SURF fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Passive recon leaves little or no trace on the target, while active recon (like scanning) can be logged and detected, so testers weigh how much noise they're willing to make
- Everything you gather in recon feeds directly into how the assessment builds its picture of what's exposed, weak recon leads to blind, noisy testing later

#### Where you'd actually use this

The opening phase of every penetration test, mapping an organisation's internet-facing footprint, an attack-surface review to find forgotten or exposed assets, or a defensive OSINT audit to see what your own organisation is leaking publicly. Recon is where every assessment starts.

#### Lab

> **Stay legal.** Pick your passive-recon domain from one of these: a domain you own, or a domain you have explicit written permission to test. If you have neither, you may still look up the *public* WHOIS and DNS records of a well-known domain such as `example.com`, because reading public records is normal and legal. What you must **not** do is scan or probe any domain or host you don't own or aren't authorized to test. Active scanning in this lab goes only to your own lab VM (Metasploitable or OWASP Juice Shop from Topic 3.2).

1. **Do passive recon** on your chosen domain, gathering registration data (replace `yourdomain.com` with your domain). This reuses the DNS skills from Module 1:
```bash
whois yourdomain.com
dig yourdomain.com NS
dig yourdomain.com TXT
```
You may see guides that use `dig yourdomain.com ANY` to get "everything at once". Don't rely on it: many DNS servers now return a minimal answer to ANY queries (this is allowed by RFC 8482), so you can miss records. Query each record type you care about instead. (On Windows without `dig`, use `Resolve-DnsName yourdomain.com -Type NS`, and so on.)

2. **Enumerate DNS records** to find hosts and mail servers tied to the domain:
```bash
dig yourdomain.com A
dig yourdomain.com AAAA
dig yourdomain.com MX
```
3. **Do active recon** by scanning every TCP port (not just the 1,000 most common) on your own lab VM:
```bash
nmap -p- <your-lab-VM-ip>
```
4. **Grab service banners** from your own lab VM (Metasploitable or Juice Shop running on your machine, replace the IP with your VM's address). The `-sV` flag asks each open port what software and version it is running, and the `banner` script prints the raw greeting text each service sends:
```bash
nmap -sV --script=banner <your-lab-VM-ip>
```
Note the software names and version numbers you see. Old versions are often the first clue to a known vulnerability.
5. **Assemble a short attack-surface profile**: list the hosts, open ports, and services you found, and mark which came from passive versus active recon.

#### Checkpoint
You have gathered passive information on a domain you own or are authorized to research (or on public records only), performed an active scan against your own lab VM, and assembled a short attack-surface profile, and you can explain the difference between passive and active recon and why the distinction matters.

#### Quiz
1. What is the goal of the reconnaissance phase?
2. What is the difference between passive and active reconnaissance?
3. What is an "attack surface"?
4. What does OSINT stand for, and give two examples of OSINT sources.
5. Why might a tester prefer passive recon over active recon in some situations?

*Answers: 1) To gather information and build a picture of the target's attack surface before any deeper testing, so later phases are focused and efficient. 2) Passive recon gathers information without directly interacting with the target (public records, DNS, OSINT), while active recon directly probes the target (port scanning, banner grabbing). 3) The total set of exposed points, hosts, open ports, services, subdomains, that an attacker could attempt to use. 4) Open-source intelligence; examples include WHOIS registration records, DNS data, certificate transparency logs, public code repositories, and social media (any two). 5) Passive recon leaves little or no trace on the target, so it avoids tipping off defenders or generating logs, whereas active scanning can be detected.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "bug",
   "kicker": "Module 3 · Ethical hacking",
   "title": "Authorized testing only",
   "beats": [
    {
     "say": "Welcome to Ethical Hacking."
    },
    {
     "say": "Ethical hacking means authorized testing: finding weaknesses on purpose, with permission, so they can be fixed."
    }
   ]
  },
  {
   "kind": "quote",
   "art": "scales",
   "kicker": "Read this first",
   "title": "Authorization is the line",
   "quote": "The only thing separating a penetration tester from an attacker is authorization.",
   "beats": [
    {
     "say": "Before anything else.",
     "show": 0
    },
    {
     "say": "Running these tools against a system you don't own, without explicit written permission, is illegal in most countries.",
     "show": 1
    },
    {
     "say": "Every active lab here targets only your own Kali virtual machine, or your own local, intentionally vulnerable lab app. Never point these tools anywhere else, including public practice hosts.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "laptop",
   "kicker": "Topic 3.1 · Kali Linux",
   "title": "A tester's workbench",
   "items": [
    [
     "Virtual machine",
     "Isolated, with a clean snapshot"
    ],
    [
     "Tool categories",
     "Info gathering, exploitation, forensics…"
    ],
    [
     "Non-root user",
     "sudo when needed"
    ],
    [
     "Dual-use",
     "Authorization makes it legitimate"
    ]
   ],
   "beats": [
    {
     "say": "Kali Linux is a Debian-based operating system from OffSec, built for penetration testing, auditing and forensics.",
     "show": 0
    },
    {
     "say": "Run it as a virtual machine. That keeps testing contained, and lets you snapshot a clean state.",
     "show": 1
    },
    {
     "say": "Its tools are grouped by category, like information gathering, vulnerability analysis, exploitation, password attacks and forensics.",
     "show": 2
    },
    {
     "say": "Modern Kali uses a non-root default user, and sudo when needed. Least privilege again.",
     "show": 3
    },
    {
     "say": "And the tools are dual use. The same scanner serves an auditor or an attacker, so authorization and scope make the work legitimate.",
     "show": 4
    }
   ]
  },
  {
   "kind": "code",
   "art": "terminal",
   "kicker": "Topic 3.1 · Lab",
   "title": "Update, then scan yourself",
   "file": "terminal",
   "code": "sudo apt update && sudo apt full-upgrade -y\nsudo nmap 127.0.0.1",
   "beats": [
    {
     "say": "Install Kali from the official image, take a clean snapshot, and update the toolset.",
     "show": 0
    },
    {
     "say": "Then run one information gathering scan against your own virtual machine. One two seven dot zero dot zero dot one means this machine, so you're scanning nothing but yourself.",
     "show": 1
    },
    {
     "say": "A fresh Kali often shows no open ports. That's a result too. Write one sentence on what it tells you.",
     "show": 1
    }
   ]
  },
  {
   "kind": "flow",
   "art": "path",
   "kicker": "Topic 3.2 · Pen testing",
   "title": "A defined methodology",
   "steps": [
    "Scope",
    "Recon",
    "Enumerate",
    "Exploit (carefully)",
    "Report"
   ],
   "beats": [
    {
     "say": "A penetration test is an authorized, simulated attack, to find and safely demonstrate weaknesses before a real attacker does.",
     "show": 0
    },
    {
     "say": "It starts with scope: the rules of engagement, agreed in writing before any testing.",
     "show": 1
    },
    {
     "say": "Then recon, to gather information.",
     "show": 2
    },
    {
     "say": "Enumeration, to scan and map the surface.",
     "show": 3
    },
    {
     "say": "Exploitation, to carefully demonstrate impact, stopping short of damage.",
     "show": 4
    },
    {
     "say": "And the report, with findings and remediation. That's the true deliverable.",
     "show": 5
    }
   ]
  },
  {
   "kind": "list",
   "art": "doc",
   "kicker": "Topic 3.2 · Key ideas",
   "title": "Vulnerability, exploit, report",
   "items": [
    [
     "Vulnerability vs exploit",
     "The flaw vs using it"
    ],
    [
     "Black · grey · white box",
     "None · partial · full knowledge"
    ],
    [
     "A good finding",
     "Reproducible + actionable"
    ]
   ],
   "beats": [
    {
     "say": "A few distinctions.",
     "show": 0
    },
    {
     "say": "A vulnerability is a weakness. An exploit is the act of actually using it.",
     "show": 1
    },
    {
     "say": "Black box testers start with no knowledge, grey box with partial knowledge like a normal user, white box with full knowledge and source.",
     "show": 2
    },
    {
     "say": "And a finding only has value if it's reproducible and actionable. Not I got in, but this misconfiguration allowed this access, and here's how to close it.",
     "show": 3
    }
   ]
  },
  {
   "kind": "flow",
   "art": "target",
   "kicker": "Topic 3.2 · Lab",
   "title": "Your own lab target",
   "steps": [
    "Write the scope",
    "nmap -sV your lab VM",
    "Confirm one known issue",
    "What · impact · fix"
   ],
   "beats": [
    {
     "say": "Set up a target you own: Juice Shop inside Kali, bound to one two seven dot zero dot zero dot one, or Metasploitable on a host-only network, never bridged to your home network.",
     "show": 0
    },
    {
     "say": "First, write a one-page scope document: which host, what's in and out of scope, and the time window.",
     "show": 1
    },
    {
     "say": "Map open ports and services on your own lab target with nmap dash s capital V.",
     "show": 2
    },
    {
     "say": "Identify one documented vulnerability, confirming it exists without weaponising anything.",
     "show": 3
    },
    {
     "say": "Then write a mini report: what it is, why it matters, and how to fix it.",
     "show": 4
    }
   ]
  },
  {
   "kind": "list",
   "art": "radar",
   "kicker": "Topic 3.3 · Reconnaissance",
   "title": "Passive versus active",
   "items": [
    [
     "Passive",
     "WHOIS, DNS, OSINT · little trace"
    ],
    [
     "Active",
     "Scans, banners · detectable"
    ],
    [
     "Defensive use",
     "See what you're leaking"
    ]
   ],
   "beats": [
    {
     "say": "Reconnaissance builds a picture of the target's attack surface: the hosts, open ports, services and subdomains an attacker could try to use.",
     "show": 0
    },
    {
     "say": "Passive recon uses public sources, like WHOIS, D N S data and other open source intelligence, or OSINT. It leaves little or no trace.",
     "show": 1
    },
    {
     "say": "Active recon probes the target directly, like port scanning or banner grabbing. More informative, but it can be logged and detected.",
     "show": 2
    },
    {
     "say": "It's a defensive skill too. Seeing what's easy to learn about your organisation tells you what to lock down.",
     "show": 3
    }
   ]
  },
  {
   "kind": "code",
   "art": "globe",
   "kicker": "Topic 3.3 · Lab",
   "title": "Public records, then your own VM",
   "file": "terminal",
   "code": "whois yourdomain.com\ndig yourdomain.com NS\ndig yourdomain.com MX\n\n# your own lab VM only\nnmap -p- <your-lab-VM-ip>\nnmap -sV --script=banner <your-lab-VM-ip>",
   "beats": [
    {
     "say": "For passive recon, use a domain you own or are authorized to research, or only the public records of a domain like example dot com.",
     "show": 0
    },
    {
     "say": "Query each record type you need, rather than relying on dig any.",
     "show": 1
    },
    {
     "say": "Active scans go only to your own lab virtual machine. Then assemble a short attack surface profile, marking what came from passive versus active recon.",
     "show": 1
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "What is the true deliverable of a penetration test?",
   "options": [
    "Getting into the system",
    "The report, with findings and how to fix them",
    "A list of every tool used"
   ],
   "answer": 1,
   "good": "That's right. The report. The point is to tell the organisation what's wrong and how to fix it. The break-in only matters as evidence of real risk.",
   "bad": "Not quite. The report. The point is to tell the organisation what's wrong and how to fix it. The break-in only matters as evidence of real risk.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "What is the true deliverable of a penetration test?",
     "show": 0
    },
    {
     "say": "Tap your answer.",
     "show": 1
    }
   ]
  },
  {
   "kind": "list",
   "art": "proof",
   "kicker": "Checkpoint",
   "title": "You're done when",
   "items": [
    [
     "Isolated Kali VM, scanned yourself",
     ""
    ],
    [
     "Scope document written",
     ""
    ],
    [
     "One finding with impact and fix",
     ""
    ],
    [
     "Attack-surface profile built",
     ""
    ],
    [
     "Authorization is the line",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 3.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you have an isolated, updated Kali virtual machine with a clean snapshot, and you've scanned only yourself,",
     "show": 1
    },
    {
     "say": "you've written a scope document for a target you own,",
     "show": 2
    },
    {
     "say": "you've enumerated your own vulnerable lab and written a finding with impact and remediation,",
     "show": 3
    },
    {
     "say": "you've done passive and active recon and built an attack surface profile,",
     "show": 4
    },
    {
     "say": "and you can explain why authorization is the line between ethical testing and crime.",
     "show": 5
    },
    {
     "say": "Next, in Module 4, cryptography.",
     "show": 5
    }
   ]
  }
 ]
}
```

---

## Module 3 Completion Checklist
- [ ] Set up an isolated, updated Kali VM with a clean snapshot and explored its tool categories
- [ ] Ran an information-gathering scan against your own Kali VM and interpreted the result
- [ ] Wrote a scope / rules-of-engagement document for a target you own
- [ ] Ran recon and enumeration against your own vulnerable VM and produced a short finding with impact and remediation
- [ ] Performed both passive and active reconnaissance and assembled an attack-surface profile
- [ ] Can explain why authorization is the line between ethical testing and crime, and can describe the phases of a penetration test
