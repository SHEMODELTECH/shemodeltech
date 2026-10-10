// api/public-request.js
// Alerts She Model Tech about a new team application, funding request, or
// Contact us message
// (from "Fund a cohort" on Support our mission; signed in or not): a bell notification for staff, an email to the
// team inbox (SUPPORT_EMAIL) and to staff, and a confirmation to the requester.
//
// Safe to call without sign-in because it only acts on a real document that was
// created in the last 15 minutes and hasn't been alerted yet; it never sends
// anything the caller writes, only a notice pointing staff to the Admin tabs.
const admin = require('../lib/firebaseAdmin');
const { sendMail } = require('../lib/mailer');
const { escapeHtml, headerSafe } = require('../lib/escapeHtml');

const SITE = process.env.SITE_URL || 'https://shemodeltech.com';
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'shemodeltech@gmail.com';
const KINDS = {
  // (Organization requests and Summit partner requests are retired.)
  team: { col: 'team_applications', title: (d) => `New team application: ${headerSafe(d.name).slice(0, 100) || 'someone'}` },
  funding: { col: 'funding_requests', title: (d) => `New funding request: ${headerSafe(d.organization || d.name).slice(0, 100) || 'someone'}` },
  contact: { col: 'contact_messages', title: (d) => `New message (${CONTACT_TOPICS[d.topic] || 'General'}): ${headerSafe(d.name).slice(0, 100) || 'someone'}` },
};
// Contact us topics (src/Pages/Contact.jsx).
const CONTACT_TOPICS = { general: 'General question', letter: 'Letter request', certificate: 'Certificate check', account: 'Sign-in or account help', privacy: 'Privacy or my data', other: 'Something else' };
const FUNDING_LABELS = {
  giverType: { company: 'Company', foundation: 'Foundation or trust', individual: 'Individual', other: 'Other' },
  fundingFor: { cohort: 'A whole cohort', team: 'One team', laptops: 'Laptops and internet', unsure: 'Not sure yet' },
  amount: { under1k: 'Under $1,000', '1k-5k': '$1,000 to $5,000', '5k-20k': '$5,000 to $20,000', over20k: 'Over $20,000', unsure: 'Not sure yet' },
};

// Shared links (/s/e/<id>, /s/p/<id>): a tiny page with the event's or
// project's own title, description, and image, so LinkedIn, WhatsApp, and
// others show a proper preview card. People are sent straight on to the page.
const htmlEsc = (t) => escapeHtml(t || '');
const CATEGORY = { workshop: 'Workshop', talk: 'Tech talk', conference: 'Conference', podcast: 'Podcast', demo: 'Live demo', demoday: 'Demo day', shoutout: 'Spotlight' };
const shareCard = async (req, res) => {
  const kind = req.query.share === 'p' ? 'p' : 'e';
  const id = String(req.query.id || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 60);
  let title = 'She Model Tech';
  let description = 'Build real experience, earn verified skill badges, and get discovered.';
  let image = `${SITE}/Images/512X512.png`;
  let target = kind === 'e' ? `${SITE}/events` : `${SITE}/projects`;
  try {
    if (id) {
      const snap = await admin.firestore().collection(kind === 'e' ? 'events' : 'projects').doc(id).get();
      const d = snap.exists ? snap.data() : null;
      if (kind === 'e' && d && d.published) {
        const when = d.startAt
          ? new Date(d.startAt).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York', timeZoneName: 'short' })
          : '';
        title = d.title || title;
        description = `${CATEGORY[d.category] || 'Event'} · ${when} · Online · Free. ${String(d.description || '').slice(0, 160)}`;
        if (d.imageUrl) image = d.imageUrl;
        target = `${SITE}/events/${id}`;
      } else if (kind === 'p' && d && ['active', 'lead_recruitment', 'setup'].includes(d.status) && !d.isCompanyPost && d.reviewStatus !== 'rejected') {
        title = `${d.projectTitle || d.title || 'A project'} · She Model Tech`;
        description = `Join a team and build it for real. ${String(d.projectDescription || d.description || '').slice(0, 180)}`;
        target = `${SITE}/projects?p=${id}`;
      }
    }
  } catch (e) {
    console.error('share card failed:', e.message);
  }
  const big = image !== `${SITE}/Images/512X512.png`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(`<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${htmlEsc(title)}</title>
<meta name="description" content="${htmlEsc(description)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="She Model Tech">
<meta property="og:title" content="${htmlEsc(title)}"><meta property="og:description" content="${htmlEsc(description)}">
<meta property="og:image" content="${htmlEsc(image)}"><meta property="og:url" content="${htmlEsc(target)}">
<meta name="twitter:card" content="${big ? 'summary_large_image' : 'summary'}"><meta name="twitter:title" content="${htmlEsc(title)}">
<meta name="twitter:description" content="${htmlEsc(description)}"><meta name="twitter:image" content="${htmlEsc(image)}">
<link rel="canonical" href="${htmlEsc(target)}"><meta http-equiv="refresh" content="0;url=${htmlEsc(target)}">
</head><body><script>location.replace(${JSON.stringify(target)});</script>
<p><a href="${htmlEsc(target)}">Continue to She Model Tech</a></p></body></html>`);
};

