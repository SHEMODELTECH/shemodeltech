// lib/nodemailer.js - Fixed version for Vercel deployment
import nodemailer from 'nodemailer';

// Validate environment variables
const validateConfig = () => {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ All required environment variables are present');
  return true;
};

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  try {
    validateConfig();
    
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Additional configuration for better compatibility
      tls: {
        rejectUnauthorized: false
      },
      // Connection timeout
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    };
    
    console.log(`📧 Creating transporter with host: ${config.host}:${config.port}`);
    return nodemailer.createTransporter(config);
    
  } catch (error) {
    console.error('❌ Error creating transporter:', error);
    throw error;
  }
};

// Verify transporter configuration
export const verifyTransporter = async () => {
  try {
    console.log('🔍 Verifying SMTP configuration...');
    const transporter = createTransporter();
    
    await transporter.verify();
    console.log('✅ SMTP server is ready to take our messages');
    return { success: true, message: 'SMTP server verified successfully' };
    
  } catch (error) {
    console.error('❌ SMTP server verification failed:', error);
    return { 
      success: false, 
      error: error.message,
      details: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? 'SET' : 'NOT SET',
        pass: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
        from: process.env.FROM_EMAIL ? 'SET' : 'NOT SET'
      }
    };
  }
};

// Send email function with enhanced error handling
export const sendEmail = async (emailOptions) => {
  try {
    console.log('📧 Attempting to send email...');
    console.log('📧 Email options:', {
      to: emailOptions.to,
      subject: emailOptions.subject,
      hasHtml: !!emailOptions.html,
      hasText: !!emailOptions.text
    });
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.FROM_EMAIL,
      ...emailOptions
    };
    
    // Validate email options
    if (!mailOptions.to) {
      throw new Error('Recipient email address (to) is required');
    }
    
    if (!mailOptions.subject) {
      throw new Error('Email subject is required');
    }
    
    if (!mailOptions.text && !mailOptions.html) {
      throw new Error('Email content (text or html) is required');
    }
    
    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      messageId: result.messageId,
      response: result.response,
      accepted: result.accepted,
      rejected: result.rejected
    });
    
    return { 
      success: true, 
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    };
    
  } catch (error) {
    console.error('❌ Error sending email:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    return { 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode
      }
    };
  }
};

// Test email function for debugging
export const sendTestEmail = async (testEmail) => {
  console.log('🧪 Sending test email to:', testEmail);
  
  const testEmailOptions = {
    to: testEmail,
    subject: '🧪 She Model Tech - Email System Test',
    text: 'This is a test email from the She Model Tech email notification system. If you receive this, the email system is working correctly!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">🧪 Email System Test</h2>
        <p>This is a test email from the She Model Tech email notification system.</p>
        <p>If you receive this, the email system is working correctly!</p>
        <p style="color: #666; font-size: 14px;">
          Sent at: ${new Date().toISOString()}
        </p>
      </div>
    `
  };
  
  return await sendEmail(testEmailOptions);
};

// Export default for backward compatibility
export default createTransporter;
