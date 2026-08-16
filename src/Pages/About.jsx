import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1">
            <img src="/Images/512X512.png" alt="She Model Tech" className="w-10 h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/support" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Support
            </Link>
            <Link
              to="/login"
              className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gray-900">About</span>{' '}
            <span className="text-pink-600">She Model Tech</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            She Model Tech is where women build real tech experience. You join a team, ship a real
            product, and earn verified badges that show employers exactly what you built.
          </p>
        </section>

        {/* The path: Ascend Achieve Advance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <span className="text-pink-600">Ascend</span>,{' '}
            <span className="text-orange-500">Achieve</span>,{' '}
            <span className="text-gray-900">Advance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center mb-3">
                <span className="text-pink-600 font-extrabold">1</span>
              </div>
              <h3 className="text-pink-600 font-bold text-lg mb-2">Ascend</h3>
              <p className="text-gray-500 text-sm">
                Find your path. Try real roles on real projects and see where your strengths
                actually are.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center mb-3">
                <span className="text-orange-500 font-extrabold">2</span>
              </div>
              <h3 className="text-orange-500 font-bold text-lg mb-2">Achieve</h3>
              <p className="text-gray-500 text-sm">
                Build the proof. Complete projects with your team and earn verified badges at every
                level.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                <span className="text-gray-900 font-extrabold">3</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Advance</h3>
              <p className="text-gray-500 text-sm">
                Get hired. Expert badges carry commit-backed evidence employers can verify
                themselves.
              </p>
            </div>
          </div>
        </section>

        {/* For Startups and Organisations */}
        <section className="mb-12">
          <div className="bg-pink-50 rounded-xl border border-pink-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              For Startups and Organisations
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Sponsor a cohort and fund a team of women through eight weeks of building, or host
              your own paid project and hire directly from women who have already earned a verified
              badge with us.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Real-World Projects',
                desc: 'Join or post collaborative projects and build real products with real teams across development, QA, architecture, security, and more - from start to finish.',
              },
              {
                title: 'TechTalent Badges',
                desc: 'Earn verified credentials across 6 skill tracks with 4 progression levels each. Badges are awarded based on your role and contribution in completed projects.',
              },
              {
                title: 'Talent Board',
                desc: 'Your verified work builds a public profile, badges, project history, and clear proof of what you build, all doing the talking for you.',
              },
              {
                title: 'Project Workspaces',
                desc: 'Every project gets a dedicated workspace with a discussion forum, resource sharing, and team directory - all logged for accountability.',
              },
              {
                title: 'Community & Messaging',
                desc: 'Post updates, follow professionals, and message anyone on the platform. Build a network through collaboration, not just connections.',
              },
              {
                title: 'Verified by Contribution',
                desc: 'Project owners evaluate each member, and badges record the role and contribution level - so the proof on your profile is honest and verified.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-gray-900 font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-gray-500 mb-4">Ready to start building your tech career?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login"
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Join She Model Tech
            </Link>
            <button
              onClick={() => navigate('/support')}
              className="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-all"
            >
              Contact Support
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <Link to="/terms" className="hover:text-pink-600">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-pink-600">
              Privacy
            </Link>
            <Link to="/support" className="hover:text-pink-600">
              Support
            </Link>
          </div>
          <p className="text-gray-400 text-xs">
            {new Date().getFullYear()} She Model Tech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
