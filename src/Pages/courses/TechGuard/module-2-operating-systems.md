<!-- order: 2 -->
## Module 2: Operating Systems

**Time: about 4 hours** (roughly 2 hours per topic).

**By the end of this module, you'll be able to:**
- Read and change Linux file permissions with `ls -l` and `chmod`, and explain owner, group, and other
- Search a Linux system for SUID and world-writable files, and explain why they enable privilege escalation
- Inspect a Windows access token, administrator group members, and a file's ACL with `whoami /all` and `icacls`
- Check Microsoft Defender status, read logon events 4624 and 4625, and find a registry Run-key persistence entry
- Explain least privilege on both systems and why services shouldn't run as root or administrator

**Tools needed for this module:** for the Linux topic, access to a Linux command line, this can be a real Linux machine, a virtual machine, WSL (Windows Subsystem for Linux), or a free cloud shell. For the Windows topic, a Windows machine with **PowerShell** and the built-in Command Prompt, plus the Event Viewer app that ships with Windows. Everything here uses tools already present on each system, nothing needs to be installed. Run these labs only on your own computer or a virtual machine you control, never on a shared, school, or work machine without permission.

### Topic 2.1: Linux

Time: about 2 hours

#### Concept

**Linux** runs the majority of the world's servers and nearly all security tooling, so for a security role it is the environment you'll spend the most time defending and investigating. Its security model rests on a simple, strict idea: every process runs as a **user**, and what that user can touch is decided by **file permissions**. Learn how users, permissions, and privilege work, and you can both harden a system and read the traces an attacker leaves behind. The guiding principle throughout is **least privilege**, give any user or process only the access it genuinely needs, and nothing more.

- **Users and groups** define identity, every file and process has an owning user and group, and **root** is the all-powerful superuser
- **File permissions** are the core control, each file has read (`r`), write (`w`), and execute (`x`) permissions set separately for its owner, its group, and everyone else, managed with `chmod` and `chown`
- **sudo** grants controlled, temporary privilege escalation, so a normal user can run one command as root without logging in as root, which is safer than being root all the time
- **Processes** are running programs, each owned by a user, inspected with `ps` and `top` and stopped with `kill`
- **Logs** in `/var/log` (especially `auth.log` or the `journal`) record logins, `sudo` use, and system events, making them a primary source of evidence during an investigation

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#134e4a', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    P["<b>Process</b><br/><br/>Runs as a specific<br/>user and group"]
    CHK["<b>Permission check</b><br/><br/>Owner? Group?<br/>Others?"]
    PERM["<b>File permissions</b><br/><br/>rwx for each of the<br/>three categories"]
    R["<b>Access result</b><br/><br/>Granted or denied<br/>accordingly"]

    P ==> CHK ==> PERM
    PERM ==> R

    style P fill:#0f766e,color:#fff,stroke:#134e4a,stroke-width:4px
    style CHK fill:#F5F5F5,color:#1a202c,stroke:#0f766e,stroke-width:4px
    style PERM fill:#F5F5F5,color:#1a202c,stroke:#0f766e,stroke-width:4px
    style R fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Permission misconfigurations are one of the largest attack surfaces on Linux, world-writable files, over-permissive directories, and stray **SUID** binaries (files that run with their owner's privileges, often root) are classic ways an attacker escalates from a normal user to root
- Running services as root by default is a common mistake, if a service running as root is compromised, the attacker inherits root, so least privilege means running each service as its own limited user

#### Where you'd actually use this

Hardening a server by tightening permissions and removing unneeded SUID binaries, investigating a break-in by reading `/var/log/auth.log`, spotting a process running as the wrong user, or confirming that a service isn't running as root when it doesn't need to be. Almost every server-side security task happens on the Linux command line.

#### Lab

1. **Find out who you are** and which groups you belong to:
```bash
whoami
id
```
2. **Read the permissions** on files in a directory, and learn to interpret the `rwx` triads:
```bash
ls -l
```
3. **Create a file, then change its permissions** and watch the change:
```bash
touch testfile
chmod 600 testfile
ls -l testfile
```
(`600` means owner can read and write, group and others get nothing.)

4. **Hunt for risky files**, SUID binaries and world-writable files, the way an attacker or auditor would:
```bash
find / -perm -4000 -type f 2>/dev/null
find / -perm -0002 -type f 2>/dev/null
```
5. **Run one command with elevated privilege** and then review the log entry it creates:
```bash
sudo id
sudo tail /var/log/auth.log
```
(On systems without `auth.log`, use `sudo journalctl -e` instead.)

#### Checkpoint
You can identify your user and groups, read and change file permissions, search a system for SUID and world-writable files, and use `sudo` to run a single command with elevated privilege, and you can explain why least privilege and not running services as root matter.

#### Quiz
1. In `ls -l` output, the permission string is split into three groups of `rwx`. Which three categories do they apply to?
2. What is the difference between logging in as root and using `sudo`, and why is `sudo` safer?
3. What does a SUID binary do, and why is it a security concern?
4. What does the principle of least privilege mean in the context of running a service?
5. Which log file (or facility) would you check to see recent logins and `sudo` use, and why does it matter?

*Answers: 1) The file's owner, the file's group, and all other users (owner, group, others). 2) Logging in as root means every action runs with full privilege the whole time; sudo grants elevated privilege for a single command by a normal user, so most of the time you operate with limited rights, reducing the damage from a mistake or a compromise. 3) A SUID binary runs with the privileges of its owner (often root) rather than the user who launched it; if such a binary is misconfigured or exploitable, an ordinary user can use it to escalate to root. 4) Giving a service only the permissions and account access it actually needs, for example running it as a dedicated limited user rather than root, so a compromise of that service doesn't hand the attacker full control. 5) /var/log/auth.log (or the journal via journalctl); it records logins and sudo activity, which is key evidence when investigating unauthorised access.*

