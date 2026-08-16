import React, { useState } from 'react';
import { autoSetupFirebase } from '../../firebase/autoSetup';
import { sanitizeErrorMessage } from '../../utils/sanitizeError';

const DatabaseSetup = () => {
  const [setupStatus, setSetupStatus] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runSetup = async () => {
    setIsRunning(true);
    setSetupStatus('Running setup...');
    
    try {
      const result = await autoSetupFirebase();
      
      if (result.success) {
        setSetupStatus(`Success! Created ${result.collectionsCreated} collections`);
      } else {
        setSetupStatus(`Failed: ${result.error}`);
      }
    } catch (error) {
      setSetupStatus(`Error: ${sanitizeErrorMessage(error.message)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8">Database Setup</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Initialize Database Collections</h2>
          <p className="text-gray-600 mb-6">
            This will create all 17 required collections with sample data:
          </p>
          <ul className="list-disc list-inside text-gray-400 mb-6 space-y-1">
            <li>client_projects</li>
            <li>project_applications</li>
            <li>applications</li>
            <li>groups</li>
            <li>group_members</li>
            <li>group_posts</li>
            <li>post_replies</li>
            <li>project_completion_requests</li>
            <li>member_badges</li>
            <li>certificates</li>
            <li>notifications</li>
            <li>users</li>
            <li>tech_events</li>
            <li>career_analyses</li>
            <li>ai_career_content</li>
            <li>follows</li>
            <li>directory_access</li>
          </ul>
          
          <button
            onClick={runSetup}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isRunning ? 'Running Setup...' : 'Run Database Setup'}
          </button>
        </div>

        {setupStatus && (
          <div className={`p-4 rounded-lg ${setupStatus.includes('Success') ? 'bg-blue-900/50' : 'bg-red-900/50'}`}>
            <pre className="whitespace-pre-wrap">{setupStatus}</pre>
          </div>
        )}

        <div className="bg-orange-900/30 border border-orange-600 rounded-lg p-6 mt-6">
          <h3 className="text-xl font-semibold mb-2">Important Notes:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Run this only once when setting up a new database</li>
            <li>Check the browser console for detailed logs</li>
            <li>After setup, deploy Firestore rules and indexes</li>
            <li>User profiles are created automatically when users sign in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetup;
