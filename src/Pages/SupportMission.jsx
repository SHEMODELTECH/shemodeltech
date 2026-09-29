// src/Pages/SupportMission.jsx
// "Support our mission": fund a cohort. A gift to She Model Tech, a 501(c)(3).
// Companies that fund a cohort are thanked with their logo; sponsors don't
// choose projects or members.
import React from 'react';
import { Link } from 'react-router-dom';
import { useFeatures } from '../utils/features';
import SponsorsStrip from '../components/SponsorsStrip';
import Navbar from '../components/Navbar';
import { DEDUCTIBLE_LINE } from '../config/nonprofit';

const DONATION_LINK = process.env.REACT_APP_DONATION_LINK || null;
const TEAM_EMAIL = 'shemodeltech@gmail.com';

const SupportMission = () => {
  const features = useFeatures();
  const canGiveOnline = features.donations && DONATION_LINK;
  return (
    <div className="bg-[#FDF4F8] min-h-screen">
      <Navbar />
      <section className="max-w-4xl mx-auto px-6 pt-14 pb-10">
        <p className="text-sm font-bold uppercase tracking-widest text-pink-700">Support our mission</p>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2 tracking-tight">Fund a cohort</h1>
        <p className="text-lg text-gray-700 mt-4 max-w-2xl">
          She Model Tech empowers women in tech through real-world projects. A cohort is a group of teams that build real
          products together, guided by leads and mentors, and earn verified badges. Funding a cohort makes it possible.
        </p>
        <div className="flex flex-wrap gap-3 mt-7">
          {canGiveOnline ? (
            <a href={DONATION_LINK} target="_blank" rel="noopener noreferrer" className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl">
              Fund a cohort
            </a>
          ) : (
            <a href={`mailto:${TEAM_EMAIL}?subject=${encodeURIComponent('Funding a She Model Tech cohort')}`} className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-6 py-3 rounded-xl">
              Contact us to fund a cohort
            </a>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-10 grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-pink-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900">What your gift funds</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Pay for members on paid cohort projects, so women earn while they learn</li>
            <li>Laptops and internet access for women who need them</li>
            <li>Certifications, awarded on clear and fair criteria</li>
            <li>The Summit, and the platform itself</li>
          </ul>
        </div>
        <div className="bg-white border border-pink-100 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-900">How we thank sponsors</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 list-disc pl-5">
            <li>Companies that fund a cohort are thanked with their logo and name in <strong>Thank you to our sponsors</strong> on She Model Tech.</li>
            <li>You’ll receive a receipt for your records. {DEDUCTIBLE_LINE}</li>
            <li>Sponsors support our programs; She Model Tech designs and runs every cohort and chooses the teams.</li>
          </ul>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 pb-16">
        <SponsorsStrip />
        <p className="text-sm text-gray-600 mt-6 text-center">
          {DEDUCTIBLE_LINE} Donors outside the United States should check their own country’s rules.
        </p>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Hiring? Companies post jobs and browse verified talent through our <Link to="/premium" className="text-pink-700 font-semibold hover:underline">company tiers</Link>.
        </p>
      </section>
    </div>
  );
};

export default SupportMission;
