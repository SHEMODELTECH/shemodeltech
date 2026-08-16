// src/App.jsx - UPDATED

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/AppShell';

// Critical path - keep eager
import Login from './Pages/auth/Login';
import ResetPassword from './Pages/auth/ResetPassword';
import AuthAction from './Pages/auth/AuthAction';
import Logout from './Pages/auth/Logout';
import AccountTypeSelection from './Pages/auth/AccountTypeSelection';
import LandingPage from './Pages/LandingPage';
import Onboarding from './Pages/Onboarding';
import CommunityPosts from './Pages/community/CommunityPosts';

// Lazy-load secondary pages
const UserDashboard = lazy(() => import('./Pages/user/dashboard'));
const UserProfile = lazy(() => import('./Pages/user/UserProfile'));
const SearchPage = lazy(() => import('./Pages/SearchPage'));
const FollowersFollowing = lazy(() => import('./Pages/user/FollowersFollowing'));
const NotificationsPage = lazy(() => import('./Pages/Notifications'));
const Messages = lazy(() => import('./Pages/Messages'));
const MembersDirectory = lazy(() => import('./Pages/MembersDirectory'));
const ApplyToLead = lazy(() => import('./Pages/cohort/ApplyToLead'));
const LeadApplicationReview = lazy(() => import('./Pages/admin/LeadApplicationReview'));
const HostCohort = lazy(() => import('./Pages/company/HostCohort'));
const CompanyCohortList = lazy(() => import('./Pages/company/CompanyCohortList'));
const CompanyCohortDetail = lazy(() => import('./Pages/company/CompanyCohortDetail'));
const Partner = lazy(() => import('./Pages/company/Partner'));
const SponsorDashboard = lazy(() => import('./Pages/company/SponsorDashboard'));
const ActivateAccess = lazy(() => import('./Pages/company/ActivateAccess'));
const ActivationQueue = lazy(() => import('./Pages/admin/ActivationQueue'));
const VerifyCertificate = lazy(() => import('./Pages/VerifyCertificate'));
const CohortManager = lazy(() => import('./Pages/admin/CohortManager'));
const Sponsor = lazy(() => import('./Pages/company/Sponsor'));
const SubmitPost = lazy(() => import('./Pages/community/SubmitPost'));
const SinglePost = lazy(() => import('./Pages/community/SinglePost'));
const About = lazy(() => import('./Pages/About'));
const Support = lazy(() => import('./Pages/Support'));
const TermsOfService = lazy(() => import('./Pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./Pages/PrivacyPolicy'));
const ProjectsListing = lazy(() => import('./Pages/projects/ProjectsListing'));
const ProjectSubmission = lazy(() => import('./Pages/projects/ProjectSubmission'));
const ProjectDetail = lazy(() => import('./Pages/projects/ProjectDetail'));
const ProjectSetup = lazy(() => import('./Pages/projects/ProjectSetup'));
const GenerateProject = lazy(() => import('./Pages/admin/GenerateProject'));
const AdminPanel = lazy(() => import('./Pages/admin/AdminPanel'));
const ProjectOwnerDashboard = lazy(() => import('./Pages/projects/ProjectOwnerDashboard'));
const DisputePage = lazy(() => import('./Pages/projects/DisputePage'));
const ProjectCompletion = lazy(() => import('./Pages/projects/ProjectCompletion'));
const MyProjects = lazy(() => import('./Pages/projects/MyProjects'));
const ProjectWorkspace = lazy(() => import('./Pages/projects/ProjectWorkspace'));
const MyWorkspaces = lazy(() => import('./Pages/projects/MyWorkspaces'));
const TalentBoard = lazy(() => import('./Pages/TalentBoard'));
const Jobs = lazy(() => import('./Pages/Jobs'));
const ProofWall = lazy(() => import('./Pages/ProofWall'));
const Foundations = lazy(() => import('./Pages/Foundations'));
const PostJobs = lazy(() => import('./Pages/PostJobs'));
const ProjectVault = lazy(() => import('./Pages/ProjectVault'));
const Settings = lazy(() => import('./Pages/Settings'));
const FollowList = lazy(() => import('./Pages/FollowList'));
const Account = lazy(() => import('./Pages/Account'));

try { require('./services/googleFormService'); } catch (e) {}

let ErrorBoundary;
try { ErrorBoundary = require('./components/ErrorBoundary').default; } catch (e) { ErrorBoundary = ({ children }) => children; }

