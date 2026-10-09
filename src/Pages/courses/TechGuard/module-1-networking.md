<!-- order: 1 -->
## Module 1: Networking Fundamentals

**Time: about 6 hours** (roughly 1.5 hours per topic).

**By the end of this module, you'll be able to:**
- Explain what IP, TCP, and UDP each guarantee, and trace a real connection with `ping`, `traceroute`, and `curl`
- Query DNS records with `dig` or `nslookup`, read a TTL, and explain how cache poisoning works
- Read a raw HTTP request and response, including methods, status codes, and security headers
- Configure a default-deny firewall with `ufw` and explain stateful inspection, rule order, and egress filtering

**Tools needed for this module:** a terminal (macOS Terminal, Linux shell, or Windows PowerShell), the built-in command-line utilities `ping`, `traceroute` (or `tracert` on Windows), `nslookup` and/or `dig` (`dig` is not built into Windows, so Windows users can use `nslookup` or PowerShell's `Resolve-DnsName` instead), and `curl` (in Windows PowerShell type `curl.exe`, because plain `curl` there is an alias for a different command), plus a normal web browser. For the firewall topic you'll use `ufw` on Linux, or the built-in firewall settings on macOS/Windows. Wireshark is optional if you want to watch real packets, but nothing in this module requires it. **Staying legal:** every lab here either works on your own machine or sends ordinary requests (the same as visiting a website) to public test sites such as `example.com` and `httpbin.org`. Never scan, probe, or capture traffic on networks or systems you don't own or have permission to use.

### Topic 1.1: TCP/IP

Time: about 1.5 hours

#### Concept

**TCP/IP** is the foundational set of protocols that lets any two devices on a network talk to each other, and it's organised in layers so that each layer only worries about one job. **IP** (Internet Protocol) handles addressing and routing, giving every device an address and getting a unit of data from source to destination across many hops. **TCP** (Transmission Control Protocol) sits on top of IP and adds reliability, it establishes a connection, numbers the data, confirms what arrived, and re-sends anything lost. For a security role this matters because most attacks and defences operate on these two layers, so you need to know exactly what each one guarantees and what it doesn't.

- An **IP address** identifies a device on a network (for example `192.168.1.10` in IPv4, or a longer IPv6 address)
- A **packet** is the unit of data IP moves around, wrapped with source and destination addresses
- **TCP** is connection-oriented and reliable, it opens a connection with a three-way handshake (SYN, SYN-ACK, ACK), acknowledges received data, and retransmits what's missing
- **UDP** is the connectionless alternative, faster but with no delivery guarantees, used for things like DNS lookups, video calls and online games (most video streaming sites actually use TCP, over HTTP)
- A **port** is a number that identifies a specific service on a host (for example 80 for HTTP, 443 for HTTPS, 22 for SSH), so one machine can run many services at once

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#1e4e8c', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    APP["<b>Application data</b><br/><br/>The message you<br/>want to send"]
    TCP["<b>TCP segment</b><br/><br/>Adds ports +<br/>sequence numbers"]
    IP["<b>IP packet</b><br/><br/>Adds source +<br/>destination address"]
    NET["<b>Across the network</b><br/><br/>Routed hop by hop<br/>to the destination"]

    APP ==> TCP ==> IP ==> NET

    style APP fill:#2b6cb0,color:#fff,stroke:#1e4e8c,stroke-width:4px
    style TCP fill:#e2e8f0,color:#1a202c,stroke:#2b6cb0,stroke-width:4px
    style IP fill:#e2e8f0,color:#1a202c,stroke:#2b6cb0,stroke-width:4px
    style NET fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Each layer wraps the one above it, this is called encapsulation, and the receiving device unwraps it in reverse, TCP guarantees delivery is complete and in order while IP only guarantees an attempt to route
- The TCP three-way handshake is where many attacks live, a SYN flood abuses it by starting thousands of handshakes and never finishing them, exhausting the target's resources

#### Where you'd actually use this

Reading firewall logs, understanding a port scan, diagnosing why a service is unreachable, or recognising a SYN flood or spoofed-address attack, all of it starts with knowing how TCP and IP behave. Almost every other topic in security builds on this foundation.

#### Lab

1. **Test basic reachability** to a host using ICMP (a different protocol in the same family):
```bash
ping -c 4 example.com
```
That is the Mac/Linux version (`-c 4` means send 4 packets). On Windows, use `ping -n 4 example.com` instead. Some servers are set to ignore ping, so if every packet is lost but the site loads in your browser, the host is up and simply not answering ICMP; step 3 checks it over TCP instead.
2. **Trace the path** your packets take, hop by hop, to that host:
```bash
traceroute example.com
```
(On Windows, use `tracert example.com`.)

3. **Open a real TCP connection** to a web server on port 443 and confirm it succeeds:
```bash
curl -v https://example.com
```
(In Windows PowerShell, type `curl.exe -v https://example.com`. Plain `curl` in PowerShell is a shortcut for a different command and gives different output. This applies to every `curl` command in this module.)

Look at the first lines of output, you'll see the connection being established before any data is exchanged.

4. **List the listening ports** and active connections on your own machine:
```bash
ss -tuln
```
(On macOS use `netstat -an | grep LISTEN`; on Windows use `netstat -an`.)

5. **Identify one service and its port** from that output, and explain to yourself which protocol (TCP or UDP) it's using and why.

#### Checkpoint
You can send a packet to a remote host, trace the route it takes, open a real TCP connection, and list the ports your own machine is listening on, and you can explain the difference between what TCP guarantees and what IP guarantees.

#### Quiz
1. What job does IP do, and what job does TCP do on top of it?
2. What are the three steps of the TCP three-way handshake?
3. What is a port, and why does a single machine need them?
4. How does UDP differ from TCP, and name one thing UDP is used for?
5. How does a SYN flood abuse the TCP handshake?

*Answers: 1) IP handles addressing and routing, getting a packet from a source address to a destination address across the network; TCP sits on top and adds reliability, opening a connection, acknowledging received data, and retransmitting anything lost. 2) SYN, SYN-ACK, ACK. 3) A port is a number identifying a specific service on a host; a machine needs them so it can run many services (web, SSH, mail) at once and direct incoming traffic to the right one. 4) UDP is connectionless and gives no delivery guarantees, making it faster but unreliable; it's used for things like DNS lookups, video calls and online games. 5) It starts many TCP handshakes by sending SYN packets but never completes them with the final ACK, leaving half-open connections that exhaust the target's resources.*

