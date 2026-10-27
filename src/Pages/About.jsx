import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SocialLinks from '../components/SocialLinks';
import Footer from '../components/Footer';


const About = () => {

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
            She Model Tech helps you build a tech career, whether you want a tech role or a company of
            your own. You learn, build real products in a team, and earn verified badges that show
            what you can do.
          </p>
        </section>

        {/* The path: Ascend Achieve Advance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            <span className="text-gray-900">Ascend</span>{' '}
            <span className="text-pink-600">Achieve</span>{' '}
            <span className="text-gray-900">Advance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                <span className="text-gray-900 font-extrabold">1</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-2">Ascend</h3>
              <p className="text-gray-500 text-sm">
                Find your path. Try real roles on real projects and see where your strengths
                actually are.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center mb-3">
                <span className="text-pink-600 font-extrabold">2</span>
              </div>
              <h3 className="text-pink-600 font-bold text-lg mb-2">Achieve</h3>
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
                Grow your career. Let your verified badges speak for you, lead teams, or pitch your own idea as a founder.
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
              ['Leadership development', 'Lead a project team from planning to delivery and earn a leadership badge, or pitch your idea and lead your own team as a founder.', 'bg-gray-50 text-gray-800 border-gray-200'],
              ['Networking', 'Build connections on the Proof Wall and Talent Board, and through real teamwork.', 'bg-pink-50 text-pink-700 border-pink-100'],
            ].map(([t, d, c]) => (
              <div key={t} className="bg-white rounded-xl border border-gray-200 p-5">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${c}`}>{t}</span>
                <p className="text-gray-600 text-sm mt-3 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join us: three ways to be part of She Model Tech */}
        <section className="mb-14" aria-labelledby="join-h">
          <h2 id="join-h" className="text-2xl font-bold text-gray-900">Be part of She Model Tech</h2>
          <p className="text-gray-600 mt-2 mb-6">There are three ways to join us in helping women learn, build, and lead in technology.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              ['Become a mentor', 'Share what you know. Create courses for our learners and help others build real skills.', '/teach', 'Become a mentor'],
              ['Join the team', 'Volunteer a few hours a week in communications, community, partnerships, programs, and more.', '/team', 'See open roles'],
              ['Partner with us', 'Fund a cohort and help more women build real products, as a company or as an individual.', '/support-our-mission', 'Support our mission'],
            ].map(([t, d, to, cta]) => (
              <Link key={t} to={to} className="group bg-white rounded-xl border border-gray-200 p-5 hover:border-pink-300 transition-colors flex flex-col">
                <h3 className="font-bold text-gray-900 text-lg">{t}</h3>
                <p className="text-gray-600 text-sm mt-2 leading-relaxed flex-1">{d}</p>
                <span className="mt-4 text-sm font-semibold text-pink-700 group-hover:underline">{cta} →</span>
              </Link>
            ))}
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
                desc: 'Join or lead team projects in She Model Tech cohorts, and build real products across development, QA, low/no-code, security, and more, from start to finish.',
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
                title: 'Founders',
                desc: 'Pitch your idea at She Model Tech Conference for prize money, and build a team of members with verified skills. Selected founders may also pitch at our partner organizations’ events.',
              },
              {
                title: 'Events',
                desc: 'Workshops, tech talks, conferences, and demo days, all online. Members 18 and over can host their own events too.',
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
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;
