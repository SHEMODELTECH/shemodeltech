import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';

// The founder's photo from her website; her initials if it can't load.
const FounderPhoto = () => {
  const [failed, setFailed] = React.useState(false);
  if (failed) {
    return (
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-pink-100 text-pink-800 text-3xl font-bold flex items-center justify-center shrink-0" aria-hidden="true">
        YA
      </div>
    );
  }
  return (
    <img
      src="https://www.opeyemitaiwoadeniran.com/images/yemi-portrait.webp"
      alt="Opeyemi (Yemi) Adeniran, founder of She Model Tech"
      onError={() => setFailed(true)}
      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover shrink-0 border-4 border-pink-50"
    />
  );
};

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

        {/* Who we are: registered nonprofit and mission */}
        <section className="mb-14" aria-labelledby="who-h">
          <div className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 via-white to-indigo-50 p-6 sm:p-8">
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
              ['Mentorship', 'Experienced mentors create courses and guide learners through the Mentor Hub.', 'bg-indigo-50 text-indigo-700 border-indigo-100'],
              ['IT skills training', 'Free, hands-on courses in She Model Tech Learning, with certificates of completion.', 'bg-pink-50 text-pink-700 border-pink-100'],
              ['Leadership development', 'Lead a real project team, from planning to delivery, and earn a leadership badge.', 'bg-orange-50 text-orange-700 border-orange-100'],
              ['Networking', 'Build connections on the Proof Wall and Talent Board, and through real teamwork.', 'bg-emerald-50 text-emerald-700 border-emerald-100'],
            ].map(([t, d, c]) => (
              <div key={t} className="bg-white rounded-xl border border-gray-200 p-5">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${c}`}>{t}</span>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* The path: Ascend Achieve Advance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <span className="text-pink-600">Ascend</span>{' '}
            <span className="text-orange-500">Achieve</span>{' '}
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

        {/* Meet the founder */}
        <section className="mb-14" aria-labelledby="founder-h">
          <h2 id="founder-h" className="text-2xl font-bold text-gray-900 mb-5">Meet the founder</h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center">
            <FounderPhoto />
            <div className="min-w-0">
              <p className="text-xl font-bold text-gray-900">Opeyemi (Yemi) Adeniran</p>
              <p className="text-pink-700 font-semibold text-sm mt-0.5">Founder, She Model Tech</p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Yemi is a PhD researcher in AI and the founder of Morgan TechFest. She built She Model Tech to help women
                learn, build, and lead in technology, so they don’t just enter the field but help shape its future.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <a href="https://www.opeyemitaiwoadeniran.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-pink-700 hover:underline">Visit her website</a>
              </div>
            </div>
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
            <Link to="/learning" className="hover:text-pink-600">
              Learning
            </Link>
            <Link to="/summit" className="hover:text-pink-600">
              Summit
            </Link>
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
          <div className="flex flex-col items-center sm:items-end gap-2">
            <SocialLinks />
            <p className="text-gray-400 text-xs text-center sm:text-right">
              {new Date().getFullYear()} SHE MODEL TECH Inc., a registered 501(c)(3) nonprofit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