const PageLoader = () => (
  <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div className="text-center px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6">
        <div className="w-full h-full rounded-xl shadow-2xl bg-blue-50 flex items-center justify-center border-2 border-blue-600">
          <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
      <div className="flex items-center justify-center space-x-2 mb-4 sm:mb-6">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div>
      <p className="text-gray-900 font-bold text-lg sm:text-xl mb-2">Loading...</p>
      <p className="text-gray-600 text-xs sm:text-sm">Just a moment</p>
    </div>
  </div>
);

const BasicProtectedRoute = ({ children, skipOnboardingCheck = false }) => {
  const { currentUser, loading, getUserData } = useAuth();
  const navigate = useNavigate();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (!loading && !currentUser) { navigate('/login'); return; }
    if (!loading && currentUser && !skipOnboardingCheck) {
      getUserData(currentUser.uid).then(userData => {
        if (userData && !userData.accountType) { navigate('/account-type', { replace: true }); }
        else if (userData && !userData.onboardingComplete) { navigate('/onboarding', { replace: true }); }
        else { setCheckingOnboarding(false); }
      }).catch(() => setCheckingOnboarding(false));
    } else if (!loading) { setCheckingOnboarding(false); }
  }, [loading, currentUser, navigate, skipOnboardingCheck, getUserData]);

  if (loading || checkingOnboarding) return <PageLoader />;
  if (!currentUser) return null;
  return children;
};

// Wrap a page in AppShell (sidebar layout) + auth protection
const SidebarRoute = ({ children }) => (
  <BasicProtectedRoute>
    <AppShell>{children}</AppShell>
  </BasicProtectedRoute>
);

