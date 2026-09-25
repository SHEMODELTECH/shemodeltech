import React from 'react';

const TermsOfService = () => {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing or using She Model Tech ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. She Model Tech is a project-based platform for women in tech to collaborate, earn badges, and build their careers.' },
    { title: '2. Eligibility', content: 'You must be at least 18 years old to use She Model Tech. By creating an account, you represent that you are at least 18 and have the legal capacity to enter into these terms.' },
    { title: '3. User Accounts', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You agree to provide accurate information during registration and to keep it updated. Notify us immediately of any unauthorized use.' },
    { title: '4. Acceptable Use', content: 'You agree not to: post false, misleading, or fraudulent content; harass, abuse, or threaten other users; use the Platform for any illegal purpose; scrape or extract data from the Platform; impersonate another person; post spam or malware; or violate any applicable laws.' },
    { title: '5. User-Generated Content', content: 'You retain ownership of content you post. By posting, you grant She Model Tech a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content on the Platform. You are responsible for ensuring your content does not infringe on third-party rights.' },
    { title: '6. Projects and Collaboration', content: 'She Model Tech provides a platform to create, join, and manage collaborative projects. Projects can be free or paid. Both types contribute to TechTalent Badge progress upon completion. She Model Tech does not manage, guarantee, or enforce any project deliverables, timelines, or outcomes. Project owners are solely responsible for managing their teams.' },
    { title: '7. Project Payments and Transactions', content: 'She Model Tech does not collect, process, or hold any payment information. All financial transactions for paid projects are conducted directly between the project owner and team members. Payment methods are determined by mutual agreement. Each party is responsible for keeping receipts and records.' },
    { title: '8. Payment Confirmation and Disputes', content: 'For paid projects, all team members must confirm they have been paid before the project can be marked as completed and badges awarded. If a member has not been paid, they may file a dispute through the project page. Disputes are flagged to the project owner and She Model Tech administrators. The project cannot be finalized until all disputes are resolved. She Model Tech facilitates dispute visibility but is not a party to financial transactions and is not liable for non-payment. Dispute and confirmation history is recorded and visible in the Project Vault.' },
    { title: '9. TechTalent Badges', content: 'TechTalent Badges are earned automatically when a project is completed. Badge type is determined by the member\'s role in the project (e.g., developer earns TechDev, QA earns TechQA). Badge level (Novice, Associate, Advanced, Expert) is determined by the number of projects completed in that track. Project owners automatically receive a TechLeads badge and a certificate upon project completion. Badges are non-transferable and represent participation in specific project categories.' },
    { title: '10. Membership', content: 'She Model Tech is free to use. There are no membership tiers, no subscription fees, and no paid features - every member has access to projects, badges, the Talent Board, messaging, and community features at no cost. We do not charge members for access to the platform. Note that paid projects, where a company pays members for work, are agreements between those parties and are separate from platform access.' },
    { title: '11. Email Visibility', content: 'Members can control whether their email address is visible to other members through the Email Visibility toggle in Settings. When set to private, your email is hidden from member profiles and the directory. Other members can still contact you through the platform\'s messaging system.' },
    { title: '12. Listing and User Disclaimer', content: 'All projects and content posted on She Model Tech are user-generated and not independently verified. She Model Tech does not verify the identity, credentials, or legitimacy of any user. Users should exercise judgment, conduct due diligence, and independently verify details before engaging. All user information is securely stored and can be used to investigate fraud or misconduct.' },
    { title: '13. Privacy', content: 'Your use of She Model Tech is governed by our Privacy Policy. By using the Platform, you consent to the collection and use of your information as described therein.' },
    { title: '14. Intellectual Property', content: 'The She Model Tech name, logo, design, and all related content are the intellectual property of She Model Tech and its founder. You may not use, reproduce, or distribute any She Model Tech branding without prior written permission.' },
    { title: '15. Termination', content: 'She Model Tech reserves the right to suspend or terminate your account at any time for conduct that violates these Terms or is harmful to other users. You may delete your account at any time through Settings.' },
    { title: '16. Disclaimers', content: 'She Model Tech is provided "as is" without warranties of any kind. We do not warrant that the Platform will be uninterrupted, error-free, or secure. We are not responsible for losses arising from your use of the Platform, including project participation or financial transactions.' },
    { title: '17. Limitation of Liability', content: 'To the maximum extent permitted by law, She Model Tech shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including payment disputes, listing inaccuracies, or user misconduct.' },
    { title: '18. Changes to Terms', content: 'We may update these Terms from time to time. Continued use after changes are posted constitutes acceptance of the updated Terms.' },
    { title: '19. Contact', content: 'Questions about these Terms? Contact us at shemodeltech@gmail.com or through our Support page.' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: March 2026</p>
      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={i}>
            <h3 className="text-gray-900 font-semibold text-base mb-2">{s.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TermsOfService;
