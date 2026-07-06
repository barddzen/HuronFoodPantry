// Shared header/nav + footer — single source of truth
// Note: All HTML content below is static/hardcoded (no user input), safe for insertion.

// Google Analytics (GA4) — skip on local dev so test visits stay out of the data
(function () {
  var host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host === '') return;

  var GA_ID = 'G-29J46PZ46J';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
})();

// Seasonal campaign visibility — flip to true when a campaign is actively running
var CAMPAIGNS = { 'simply-give': false };

var chevron = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';

var siteHeader = ''
  + '<a href="#main-content" class="skip-link">Skip to content</a>'
  + '<header class="site-header">'
  + '  <div class="header-inner">'
  + '    <a href="index.html" class="logo">'
  + '      <img src="images/hhh-logo-full.webp" alt="Huron Helping Hands Food Pantry">'
  + '    </a>'
  + '    <nav class="nav-desktop">'
  + '      <a href="index.html">Home</a>'
  + '      <a href="about.html">About</a>'
  + '      <a href="events.html">Events</a>'
  + '      <a href="receiving-goods.html">How We Can Help</a>'
  + '      <div class="dropdown">'
  + '        <button class="dropdown-toggle" aria-expanded="false" aria-haspopup="true">Ways to Give ' + chevron + '</button>'
  + '        <div class="dropdown-menu">'
  + '          <a href="ways-to-give-monetary.html">Monetary Donations</a>'
  + '          <a href="ways-to-give-current-needs.html">Current Needs</a>'
  + '          <a href="ways-to-give-guidelines.html">Donation Guidelines</a>'
  + '        </div>'
  + '      </div>'
  + '      <div class="dropdown">'
  + '        <button class="dropdown-toggle" aria-expanded="false" aria-haspopup="true">Get Involved ' + chevron + '</button>'
  + '        <div class="dropdown-menu">'
  + '          <a href="get-involved-volunteers.html">Volunteer</a>'
  + '          <a href="get-involved-projects.html" data-campaign="simply-give">Projects &amp; Campaigns</a>'
  + '        </div>'
  + '      </div>'
  + '    </nav>'
  + '    <button class="nav-toggle" aria-label="Toggle navigation">'
  + '      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">'
  + '        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>'
  + '      </svg>'
  + '    </button>'
  + '  </div>'
  + '</header>'
  + '<nav class="nav-mobile">'
  + '  <a href="index.html">Home</a>'
  + '  <a href="about.html">About</a>'
  + '  <a href="events.html">Events</a>'
  + '  <a href="receiving-goods.html">How We Can Help</a>'
  + '  <div class="nav-mobile-section">'
  + '    <div class="nav-mobile-section-title">Ways to Give</div>'
  + '    <a href="ways-to-give-monetary.html">Monetary Donations</a>'
  + '    <a href="ways-to-give-current-needs.html">Current Needs</a>'
  + '    <a href="ways-to-give-guidelines.html">Donation Guidelines</a>'
  + '  </div>'
  + '  <div class="nav-mobile-section">'
  + '    <div class="nav-mobile-section-title">Get Involved</div>'
  + '    <a href="get-involved-volunteers.html">Volunteer</a>'
  + '    <a href="get-involved-projects.html" data-campaign="simply-give">Projects &amp; Campaigns</a>'
  + '  </div>'
  + '</nav>';