// Home: logged-out visitors see the landing page; logged-in members go to their dashboard.
const HomeRoute = () => {
  const { currentUser, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return <LandingPage />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="w-full min-h-screen overflow-x-hidden">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public - no sidebar */}
                <Route path="/" element={<HomeRoute />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/action" element={<AuthAction />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<div className="min-h-screen bg-white"><div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16"><TermsOfService /></div></div>} />
                <Route path="/privacy" element={<div className="min-h-screen bg-white"><div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16"><PrivacyPolicy /></div></div>} />

                {/* Auth flow - no sidebar */}
                <Route path="/account-type" element={<BasicProtectedRoute skipOnboardingCheck={true}><AccountTypeSelection /></BasicProtectedRoute>} />
                <Route path="/onboarding" element={<BasicProtectedRoute skipOnboardingCheck={true}><Onboarding /></BasicProtectedRoute>} />

                {/* App pages - all wrapped in sidebar layout */}
                <Route path="/dashboard" element={<SidebarRoute><UserDashboard /></SidebarRoute>} />
                <Route path="/admin" element={<SidebarRoute><AdminPanel /></SidebarRoute>} />

                <Route path="/community" element={<Navigate to="/proof-wall" replace />} />
                <Route path="/search" element={<SidebarRoute><SearchPage /></SidebarRoute>} />
                <Route path="/proof-wall" element={<SidebarRoute><ProofWall /></SidebarRoute>} />
                <Route path="/foundations" element={<SidebarRoute><Foundations /></SidebarRoute>} />
                <Route path="/community/submit" element={<Navigate to="/proof-wall" replace />} />
                <Route path="/community/post/:postId" element={<Navigate to="/proof-wall" replace />} />
                <Route path="/post/:postId" element={<SidebarRoute><SinglePost /></SidebarRoute>} />

                <Route path="/projects" element={<SidebarRoute><ProjectsListing /></SidebarRoute>} />
                <Route path="/projects/generate" element={<SidebarRoute><GenerateProject /></SidebarRoute>} />
                <Route path="/projects/submit" element={<SidebarRoute><ProjectSubmission /></SidebarRoute>} />
                <Route path="/projects/:projectId/setup" element={<SidebarRoute><ProjectSetup /></SidebarRoute>} />
                <Route path="/projects/owner-dashboard" element={<SidebarRoute><ProjectOwnerDashboard /></SidebarRoute>} />
                <Route path="/projects/my-projects" element={<SidebarRoute><MyProjects /></SidebarRoute>} />
                <Route path="/projects/:projectId/complete" element={<SidebarRoute><ProjectCompletion /></SidebarRoute>} />
                <Route path="/projects/:projectId/workspace" element={<SidebarRoute><ProjectWorkspace /></SidebarRoute>} />
                <Route path="/projects/:projectId" element={<SidebarRoute><ProjectDetail /></SidebarRoute>} />
                <Route path="/my-workspaces" element={<SidebarRoute><MyWorkspaces /></SidebarRoute>} />

                <Route path="/talent-board" element={<SidebarRoute><TalentBoard /></SidebarRoute>} />
                <Route path="/project-vault" element={<SidebarRoute><ProjectVault /></SidebarRoute>} />
                <Route path="/disputes" element={<SidebarRoute><DisputePage /></SidebarRoute>} />
                <Route path="/disputes/:projectId" element={<SidebarRoute><DisputePage /></SidebarRoute>} />
                <Route path="/settings" element={<SidebarRoute><Settings /></SidebarRoute>} />
                {/* Legacy paid-membership URL - everything is free now. */}
                <Route path="/premium-success" element={<Navigate to="/dashboard" replace />} />
                {/* Cohort: apply to lead (ranked choices, reviewed by admin/editor) */}
                <Route path="/cohort/apply-to-lead" element={<SidebarRoute><ApplyToLead /></SidebarRoute>} />
                {/* Reviewer queue for lead applications (admin + editor) */}
                <Route path="/admin/lead-applications" element={<SidebarRoute><LeadApplicationReview /></SidebarRoute>} />
                {/* Company-hosted cohorts: company owns brief, team, timeline and pays members */}
                <Route path="/company/host-cohort" element={<SidebarRoute><HostCohort /></SidebarRoute>} />
                <Route path="/company-cohorts" element={<SidebarRoute><CompanyCohortList /></SidebarRoute>} />
                <Route path="/company-cohorts/:cohortId" element={<SidebarRoute><CompanyCohortDetail /></SidebarRoute>} />
                <Route path="/partner" element={<SidebarRoute><Partner /></SidebarRoute>} />
                <Route path="/sponsor/dashboard" element={<SidebarRoute><SponsorDashboard /></SidebarRoute>} />
                {/* Payment redirect lands here. Records a claim; grants nothing. */}
                <Route path="/partner/activate" element={<SidebarRoute><ActivateAccess /></SidebarRoute>} />
                <Route path="/admin/activations" element={<SidebarRoute><ActivationQueue /></SidebarRoute>} />
                {/* PUBLIC — no login. A recruiter must be able to check a
                    certificate in one click or verification is pointless. */}
                <Route path="/verify" element={<VerifyCertificate />} />
                <Route path="/verify/:certificateId" element={<VerifyCertificate />} />
                <Route path="/admin/cohorts" element={<SidebarRoute><CohortManager /></SidebarRoute>} />
                <Route path="/sponsor" element={<SidebarRoute><Sponsor /></SidebarRoute>} />
                <Route path="/my-connections" element={<Navigate to="/proof-wall" replace />} />
                <Route path="/account" element={<SidebarRoute><Account /></SidebarRoute>} />

                <Route path="/messages" element={<SidebarRoute><Messages /></SidebarRoute>} />
                <Route path="/notifications" element={<SidebarRoute><NotificationsPage /></SidebarRoute>} />
                <Route path="/support" element={<SidebarRoute><Support /></SidebarRoute>} />

                <Route path="/members" element={<Navigate to="/talent-board" replace />} />
                <Route path="/directory" element={<Navigate to="/talent-board" replace />} />
                <Route path="/members-directory" element={<Navigate to="/talent-board" replace />} />

                <Route path="/profile/:userEmail" element={<SidebarRoute><UserProfile /></SidebarRoute>} />
                <Route path="/profile/:userEmail/followers" element={<Navigate to="/proof-wall" replace />} />
                <Route path="/profile/:userEmail/following" element={<Navigate to="/proof-wall" replace />} />

                {/* Legacy redirects */}
                <Route path="/user/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/payment" element={<Navigate to="/dashboard" replace />} />
                <Route path="/jobs" element={<SidebarRoute><Jobs /></SidebarRoute>} />
                <Route path="/jobs/post" element={<SidebarRoute><PostJobs /></SidebarRoute>} />
                <Route path="/jobs/:jobId/edit" element={<SidebarRoute><PostJobs /></SidebarRoute>} />
                <Route path="/housing" element={<Navigate to="/dashboard" replace />} />
                <Route path="/finance" element={<Navigate to="/dashboard" replace />} />
                <Route path="/banking" element={<Navigate to="/dashboard" replace />} />
                <Route path="/hub" element={<Navigate to="/projects" replace />} />

                {/* 404 */}
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full text-center bg-white rounded-2xl p-8 shadow-md">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">404</span>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h1>
                      <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
                      <div className="space-y-3">
                        <button onClick={() => window.location.href = '/dashboard'} className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">Go to Dashboard</button>
                        <button onClick={() => window.history.back()} className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl border border-gray-300 transition-all">Go Back</button>
                      </div>
                    </div>
                  </div>
                } />
              </Routes>
            </Suspense>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="mt-4"
            toastClassName="text-xs sm:text-sm"
            toastStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.6rem',
              color: '#111827',
              margin: '0.5rem',
              minHeight: '48px',
              padding: '0.5rem 0.75rem',
              maxWidth: '340px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
