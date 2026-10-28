/* ZETTA-ZONE GA4: link and project interest tracking, v2.
   Uses the existing gtag installation on each page. */
(function () {
  'use strict';
  if (/^\/(catalog|catalog-lab)(\/|$)/.test(location.pathname)) return;
  if (window.__zzLinkTracking) return;
  window.__zzLinkTracking = true;

  var measurementId = 'G-73PZLJHB2D';
  function clean(s, n) {
    return String(s || '').replace(/\s+/g, ' ').trim().slice(0, n || 100);
  }
  function project(link) {
    var card = link.closest('[data-site]');
    var raw = link.getAttribute('data-site') || (card && card.getAttribute('data-site')) || '';
    if (!raw) {
      var guide = location.pathname.match(/^\/guid\/([^/]+)/);
      if (guide) raw = guide[1];
    }
    if (!raw) {
      var href = link.getAttribute('href') || '';
      var guideLink = href.match(/\/guid\/([^/?#]+)/);
      if (guideLink) raw = guideLink[1];
    }
    return clean(raw, 80).toLowerCase();
  }
  function track(e) {
    if (e.type === 'auxclick' && e.button !== 1) return;
    var el = e.target;
    if (el && el.nodeType === 3) el = el.parentElement;
    var link = el && el.closest ? el.closest('a[href]') : null;
    if (!link || typeof window.gtag !== 'function') return;
    var u;
    try { u = new URL(link.href, location.href); } catch (_) { return; }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return;
    if (u.origin === location.origin && u.pathname === location.pathname && u.search === location.search && !u.hash) return;

    var site = project(link);
    var btn = clean(link.getAttribute('data-btn'), 60).toLowerCase();
    var label = clean(link.getAttribute('aria-label') || link.textContent, 100);
    var outbound = u.origin !== location.origin;
    var base = {
      send_to: measurementId,
      project_id: site || 'unknown',
      button_type: btn || 'link',
      link_domain: u.hostname,
      link_path: u.pathname,
      link_text: label,
      outbound: outbound,
      page_path: location.pathname,
      transport_type: 'beacon'
    };
    // Existing event kept for backwards compatibility; never collect referral tokens.
    window.gtag('event', 'zz_link_click', base);
    var isGuide = u.origin === location.origin && /^\/guid\//.test(u.pathname);
    if (isGuide) {
      window.gtag('event', 'zz_guide_click', base);
    } else if (outbound && site && !/^(nav|footer|more|site)$/.test(site)) {
      // This measures outbound project-link clicks, not confirmed registrations.
      window.gtag('event', 'zz_project_outbound', base);
    }
  }
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
}());