---

### Topic 2.2: Windows Security

Time: about 2 hours

#### Concept

**Windows** is the dominant operating system on enterprise desktops and laptops, which makes it the single biggest endpoint attack target, so knowing how its security model works is essential for defending real organisations. Windows controls access through **security identifiers** and **access control lists** rather than the simpler owner/group/other model of Linux, and it layers on **User Account Control** to gate privilege, **Microsoft Defender Antivirus** for built-in protection, and a rich **event log** for investigation. As on Linux, the safest posture is least privilege: standard users for everyday work, administrator rights only when a task truly needs them.

- Every account and group has a **SID** (security identifier), a unique value Windows uses internally instead of the name, and a user's **access token** carries their SIDs and privileges
- **Access Control Lists (ACLs)** are attached to objects like files and registry keys, listing exactly which accounts get which rights, inspected and edited with `icacls`
- **User Account Control (UAC)** prompts for confirmation before an action uses administrator privileges, keeping users in a standard context until elevation is genuinely needed
- The **Registry** is Windows' hierarchical configuration database, and its "Run" keys are a favourite place for malware to install **persistence** so it relaunches at every login
- **Microsoft Defender Antivirus** (older guides call it Windows Defender) is the built-in antivirus and endpoint protection, and the **Security event log** (viewed in Event Viewer) records logons and other security events, for example event ID `4624` for a successful logon and `4625` for a failed one

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#004578', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    U["<b>User</b><br/><br/>Access token with<br/>SIDs + privileges"]
    OBJ["<b>Object</b><br/><br/>File or registry key<br/>with an ACL"]
    CHK["<b>ACL check</b><br/><br/>Do the token's SIDs<br/>match a permit entry?"]
    R["<b>Access result</b><br/><br/>Granted or denied<br/>accordingly"]

    U ==> CHK
    OBJ ==> CHK
    CHK ==> R

    style U fill:#0078d4,color:#fff,stroke:#004578,stroke-width:4px
    style OBJ fill:#cce4f6,color:#1a202c,stroke:#0078d4,stroke-width:4px
    style CHK fill:#cce4f6,color:#1a202c,stroke:#0078d4,stroke-width:4px
    style R fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Because so many users historically run as local administrator, a single click on malicious software can compromise the whole machine, this is exactly why UAC and standard-user accounts exist, and why reducing admin rights is one of the highest-impact defensive changes
- The Registry's autostart locations (the Run keys) are a standard persistence mechanism, so knowing where they are lets you both spot malware clinging on and clean it out

#### Where you'd actually use this

Investigating a possibly compromised laptop by reading its Security event log, checking file or registry permissions with `icacls`, confirming Defender is active and up to date, hunting for malware persistence in the registry Run keys, and reducing users from administrator to standard accounts to shrink the attack surface. This is the core of endpoint security work in most organisations.

#### Lab

> Run these in PowerShell or Command Prompt on a Windows machine. Some commands (like reading the Security log) may need an administrator PowerShell window.

