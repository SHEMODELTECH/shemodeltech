// src/components/BuiltInCourseStaffTools.jsx
// Under every She Model Tech (built-in) course: Edit and Remove, for admins and editors.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { setCourseHidden, startCourseOverrides, subscribeOverrides } from '../utils/courseOverrides';
import { useStaffRole } from './MentorCourseStaffTools';

// Re-render when staff edits change (and start listening the first time).
export const useCourseOverridesVersion = () => {
  const [v, setV] = useState(0);
  useEffect(() => {
    startCourseOverrides();
    return subscribeOverrides(setV);
  }, []);
  return v;
};

const BuiltInCourseStaffTools = ({ course, track, onRemoved }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const role = useStaffRole();
  const [busy, setBusy] = useState(false);
  if (!course || course.isMentorCourse || !['admin', 'editor'].includes(role)) return null;
  const t = track || course.track;

  const edit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/learning/manage/${t}/${course.slug}`);
  };
  const remove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Remove "${course.title}" from Learning? Learners will no longer see it. You can restore it later from Learning → Manage courses.`)) return;
    setBusy(true);
    try {
      await setCourseHidden(t, course.slug, true, currentUser, course.title);
      toast.success('Removed from Learning. You can restore it from Manage courses.');
      if (onRemoved) onRemoved(course);
    } catch (err) {
      toast.error('Could not remove it.');
    }
    setBusy(false);
  };

  return (
    <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={edit} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">Edit</button>
      <button type="button" onClick={remove} disabled={busy} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50">
        {busy ? 'Removing…' : 'Remove'}
      </button>
    </div>
  );
};

export default BuiltInCourseStaffTools;
