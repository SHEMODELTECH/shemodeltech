// src/Pages/learning/LearningManage.jsx
// Learning → Manage (admins and editors): the staff tools for Learning in one
// place, under the Learning tabs, instead of the Admin menu.
//   Courses · Learners · Mentors · Course feedback
import React from 'react';
import LearningLayout from './LearningLayout';
import { ManageCourses } from './ManageCourses';
import AdminPanel from '../admin/AdminPanel';
import { ManagePills, StaffGate } from '../../components/SectionTabs';

const SECTIONS = [
  { key: 'courses', to: '/learning/manage', label: 'Courses', exact: true },
  { key: 'learners', to: '/learning/manage/learners', label: 'Learners', only: 'learners' },
  { key: 'mentors', to: '/learning/manage/mentors', label: 'Mentors', only: 'teachers' },
  { key: 'feedback', to: '/learning/manage/feedback', label: 'Course feedback', only: 'coursefeedback' },
];

const LearningManage = ({ section = 'courses' }) => {
  const current = SECTIONS.find((s) => s.key === section) || SECTIONS[0];
  return (
    <LearningLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 box-content py-6 pb-12">
        <StaffGate>
          <ManagePills label="Manage Learning" items={SECTIONS} />
          {current.only ? <AdminPanel key={current.only} only={current.only} bare /> : <ManageCourses embedded />}
        </StaffGate>
      </div>
    </LearningLayout>
  );
};

export default LearningManage;
