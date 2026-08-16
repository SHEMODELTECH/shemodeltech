// Create this file: src/Pages/admin/TestDailyDigest.jsx
import React, { useState } from 'react';

const TestDailyDigest = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const baseUrl = window.location.origin;

  const showResponse = (data, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    setResponse(`[${timestamp}] ${formattedData}`);
  };

  const testDebugMode = async () => {
    setLoading(true);
    showResponse('🔄 Testing debug mode...');
    
    try {
      const response = await fetch(`${baseUrl}/api/email/send-daily-digest?debug=true`, {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResponse(`✅ Debug test successful!\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        showResponse(`❌ Debug test failed!\nStatus: ${response.status}\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      showResponse(`💥 Network error: ${error.message}`);
    }
    setLoading(false);
  };

  const testManualSend = async () => {
    setLoading(true);
    showResponse('🔄 Testing manual send...');
    
    try {
      const response = await fetch(`${baseUrl}/api/email/send-daily-digest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResponse(`✅ Manual send test successful!\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        showResponse(`❌ Manual send failed!\nStatus: ${response.status}\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      showResponse(`💥 Network error: ${error.message}`);
    }
    setLoading(false);
  };

  const testWithApiKey = async () => {
    setLoading(true);
    showResponse('🔄 Testing with API key...');
    
    try {
      const response = await fetch(`${baseUrl}/api/email/send-daily-digest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResponse(`✅ API key test successful!\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        showResponse(`❌ API key test failed!\nStatus: ${response.status}\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      showResponse(`💥 Network error: ${error.message}`);
    }
    setLoading(false);
  };

  const testCronHeaders = async () => {
    setLoading(true);
    showResponse('🔄 Testing with Vercel cron headers...');
    
    try {
      const response = await fetch(`${baseUrl}/api/email/send-daily-digest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-vercel-cron': '1',
          'user-agent': 'vercel-cron'
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showResponse(`✅ Cron headers test successful!\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        showResponse(`❌ Cron headers test failed!\nStatus: ${response.status}\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      showResponse(`💥 Network error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 rounded-3xl p-8 border border-white/20">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            🔍 Daily Digest Testing Tool
          </h1>
          
          <div className="bg-white/5 rounded-2xl p-6 mb-6">
            <h3 className="text-xl text-white mb-4">🧪 Test Configuration</h3>
            <div className="mb-4">
              <label className="block text-white mb-2">Domain:</label>
              <input 
                type="text" 
                value={baseUrl}
                disabled
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">API Key:</label>
              <input 
                type="text" 
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                placeholder="favored-daily-2025"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 mb-6">
            <h3 className="text-xl text-white mb-4">🔧 Diagnostic Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button 
                onClick={testDebugMode}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
              >
                🐛 Test Debug Mode
              </button>
              <button 
                onClick={testManualSend}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
              >
                📧 Test Manual Send
              </button>
              <button 
                onClick={testWithApiKey}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
              >
                🔑 Test With API Key
              </button>
              <button 
                onClick={testCronHeaders}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition-colors disabled:opacity-50"
              >
                ⏰ Test Cron Headers
              </button>
            </div>
            
            {response && (
              <div className="bg-black/30 rounded-lg p-4 border border-white/20">
                <h4 className="text-white mb-2">Response:</h4>
                <pre className="text-blue-400 text-sm overflow-x-auto whitespace-pre-wrap">
                  {response}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white/5 rounded-2xl p-6">
            <h3 className="text-xl text-white mb-4">📋 Checklist</h3>
            <div className="text-white space-y-2">
              <p className="font-semibold">✅ Environment Variables to Check:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                <li>FIREBASE_CLIENT_EMAIL</li>
                <li>FIREBASE_PRIVATE_KEY</li>
                <li>EMAIL_USER (Gmail address)</li>
                <li>EMAIL_PASSWORD (Gmail app password)</li>
                <li>DAILY_DIGEST_API_KEY</li>
              </ul>
              
              <p className="font-semibold mt-4">⚙️ Vercel Settings:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-gray-600">
                <li>Check if cron job is configured in vercel.json</li>
                <li>Verify cron job appears in Vercel dashboard</li>
                <li>Check function logs in Vercel dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDailyDigest;
