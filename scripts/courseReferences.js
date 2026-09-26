/**
 * scripts/courseReferences.js
 *
 * Authoritative references for She Model Tech Learning courses. At build time,
 * generateCourses.js matches each course's text against these patterns and
 * attaches the most relevant ones (official documentation, standards, and
 * primary sources for the tools and ideas the course actually teaches).
 *
 * These are sources for checking the material and going deeper. They are not a
 * record of where each sentence came from.
 *
 * To add or fix a reference, edit this list; `node scripts/checkReferences.js`
 * checks that every link still works.
 */

const R = (title, publisher, url, re, tracks = null) => ({ title, publisher, url, re, tracks });

// Always included for a track (shown after the course-specific matches).
const TRACK_BASE = {
  TechQA: [R('ISTQB Certified Tester Foundation Level syllabus', 'ISTQB', 'https://www.istqb.org/', null)],
  TechGuard: [
    R('OWASP Top 10', 'OWASP Foundation', 'https://owasp.org/www-project-top-ten/', null),
    R('Cybersecurity Framework', 'NIST', 'https://www.nist.gov/cyberframework', null),
  ],
  TechPO: [R('Agile Coach: product management guides', 'Atlassian', 'https://www.atlassian.com/agile', null)],
};

const REFERENCES = [
  // ---- Programming and the web ----
  R('The Python Tutorial', 'Python Software Foundation', 'https://docs.python.org/3/tutorial/', /\bpython\b/gi),
  R('heapq: heap queue algorithm', 'Python Software Foundation', 'https://docs.python.org/3/library/heapq.html', /\bheapq\b|\bheaps?\b/gi),
  R('Time complexity of Python operations', 'Python Wiki', 'https://wiki.python.org/moin/TimeComplexity', /big o\b|\bO\((1|n|log n|n log n|n\^2)\)/gi),
  R('Pro Git (book)', 'Scott Chacon and Ben Straub, git-scm.com', 'https://git-scm.com/book/en/v2', /\bgit\b/gi),
  R('GitHub Actions documentation', 'GitHub', 'https://docs.github.com/en/actions', /GitHub Actions/g),
  R('HTML reference and guides', 'MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web/HTML', /\bHTML\b/g),
  R('CSS reference and guides', 'MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web/CSS', /\bCSS\b/g),
  R('JavaScript guide', 'MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', /\bJavaScript\b/g),
  R('HTTP overview', 'MDN Web Docs', 'https://developer.mozilla.org/en-US/docs/Web/HTTP', /\bHTTP\b|\bREST(ful)?\b|status code/g),
  R('TypeScript Handbook', 'Microsoft', 'https://www.typescriptlang.org/docs/handbook/intro.html', /TypeScript/g),
  R('React documentation', 'Meta', 'https://react.dev/learn', /\bReact\b/g),
  R('FastAPI documentation', 'FastAPI', 'https://fastapi.tiangolo.com/', /FastAPI/g),
  R('Flask documentation', 'Pallets Projects', 'https://flask.palletsprojects.com/', /\bFlask\b/g),
  R('PostgreSQL documentation', 'PostgreSQL Global Development Group', 'https://www.postgresql.org/docs/current/', /PostgreSQL|Postgres\b/g),
  R('SQLite documentation', 'SQLite', 'https://www.sqlite.org/docs.html', /SQLite/g),
  R('SQLAlchemy documentation', 'SQLAlchemy', 'https://docs.sqlalchemy.org/', /SQLAlchemy/g),
  R('OpenAPI Specification and Swagger tools', 'SmartBear', 'https://swagger.io/docs/', /Swagger|OpenAPI/g),
  R('pytest documentation', 'pytest', 'https://docs.pytest.org/', /pytest/g),
  R('Jest documentation', 'Jest', 'https://jestjs.io/docs/getting-started', /\bJest\b/g),
  R('JSON Web Token (RFC 7519)', 'IETF', 'https://datatracker.ietf.org/doc/html/rfc7519', /\bJWTs?\b/g),
  R('OAuth 2.0', 'oauth.net', 'https://oauth.net/2/', /OAuth/g),
  R('Pydantic documentation', 'Pydantic', 'https://docs.pydantic.dev/', /Pydantic/g),

  // ---- DevOps and infrastructure ----
  R('Docker documentation', 'Docker', 'https://docs.docker.com/', /Docker(file)?\b/g),
  R('Kubernetes documentation', 'The Kubernetes Authors', 'https://kubernetes.io/docs/home/', /Kubernetes/g),
  R('Terraform documentation', 'HashiCorp', 'https://developer.hashicorp.com/terraform/docs', /Terraform/g),
  R('OpenTofu documentation', 'OpenTofu', 'https://opentofu.org/docs/', /OpenTofu/g),
  R('Pulumi documentation', 'Pulumi', 'https://www.pulumi.com/docs/', /Pulumi/g),
  R('Redis documentation', 'Redis', 'https://redis.io/docs/', /\bRedis\b/g),
  R('RQ (Redis Queue) documentation', 'RQ', 'https://python-rq.org/', /\bRQ\b|python-rq|rq worker/g),
  R('Prometheus documentation', 'Prometheus', 'https://prometheus.io/docs/', /Prometheus/g),
  R('Grafana documentation', 'Grafana Labs', 'https://grafana.com/docs/', /Grafana/g),
  R('AWS documentation', 'Amazon Web Services', 'https://docs.aws.amazon.com/', /\bAWS\b/g),
  R('Microsoft Azure documentation', 'Microsoft', 'https://learn.microsoft.com/azure/', /\bAzure\b/g),
  R('Google Cloud documentation', 'Google', 'https://cloud.google.com/docs', /Google Cloud/g),

  // ---- AI, data, and vision ----
  R('Claude API documentation', 'Anthropic', 'https://docs.claude.com/', /Anthropic|Claude/g),
  R('Google Colab', 'Google', 'https://colab.research.google.com/', /\bColab\b/g),
  R('Jupyter documentation', 'Project Jupyter', 'https://docs.jupyter.org/', /Jupyter/g),
  R('Streamlit documentation', 'Snowflake', 'https://docs.streamlit.io/', /Streamlit/g),
  R('Chroma documentation', 'Chroma', 'https://docs.trychroma.com/', /\bChroma\b/g),
  R('pandas documentation', 'pandas', 'https://pandas.pydata.org/docs/', /\bpandas\b/g),
  R('NumPy documentation', 'NumPy', 'https://numpy.org/doc/stable/', /NumPy/g),
  R('scikit-learn user guide', 'scikit-learn', 'https://scikit-learn.org/stable/user_guide.html', /scikit-learn|sklearn/g),
  R('PyTorch tutorials', 'PyTorch Foundation', 'https://pytorch.org/tutorials/', /PyTorch/g),
  R('TensorFlow tutorials', 'Google', 'https://www.tensorflow.org/tutorials', /TensorFlow/g),
  R('OpenCV documentation', 'OpenCV', 'https://docs.opencv.org/4.x/', /OpenCV/g),
  R('Computer Vision: Algorithms and Applications (2nd ed.)', 'Richard Szeliski', 'https://szeliski.org/Book/', /computer vision|image processing|convolution/gi),
  R('Ultralytics YOLO documentation', 'Ultralytics', 'https://docs.ultralytics.com/', /\bYOLO/g),
  R('You Only Look Once: Unified, Real-Time Object Detection', 'Redmon et al., 2016 (arXiv)', 'https://arxiv.org/abs/1506.02640', /\bYOLO/g),
  R('An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale', 'Dosovitskiy et al., 2021 (arXiv)', 'https://arxiv.org/abs/2010.11929', /Vision Transformer|\bViT\b/g),
  R('Attention Is All You Need', 'Vaswani et al., 2017 (arXiv)', 'https://arxiv.org/abs/1706.03762', /transformer|self-attention/gi),
  R('Generative Adversarial Networks', 'Goodfellow et al., 2014 (arXiv)', 'https://arxiv.org/abs/1406.2661', /\bGANs?\b|generative adversarial/g),
  R('Auto-Encoding Variational Bayes', 'Kingma and Welling, 2013 (arXiv)', 'https://arxiv.org/abs/1312.6114', /\bVAEs?\b|variational autoencoder/gi),
  R('ROS 2 documentation', 'Open Robotics', 'https://docs.ros.org/en/rolling/', /\bROS ?2?\b/g),
  R('Gazebo documentation', 'Open Robotics', 'https://gazebosim.org/docs', /Gazebo/g),
  R('Ray documentation', 'Anyscale', 'https://docs.ray.io/', /\bRay\b/g),
  R('MLflow documentation', 'MLflow', 'https://mlflow.org/docs/latest/', /MLflow/g),
  R('SHAP documentation', 'SHAP', 'https://shap.readthedocs.io/', /\bSHAP\b/g),
  R('Regulation (EU) 2024/1689 (EU AI Act)', 'EUR-Lex, European Union', 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj', /EU AI Act|2024\/1689/g),
  R('AI Risk Management Framework', 'NIST', 'https://www.nist.gov/itl/ai-risk-management-framework', /AI RMF|AI Risk Management Framework|NIST/g),
  R('Model Cards for Model Reporting', 'Mitchell et al., 2019 (arXiv)', 'https://arxiv.org/abs/1810.03993', /model cards?/gi),

  // ---- Quality assurance ----
  R('Selenium documentation', 'Selenium', 'https://www.selenium.dev/documentation/', /Selenium/g),
  R('Cypress documentation', 'Cypress', 'https://docs.cypress.io/', /Cypress/g),
  R('Playwright documentation', 'Microsoft', 'https://playwright.dev/docs/intro', /Playwright/g),
  R('Postman Learning Center', 'Postman', 'https://learning.postman.com/docs/', /Postman|Newman/g),
  R('Apache JMeter user manual', 'Apache Software Foundation', 'https://jmeter.apache.org/usermanual/index.html', /JMeter/g),
  R('Android Studio', 'Google', 'https://developer.android.com/studio', /Android Studio/g),
  R('Xcode', 'Apple', 'https://developer.apple.com/xcode/', /Xcode/g),
  R('Make apps more accessible (Android)', 'Google', 'https://developer.android.com/guide/topics/ui/accessibility', /TalkBack|Accessibility Scanner/g),
  R('Accessibility: Human Interface Guidelines', 'Apple', 'https://developer.apple.com/design/human-interface-guidelines/accessibility', /VoiceOver|Accessibility Inspector/g),
  R('Web Content Accessibility Guidelines (WCAG)', 'W3C', 'https://www.w3.org/WAI/standards-guidelines/wcag/', /WCAG|accessibility audit|screen reader/gi),

  // ---- Security ----
  R('OWASP ZAP documentation', 'ZAP', 'https://www.zaproxy.org/docs/', /\bZAP\b/g),
  R('OWASP Juice Shop', 'OWASP Foundation', 'https://owasp.org/www-project-juice-shop/', /Juice Shop/g),
  R('OWASP Cheat Sheet Series', 'OWASP Foundation', 'https://cheatsheetseries.owasp.org/', /injection|cross-site scripting|\bXSS\b|input validation/gi),
  R('Wireshark documentation', 'Wireshark Foundation', 'https://www.wireshark.org/docs/', /Wireshark/g),
  R('Nmap reference guide', 'Nmap Project', 'https://nmap.org/book/man.html', /\bNmap\b/g),
  R('Metasploit documentation', 'Rapid7', 'https://docs.metasploit.com/', /Metasploit/g),
  R('Burp Suite documentation', 'PortSwigger', 'https://portswigger.net/burp/documentation', /Burp/g),
  R('How it works (TLS certificates)', "Let's Encrypt", 'https://letsencrypt.org/how-it-works/', /certificate authority|TLS certificate|Let's Encrypt/gi),
  R('Digital Identity Guidelines: Authentication (SP 800-63B)', 'NIST', 'https://pages.nist.gov/800-63-3/sp800-63b.html', /MFA|multi-factor|passwords?\b/gi, ['TechGuard']),
  R('Passkeys and FIDO2', 'FIDO Alliance', 'https://fidoalliance.org/passkeys/', /FIDO2|WebAuthn|passkeys?/gi),
  R('IAM user guide', 'Amazon Web Services', 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', /\bIAM\b/g),
  R('MITRE ATT&CK', 'MITRE', 'https://attack.mitre.org/', /ATT&CK|MITRE/g),
  R('CIS Benchmarks', 'Center for Internet Security', 'https://www.cisecurity.org/cis-benchmarks', /CIS Benchmark/g),
  R('Gitleaks', 'Gitleaks project', 'https://github.com/gitleaks/gitleaks', /Gitleaks/g),
  R('Trivy documentation', 'Aqua Security', 'https://trivy.dev/', /Trivy/g),
  R('Checkov documentation', 'Prisma Cloud (Palo Alto Networks)', 'https://www.checkov.io/', /Checkov/g),
  R('Dependabot documentation', 'GitHub', 'https://docs.github.com/en/code-security/dependabot', /Dependabot/g),

  // ---- Product, delivery, and leadership ----
  R('The Scrum Guide', 'Ken Schwaber and Jeff Sutherland', 'https://scrumguides.org/scrum-guide.html', /\bScrum\b/g),
  R('Kanban guide', 'Atlassian', 'https://www.atlassian.com/agile/kanban', /Kanban/g),
  R('Jira documentation', 'Atlassian', 'https://support.atlassian.com/jira-software-cloud/', /\bJira\b/g),
  R('Trello guide', 'Atlassian', 'https://support.atlassian.com/trello/', /Trello/g),
  R('Figma help center', 'Figma', 'https://help.figma.com/', /Figma/g),
  R('RICE: simple prioritization for product managers', 'Intercom', 'https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/', /\bRICE\b/g),
  R('10 Usability Heuristics for User Interface Design', 'Nielsen Norman Group', 'https://www.nngroup.com/articles/ten-usability-heuristics/', /usability|UX principles|usability heuristics/gi),
  R('Personas', 'Nielsen Norman Group', 'https://www.nngroup.com/articles/persona/', /personas?\b/gi),
  R('User interviews', 'Nielsen Norman Group', 'https://www.nngroup.com/articles/user-interviews/', /user interviews?|interview guide|leading questions?/gi),
  R('PMBOK Guide', 'Project Management Institute', 'https://www.pmi.org/standards/pmbok', /PMBOK|project scope|work breakdown|RAID log/gi),
  R('Diátaxis: a framework for technical documentation', 'Daniele Procida', 'https://diataxis.fr/', /how-to guides?|reference page|Diátaxis/gi),
  R('Google developer documentation style guide', 'Google', 'https://developers.google.com/style', /style guide/gi),
  R('Federal plain language guidelines', 'plainlanguage.gov', 'https://www.plainlanguage.gov/guidelines/', /plain language/gi, ['TechLeads']),
  R('Architectural decision records', 'adr.github.io', 'https://adr.github.io/', /decision records?/gi),
  R('The Prosci ADKAR model', 'Prosci', 'https://www.prosci.com/methodology/adkar', /ADKAR|change management/gi, ['TechLeads', 'TechPO']),
  R("Kotter's 8-step process for leading change", 'Kotter', 'https://www.kotterinc.com/methodology/8-steps/', /Kotter/g),

  R('A Guide to the Business Analysis Body of Knowledge (BABOK Guide)', 'IIBA', 'https://www.iiba.org/', /business analysis|requirements elicitation/gi, ['TechLeads', 'TechPO']),
  R('Stakeholder engagement (PMBOK Guide)', 'Project Management Institute', 'https://www.pmi.org/standards/pmbok', /stakeholder/gi, ['TechLeads']),
  R('Coaching and feedback', 'Center for Creative Leadership', 'https://www.ccl.org/articles/leading-effectively-articles/', /coaching|feedback conversation|one-on-ones?/gi, ['TechLeads']),
  R('Bug writing guidelines', 'Mozilla', 'https://bugzilla.mozilla.org/page.cgi?id=bug-writing.html', /bug reports?|steps to reproduce/gi, ['TechQA', 'TechDev']),
  R('Writing survey questions', 'Pew Research Center', 'https://www.pewresearch.org/writing-survey-questions/', /surveys?\b/gi, ['TechLeads', 'TechPO']),
  R('GitHub documentation', 'GitHub', 'https://docs.github.com/', /\bGitHub\b/g, ['TechDev']),
  R('Exploratory testing', 'Martin Fowler', 'https://martinfowler.com/bliki/ExploratoryTesting.html', /exploratory testing/gi),
  R('Financial statements basics', 'U.S. Securities and Exchange Commission (Investor.gov)', 'https://www.investor.gov/introduction-investing/getting-started/researching-investments/financial-statements', /financial statements?|profit and loss|\bP&L\b|cash flow|budget/gi, ['TechLeads']),

  // ---- No-code and low-code platforms ----
  R('Webflow University', 'Webflow', 'https://university.webflow.com/', /Webflow/g),
  R('Bubble manual', 'Bubble', 'https://manual.bubble.io/', /\bBubble\b/g),
  R('Zapier help center', 'Zapier', 'https://help.zapier.com/', /Zapier|\bZaps?\b/g),
  R('Make help center', 'Make', 'https://www.make.com/en/help', /Make\.com|\bMake\b (scenario|scenarios)/g),
  R('HubSpot Academy', 'HubSpot', 'https://academy.hubspot.com/', /HubSpot/g),
  R('Trailhead', 'Salesforce', 'https://trailhead.salesforce.com/', /Salesforce/g),
  R('Zoho CRM help', 'Zoho', 'https://www.zoho.com/crm/help/', /Zoho/g),
  R('Retool documentation', 'Retool', 'https://docs.retool.com/', /Retool/g),
  R('Airtable support', 'Airtable', 'https://support.airtable.com/', /Airtable/g),
  R('WordPress documentation', 'WordPress.org', 'https://wordpress.org/documentation/', /WordPress/g),
  R('Glide documentation', 'Glide', 'https://www.glideapps.com/docs', /\bGlide\b/g),
  R('Softr documentation', 'Softr', 'https://docs.softr.io/', /Softr/g),
  R('Power Automate documentation', 'Microsoft', 'https://learn.microsoft.com/power-automate/', /Power Automate/g),
  R('n8n documentation', 'n8n', 'https://docs.n8n.io/', /\bn8n\b/g),
  R('Notion help center', 'Notion', 'https://www.notion.so/help', /\bNotion\b/g),
];

// Pick references for one course from its text: course-specific matches first
// (most mentioned first), then the track's base references, up to `max`.
const referencesFor = (track, text, max = 8) => {
  const scored = REFERENCES.filter((r) => !r.tracks || r.tracks.includes(track))
    .map((r) => ({ r, n: (text.match(r.re) || []).length }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .map((x) => x.r);
  const out = [];
  const seen = new Set();
  [...scored.slice(0, max - (TRACK_BASE[track] || []).length), ...(TRACK_BASE[track] || [])].forEach((r) => {
    if (!seen.has(r.url)) {
      seen.add(r.url);
      out.push({ title: r.title, publisher: r.publisher, url: r.url });
    }
  });
  return out.slice(0, max);
};

const allReferenceUrls = () =>
  [...new Set([...REFERENCES, ...Object.values(TRACK_BASE).flat()].map((r) => r.url))];

module.exports = { referencesFor, allReferenceUrls };
