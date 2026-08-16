import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import TechMO from '../Images/TechMO.png';
import TechQA from '../Images/TechQA.png';
import TechDev from '../Images/TechDev.png';
import TechLeads from '../Images/TechLeads.png';
import TechArchs from '../Images/TechArchs.png';
import TechGuard from '../Images/TechGuard.png';

const About = () => {
  const navigate = useNavigate();

  const badges = [
    { name: 'TechPO', img: TechMO, label: 'Product / Project Owner' },
    { name: 'TechQA', img: TechQA, label: 'Quality Assurance' },
    { name: 'TechDev', img: TechDev, label: 'Development' },
    { name: 'TechLeads', img: TechLeads, label: 'Non-Technical Roles' },
    { name: 'TechArchs', img: TechArchs, label: 'Low/No-Code Developer' },
    { name: 'TechGuard', img: TechGuard, label: 'Cybersecurity' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1">
            <img src="/Images/512X512.png" alt="She Model Tech" className="w-10 h-10" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/support" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Support</Link>
            <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">Get Started</Link>
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
            SHE MODEL TECH is a collaborative tech talent development platform where individuals build in-demand technology skills by working together on real-world projects. Through cross-functional collaboration, members gain practical experience, discover the right career path in tech, and develop the expertise needed to thrive in today's technology industry.
          </p>
        
        </section>

        {/* The path: Ascend Achieve Advance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <span className="text-pink-600">Ascend</span>, <span className="text-orange-500">Achieve</span>, <span className="text-gray-900">Advance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center mb-3">
                <span className="text-pink-600 font-extrabold">1</span>
              </div>
              <h3 className="text-pink-600 font-bold text-lg mb-2">Ascend</h3>
              <p className="text-gray-500 text-sm">Start your journey in tech. Whether you're discovering your path, switching careers, or beginning a new journey in technology, SHE MODEL TECH helps you explore different career paths by collaborating on real-world projects. Through hands-on experience in different roles, you can quickly identify where your interests, strengths, and potential align.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center mb-3">
                <span className="text-orange-500 font-extrabold">2</span>
              </div>
              <h3 className="text-orange-500 font-bold text-lg mb-2">Achieve</h3>
              <p className="text-gray-500 text-sm">Build your skills through collaboration. Track your progress as you complete real-world projects and earn verified badges that recognize your growth at every stage. As you advance from one level to the next, you build practical experience, strengthen your confidence, and grow through meaningful collaboration with peers on real-world projects.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                <span className="text-gray-900 font-extrabold">3</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Advance</h3>
              <p className="text-gray-500 text-sm">Earn recognition for your expertise. Expert badges are awarded after successfully completing a defined number of real-world projects within a specific field. These achievements showcase your verified experience and demonstrate your capabilities to employers, startups, organizations, and clients, both within and beyond the SHE MODEL TECH ecosystem.</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mb-12">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower the next generation of technology professionals by making collaboration the foundation of learning, innovation, and career development.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="mb-12">
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the world's leading collaborative platform where aspiring and experienced technology professionals learn, build, innovate, and grow together while solving meaningful real-world problems.
            </p>
          </div>
        </section>

        {/* For Startups and Organisations */}
        <section className="mb-12">
          <div className="bg-pink-50 rounded-xl border border-pink-100 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">For Startups and Organisations</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              SHE MODEL TECH also connects startups and organisations with emerging tech talent ready to contribute to real-world projects. Instead of building teams from scratch, organisations can collaborate with skilled individuals to accelerate innovation, validate ideas, develop products, and solve real business challenges.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Everyone here is verified by the work they have actually shipped, so you hire on evidence, not on resumes. Browse the Talent Board, see real project history and verified badges, and reach out to the people whose proof matches what you need.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You can also post paid projects and build directly from our talent pool. Bring real work to teams that are ready to deliver it, across development, QA, architecture, security, and product, and let their contribution on your project speak for itself.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Real-World Projects', desc: 'Join or post collaborative projects and build real products with real teams across development, QA, architecture, security, and more - from start to finish.' },
              { title: 'TechTalent Badges', desc: 'Earn verified credentials across 6 skill tracks with 4 progression levels each. Badges are awarded based on your role and contribution in completed projects.' },
              { title: 'Talent Board', desc: 'Your verified work builds a public profile, badges, project history, and clear proof of what you build, all doing the talking for you.' },
              { title: 'Project Workspaces', desc: 'Every project gets a dedicated workspace with a discussion forum, resource sharing, and team directory - all logged for accountability.' },
              { title: 'Community & Messaging', desc: 'Post updates, follow professionals, and message anyone on the platform. Build a network through collaboration, not just connections.' },
              { title: 'Verified by Contribution', desc: 'Project owners evaluate each member, and badges record the role and contribution level - so the proof on your profile is honest and verified.' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-gray-900 font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Badge Tracks */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">6 Skill Tracks</h2>
          <p className="text-gray-500 text-sm mb-6">Each track has 4 levels: Novice, Associate, Advanced, Expert. Badges are earned by completing real projects in that role.</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {badges.map((b, i) => (
              <div key={i} className="text-center">
                <img src={b.img} alt={b.name} className="w-14 h-14 mx-auto mb-2" />
                <p className="text-gray-700 text-xs font-semibold">{b.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mb-12 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              { num: '1', title: 'Sign up and build your profile', desc: 'Sign in with Google, pick your skill track, and set your experience level. Takes under a minute.' },
              { num: '2', title: 'Join or post a project', desc: 'Browse open projects and apply with your portfolio and LinkedIn. Or post your own project and build a team.' },
              { num: '3', title: 'Collaborate in workspaces', desc: 'Once approved, access the project workspace. Discuss in the forum, share resources, and coordinate with your team.' },
              { num: '4', title: 'Complete and earn badges', desc: 'When the project is done, the owner evaluates the team. Badges are awarded based on your role and contribution, building a verified portfolio of proven work.' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">{step.num}</div>
                <div>
                  <h3 className="text-gray-900 font-semibold text-base">{step.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <p className="text-gray-500 mb-4">Ready to start building your tech career?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/login" className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-all">
              Join She Model Tech
            </Link>
            <button onClick={() => navigate('/support')} className="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-lg hover:bg-gray-50 transition-all">
              Contact Support
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <Link to="/terms" className="hover:text-pink-600">Terms</Link>
            <Link to="/privacy" className="hover:text-pink-600">Privacy</Link>
            <Link to="/support" className="hover:text-pink-600">Support</Link>
          </div>
          <p className="text-gray-400 text-xs">{new Date().getFullYear()} She Model Tech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