---

### Topic 1.2: DNS

Time: about 1.5 hours

#### Concept

**DNS** (Domain Name System) is the network's address book, it translates human-readable names like `example.com` into the IP addresses that TCP/IP actually needs to route traffic. Rather than one giant list, DNS is a hierarchy of servers that each know a piece of the answer, and a **resolver** walks that hierarchy on your behalf. For a security role DNS matters twice over, it's a common thing attackers try to tamper with (redirecting a name to a server you control), and its query logs are one of the richest sources of evidence about what a device was trying to reach.

- A **resolver** is the service (usually run by your ISP or a provider like `1.1.1.1`) that does the lookup work and returns a final answer
- The hierarchy runs **root servers**, then **TLD servers** (for `.com`, `.org`, and so on), then the **authoritative server** that actually holds the record for a specific domain
- **Records** are the data DNS returns, an **A** record maps a name to an IPv4 address, **AAAA** to IPv6, **CNAME** to another name, **MX** to a mail server, **TXT** to arbitrary text (often used for verification)
- **Caching** and **TTL** (time to live) mean a resolver stores an answer for a set number of seconds before asking again, which is fast but is also why a poisoned or stale record can linger

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#262626', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    C["<b>Your device</b><br/><br/>Wants the IP for<br/>example.com"]
    R["<b>Resolver</b><br/><br/>Does the lookup<br/>on your behalf"]
    H["<b>Server hierarchy</b><br/><br/>Root then TLD then<br/>authoritative"]
    A["<b>Answer</b><br/><br/>The IP address,<br/>then cached"]

    C ==> R ==> H
    H ==> A ==> C

    style C fill:#e2e8f0,color:#1a202c,stroke:#262626,stroke-width:4px
    style R fill:#262626,color:#fff,stroke:#262626,stroke-width:4px
    style H fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style A fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Because the resolver trusts the answer it gets back, **DNS cache poisoning** and **spoofing** attacks try to inject a false record so that a legitimate name points to a malicious IP, this is why **DNSSEC** was introduced to cryptographically sign records
- The same query path that resolves a name is also a logging goldmine, monitoring DNS requests can reveal malware phoning home to a command-and-control domain long before anything else does

#### Where you'd actually use this

Investigating where a suspicious domain actually points, spotting a device querying a known-malicious domain, understanding a phishing site's setup, or diagnosing why a service is unreachable when the network itself is fine. DNS is often the first thing you check and the first thing an attacker tries to abuse.

#### Lab

1. **Look up the A record** for a domain, the basic name-to-IP translation:
```bash
nslookup example.com
```
2. **Query a specific record type** using `dig`, which gives more detail:
```bash
dig example.com A
dig example.com MX
dig example.com TXT
```
`dig` is not built into Windows. On Windows, use `nslookup -type=MX example.com`, or in PowerShell `Resolve-DnsName example.com -Type MX` (swap `MX` for `A` or `TXT`). For the next three steps, Windows users can install `dig` (it comes with the free BIND tools from ISC) or use a Linux environment such as WSL; if you can't, read the steps and compare with the `Resolve-DnsName` output, which also shows the TTL.
3. **Watch the full resolution walk the hierarchy** from the root down:
```bash
dig +trace example.com
```
Read the output top to bottom, you'll see it go root, then TLD, then authoritative.

4. **Query a specific public resolver directly** and compare the answer:
```bash
dig @1.1.1.1 example.com
```
5. **Find the TTL** on a record (the number before the record type in `dig` output) and explain what it means for how long that answer will be cached.

