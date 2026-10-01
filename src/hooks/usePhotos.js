// src/hooks/usePhotos.js
// Fill in profile photos that weren't saved with a reaction or comment.
import { useEffect, useState } from 'react';
import { fetchPhotos } from '../utils/updateSocial';

export const usePhotos = (uids, saved = {}) => {
  const key = (uids || []).join(',');
  const [found, setFound] = useState({});
  useEffect(() => {
    const need = (uids || []).filter((u) => !saved?.[u]);
    if (!need.length) return;
    let alive = true;
    fetchPhotos(need).then((m) => { if (alive) setFound(m); }).catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (u) => saved?.[u] || found[u] || '';
};
