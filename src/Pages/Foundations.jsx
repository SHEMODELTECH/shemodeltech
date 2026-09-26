// src/Pages/Foundations.jsx
// Foundations moved to She Model Tech Learning (/learning). This keeps old
// links working: /foundations?track=X&course=Y&part=N goes to the same place.
import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const Foundations = () => {
  const [params] = useSearchParams();
  const track = params.get('track');
  const course = params.get('course');
  const part = params.get('part');
  let to = '/learning';
  if (track && course) to = `/learning/${track}/${course}/learn${part ? `?part=${part}` : ''}`;
  return <Navigate to={to} replace />;
};

export default Foundations;