1. **Inspect your own account**, its SID, groups, and privileges:
```powershell
whoami /all
```
2. **List local users and the administrators group** to see who has elevated rights:
```powershell
Get-LocalUser
Get-LocalGroup Administrators | Get-LocalGroupMember
```
3. **Read the permissions (ACL) on a file** to see which accounts have which rights:
```powershell
icacls C:\Windows\System32\drivers\etc\hosts
```
4. **Check Microsoft Defender Antivirus status** to confirm real-time protection is on and definitions are current:
```powershell
Get-MpComputerStatus
```
5. **Look at recent logon events and a common persistence location:**
```powershell
Get-WinEvent -LogName Security -MaxEvents 20
reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Run"
```
(You can also open **Event Viewer**, go to Windows Logs then Security, and filter for event IDs `4624` and `4625`.)

#### Checkpoint
You can read your own token and privileges, list which accounts have administrator rights, inspect a file's ACL, confirm Defender is running, and view logon events and a registry autostart key, and you can explain why least privilege, UAC, and monitoring the Security log matter on Windows.

#### Quiz
1. What is a SID, and what does an access token carry?
2. How does Windows decide whether a user can access a file or registry key?
3. What is UAC, and what problem does it help with?
4. Why are the registry "Run" keys relevant to a security investigation?
5. Which event IDs indicate a successful and a failed logon in the Security log, and why would you look at them?