#### Checkpoint
You can resolve a name to an IP, query several different record types, watch a full recursive lookup walk the server hierarchy, and read a TTL, and you can explain why DNS is both a common attack target and a valuable source of evidence.

#### Quiz
1. What does DNS translate, and why is that translation needed for TCP/IP to work?
2. Name the three tiers of the DNS server hierarchy in the order a lookup reaches them.
3. What is the difference between an A record and an MX record?
4. What does TTL control, and why does it matter for security?
5. What is DNS cache poisoning, and what was DNSSEC introduced to defend against?

*Answers: 1) It translates human-readable domain names into IP addresses; TCP/IP routes by IP address, so a name has to be resolved to an address before any connection can be made. 2) Root servers, then TLD servers (for .com, .org, and so on), then the authoritative server for the specific domain. 3) An A record maps a name to an IPv4 address; an MX record points to the mail server responsible for a domain. 4) TTL sets how many seconds a resolver caches an answer before asking again; it matters because a poisoned or stale record can persist in caches for as long as the TTL allows. 5) Cache poisoning injects a false record into a resolver so a legitimate name points to a malicious IP; DNSSEC was introduced to cryptographically sign records so forged answers can be detected.*

---

### Topic 1.3: HTTP

Time: about 1.5 hours

#### Concept

