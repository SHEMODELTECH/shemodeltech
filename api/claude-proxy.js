// api/claude-proxy-fetch.js

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Enhanced request validation
  if (!req.body) {
    return res.status(400).json({ 
      error: 'Missing request body' 
    });
  }
  
  if (!req.body.messages) {
    return res.status(400).json({ 
      error: 'Missing messages array in request', 
      details: 'Request must include a messages array with at least one message'
    });
  }
  
  if (!req.body.model) {
    return res.status(400).json({ 
      error: 'Missing model in request', 
      details: 'Request must specify a valid Claude model'
    });
  }
  
  // Validate messages format
  if (!Array.isArray(req.body.messages) || req.body.messages.length === 0) {
    return res.status(400).json({
      error: 'Invalid messages format',
      details: 'Messages must be a non-empty array'
    });
  }
  
  try {
    // Log request details for debugging
    console.log('Claude API Request:', {
      model: req.body.model,
      messageCount: req.body.messages.length,
      maxTokens: req.body.max_tokens || 'default'
    });
    
    // Check API key
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY environment variable is not set');
      return res.status(500).json({
        error: 'API configuration error',
        details: 'Claude API key is not configured'
      });
    }
    
    // Prepare the request body with well-defined structure
    const requestBody = {
      model: req.body.model,
      messages: req.body.messages,
      max_tokens: req.body.max_tokens || 4096,
      temperature: req.body.temperature !== undefined ? req.body.temperature : 0.7,
      system: req.body.system || ''
    };
    
    // Call the Claude API using fetch
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01' // Consider using a more recent version if available
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      
      return res.status(response.status).json({
        error: 'Claude API error',
        details: errorData.error?.message || response.statusText,
        status: response.status
      });
    }
    
    // Successfully received response from Claude API
    const data = await response.json();
    
    // Log response structure for debugging
    console.log('Claude API Response Structure:', {
      hasContent: !!data.content,
      contentType: data.content ? (Array.isArray(data.content) ? 'array' : typeof data.content) : 'undefined',
      role: data.role || 'unknown',
      model: data.model || 'unknown'
    });
    
    // Enhance the response if needed for backward compatibility
    if (data.content && Array.isArray(data.content) && data.content.length > 0) {
      // Modern Claude API format - keep as is
      // But add a log to help debug the structure
      console.log('Content structure:', {
        type: data.content[0].type,
        hasText: !!data.content[0].text
      });
    } else if (data.completion) {
      // Legacy Claude API format - convert to new format
      console.log('Converting legacy format to new format');
      data.content = [{ type: 'text', text: data.completion }];
    }
    
    // Return the Claude API response to the client
    return res.status(200).json(data);
  } catch (error) {
    console.error('Claude API Request Error:', error);
    
    // Provide detailed error information
    return res.status(500).json({ 
      error: 'Error processing request',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