*Answers: 1) A SID (security identifier) is a unique value Windows uses to represent an account or group internally instead of its name; an access token carries the user's SIDs and their privileges. 2) It checks the object's ACL (access control list) to see whether any SID in the user's access token matches an entry that permits the requested access. 3) User Account Control prompts for confirmation before an action uses administrator privileges, keeping users in a standard, limited context until elevation is genuinely needed, which limits the damage a careless click or malware can do. 4) The Run keys are autostart locations that make a program launch at login, so malware commonly writes there for persistence; checking them helps you spot and remove that persistence. 5) Event ID 4624 is a successful logon and 4625 is a failed one; reviewing them helps detect unauthorised access attempts, such as a burst of 4625 failures indicating a brute-force attempt.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "laptop",
   "kicker": "Module 2 · Operating systems",
   "title": "Who can touch what",
   "beats": [
    {
     "say": "Welcome to Operating Systems."
    },
    {
     "say": "You'll look at how Linux and Windows decide who can touch what, and where to find the evidence when something goes wrong."
    },
    {
     "say": "Run these labs only on your own computer or a virtual machine you control."
    }
   ]
  },
  {
   "kind": "array",
   "kicker": "Topic 2.1 · Linux",
   "title": "Read a permission string, then change it",
   "values": [
    "-",
    "r",
    "w",
    "-",
    "r",
    "-",
    "-",
    "r",
    "-",
    "-"
   ],
   "beats": [
    {
     "say": "On Linux, every process runs as a user, and file permissions decide what that user can touch.",
     "note": "touch testfile · ls -l testfile"
    },
    {
     "say": "Ls dash l shows ten characters. The first is the type: a dash means a regular file.",
     "hl": 0,
     "note": "- file · d directory"
    },
    {
     "say": "The next three are for the owner: read, write, but no execute.",
     "hl": [
      1,
      2,
      3
     ],
     "ptr": {
      "owner": 1
     },
     "note": "owner: rw-"
    },
    {
     "say": "Then three for the file's group: read only.",
     "ok": [
      1,
      2,
      3
     ],
     "hl": [
      4,
      5,
      6
     ],
     "ptr": {
      "group": 4
     },
     "note": "group: r--"
    },
    {
     "say": "And three for everyone else: read only.",
     "ok": [
      1,
      2,
      3,
      4,
      5,
      6
     ],
     "hl": [
      7,
      8,
      9
     ],
     "ptr": {
      "others": 7
     },
     "note": "others: r--"
    },
    {
     "say": "Now run C H mod six hundred. Each digit sets one group of three: read is four, write is two, execute is one.",
     "vals": [
      "-",
      "r",
      "w",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-"
     ],
     "hl": [
      1,
      2
     ],
     "ptr": {
      "owner": 1
     },
     "note": "chmod 600 → 6 = 4 + 2 (rw-) · 0 · 0"
    },
    {
     "say": "Six gives the owner read and write. The two zeros take everything from group and others.",
     "vals": [
      "-",
      "r",
      "w",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-"
     ],
     "hl": [
      1,
      2
     ],
     "gone": [
      4,
      5,
      6,
      7,
      8,
      9
     ],
     "note": "-rw-------"
    },
    {
     "say": "That's least privilege on a single file: only the access that's genuinely needed.",
     "vals": [
      "-",
      "r",
      "w",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-",
      "-"
     ],
     "ok": [
      1,
      2
     ],
     "gone": [
      4,
      5,
      6,
      7,
      8,
      9
     ],
     "note": "only the owner can read or write"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 2.1 · Lab",
   "title": "sudo: one command as root, and a record of it",
   "nodes": [
    {
     "id": "you",
     "label": "You",
     "x": 12,
     "y": 28,
     "sub": "a normal user",
     "art": "persona"
    },
    {
     "id": "sudo",
     "label": "sudo",
     "x": 46,
     "y": 54,
     "sub": "checks you're allowed",
     "art": "key"
    },
    {
     "id": "cmd",
     "label": "id",
     "x": 86,
     "y": 22,
     "sub": "runs as root",
     "art": "terminal"
    },
    {
     "id": "log",
     "label": "auth.log",
     "x": 86,
     "y": 80,
     "sub": "in /var/log",
     "art": "file"
    }
   ],
   "edges": [
    {
     "from": "you",
     "to": "sudo"
    },
    {
     "from": "sudo",
     "to": "cmd"
    },
    {
     "from": "sudo",
     "to": "log"
    }
   ],
   "beats": [
    {
     "say": "Who am I and I D show who you are: a normal user, with limited rights.",
     "show": 1,
     "on": "you"
    },
    {
     "say": "To do one thing as root, you put sudo in front of the command.",
     "show": 2,
     "on": "you",
     "send": {
      "from": "you",
      "to": "sudo",
      "label": "sudo id"
     }
    },
    {
     "say": "Sudo asks for your password and checks you're allowed.",
     "show": 2,
     "on": "sudo"
    },
    {
     "say": "Then just that one command runs as root.",
     "show": 3,
     "on": "cmd",
     "send": {
      "from": "sudo",
      "to": "cmd",
      "label": "run as root"
     }
    },
    {
     "say": "I D now prints U I D zero: root.",
     "show": 3,
     "on": "cmd",
     "send": {
      "from": "cmd",
      "to": "sudo",
      "label": "uid=0(root)"
     }
    },
    {
     "say": "And sudo leaves a record of who ran what, and when.",
     "show": 4,
     "on": "log",
     "send": {
      "from": "sudo",
      "to": "log",
      "label": "who ran what"
     }
    },
    {
     "say": "Sudo tail slash var slash log slash auth dot log shows it. Without that file, use journal C T L dash e.",
     "show": 4,
     "on": "log"
    },
    {
     "say": "Logged in as root, every action has full power the whole time. Sudo keeps those moments short and recorded.",
     "show": 4,
     "on": [
      "you",
      "sudo"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 2.1 · Lab",
   "title": "Audit for SUID and world-writable files",
   "columns": [
    "Path (example)",
    "Owner",
    "Found by",
    "Verdict"
   ],
   "rows": [
    [
     "/usr/bin/passwd",
     "root",
     "-4000 SUID",
     "expected"
    ],
    [
     "/usr/bin/sudo",
     "root",
     "-4000 SUID",
     "expected"
    ],
    [
     "/opt/tool/helper",
     "root",
     "-4000 SUID",
     "unknown: investigate"
    ],
    [
     "/opt/app/run.sh",
     "root",
     "-0002 any-write",
     "anyone can edit"
    ]
   ],
   "beats": [
    {
     "say": "Now audit the system the way a defender would. Here are example results.",
     "sql": "find / -perm -4000 -type f 2>/dev/null"
    },
    {
     "say": "The first search finds SUID files. They run with their owner's privileges, often root, not yours.",
     "hl": [
      0,
      1,
      2
     ],
     "col": 2
    },
    {
     "say": "Some are expected. Passwd and sudo need root to do their jobs.",
     "hl": [
      0,
      1
     ],
     "dim": true
    },
    {
     "say": "A SUID root file you don't recognise is a red flag. If it's exploitable, an ordinary user could become root.",
     "hl": 2,
     "dim": true,
     "col": 3
    },
    {
     "say": "The second search finds world-writable files: anyone on the system can change them.",
     "sql": "find / -perm -0002 -type f 2>/dev/null",
     "hl": 3,
     "dim": true
    },
    {
     "say": "If a privileged process runs a file like that, it's a path to root. Tighten it, or remove what isn't needed.",
     "hl": 3,
     "dim": true,
     "col": 3
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 2.2 · Windows",
   "title": "Does a SID in your token match the ACL?",
   "columns": [
    "Account (SID)",
    "Rights",
    "Means"
   ],
   "rows": [
    [
     "NT AUTHORITY\\SYSTEM",
     "(I)(F)",
     "full control"
    ],
    [
     "BUILTIN\\Administrators",
     "(I)(F)",
     "full control"
    ],
    [
     "BUILTIN\\Users",
     "(I)(RX)",
     "read and execute"
    ]
   ],
   "beats": [
    {
     "say": "Windows uses S I Ds, security identifiers, and access control lists. I C A C L S shows one.",
     "sql": "icacls C:\\Windows\\System32\\drivers\\etc\\hosts"
    },
    {
     "say": "F means full control. R X means read and execute. And I means inherited from the folder.",
     "col": 1
    },
    {
     "say": "A standard user tries to edit the hosts file. Their token carries their S I Ds, including Users.",
     "sql": "token: your SID · Users · ...  →  write?",
     "hl": 2
    },
    {
     "say": "Windows checks the A C L. Users only permits read and execute, so the write is denied.",
     "hl": 2,
     "dim": true,
     "col": 1
    },
    {
     "say": "An administrator's token includes the Administrators S I D, but U A C prompts before using it.",
     "sql": "token: Administrators (after UAC prompt)  →  write?",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Once they confirm, the Administrators entry matches, and full control is granted.",
     "hl": 1,
     "dim": true,
     "col": 2
    },
    {
     "say": "Who am I slash all shows the S I Ds and privileges in your own token.",
     "sql": "whoami /all"
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 2.2 · Lab",
   "title": "Read the Security log",
   "columns": [
    "Time",
    "Event ID",
    "Account",
    "Result"
   ],
   "rows": [
    [
     "09:14:02",
     "4625",
     "admin",
     "failed logon"
    ],
    [
     "09:14:03",
     "4625",
     "admin",
     "failed logon"
    ],
    [
     "09:14:04",
     "4625",
     "admin",
     "failed logon"
    ],
    [
     "09:14:05",
     "4625",
     "admin",
     "failed logon"
    ],
    [
     "09:14:06",
     "4625",
     "admin",
     "failed logon"
    ],
    [
     "09:14:08",
     "4624",
     "admin",
     "successful logon"
    ]
   ],
   "beats": [
    {
     "say": "Here's an example slice of a Windows Security log.",
     "sql": "Get-WinEvent -LogName Security -MaxEvents 20"
    },
    {
     "say": "Event forty six twenty five is a failed logon.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ],
     "col": 1
    },
    {
     "say": "Five failures on the same account, about a second apart. A burst like that can point to a brute force attempt.",
     "hl": [
      0,
      1,
      2,
      3,
      4
     ],
     "dim": true
    },
    {
     "say": "Then forty six twenty four, a successful logon. Right after that burst, it's worth investigating straight away.",
     "hl": 5,
     "dim": true,
     "col": 3
    },
    {
     "say": "In Event Viewer, open Windows Logs, then Security, and filter for these two I Ds.",
     "sql": "Event Viewer → Windows Logs → Security · filter 4624, 4625",
     "hl": [
      4,
      5
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 2.2 · Lab",
   "title": "Three more checks on a Windows machine",
   "columns": [
    "Check",
    "Command",
    "Healthy sign"
   ],
   "rows": [
    [
     "Defender",
     "Get-MpComputerStatus",
     "real-time: on"
    ],
    [
     "Admins",
     "Get-LocalGroupMember",
     "only who needs it"
    ],
    [
     "Autostart",
     "reg query ...\\Run",
     "programs you know"
    ]
   ],
   "beats": [
    {
     "say": "Microsoft Defender Antivirus is the built-in protection. Confirm real-time protection is on and definitions are current.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "List the Administrators group. Keep it short: one bad click by an administrator can compromise the whole machine.",
     "sql": "Get-LocalGroup Administrators | Get-LocalGroupMember",
     "hl": 1,
     "dim": true
    },
    {
     "say": "Then the registry Run key. Programs listed there relaunch at every login, a favourite place for malware persistence.",
     "sql": "reg query \"HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\"",
     "hl": 2,
     "dim": true
    },
    {
     "say": "Anything there you don't recognise, investigate and clean out.",
     "hl": 2,
     "dim": true,
     "col": 2
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Both systems",
   "title": "Least privilege limits the damage",
   "nodes": [
    {
     "id": "atk",
     "label": "Attacker",
     "x": 12,
     "y": 50,
     "sub": "finds a flaw",
     "art": "bug"
    },
    {
     "id": "svc1",
     "label": "Service as root",
     "x": 48,
     "y": 22,
     "sub": "or as administrator",
     "art": "server"
    },
    {
     "id": "all",
     "label": "Whole system",
     "x": 88,
     "y": 22,
     "sub": "every file, every user",
     "art": "warning"
    },
    {
     "id": "svc2",
     "label": "Limited service",
     "x": 48,
     "y": 78,
     "sub": "runs as its own user",
     "art": "server"
    },
    {
     "id": "own",
     "label": "Its own files",
     "x": 88,
     "y": 78,
     "sub": "and nothing else",
     "art": "lock"
    }
   ],
   "edges": [
    {
     "from": "atk",
     "to": "svc1"
    },
    {
     "from": "svc1",
     "to": "all"
    },
    {
     "from": "atk",
     "to": "svc2"
    },
    {
     "from": "svc2",
     "to": "own"
    }
   ],
   "beats": [
    {
     "say": "Say an attacker compromises a service that runs as root.",
     "show": 2,
     "on": "atk",
     "send": {
      "from": "atk",
      "to": "svc1",
      "label": "compromise"
     }
    },
    {
     "say": "They inherit root, and with it, the whole system.",
     "show": 3,
     "on": "all",
     "send": {
      "from": "svc1",
      "to": "all",
      "label": "root access"
     }
    },
    {
     "say": "Now the same flaw in a service running as its own limited user.",
     "show": 4,
     "on": "svc2",
     "send": {
      "from": "atk",
      "to": "svc2",
      "label": "compromise"
     }
    },
    {
     "say": "They only get what that user could touch.",
     "show": 5,
     "on": "own",
     "send": {
      "from": "svc2",
      "to": "own",
      "label": "limited rights"
     }
    },
    {
     "say": "That's least privilege, on both systems: standard users for everyday work, root or admin only when a task truly needs it.",
     "show": 5,
     "on": [
      "svc2",
      "own"
     ]
    },
    {
     "say": "Reducing admin rights is one of the highest-impact defensive changes you can make.",
     "show": 5,
     "on": "svc2"
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "Which event ID marks a failed logon in the Windows Security log?",
   "options": [
    "4624",
    "None, failures are not logged",
    "4625"
   ],
   "answer": 2,
   "good": "That's right. Event 4625 is a failed logon, and 4624 is a successful one. A burst of 4625s can point to a brute force attempt.",
   "bad": "Not quite. Event 4625 is a failed logon, and 4624 is a successful one. A burst of 4625s can point to a brute force attempt.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "Which event I D marks a failed logon in the Windows Security log?",
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
     "Linux permissions read, changed and audited",
     ""
    ],
    [
     "sudo used and logged",
     ""
    ],
    [
     "Token, admins and ACL inspected",
     ""
    ],
    [
     "Defender, logon events, Run key",
     ""
    ],
    [
     "Both models and least privilege explained",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 2.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've read and changed Linux permissions, and searched for SUID and world-writable files,",
     "show": 1
    },
    {
     "say": "you've used sudo and reviewed the log entry it left,",
     "show": 2
    },
    {
     "say": "you've inspected your Windows token, the admin group, and a file's A C L,",
     "show": 3
    },
    {
     "say": "you've confirmed Defender and viewed logon events and a Run key,",
     "show": 4
    },
    {
     "say": "and you can explain both permission models, and least privilege on each.",
     "show": 5
    },
    {
     "say": "Next, in Module 3, ethical hacking.",
     "show": 5
    }
   ]
  }
 ]
}
```

---

## Module 2 Completion Checklist
- [ ] Identified your user and groups on Linux, read and changed file permissions, and searched for SUID and world-writable files
- [ ] Used `sudo` to run a command with elevated privilege and reviewed the resulting log entry
- [ ] Inspected your Windows access token, listed administrator-group members, and read a file's ACL with `icacls`
- [ ] Confirmed Microsoft Defender Antivirus status and viewed logon events plus a registry Run key
- [ ] Can explain the Linux permission model (owner/group/other, rwx) and the Windows model (SIDs, tokens, ACLs), and how they differ
- [ ] Can explain what least privilege means on each system, and name one way an attacker abuses OS-level access and one way a defender limits it
