// Content loader for Danori landing page
// This script loads content from landingCopy.js and applies it to the HTML

import { landingCopy } from '../content/landingCopy.js';

// Function to safely set text content
function setTextContent(selector, text) {
  const element = document.querySelector(selector);
  if (element && text !== undefined) {
    element.textContent = text;
  }
}

// Function to safely set HTML content
function setHTMLContent(selector, html) {
  const element = document.querySelector(selector);
  if (element && html !== undefined) {
    element.innerHTML = html;
  }
}

// Function to populate header content
function populateHeader() {
  setTextContent('.logo-wordmark', landingCopy.header.logo);
  setTextContent('nav a[href="#how-it-works"]', landingCopy.header.nav.howItWorks);
  setTextContent('nav a[href="#faq"]', landingCopy.header.nav.faq);
  setTextContent('.header-cta', landingCopy.header.cta);
}

// Function to populate hero section
function populateHero() {
  setTextContent('#hero h1', landingCopy.hero.headline);
  setHTMLContent('#hero .hero-subtitle', landingCopy.hero.subtitleHTML);
  setTextContent('#hero .primary-cta', landingCopy.hero.cta.primary);
  setHTMLContent('#hero .trust-text', landingCopy.hero.trustHTML);
}

// Function to populate problem section
function populateProblem() {
  setTextContent('#problem h2', landingCopy.problem.headline);

  const problemItems = document.querySelectorAll('#problem .problem-item');
  landingCopy.problem.items.forEach((item, index) => {
    if (problemItems[index]) {
      setTextContent(`#problem .problem-item:nth-child(${index + 1}) h3`, item.title);
      setTextContent(`#problem .problem-item:nth-child(${index + 1}) p`, item.description);
    }
  });
}

// Function to populate note from builder section
function populateNoteFromBuilder() {
  setTextContent('#note-from-builder h2',
    landingCopy.noteFromBuilder.headline);

  const builderContent = document.querySelector(
    '#note-from-builder .builder-content');
  if (builderContent) {
    const existingParagraphs = builderContent.querySelectorAll('p');
    existingParagraphs.forEach(p => p.remove());

    const signature = builderContent
      .querySelector('.builder-signature');

    landingCopy.noteFromBuilder.content.forEach(text => {
      const p = document.createElement('p');
      p.textContent = text;
      builderContent.insertBefore(p, signature);
    });
  }

  setTextContent(
    '#note-from-builder .builder-signature strong',
    landingCopy.noteFromBuilder.signature.name);
  setTextContent(
    '#note-from-builder .builder-signature span',
    landingCopy.noteFromBuilder.signature.title);
}

// Function to populate how it works section
function populateHowItWorks() {
  setTextContent('#how-it-works h2', landingCopy.howItWorks.headline);
  setTextContent(
    '#how-it-works .section-subtitle',
    landingCopy.howItWorks.subtitle
  );

  const steps = document.querySelectorAll('#how-it-works .step');
  landingCopy.howItWorks.steps.forEach((step, index) => {
    if (steps[index]) {
      setTextContent(`#how-it-works .step:nth-child(${index + 1}) .step-number`, step.number);
      setTextContent(`#how-it-works .step:nth-child(${index + 1}) h3`, step.title);
      setTextContent(`#how-it-works .step:nth-child(${index + 1}) p`, step.description);
    }
  });

  setTextContent('#how-it-works .primary-cta', landingCopy.howItWorks.cta.primary);
  setTextContent('#how-it-works .trust-text', landingCopy.howItWorks.cta.trustText);
}

// Function to populate before/after section (no main h2 headline)
function populateBeforeAfter() {
  setTextContent('#before-after .before h3', landingCopy.beforeAfter.before.title);
  setTextContent('#before-after .after h3', landingCopy.beforeAfter.after.title);

  const beforeList = document.querySelector('#before-after .before ul');
  if (beforeList) {
    beforeList.innerHTML = '';
    landingCopy.beforeAfter.before.items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      beforeList.appendChild(li);
    });
  }

  const afterList = document.querySelector('#before-after .after ul');
  if (afterList) {
    afterList.innerHTML = '';
    landingCopy.beforeAfter.after.items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      afterList.appendChild(li);
    });
  }
}

// Function to populate FAQ section
function populateFaq() {
  setTextContent('#faq h2', landingCopy.faq.headline);

  const faqItems = document.querySelectorAll('#faq .faq-item');
  landingCopy.faq.items.forEach((faq, index) => {
    if (faqItems[index]) {
      setTextContent(`#faq .faq-item:nth-child(${index + 1}) h3`, faq.question);
      setTextContent(`#faq .faq-item:nth-child(${index + 1}) p`, faq.answer);
    }
  });
}

// Function to populate final CTA section
function populateFinalCta() {
  setTextContent('#final-cta h2', landingCopy.finalCta.headline);
  setTextContent('#final-cta p', landingCopy.finalCta.description);
  setTextContent('#final-cta .primary-cta', landingCopy.finalCta.cta);
}

// Function to populate footer
function populateFooter() {
  setTextContent('footer .footer-section:nth-child(1) h4', landingCopy.footer.danori.title);
  setTextContent('footer .footer-section:nth-child(1) p', landingCopy.footer.danori.description);

  setTextContent('footer .footer-section:nth-child(2) h4', landingCopy.footer.product.title);
  setTextContent('footer .footer-section:nth-child(3) h4', landingCopy.footer.support.title);
  setTextContent('footer .footer-section:nth-child(4) h4', landingCopy.footer.legal.title);

  setTextContent('footer .footer-bottom p', landingCopy.footer.bottom);
}

// Main function to populate all content
function populateAllContent() {
  try {
    populateHeader();
    populateHero();
    populateProblem();
    populateHowItWorks();
    populateBeforeAfter();
    populateNoteFromBuilder();
    populateFaq();
    populateFinalCta();
    populateFooter();

    console.log('Danori landing page content loaded successfully');
  } catch (error) {
    console.error('Error loading Danori content:', error);
  }
}

// Export the main function
export { populateAllContent };

// Auto-populate when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', populateAllContent);
} else {
  populateAllContent();
}
