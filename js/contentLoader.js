// Optional copy helper. The homepage now keeps copy in HTML for SEO.
// This file remains so older references do not 404.

import { landingCopy } from '../content/landingCopy.js';

function setTextContent(selector, text) {
  const element = document.querySelector(selector);
  if (element && text !== undefined) {
    element.textContent = text;
  }
}

function setHTMLContent(selector, html) {
  const element = document.querySelector(selector);
  if (element && html !== undefined) {
    element.innerHTML = html;
  }
}

function populateHeader() {
  setTextContent('.logo-wordmark', landingCopy.header.logo);
  setTextContent('.header-cta', landingCopy.header.cta);
}

function populateFooter() {
  setHTMLContent('footer .footer-section:nth-child(1) p', landingCopy.footer.danori.description);
  setTextContent('footer .footer-bottom p', landingCopy.footer.bottom);
}

function populateAllContent() {
  try {
    populateHeader();
    populateFooter();
  } catch (error) {
    console.error('Error loading Danori content:', error);
  }
}

export { populateAllContent };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', populateAllContent);
} else {
  populateAllContent();
}
