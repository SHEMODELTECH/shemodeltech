// src/components/MentorCourseStaffTools.jsx
// Under every mentor course in Learning: staff tools.
// Admins: Edit and Remove. Editors: Edit.
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { removePublishedCourse } from '../utils/learningPublished';

// One lookup per session for the viewer's role.
let roleCache = { uid: null, role: null };
export const useStaffRole = () => {
  const { currentUser } = useAuth();
  const [role, setRole] = useState(roleCache.uid === currentUser?.uid ? roleCache.role : null);
  useEffect(() => {
    if (!currentUser) return;
    if (roleCache.uid === currentUser.uid) {
      setRole(roleCache.role);
      return;
    }
    getDoc(doc(db, 'users', currentUser.uid))
      .then((s) => {
        const r = s.exists() ? s.data().role || 'member' : 'member';
        roleCache = { uid: currentUser.uid, role: r };
        setRole(r);
      })
      .catch(() => {});
  }, [currentUser]);
  return role;
};

const MentorCourseStaffTools = ({ course, onRemoved }) => {
  const navigate = useNavigate();
  const role = useStaffRole();
  const [busy, setBusy] = useState(false);
  if (!course?.isMentorCourse || !['admin', 'editor'].includes(role)) return null;

  const edit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!course.sourceTeacherId) return toast.error('The Mentor Hub copy of this course no longer exists, so it can only be removed.');
    const src = await getDoc(doc(db, 'teacher_courses', course.sourceTeacherId)).catch(() => null);
    if (!src || !src.exists()) return toast.error('The Mentor Hub copy of this course no longer exists, so it can only be removed.');
    navigate(`/teacher/${course.sourceTeacherId}`);
  };
  const remove = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Remove "${course.title}" from Learning? Learners will no longer see it.`)) return;
    setBusy(true);
    try {
      await removePublishedCourse(course.publishedId);
      toast.success('Removed from Learning.');
      if (onRemoved) onRemoved(course);
    } catch (err) {
      toast.error('Could not remove it.');
    }
    setBusy(false);
  };

  return (
    <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={edit} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50">Edit</button>
      {role === 'admin' && (
        <button type="button" onClick={remove} disabled={busy} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50">
          {busy ? 'Removing…' : 'Remove'}
        </button>
      )}
    </div>
  );
};

export default MentorCourseStaffTools;
