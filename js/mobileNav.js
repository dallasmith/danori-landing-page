(function () {
  const header = document.querySelector('header');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!header || !toggle || !menu) return;

  const resources = menu.querySelector('.nav-menu');
  const resourcesBtn = resources && resources.querySelector('.nav-toggle');
  const resourcesPanel = resources && resources.querySelector('.nav-dropdown');

  function resourcesOpen() {
    return !!(resourcesBtn && resourcesBtn.getAttribute('aria-expanded') === 'true');
  }

  function setResourcesOpen(open) {
    if (!resourcesBtn || !resourcesPanel) return;
    resourcesBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    resourcesPanel.hidden = !open;
  }

  function setOpen(open) {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open) setResourcesOpen(false);
  }

  toggle.addEventListener('click', function (event) {
    event.stopPropagation();
    setOpen(!header.classList.contains('menu-open'));
  });

  if (resourcesBtn) {
    resourcesBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      setResourcesOpen(!resourcesOpen());
    });
  }

  if (resources) {
    resources.addEventListener('focusout', function (event) {
      if (!resources.contains(event.relatedTarget)) setResourcesOpen(false);
    });
  }

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setResourcesOpen(false);
      setOpen(false);
    });
  });

  document.addEventListener('click', function (event) {
    if (resources && !resources.contains(event.target)) setResourcesOpen(false);
    if (!header.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (resourcesOpen()) {
      setResourcesOpen(false);
      resourcesBtn.focus();
      return;
    }
    setOpen(false);
  });
})();