**HTTP** (HyperText Transfer Protocol) is the application-layer protocol the web runs on, and it works as a simple request-and-response exchange, your client sends a request, the server sends a response, and the connection is otherwise **stateless** (the server doesn't inherently remember you between requests). Every request carries a **method** saying what you want to do, and every response carries a **status code** saying what happened, along with **headers** full of metadata. For a security role, HTTP is where a huge share of real-world attacks and defences play out, so reading a raw request and response by eye is a core skill.

- A **request** has a method, a path, headers, and sometimes a body; a **response** has a status code, headers, and usually a body
- A **method** states the intent, `GET` retrieves, `POST` submits data, `PUT` updates, `DELETE` removes
- A **status code** reports the outcome, `2xx` success, `3xx` redirect, `4xx` client error (like `404` not found or `403` forbidden), `5xx` server error
- **Headers** carry metadata such as content type, cookies, authentication tokens, and security headers, and because they're plain text in HTTP, anyone in the path can read them
- **HTTPS** is HTTP wrapped in **TLS** encryption, which protects the request and response from being read or altered in transit, which is why plain HTTP is now treated as unsafe

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#5b21b6', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    CL["<b>Client</b><br/><br/>Browser or curl<br/>sends a request"]
    REQ["<b>Request</b><br/><br/>Method + path +<br/>headers + body"]
    SRV["<b>Server</b><br/><br/>Processes and<br/>responds"]
    RES["<b>Response</b><br/><br/>Status code +<br/>headers + body"]

    CL ==> REQ ==> SRV
    SRV ==> RES ==> CL

    style CL fill:#e2e8f0,color:#1a202c,stroke:#5b21b6,stroke-width:4px
    style REQ fill:#7c3aed,color:#fff,stroke:#5b21b6,stroke-width:4px
    style SRV fill:#ede9fe,color:#1a202c,stroke:#7c3aed,stroke-width:4px
    style RES fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Because plain HTTP is unencrypted text, anyone positioned in the network path can read or modify it, a **man-in-the-middle** attack, which is exactly what TLS (HTTPS) is designed to prevent
- Security-relevant behaviour lives in the headers, things like `Set-Cookie`, `Authorization`, and defensive headers such as `Content-Security-Policy` and `Strict-Transport-Security`, so reading headers is a routine part of assessing a web app

#### Where you'd actually use this

Inspecting what a web app actually sends and receives, spotting a missing security header, understanding how a session cookie or auth token travels, testing an API, or recognising why a site served over plain HTTP is a risk. Nearly all web security work involves reading and reasoning about HTTP traffic.

#### Lab

1. **Send a request and see the full exchange**, headers and all, with `curl`'s verbose mode:
```bash
curl -v https://example.com
```
Read the lines starting with `>` (your request) and `<` (the server's response).

2. **Fetch only the response headers** to inspect metadata without the page body:
```bash
curl -I https://example.com
```
3. **Trigger different status codes** and observe them:
```bash
curl -I https://example.com/thispagedoesnotexist
```
Note the `4xx` code you get back. (If a site answers with a `200` page instead, try `curl -I https://httpbin.org/status/404`, which always returns a 404.)

4. **Send a POST request** with data and watch how it differs from a GET:
```bash
curl -X POST -d "name=test" https://httpbin.org/post
```
5. **Compare plain HTTP against HTTPS** by requesting both (where available) and noting that only one protects the data in transit. Then, in your browser's developer tools, open the Network tab, reload a page, and click one request to inspect its real method, status, and headers.

#### Checkpoint
You can send GET and POST requests by hand, read a full request and response including headers, trigger and identify different status codes, and explain what HTTPS adds over plain HTTP and why that matters.

#### Quiz
1. What is the basic request-and-response cycle in HTTP, and what does "stateless" mean here?
2. Name three HTTP methods and what each one is for.
3. What do the `2xx`, `4xx`, and `5xx` ranges of status codes mean?
4. Why is plain HTTP considered unsafe, and what does HTTPS add?
5. Name one security-relevant HTTP header and what it does.

*Answers: 1) The client sends a request and the server sends back a response; stateless means the server doesn't inherently remember the client between separate requests. 2) For example: GET retrieves a resource, POST submits data, DELETE removes a resource (PUT, which updates, is also acceptable). 3) 2xx means success, 4xx means a client-side error such as 404 not found or 403 forbidden, and 5xx means a server-side error. 4) Plain HTTP sends everything as readable text, so anyone in the network path can read or alter it in a man-in-the-middle attack; HTTPS wraps HTTP in TLS encryption to protect the data in transit. 5) For example: Set-Cookie carries a session cookie, Authorization carries an auth token, Content-Security-Policy restricts what content can load to limit injection attacks, or Strict-Transport-Security forces future connections to use HTTPS.*

---

### Topic 1.4: Firewalls

Time: about 1.5 hours

#### Concept

A **firewall** is the gatekeeper that decides which network traffic is allowed through and which is blocked, based on a set of **rules**. It examines traffic by criteria like source and destination IP, port, and protocol, and either permits or drops it. The most important principle is **default-deny**, block everything that isn't explicitly allowed, so that a service is only reachable when you've made a deliberate decision to expose it. This is the topic where the previous three come together, because a firewall rule is written in exactly the terms you've just learned: addresses, ports, and protocols.

- A **rule** allows or denies traffic based on criteria such as source/destination IP, port, and protocol (TCP or UDP)
- **Stateful inspection** means the firewall tracks the state of active connections, so it can allow return traffic for a connection you started without needing a separate rule for it
- **Default-deny** is the safe baseline, everything is blocked unless a rule explicitly permits it, which limits your attack surface to only what you've intentionally opened
- **Ingress** filtering controls traffic coming in, **egress** filtering controls traffic going out, egress rules matter because they can stop compromised machines from phoning home

#### Structure at a Glance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'fontSize':'22px', 'primaryTextColor':'#1a202c', 'primaryBorderColor':'#7f1d1d', 'lineColor':'#333333'}, 'flowchart': {'nodeSpacing': 70, 'rankSpacing': 90, 'padding': 20}}}%%
flowchart LR
    T["<b>Incoming traffic</b><br/><br/>Has a source IP,<br/>port, protocol"]
    FW["<b>Firewall</b><br/><br/>Checks against<br/>its rule set"]
    ALLOW["<b>Allowed</b><br/><br/>Matches a permit<br/>rule, passes through"]
    DENY["<b>Denied</b><br/><br/>No match, dropped<br/>by default-deny"]

    T ==> FW
    FW ==> ALLOW
    FW ==> DENY

    style T fill:#e2e8f0,color:#1a202c,stroke:#7f1d1d,stroke-width:4px
    style FW fill:#c1121f,color:#fff,stroke:#7f1d1d,stroke-width:4px
    style ALLOW fill:#F5F5F5,color:#1a202c,stroke:#262626,stroke-width:4px
    style DENY fill:#EBEBEB,color:#1a202c,stroke:#000000,stroke-width:4px
    linkStyle default stroke-width:4px,stroke:#333333
```
- Firewalls come in tiers, a **packet-filtering** firewall checks each packet's headers in isolation, a **stateful** firewall tracks whole connections, and an **application-layer** firewall or **WAF** (web application firewall) inspects the actual HTTP content to block things like injection attacks
- The order of rules matters, most firewalls evaluate rules top to bottom and stop at the first match, so a broad allow rule placed above a specific deny rule can accidentally undo the deny

#### Where you'd actually use this

Locking down a server so only the ports it needs are reachable, segmenting a network so a breach in one area can't spread, blocking known-bad addresses, and controlling outbound traffic so a compromised host can't exfiltrate data. Firewall configuration is one of the most direct, everyday defensive controls in a security role.

#### Lab

> Do this on a machine you have direct (non-remote) access to, or be careful not to lock yourself out. If you're on a remote server over SSH, always allow the SSH port **before** enabling the firewall.

1. **Check the current firewall status** (Linux, using `ufw`):
```bash
sudo ufw status verbose
```
2. **Set a default-deny baseline** for incoming traffic while allowing your own outbound traffic:
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```
3. **Explicitly allow one service** you actually need, for example SSH on port 22:
```bash
sudo ufw allow 22/tcp
```
4. **Enable the firewall and re-check the rules:**
```bash
sudo ufw enable
sudo ufw status numbered
```
5. **Add and then delete a rule** to see how rule management works, for example allow then remove HTTP on port 80:
```bash
sudo ufw allow 80/tcp
sudo ufw status numbered
sudo ufw delete allow 80/tcp
```
(On macOS or Windows, open the built-in firewall settings and confirm you can see the same ideas: a default policy plus specific allow rules per app or port.)

#### Checkpoint
You have configured a firewall with a default-deny baseline, explicitly allowed only the services you need, and added and removed a rule, and you can explain default-deny, stateful inspection, and the difference between ingress and egress filtering.

#### Quiz
1. What criteria does a firewall rule typically use to allow or deny traffic?
2. What does "default-deny" mean, and why is it the safer baseline?
3. What does stateful inspection let a firewall do that packet-filtering alone does not?
4. What is the difference between ingress and egress filtering, and why does egress matter for security?
5. Why does the order of firewall rules matter?

*Answers: 1) Criteria such as source and destination IP address, port, and protocol (TCP or UDP). 2) Default-deny blocks all traffic that isn't explicitly permitted by a rule; it's safer because it limits the attack surface to only what you've deliberately chosen to open, rather than trying to block threats one by one. 3) Stateful inspection tracks the state of active connections, so it can automatically allow the return traffic for a connection you initiated without needing a separate rule; packet-filtering examines each packet in isolation without that context. 4) Ingress filtering controls inbound traffic while egress filtering controls outbound traffic; egress matters because it can stop a compromised machine from sending data out or phoning home to an attacker's server. 5) Most firewalls evaluate rules top to bottom and act on the first match, so a broad allow rule placed above a specific deny rule can unintentionally override it.*

