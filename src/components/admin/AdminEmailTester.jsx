// src/components/admin/AdminEmailTester.jsx
// Complete Email Testing System for Admin Dashboard

import React, { useState } from 'react';
import { toast } from 'react-toastify';

const AdminEmailTester = () => {
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const emailTests = [
    {
      key: 'PROJECT_APPROVED',
      label: '✅ Project Approved',
      endpoint: 'send-project-approved',
      description: 'Sent when admin approves a project and creates team group',
      testData: {
        projectData: {
          contactEmail: '',
          contactName: 'Test Project Owner',
          projectTitle: 'Test React E-commerce Application',
          projectType: 'Web Development',
          timeline: '3 months',
          experienceLevel: 'Intermediate',
          projectId: 'test-project-123'
        }
      }
    },
    {
      key: 'PROJECT_REJECTED',
      label: '❌ Project Rejected',
      endpoint: 'send-project-rejected',
      description: 'Sent when admin rejects a project submission',
      testData: {
        projectData: {
          contactEmail: '',
          contactName: 'Test Project Owner',
          projectTitle: 'Test React E-commerce Application',
          projectId: 'test-project-123',
          rejectionReason: 'Project description needs more detail and clarity. Please provide specific features, technologies to be used, and clearer timeline expectations.'
        }
      }
    },
    {
      key: 'EVENT_PUBLISHED',
      label: '📅 Event Published',
      endpoint: 'send-event-published',
      description: 'Sent when admin approves and publishes an event',
      testData: {
        eventData: {
          organizerEmail: '',
          organizerName: 'Test Event Organizer',
          eventTitle: 'React Advanced Workshop - Building Modern UIs',
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          eventType: 'Workshop',
          maxAttendees: 25,
          eventId: 'test-event-123'
        }
      }
    },
    {
      key: 'EVENT_REJECTED',
      label: '❌ Event Rejected',
      endpoint: 'send-event-rejected',
      description: 'Sent when admin rejects an event submission',
      testData: {
        eventData: {
          organizerEmail: '',
          organizerName: 'Test Event Organizer',
          eventTitle: 'React Advanced Workshop - Building Modern UIs',
          eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          eventId: 'test-event-123',
          rejectionReason: 'Event details are incomplete. Please provide more information about the agenda, prerequisites, and learning outcomes.'
        }
      }
    },
    {
      key: 'PROJECT_REVIEW_APPROVED',
      label: '🎉 Project Review Approved',
      endpoint: 'send-project-review-approved',
      description: 'Sent when admin approves completed project for badge assignment',
      testData: {
        completionData: {
          adminEmail: '',
          adminName: 'Test Project Owner',
          projectTitle: 'Test React E-commerce Application',
          teamSize: 4,
          groupId: 'test-group-123'
        }
      }
    },
    {
      key: 'PROJECT_REVIEW_REJECTED',
      label: '❌ Project Review Rejected',
      endpoint: 'send-project-review-rejected',
      description: 'Sent when admin rejects completed project review',
      testData: {
        completionData: {
          adminEmail: '',
          adminName: 'Test Project Owner',
          projectTitle: 'Test React E-commerce Application',
          teamSize: 4,
          groupId: 'test-group-123',
          rejectionReason: 'GitHub repository is not public. Please make your repository public and ensure "She Model Tech" is added as a collaborator before resubmitting.'
        }
      }
    },
    {
      key: 'APPLICATION_APPROVED',
      label: '🤝 Application Approved',
      endpoint: 'send-application-approved',
      description: 'Sent when project owner approves team member application',
      testData: {
        applicationData: {
          applicantEmail: '',
          applicantName: 'Test Developer',
          roleAppliedFor: 'Frontend Developer',
          applicationId: 'test-app-123'
        },
        projectData: {
          projectTitle: 'Test React E-commerce Application',
          contactName: 'Test Project Owner',
          contactEmail: 'owner@example.com',
          projectId: 'test-project-123',
          teamSize: 3,
          groupId: 'test-group-123'
        }
      }
    },
    {
      key: 'PROJECT_SUBMITTED_TO_ADMIN',
      label: '📋 Project Submitted to Admin',
      endpoint: 'send-project-submitted-admin',
      description: 'Sent to admins when project completion is submitted for review',
      testData: {
        projectData: {
          projectTitle: 'Test React E-commerce Application',
          contactName: 'Test Submitter',
          contactEmail: 'test-submitter@example.com',
          companyName: 'Test Company',
          projectType: 'Web Development',
          timeline: '3 months',
          experienceLevel: 'Intermediate',
          budget: '$5,000',
          projectDescription: 'A comprehensive e-commerce application built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment processing.'
        }
      }
    }
  ];

  const testSingleEmail = async (emailTest) => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      // Prepare test data with the test email
      let testData = { ...emailTest.testData };
      
      // Set the appropriate email field based on the test type
      if (emailTest.key === 'APPLICATION_APPROVED') {
        // Special handling for APPLICATION_APPROVED - set applicant email
        testData.applicationData.applicantEmail = testEmail;
      } else if (emailTest.key === 'PROJECT_SUBMITTED_TO_ADMIN') {
        // Special handling for PROJECT_SUBMITTED_TO_ADMIN - set contact email in nested projectData
        testData.projectData.contactEmail = testEmail;
      } else if (testData.projectData) {
        testData.projectData.contactEmail = testEmail;
      } else if (testData.eventData) {
        testData.eventData.organizerEmail = testEmail;
      } else if (testData.completionData) {
        testData.completionData.adminEmail = testEmail;
      } else if (testData.applicantEmail !== undefined) {
        testData.applicantEmail = testEmail;
      }

      console.log(`🧪 Testing ${emailTest.key} with data:`, testData);

      const response = await fetch(`/api/notifications/${emailTest.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      const testResult = {
        key: emailTest.key,
        label: emailTest.label,
        endpoint: emailTest.endpoint,
        success: result.success,
        duration: duration,
        timestamp: new Date().toISOString(),
        error: result.success ? null : result.error,
        testEmail: testEmail
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]); // Keep last 10 results

      if (result.success) {
        toast.success(`✅ ${emailTest.label} email sent successfully! (${duration}ms)`);
      } else {
        toast.error(`❌ ${emailTest.label} failed: ${result.error}`);
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`Email test error for ${emailTest.key}:`, error);
      
      const testResult = {
        key: emailTest.key,
        label: emailTest.label,
        endpoint: emailTest.endpoint,
        success: false,
        duration: duration,
        timestamp: new Date().toISOString(),
        error: error.message,
        testEmail: testEmail
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 9)]);
      toast.error(`❌ ${emailTest.label} failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testAllEmails = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    toast.info('🧪 Testing all email types... This may take a moment.');

    for (const emailTest of emailTests) {
      try {
        await testSingleEmail(emailTest);
        // Small delay between tests to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to test ${emailTest.key}:`, error);
      }
    }

    setIsLoading(false);
    toast.success('🎉 All email tests completed! Check your inbox.');
  };

  const clearResults = () => {
    setTestResults([]);
    toast.info('📊 Test results cleared');
  };

  return (
    <div className="space-y-8">
      
      {/* Email Testing Header */}
      <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-2xl p-6 border border-white/20">
        <h3 className="text-2xl font-bold text-white mb-4">🧪 Email System Testing</h3>
        <p className="text-gray-600 mb-6">Test all email notifications to verify functionality and templates</p>
        
        {/* Test Email Input */}
        <div className="mb-6">
          <label className="block text-orange-400 font-semibold mb-3">
            Test Email Address *
          </label>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="admin@yourcompany.com"
            className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all duration-300"
          />
          <p className="text-gray-400 text-sm mt-2">
            All test emails will be sent to this address. Use your own email to verify templates and functionality.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={testAllEmails}
            disabled={isLoading || !testEmail}
            className="bg-gradient-to-r from-pink-500 to-orange-600 hover:from-pink-500 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Testing All...
              </>
            ) : (
              <>
                🚀 Test All Email Types
              </>
            )}
          </button>
          
          <button
            onClick={clearResults}
            disabled={testResults.length === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:cursor-not-allowed"
          >
            🗑️ Clear Results
          </button>
        </div>
      </div>

      {/* Individual Email Tests */}
      <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-2xl p-6 border border-white/20">
        <h4 className="text-xl font-bold text-white mb-4">📧 Individual Email Tests</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {emailTests.map((emailTest) => (
            <div key={emailTest.key} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="mb-3">
                <h5 className="text-white font-semibold text-sm mb-1">{emailTest.label}</h5>
                <p className="text-gray-400 text-xs mb-2">{emailTest.description}</p>
                <code className="text-orange-400 text-xs bg-black/30 px-2 py-1 rounded">
                  {emailTest.endpoint}
                </code>
              </div>
              <button
                onClick={() => testSingleEmail(emailTest)}
                disabled={isLoading || !testEmail}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Testing...' : 'Test'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-2xl p-6 border border-white/20">
          <h4 className="text-xl font-bold text-white mb-4">📊 Test Results</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div
                key={`${result.key}-${result.timestamp}`}
                className={`p-4 rounded-xl border ${
                  result.success
                    ? 'bg-pink-500/10 border-pink-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className={`text-2xl mr-3 ${result.success ? 'text-pink-400' : 'text-red-400'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                    <div>
                      <h5 className="text-white font-semibold">{result.label}</h5>
                      <p className="text-gray-400 text-sm">
                        {new Date(result.timestamp).toLocaleTimeString()} • {result.duration}ms
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <code className="text-orange-400 text-xs bg-black/30 px-2 py-1 rounded">
                      {result.endpoint}
                    </code>
                  </div>
                </div>
                
                {result.error && (
                  <div className="mt-2 p-3 bg-red-900/20 rounded-lg">
                    <p className="text-red-300 text-sm font-mono">{result.error}</p>
                  </div>
                )}
                
                <div className="mt-2 text-gray-400 text-xs">
                  Sent to: {result.testEmail}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email System Status */}
      <div className="bg-gradient-to-br from-black/40 via-gray-900/40 to-black/40 rounded-2xl p-6 border border-white/20">
        <h4 className="text-xl font-bold text-white mb-4">📈 Email System Status</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {testResults.filter(r => r.success).length}
            </div>
            <div className="text-pink-500 font-semibold">Successful Tests</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {testResults.filter(r => !r.success).length}
            </div>
            <div className="text-red-300 font-semibold">Failed Tests</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {emailTests.length}
            </div>
            <div className="text-pink-500 font-semibold">Total Email Types</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <h5 className="text-orange-500 font-bold mb-2">💡 Testing Tips</h5>
          <ul className="text-orange-400 text-sm space-y-1">
            <li>• Check your spam/junk folder if emails don't arrive</li>
            <li>• Test with your actual email address to verify templates</li>
            <li>• Failed tests may indicate missing API endpoints or email configuration issues</li>
            <li>• Each email type serves a different purpose in the user workflow</li>
            <li>• Monitor test timing - slow emails may indicate server issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminEmailTester;