var siteFooter = ''
  + '<footer class="site-footer">'
  + '  <div class="footer-inner">'
  + '    <div class="footer-col">'
  + '      <strong>Huron Helping Hands Food Pantry</strong>'
  + '      <p>607 S. Main St</p>'
  + '      <p>Huron, OH 44839</p>'
  + '      <p><a href="https://maps.google.com/?q=607+S+Main+St+Huron+OH+44839" target="_blank" rel="noopener">Get Directions</a></p>'
  + '    </div>'
  + '    <div class="footer-col">'
  + '      <strong>Contact</strong>'
  + '      <p>General: <a href="tel:4196160088">419-616-0088</a></p>'
  + '      <p>Appointments: <a href="tel:4193660524">419-366-0524</a></p>'
  + '      <p><a href="mailto:huronfoodpantry@gmail.com">huronfoodpantry@gmail.com</a></p>'
  + '    </div>'
  + '    <div class="footer-col">'
  + '      <strong>Hours</strong>'
  + '      <p>Wed: 9:00 AM &ndash; 3:00 PM</p>'
  + '      <p>Thu: 10:00 AM &ndash; 2:00 PM</p>'
  + '      <p><a href="https://www.facebook.com/profile.php?id=100067649997052" target="_blank" rel="noopener">Follow us on Facebook</a></p>'
  + '    </div>'
  + '  </div>'
  + '  <div class="footer-bottom">'
  + '    &copy; ' + new Date().getFullYear() + ' Huron Helping Hands Food Pantry &middot; Serving our community since 1996 &middot; Registered 501(c)(3) nonprofit'
  + '  </div>'
  + '</footer>';

// Inject header at start of body (static content only — no user input)
document.body.insertAdjacentHTML('afterbegin', siteHeader);

// Inject footer at end of body (static content only — no user input)
document.body.insertAdjacentHTML('beforeend', siteFooter);

// Interactive behavior
document.addEventListener('DOMContentLoaded', function() {

  // Hide surfaces for seasonal campaigns that aren't currently running
  document.querySelectorAll('[data-campaign]').forEach(function(el) {
    if (!CAMPAIGNS[el.getAttribute('data-campaign')]) {
      el.style.display = 'none';
    }
  });

  // Facebook Page Plugin — size the iframe to its container (up to 500px) so it never clips
  (function() {
    var wrap = document.querySelector('.fb-embed');
    var iframe = wrap && wrap.querySelector('iframe');
    if (!iframe) return;
    function sizeFb() {
      var w = Math.max(280, Math.min(500, Math.floor(wrap.clientWidth)));
      var url = new URL(iframe.src);
      if (parseInt(url.searchParams.get('width'), 10) === w) return;
      url.searchParams.set('width', w);
      iframe.setAttribute('width', w);
      iframe.src = url.toString();
    }
    sizeFb();
    var t;
    window.addEventListener('resize', function() { clearTimeout(t); t = setTimeout(sizeFb, 250); });
  })();

  // Active page highlighting
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-desktop a, .nav-mobile a').forEach(function(link) {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  // Also highlight dropdown toggle if a child page is active
  document.querySelectorAll('.nav-desktop .dropdown').forEach(function(dropdown) {
    var links = dropdown.querySelectorAll('.dropdown-menu a');
    links.forEach(function(link) {
      if (link.getAttribute('href') === currentPage) {
        dropdown.querySelector('.dropdown-toggle').classList.add('active');
      }
    });
  });

  // Desktop dropdown accessibility — handle multiple dropdowns
  var dropdowns = document.querySelectorAll('.nav-desktop .dropdown');
  dropdowns.forEach(function(dropdown) {
    var btn = dropdown.querySelector('.dropdown-toggle');
    if (!btn) return;

    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var expanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all other dropdowns first
      dropdowns.forEach(function(other) {
        if (other !== dropdown) {
          other.classList.remove('dropdown--open');
          var otherBtn = other.querySelector('.dropdown-toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      dropdown.classList.toggle('dropdown--open');
    });
  });

  // Close dropdowns on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('dropdown--open');
        var btn = dropdown.querySelector('.dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    dropdowns.forEach(function(dropdown) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('dropdown--open');
        var btn = dropdown.querySelector('.dropdown-toggle');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Mobile navigation toggle
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.nav-mobile');
  var hamburgerPath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
  var closePath = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      // Swap hamburger/X icon (static SVG paths, no user input)
      var icon = toggle.querySelector('svg');
      icon.innerHTML = mobileNav.classList.contains('active') ? closePath : hamburgerPath;
    });

    mobileNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        var icon = toggle.querySelector('svg');
        icon.innerHTML = hamburgerPath;
      });
    });
  }
});
