const { put, del } = require('@vercel/blob');
const { requireUser } = require('../lib/requireUser');

// Only these file types may be uploaded (images, and documents such as
// mentors' draft letters), and nothing over 4 MB (the function's request limit).
const ALLOWED_TYPES = /^(image\/(png|jpe?g|gif|webp)|application\/pdf|application\/msword|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|text\/plain)$/;
const MAX_BYTES = 4 * 1024 * 1024;

// Vercel Serverless Function handler
module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Uploads and deletes need a signed-in member (stops strangers using our storage).
  if (req.method === 'POST' || req.method === 'DELETE') {
    const user = await requireUser(req, res);
    if (!user) return;
  }

  // Handle UPLOAD
  if (req.method === 'POST') {
    try {
      // Check for BLOB_READ_WRITE_TOKEN
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error('BLOB_READ_WRITE_TOKEN is not configured');
        return res.status(500).json({ 
          error: 'Storage not configured', 
          message: 'BLOB_READ_WRITE_TOKEN environment variable is missing.' 
        });
      }

      const { filename, contentType, fileData } = req.body || {};

      if (!filename || !fileData) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          message: 'filename and fileData are required'
        });
      }

      if (!ALLOWED_TYPES.test(String(contentType || ''))) {
        return res.status(415).json({ error: 'Unsupported file type', message: 'Upload an image, PDF, Word, or text file.' });
      }

      // Convert base64 back to buffer
      const buffer = Buffer.from(fileData, 'base64');
      if (buffer.length > MAX_BYTES) {
        return res.status(413).json({ error: 'File too large', message: 'Files must be smaller than 4 MB.' });
      }

      console.log(`Uploading: ${filename}, size: ${buffer.length} bytes, type: ${contentType}`);

      // Upload to Vercel Blob
      const blob = await put(filename, buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType,
      });

      console.log(`Upload success: ${blob.url}`);

      // Return success response
      return res.status(200).json({
        url: blob.url,
        pathname: blob.pathname,
        contentType: blob.contentType,
        size: blob.size,
        uploadedAt: blob.uploadedAt
      });
    } catch (error) {
      console.error('Upload error:', error.message);
      console.error('Stack:', error.stack);
      return res.status(500).json({ 
        error: 'Upload failed', 
        message: error.message
      });
    }
  }

  // Handle DELETE
  if (req.method === 'DELETE') {
    try {
      const { url } = req.body || {};

      if (!url) {
        return res.status(400).json({ error: 'Missing URL' });
      }

      await del(url, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ 
        error: 'Delete failed', 
        message: error.message 
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

// Vercel serverless function config - increase body size limit for image uploads
module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
