/* ZETTA-ZONE: shared GA4 link tracking. Requires the page's Google tag. */
(function () {
  'use strict';
  if (/^\/(catalog|catalog-lab)(\/|$)/.test(location.pathname)) return;
  if (window.__zzLinkTracking) return;
  window.__zzLinkTracking = true;
  function track(event) {
    if (event.type === 'auxclick' && event.button !== 1) return;
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href]') : null;
    if (!link || typeof window.gtag !== 'function') return;
    var url;
    try { url = new URL(link.href, location.href); } catch (_) { return; }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
    if (url.origin === location.origin && url.pathname === location.pathname && url.search === location.search) return;
    // Exclude query strings and hashes from analytics; never change the actual link.
    window.gtag('event', 'zz_link_click', {
      send_to: 'G-73PZLJHB2D',
      link_url: url.origin + url.pathname,
      link_domain: url.hostname,
      link_text: (link.getAttribute('aria-label') || link.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 100),
      outbound: url.origin !== location.origin,
      page_path: location.pathname,
      language: document.documentElement.lang || 'und',
      transport_type: 'beacon'
    });
  }
  // Delegation also covers links added by the shared header and footer.
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
}());
