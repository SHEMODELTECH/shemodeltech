// api/claude-proxy.js
// Server-side proxy to the Claude API, so the API key never reaches browsers.
// Only signed-in members can use it, only approved models, and with a cap on
// response length, so no one can run up the API bill through this endpoint.
const { requireUser, throttle } = require('../lib/requireUser');

const ALLOWED_MODEL = /^claude-(haiku|sonnet)-/;
const MAX_TOKENS = 2000;
const MAX_BODY_CHARS = 60000; // roughly 15k words of input

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.SITE_URL || 'https://shemodeltech.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await requireUser(req, res);
  if (!user) return;

  const body = req.body || {};
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages format' });
  }
  if (!ALLOWED_MODEL.test(String(body.model || ''))) {
    return res.status(400).json({ error: 'Model not allowed' });
  }
  if (JSON.stringify(body.messages).length + String(body.system || '').length > MAX_BODY_CHARS) {
    return res.status(413).json({ error: 'Request too large' });
  }
  // At most one request per second per member.
  if (!(await throttle(`claude_${user.uid}`, 1))) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
  }
  if (!process.env.CLAUDE_API_KEY) {
    return res.status(500).json({ error: 'API configuration error' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model,
        messages: body.messages,
        max_tokens: Math.min(Number(body.max_tokens) || 1024, MAX_TOKENS),
        temperature: body.temperature !== undefined ? body.temperature : 0.7,
        ...(body.system ? { system: body.system } : {}),
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Claude API error', response.status, data?.error?.message);
      return res.status(response.status).json({ error: 'Claude API error', details: data?.error?.message || response.statusText });
    }
    return res.status(200).json(data);
  } catch (error) {
    console.error('Claude proxy error:', error.message);
    return res.status(500).json({ error: 'Error processing request' });
  }
};
