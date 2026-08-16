import React from 'react';

const PrivacyPolicy = () => {
  const sections = [
    { title: '1. Information We Collect', content: 'We collect information you provide when you create an account, including your name, email address, specialization, experience level, skill track, location, LinkedIn URL, GitHub URL, and portfolio URL. We also collect information about your activity on the Platform, including projects, posts, badges earned, and interactions. We use Google Authentication for sign-in, which provides us with your Google profile information.' },
    { title: '2. How We Use Your Information', content: 'We use your information to: provide and improve the Platform; personalize your experience; display your profile to other members; facilitate project collaboration and badge tracking; send notifications about project activity, payment confirmations, and disputes; analyze usage patterns; and communicate important Platform updates.' },
    { title: '3. Profile and Email Visibility', content: 'Your profile information (name, skill track, experience level, location) is visible to other authenticated members. Your email address visibility is controlled by you through the Email Visibility toggle in Settings. When set to private, your email is hidden from other members. When set to public, other members can view and copy your email from your profile.' },
    { title: '4. Project and Collaboration Data', content: 'When you create or join projects, we store project details, team roles, applications, workspace data, and completion records. For paid projects, we store agreed payment amounts and payment confirmation status (confirmed, pending, or disputed) but do not collect or store any actual payment credentials or financial account information.' },
    { title: '5. Payment Confirmation and Dispute Records', content: 'For paid projects, we record whether each member has confirmed payment receipt or filed a dispute. Dispute and confirmation history (including member name, action taken, and timestamp) is stored on the project record and visible in the Project Vault. This data may be used by administrators to review disputes and by project owners to track payment status.' },
    { title: '6. TechTalent Badges and Certificates', content: 'We store information about badges earned through project completion, including badge type, level, category, awarding project, contribution rating, and date awarded. Project owner certificates include project title, team size, and completion date. Badge and certificate data is displayed on your profile and visible to other members. Badge data cannot be edited or deleted by users.' },
    { title: '7. Messaging Data', content: 'Messages sent through the Platform are stored to enable conversations between members. Message content is only visible to the participants in the conversation.' },
    { title: '8. Data Storage and Security', content: 'Your data is stored securely using Google Cloud infrastructure with encrypted connections and secure authentication. We implement industry-standard security measures. However, no method of internet transmission is 100% secure, and we cannot guarantee absolute security.' },
    { title: '9. Information Sharing', content: 'We do not sell your personal information to third parties. Your profile information is visible to authenticated members as described above. We may share anonymized, aggregated data for analytical purposes. We may share user information with law enforcement if required by law.' },
    { title: '10. Fraud Prevention', content: 'All user information, including profile data, project history, payment confirmation records, dispute history, and activity logs, may be used to investigate reports of fraud, misconduct, non-payment, or Terms of Service violations.' },
    { title: '11. Cookies and Tracking', content: 'She Model Tech uses essential cookies for authentication and session management. We may use analytics tools to understand Platform usage. We do not use tracking cookies for advertising.' },
    { title: '12. Third-Party Services', content: 'She Model Tech integrates with Google Authentication and Google Cloud services. These services have their own privacy policies. We encourage you to review them.' },
    { title: '13. Your Rights', content: 'You have the right to: access, update, or delete your personal information through Settings; control your email visibility; delete your account; and opt out of non-essential communications. To exercise these rights, visit Settings or contact Support.' },
    { title: '14. Data Retention', content: 'We retain your information for as long as your account is active. If you delete your account, your personal data will be removed within a reasonable timeframe. We may retain anonymized data and project/dispute records as required by law.' },
    { title: '15. Children\'s Privacy', content: 'She Model Tech is not intended for users under 18. We do not knowingly collect information from children under 18.' },
    { title: '16. Changes to This Policy', content: 'We may update this Privacy Policy from time to time. Continued use after changes are posted constitutes acceptance.' },
    { title: '17. Contact Us', content: 'Questions about this Privacy Policy? Contact us at shemodeltech@gmail.com or through our Support page.' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
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

export default PrivacyPolicy;
