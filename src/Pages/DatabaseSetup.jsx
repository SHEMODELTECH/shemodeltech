// src/Pages/DatabaseSetup.jsx
import React, { useState } from 'react';
import { autoSetupFirebase } from '../firebase/autoSetup';
import { sanitizeErrorMessage } from '../utils/sanitizeError';

const DatabaseSetup = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSetup = async () => {
    if (!window.confirm('This will create all 17 collections with sample data. Continue?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const setupResult = await autoSetupFirebase();
      setResult(setupResult);
      
      if (setupResult.success) {
        alert('Database setup completed successfully!');
      } else {
        alert('Setup completed with errors. Check the results below.');
      }
    } catch (err) {
      setError(sanitizeErrorMessage(err.message));
      alert('Setup failed: ' + sanitizeErrorMessage(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h1>She Model Tech Database Setup</h1>
      <p>This will create all 17 collections with sample data in your Firestore database.</p>
      
      <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>Warning:</strong> Only run this once on a new database!
      </div>

      <button
        onClick={handleSetup}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          padding: '12px 24px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Setting up database...' : 'Run Database Setup'}
      </button>

      {loading && (
        <div style={{ marginTop: '20px' }}>
          <p>Setting up collections... Please wait...</p>
          <p>Check the browser console for detailed progress.</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#f8d7da', borderRadius: '5px' }}>
          <h3>Error</h3>
          <pre>{error}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: result.success ? '#d4edda' : '#f8d7da', borderRadius: '5px' }}>
          <h3>{result.success ? 'Success!' : 'Completed with Issues'}</h3>
          <p>Collections created: {result.collectionsCreated}/17</p>
          
          {result.results && result.results.length > 0 && (
            <div>
              <h4>Results:</h4>
              <ul>
                {result.results.map((res, idx) => (
                  <li key={idx}>
                    {res.collection}: {res.status}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.success && (
            <div style={{ marginTop: '20px' }}>
              <h4>Next Steps:</h4>
              <ol>
                <li>Check your Firestore console to verify collections were created</li>
                <li>Deploy security rules: <code>firebase deploy --only firestore:rules</code></li>
                <li>Deploy indexes: <code>firebase deploy --only firestore:indexes</code></li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatabaseSetup;