```watch
{
 "scenes": [
  {
   "kind": "title",
   "art": "router",
   "kicker": "Module 1 · Networking fundamentals",
   "title": "How machines talk",
   "beats": [
    {
     "say": "Welcome to Networking Fundamentals."
    },
    {
     "say": "Across four topics, T C P slash I P, D N S, H T T P and firewalls, you'll learn the ground that almost every other security topic builds on."
    },
    {
     "say": "Every lab works on your own machine, or sends ordinary requests to public test sites. Never scan or probe networks you don't own."
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 1.1 · TCP/IP",
   "title": "Each layer wraps the one above it",
   "nodes": [
    {
     "id": "app",
     "label": "Application data",
     "x": 12,
     "y": 30,
     "sub": "the message to send",
     "art": "doc"
    },
    {
     "id": "tcp",
     "label": "TCP segment",
     "x": 37,
     "y": 70,
     "sub": "+ ports, sequence nos",
     "art": "boxes"
    },
    {
     "id": "ip",
     "label": "IP packet",
     "x": 63,
     "y": 30,
     "sub": "+ source, destination",
     "art": "package"
    },
    {
     "id": "net",
     "label": "The network",
     "x": 88,
     "y": 70,
     "sub": "routed hop by hop",
     "art": "globe"
    }
   ],
   "edges": [
    {
     "from": "app",
     "to": "tcp"
    },
    {
     "from": "tcp",
     "to": "ip"
    },
    {
     "from": "ip",
     "to": "net"
    }
   ],
   "beats": [
    {
     "say": "Start with the message you want to send. That's the application data.",
     "show": 1,
     "on": "app"
    },
    {
     "say": "T C P wraps it in a segment, adding port numbers and sequence numbers.",
     "show": 2,
     "on": "tcp",
     "send": {
      "from": "app",
      "to": "tcp",
      "label": "message"
     }
    },
    {
     "say": "I P wraps that in a packet, adding the source and destination addresses.",
     "show": 3,
     "on": "ip",
     "send": {
      "from": "tcp",
      "to": "ip",
      "label": "segment"
     }
    },
    {
     "say": "Then routers pass the packet along, hop by hop. Traceroute shows you each of those hops.",
     "show": 4,
     "on": "net",
     "send": {
      "from": "ip",
      "to": "net",
      "label": "packet"
     }
    },
    {
     "say": "This wrapping is called encapsulation, and the receiving device unwraps it in reverse.",
     "show": 4,
     "on": [
      "app",
      "tcp",
      "ip",
      "net"
     ]
    },
    {
     "say": "Notice the split. I P only guarantees an attempt to route. T C P guarantees the data arrives complete and in order.",
     "show": 4,
     "on": [
      "tcp",
      "ip"
     ]
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 1.1 · TCP/IP",
   "title": "The three-way handshake, and how a SYN flood abuses it",
   "nodes": [
    {
     "id": "cli",
     "label": "Your laptop",
     "x": 14,
     "y": 26,
     "sub": "curl -v",
     "art": "laptop"
    },
    {
     "id": "srv",
     "label": "Web server",
     "x": 84,
     "y": 50,
     "sub": "port 443 · HTTPS",
     "art": "server"
    },
    {
     "id": "atk",
     "label": "Attacker",
     "x": 14,
     "y": 76,
     "sub": "many fake starts",
     "art": "bug"
    }
   ],
   "edges": [
    {
     "from": "cli",
     "to": "srv"
    },
    {
     "from": "atk",
     "to": "srv"
    }
   ],
   "beats": [
    {
     "say": "To reach a web server on port four four three, T C P opens with a handshake. First, syn.",
     "show": 2,
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "srv",
      "label": "SYN"
     }
    },
    {
     "say": "The server answers syn ack, and sets aside resources for you.",
     "show": 2,
     "on": "srv",
     "send": {
      "from": "srv",
      "to": "cli",
      "label": "SYN-ACK"
     }
    },
    {
     "say": "Your laptop sends ack, and the connection is open.",
     "show": 2,
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "srv",
      "label": "ACK"
     }
    },
    {
     "say": "Now data flows numbered. What arrives is acknowledged, and anything lost is re-sent.",
     "show": 2,
     "on": [
      "cli",
      "srv"
     ],
     "send": {
      "from": "cli",
      "to": "srv",
      "label": "data, numbered"
     }
    },
    {
     "say": "U D P skips all of this and just sends, with no guarantee. It suits D N S lookups, video calls and games.",
     "show": 2,
     "on": "cli",
     "send": {
      "from": "cli",
      "to": "srv",
      "label": "UDP: just send"
     }
    },
    {
     "say": "A SYN flood abuses the handshake. It sends thousands of syns.",
     "show": 3,
     "on": "atk",
     "send": {
      "from": "atk",
      "to": "srv",
      "label": "SYN ×1000"
     }
    },
    {
     "say": "The server answers each one and waits.",
     "show": 3,
     "on": "srv",
     "send": {
      "from": "srv",
      "to": "atk",
      "label": "SYN-ACK ×1000"
     }
    },
    {
     "say": "The final ack never comes, and half-open connections pile up until the server runs out of resources.",
     "show": 3,
     "on": "srv"
    }
   ]
  },
  {
   "kind": "diagram",
   "kicker": "Topic 1.2 · DNS",
   "title": "Watch a resolver walk the hierarchy",
   "nodes": [
    {
     "id": "dev",
     "label": "Your device",
     "x": 10,
     "y": 50,
     "sub": "wants example.com",
     "art": "laptop"
    },
    {
     "id": "res",
     "label": "Resolver",
     "x": 42,
     "y": 50,
     "sub": "e.g. 1.1.1.1",
     "art": "server"
    },
    {
     "id": "root",
     "label": "Root server",
     "x": 84,
     "y": 16,
     "sub": "knows the TLDs",
     "art": "globe"
    },
    {
     "id": "tld",
     "label": ".com TLD server",
     "x": 84,
     "y": 50,
     "sub": "knows .com domains",
     "art": "network"
    },
    {
     "id": "auth",
     "label": "Authoritative",
     "x": 84,
     "y": 84,
     "sub": "holds the record",
     "art": "database"
    }
   ],
   "edges": [
    {
     "from": "dev",
     "to": "res"
    },
    {
     "from": "res",
     "to": "root"
    },
    {
     "from": "res",
     "to": "tld"
    },
    {
     "from": "res",
     "to": "auth"
    }
   ],
   "beats": [
    {
     "say": "D N S turns a name into an I P address. Your device asks a resolver.",
     "show": 2,
     "on": "dev",
     "send": {
      "from": "dev",
      "to": "res",
      "label": "example.com A?"
     }
    },
    {
     "say": "The resolver starts at a root server, which points it to dot com.",
     "show": 3,
     "on": "root",
     "send": {
      "from": "root",
      "to": "res",
      "label": "ask .com"
     }
    },
    {
     "say": "The dot com T L D server points it to the authoritative server.",
     "show": 4,
     "on": "tld",
     "send": {
      "from": "tld",
      "to": "res",
      "label": "ask its server"
     }
    },
    {
     "say": "That server holds the actual record, and answers with the address and a T T L.",
     "show": 5,
     "on": "auth",
     "send": {
      "from": "auth",
      "to": "res",
      "label": "IP + TTL"
     }
    },
    {
     "say": "The resolver passes it back, and caches it for T T L seconds. Dig plus trace shows this whole walk.",
     "show": 5,
     "on": "res",
     "send": {
      "from": "res",
      "to": "dev",
      "label": "IP (cached)"
     }
    },
    {
     "say": "Ask again inside the T T L, and the answer comes straight from the cache.",
     "show": 5,
     "on": "res",
     "send": {
      "from": "res",
      "to": "dev",
      "label": "from cache"
     }
    },
    {
     "say": "That's also the risk. A poisoned record planted here lingers for as long as the T T L allows.",
     "show": 5,
     "on": "res"
    },
    {
     "say": "D N S SEC signs records, so forged answers can be detected.",
     "show": 5,
     "on": [
      "auth",
      "res"
     ]
    },
    {
     "say": "And D N S query logs are evidence. They can reveal malware phoning home to a command and control domain.",
     "show": 5,
     "on": [
      "dev",
      "res"
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 1.2 · Lab",
   "title": "One name, many record types",
   "columns": [
    "Type",
    "Points to",
    "Typical use"
   ],
   "rows": [
    [
     "A",
     "an IPv4 address",
     "reach the website"
    ],
    [
     "AAAA",
     "an IPv6 address",
     "the same, over IPv6"
    ],
    [
     "CNAME",
     "another name",
     "an alias"
    ],
    [
     "MX",
     "a mail server",
     "where email goes"
    ],
    [
     "TXT",
     "any text",
     "domain verification"
    ]
   ],
   "beats": [
    {
     "say": "Each D N S record type answers a different question."
    },
    {
     "say": "Type A gives the I P v four address.",
     "sql": "dig example.com A",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Quad A is the same for I P v six. A C name points to another name.",
     "hl": [
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "M X says where the domain's email goes.",
     "sql": "dig example.com MX",
     "hl": 3,
     "dim": true
    },
    {
     "say": "T X T holds free text, often to prove you own a domain.",
     "sql": "dig example.com TXT",
     "hl": 4,
     "dim": true
    },
    {
     "say": "In dig's answer, the number before the record type is the T T L: how many seconds it may be cached.",
     "sql": "example.com.  <TTL>  IN  A  <address>",
     "col": 0
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Topic 1.3 · HTTP",
   "title": "Read a raw request and response",
   "file": "curl -v https://example.com",
   "code": "* Connected to example.com port 443\n* SSL connection using TLSv1.3\n> GET / HTTP/2\n> Host: example.com\n> User-Agent: curl/8.x\n> Accept: */*\n>\n< HTTP/2 200\n< content-type: text/html\n< ...more response headers\n<\n<!doctype html> ...the page itself",
   "beats": [
    {
     "say": "Curl dash v shows the whole exchange. First, the connection on port four four three.",
     "line": 1
    },
    {
     "say": "Then T L S encryption, which turns H T T P into H T T P S.",
     "line": 2,
     "vars": {
      "TLS": "on"
     }
    },
    {
     "say": "Lines with a greater than sign are your request. First the method and path: GET slash.",
     "line": 3,
     "vars": {
      "TLS": "on",
      "method": "GET",
      "path": "/"
     }
    },
    {
     "say": "Then headers: which host, which client, what it accepts. A blank line ends it. A GET has no body.",
     "line": [
      4,
      5,
      6,
      7
     ]
    },
    {
     "say": "Lines with a less than sign are the response. Status two hundred: success.",
     "line": 8,
     "vars": {
      "TLS": "on",
      "method": "GET",
      "path": "/",
      "status": 200
     }
    },
    {
     "say": "Response headers carry metadata. Check here for security headers like Strict Transport Security.",
     "line": [
      9,
      10
     ]
    },
    {
     "say": "Then the body, the page itself.",
     "line": [
      11,
      12
     ]
    },
    {
     "say": "Ask for a missing page, and you get a four hundreds code, like four oh four.",
     "vars": {
      "TLS": "on",
      "method": "GET",
      "status": 404
     },
     "out": [
      "$ curl -I https://httpbin.org/status/404",
      "HTTP/2 404"
     ]
    },
    {
     "say": "Post some data, and the test server echoes back your form.",
     "vars": {
      "TLS": "on",
      "method": "POST",
      "status": 200
     },
     "out": [
      "$ curl -X POST -d \"name=test\" https://httpbin.org/post",
      "\"form\": {\"name\": \"test\"}"
     ]
    },
    {
     "say": "Over plain H T T P, all of this is readable text, open to a man in the middle.",
     "line": [
      3,
      12
     ]
    }
   ]
  },
  {
   "kind": "table",
   "kicker": "Topic 1.4 · Firewalls",
   "title": "Rules are checked top to bottom",
   "columns": [
    "#",
    "Match",
    "Action"
   ],
   "rows": [
    [
     "1",
     "in, tcp port 443",
     "ALLOW"
    ],
    [
     "2",
     "in, from 10.0.0.0/8",
     "ALLOW"
    ],
    [
     "3",
     "in, from 10.0.0.66",
     "DENY"
    ],
    [
     "default",
     "anything else in",
     "DENY"
    ]
   ],
   "beats": [
    {
     "say": "Firewall rules match on addresses, ports and protocols. Here's an example set.",
     "sql": "first match wins"
    },
    {
     "say": "A visitor connects to port four four three. Rule one matches: allowed.",
     "hl": 0,
     "dim": true
    },
    {
     "say": "Someone outside tries port twenty two. Nothing matches, so default deny drops it. Only what you deliberately opened is reachable.",
     "hl": 3,
     "dim": true
    },
    {
     "say": "Now the host ten dot zero dot zero dot sixty six connects. Rule three is meant to block it.",
     "hl": 2,
     "dim": true
    },
    {
     "say": "But the broad allow in rule two matches first, so it's let in. Rule three is never reached.",
     "hl": [
      1,
      2
     ],
     "dim": true
    },
    {
     "say": "The fix: put the specific deny above the broad allow.",
     "hl": [
      1,
      2
     ],
     "col": 0
    }
   ]
  },
  {
   "kind": "walk",
   "kicker": "Topic 1.4 · Lab",
   "title": "Lock it down with ufw",
   "file": "terminal",
   "code": "sudo ufw status verbose\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\nsudo ufw allow 22/tcp\nsudo ufw enable\nsudo ufw status numbered\nsudo ufw allow 80/tcp\nsudo ufw delete allow 80/tcp",
   "beats": [
    {
     "say": "Check the firewall first. Here it's off.",
     "line": 1,
     "out": "Status: inactive"
    },
    {
     "say": "Set the baseline: deny all incoming traffic.",
     "line": 2,
     "vars": {
      "incoming": "deny"
     },
     "out": "Default incoming policy changed to 'deny'"
    },
    {
     "say": "Allow your own outgoing traffic. Stricter egress rules can also stop a compromised machine phoning home.",
     "line": 3,
     "vars": {
      "incoming": "deny",
      "outgoing": "allow"
     },
     "out": "Default outgoing policy changed to 'allow'"
    },
    {
     "say": "Allow the one service you need, S S H on port twenty two. On a remote server, do this before enabling.",
     "line": 4,
     "vars": {
      "incoming": "deny",
      "outgoing": "allow",
      "rules": "22/tcp"
     },
     "out": "Rules updated"
    },
    {
     "say": "Turn it on, and the numbered list shows your one allow rule.",
     "line": [
      5,
      6
     ],
     "vars": {
      "status": "active",
      "incoming": "deny",
      "outgoing": "allow",
      "rules": "22/tcp"
     },
     "out": [
      "Firewall is active and enabled on system startup",
      "[ 1] 22/tcp    ALLOW IN    Anywhere"
     ]
    },
    {
     "say": "Practise by allowing port eighty,",
     "line": 7,
     "vars": {
      "status": "active",
      "incoming": "deny",
      "outgoing": "allow",
      "rules": "22/tcp, 80/tcp"
     },
     "out": "Rule added"
    },
    {
     "say": "then deleting it again.",
     "line": 8,
     "vars": {
      "status": "active",
      "incoming": "deny",
      "outgoing": "allow",
      "rules": "22/tcp"
     },
     "out": "Rule deleted"
    },
    {
     "say": "Replies to connections you started still get in, because the firewall is stateful. It tracks each connection.",
     "line": [
      2,
      3
     ]
    }
   ]
  },
  {
   "kind": "quiz",
   "art": "ask",
   "kicker": "Quick check",
   "title": "How does a SYN flood abuse the TCP handshake?",
   "options": [
    "It sends SYN packets but never completes the handshake, leaving half-open connections",
    "It forges DNS records for the target",
    "It reads plain HTTP traffic in transit"
   ],
   "answer": 0,
   "good": "That's right. It starts many handshakes with SYN packets but never sends the final ACK, and the half-open connections exhaust the target's resources.",
   "bad": "Not quite. It starts many handshakes with SYN packets but never sends the final ACK, and the half-open connections exhaust the target's resources.",
   "beats": [
    {
     "say": "Quick check.",
     "show": 0
    },
    {
     "say": "How does a SYN flood abuse the T C P handshake?",
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
     "Ping, trace, connect, list ports",
     ""
    ],
    [
     "DNS records and a full lookup",
     ""
    ],
    [
     "Raw HTTP requests read",
     ""
    ],
    [
     "Default-deny firewall configured",
     ""
    ],
    [
     "One attack, one defence per topic",
     ""
    ]
   ],
   "beats": [
    {
     "say": "That's Module 1.",
     "show": 0
    },
    {
     "say": "You're done when:",
     "show": 0
    },
    {
     "say": "you've sent a packet, traced its route, opened a T C P connection and listed your listening ports,",
     "show": 1
    },
    {
     "say": "you've resolved names, queried several record types and watched a full lookup,",
     "show": 2
    },
    {
     "say": "you've sent get and post requests by hand and read the headers and status codes,",
     "show": 3
    },
    {
     "say": "you've set up a default deny firewall, and added and removed a rule,",
     "show": 4
    },
    {
     "say": "and for each topic, you can name one way an attacker abuses it and one way a defender protects it.",
     "show": 5
    },
    {
     "say": "Next, in Module 2, operating systems.",
     "show": 5
    }
   ]
  }
 ]
}
```

---

## Module 1 Completion Checklist
- [ ] Sent a packet, traced its route, opened a real TCP connection, and listed the ports your machine is listening on
- [ ] Resolved a name with DNS, queried multiple record types, and watched a full lookup walk the server hierarchy
- [ ] Sent GET and POST requests by hand, read raw requests and responses including headers, and identified different status codes
- [ ] Configured a firewall with a default-deny baseline and explicit allow rules, and added and removed a rule
- [ ] Can explain how TCP/IP, DNS, and HTTP each work, and how a firewall rule is written in the same terms (addresses, ports, protocols)
- [ ] Can name, for each topic, at least one way an attacker abuses it and one way a defender protects against that
