// src/utils/pageMeta.js
// Page titles and descriptions for browser tabs, search engines and link
// previews. Public pages are listed in src/config/seoPages.json (the build
// also uses it to write the sitemap and pre-filled copies of index.html, see
// scripts/build.js); course pages set their own with setPageMeta().
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../config/seoPages.json';

const setTag = (selector, attr, key, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute(selector.startsWith('link') ? 'href' : 'content', value);
};

export const setPageMeta = ({ title, description, path }) => {
  const t = title || SEO.default.title;
  const d = (description || SEO.default.description).replace(/\s+/g, ' ').trim().slice(0, 300);
  const url = SEO.site + (path && path !== '/' ? path : '');
  document.title = t;
  setTag('meta[name="description"]', 'name', 'description', d);
  setTag('meta[property="og:title"]', 'property', 'og:title', t);
  setTag('meta[property="og:description"]', 'property', 'og:description', d);
  setTag('meta[property="og:url"]', 'property', 'og:url', url || SEO.site);
  setTag('meta[name="twitter:title"]', 'name', 'twitter:title', t);
  setTag('meta[name="twitter:description"]', 'name', 'twitter:description', d);
  setTag('link[rel="canonical"]', 'rel', 'canonical', url || SEO.site);
};

// Mounted once inside the router: listed pages get their own title, every
// other page gets the site default (pages like courses then set their own).
export const RouteMeta = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : '/';
    const page = SEO.pages[path];
    setPageMeta(page ? { ...page, path } : { path });
  }, [pathname]);
  return null;
};

export const usePageMeta = (meta, deps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (meta) setPageMeta(meta); }, deps);
};