const publicProjects = async (res) => {
  try {
    const snap = await admin.firestore().collection('projects')
      .where('status', 'in', ['active', 'lead_recruitment', 'setup'])
      // Only the fields a card shows (and the filters below), not whole documents.
      .select('projectTitle', 'title', 'projectDescription', 'description', 'status', 'applicationsOpen',
        'isPaid', 'isCohort', 'industryTrack', 'timeline', 'featured', 'teamRoles', 'createdAt',
        'reviewStatus', 'isActive', 'isCompanyPost', 'hidden')
      .get();
    const projects = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.reviewStatus !== 'rejected' && p.isActive !== false && !p.isCompanyPost && !p.hidden)
      .map((p) => ({
        id: p.id,
        projectTitle: p.projectTitle || p.title || 'Untitled project',
        projectDescription: String(p.projectDescription || p.description || '').slice(0, 400),
        status: p.status,
        applicationsOpen: p.applicationsOpen !== false,
        isPaid: !!p.isPaid,
        isCohort: !!p.isCohort,
        industryTrack: p.industryTrack || null,
        timeline: p.timeline || null,
        featured: !!p.featured,
        teamRoles: (p.teamRoles || []).map((r) => ({ role: r.role, count: r.count || null, payAmount: r.payAmount || null })),
        createdAt: p.createdAt?.toMillis ? p.createdAt.toMillis() : 0,
      }))
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.createdAt - a.createdAt);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ projects });
  } catch (e) {
    console.error('public projects failed:', e.message);
    return res.status(500).json({ error: 'Could not load projects' });
  }
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', SITE);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  // GET: the public project board for visitors who aren't signed in. Only
  // what a project card shows (no member lists, emails, or links), cached
  // for five minutes.
  if (req.method === 'GET') return req.query && req.query.share ? shareCard(req, res) : publicProjects(res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const kind = KINDS[req.body?.kind];
  const id = String(req.body?.id || '');
  if (!kind || !/^[A-Za-z0-9]{10,40}$/.test(id)) return res.status(400).json({ error: 'Bad request' });

  const db = admin.firestore();
  const ref = db.collection(kind.col).doc(id);
  try {
    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) return null;
      const d = snap.data();
      const created = d.createdAt?.toMillis ? d.createdAt.toMillis() : 0;
      if (d.staffAlerted || Date.now() - created > 15 * 60 * 1000) return null;
      tx.update(ref, { staffAlerted: true });
      return d;
    });
    if (!result) return res.status(200).json({ ok: true, skipped: true });

    const title = kind.title(result);
    const staff = await db.collection('users').where('role', 'in', ['admin', 'editor']).get();
    const esc = (t) => escapeHtml(t || '');
    // Team applications use name/email; the rest of this file reads contactEmail.
    if (req.body.kind === 'team' || req.body.kind === 'funding' || req.body.kind === 'contact') { result.contactEmail = result.email; result.contactName = result.name; }
    const adminLink = req.body.kind === 'team' ? '/admin?tab=team' : req.body.kind === 'funding' ? '/admin?tab=sponsors' : req.body.kind === 'contact' ? '/admin?tab=messages' : '/admin';
    const TEAM_ROLE = { community: 'Community Manager', communication: 'Communication Strategist', social: 'Social Media Manager', brand: 'Brand Strategist', partnership: 'Partnership Manager', sponsorship: 'Sponsorship Manager', program: 'Program Manager', designer: 'Designer', content: 'Content Strategist' };
    const lines = req.body.kind === 'contact'
      ? [['Name', result.name], ['Email', result.email], ['Topic', CONTACT_TOPICS[result.topic] || result.topic], [result.topic === 'certificate' ? 'Certificate ID' : 'Reference', result.reference], ['Message', result.message]]
      : req.body.kind === 'funding'
      ? [['Name', result.name], ['Organization', result.organization], ['Giving as', FUNDING_LABELS.giverType[result.giverType]], ['Would like to fund', FUNDING_LABELS.fundingFor[result.fundingFor]], ['Amount in mind', FUNDING_LABELS.amount[result.amount]], ['Email', result.email], ['Phone', result.phone], ['Message', result.message]]
      : req.body.kind === 'team'
      ? [['Name', result.name], ['Role', TEAM_ROLE[result.role] || result.role], ['Also interested in', (result.otherRoles || []).map((r) => TEAM_ROLE[r] || r).join(', ')], ['Email', result.email], ['Phone', result.phone], ['LinkedIn or portfolio', result.linkedinOrPortfolio], [result.socialPlatform, result.socialHandle], ['Hours a week', result.hours], ['Why', result.why]]
      : req.body.kind === 'org'
      ? [['Organization', result.orgName], ['Type', result.orgType], ['Interested in', result.type], ['Learners', result.learners], ['Format', result.format], ['Timeline', result.timeline], ['Topics', result.topics], ['Courses', result.courses], ['Contact', `${result.contactName || ''} <${result.contactEmail || ''}> ${result.contactPhone || ''}`], ['Message', result.message]]
      : [['Company', result.companyName], ['Option', result.option], ['Contact', `${result.contactName || ''} <${result.contactEmail || ''}>`], ['Message', result.message]];
    const detailHtml = lines.filter(([, v]) => v).map(([k, v]) => `<p><strong>${esc(k)}:</strong> ${esc(v)}</p>`).join('');
    const detailText = lines.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');
    // The team inbox always gets the full request.
    await sendMail({
      to: SUPPORT_EMAIL,
      replyTo: (result.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.contactEmail)) ? result.contactEmail : undefined,
      subject: title,
      text: `${title}\n\n${detailText}\n\nManage it in the Admin dashboard: ${SITE}${adminLink}`,
      html: `<p><strong>${esc(title)}</strong></p>${detailHtml}<p><a href="${SITE}${adminLink}">Manage it in the Admin dashboard</a></p>`,
    }).catch(() => {});
    // A confirmation for the person who sent it.
    if (result.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.contactEmail)) {
      await sendMail({
        to: result.contactEmail,
        subject: req.body.kind === 'team' ? 'We received your team application - She Model Tech' : req.body.kind === 'contact' ? 'We received your message - She Model Tech' : req.body.kind === 'funding' ? 'Thank you for offering to fund a cohort - She Model Tech' : 'We received your request - She Model Tech',
        text: `${req.body.kind === 'funding' ? 'Thank you for offering to support women in tech through She Model Tech. We received your message and will reply within a few working days.' : 'Thank you for contacting She Model Tech. We received your request and will reply within a few working days.'}\n\n${detailText}`,
        html: `<p>${req.body.kind === 'funding' ? 'Thank you for offering to support women in tech through She Model Tech. We received your message and will reply within a few working days.' : 'Thank you for contacting She Model Tech. We received your request and will reply within a few working days.'}</p>${detailHtml}`,
      }).catch(() => {});
    }
    await Promise.all(
      staff.docs.map(async (u) => {
        await db.collection('notifications').add({
          userId: u.id,
          recipientId: u.id,
          type: req.body.kind === 'org' ? 'org_request' : req.body.kind === 'team' ? 'team_application' : req.body.kind === 'funding' ? 'funding_request' : req.body.kind === 'contact' ? 'contact_message' : 'summit_partner',
          title,
          body: 'Review it in the Admin dashboard.',
          message: title,
          link: adminLink,
          isRead: false,
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        const email = u.data().email;
        if (email && email.toLowerCase() !== SUPPORT_EMAIL.toLowerCase()) {
          await sendMail({
            to: email,
            subject: title,
            text: `${title}\n\nReview it in the Admin dashboard: ${SITE}${adminLink}`,
            html: `<p><strong>${esc(title)}</strong></p><p><a href="${SITE}${adminLink}">Review it in the Admin dashboard</a></p>`,
          }).catch(() => {});
        }
      })
    );
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('public-request alert failed:', e.message);
    return res.status(500).json({ error: 'Could not send the alert' });
  }
};
