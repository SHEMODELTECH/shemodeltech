import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';
import Footer from '../components/Footer';


const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Shared site navbar - same menu and style as every other page */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gray-900">About</span>{' '}
            <span className="text-pink-600">She Model Tech</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-4">
            She Model Tech is where women build real tech careers by joining teams, shipping real
            products, and earning verified badges that showcase what they built.
          </p>
        </section>

        {/* The path: Ascend Achieve Advance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <span className="text-pink-600">Ascend</span>{' '}
            <span className="text-amber-500">Achieve</span>{' '}
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
              <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                <span className="text-gray-900 font-extrabold">2</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Achieve</h3>
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
                Grow your career. Level up from Novice to Expert and lead teams.
              </p>
            </div>
          </div>
        </section>

        {/* Who we are: registered nonprofit and mission */}
        <section className="mb-14" aria-labelledby="who-h">
          <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-pink-50 p-6 sm:p-8">
            <h2 id="who-h" className="text-2xl font-bold text-gray-900">Who we are</h2>
            <p className="text-gray-700 text-lg leading-relaxed mt-3">
              <strong className="text-gray-900">SHE MODEL TECH Inc.</strong> is a registered 501(c)(3) non-profit
              organization with the mission to empower women in tech through mentorship, IT skills training, leadership
              development, and networking opportunities.
            </p>
          </div>

          {/* The four parts of the mission, and where they live on the platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {[
              ['Mentorship', 'Experienced mentors create courses in the Mentor Hub.', 'bg-pink-50 text-pink-700 border-pink-100'],
              ['IT skills training', 'Hands-on, real-world projects built in teams, plus free courses in She Model Tech Learning with certificates of completion.', 'bg-pink-50 text-pink-700 border-pink-100'],
              ['Leadership development', 'Lead a real project team, from planning to delivery, and earn a leadership badge.', 'bg-amber-50 text-amber-700 border-amber-100'],
              ['Networking', 'Build connections on the Proof Wall and Talent Board, and through real teamwork.', 'bg-green-50 text-green-700 border-green-100'],
            ].map(([t, d, c]) => (
              <div key={t} className="bg-white rounded-xl border border-gray-200 p-5">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${c}`}>{t}</span>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For companies */}
        <section className="mb-12">
          <div className="bg-pink-50 rounded-xl border border-pink-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              For companies
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Support our mission by funding a cohort, and hire women with verified badges through job posts and
              the Talent Board with a company tier.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'She Model Tech Learning',
                desc: 'Free, hands-on courses across six tech tracks, with interactive labs, video lessons, and a certificate of completion for every course you finish.',
              },
              {
                title: 'Mentorship',
                desc: 'Learn from mentors who create courses and guides for our tracks. Experienced professionals can apply to become a mentor.',
              },
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
      <Footer />
    </div>
  );
};

export default About;
