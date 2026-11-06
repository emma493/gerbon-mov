/* js/features/ads.js — Social bar reload on scroll.
 *
 * Reloads the Adsterra social bar script on every video change (swipe/scroll)
 * so the social bar refreshes with new ads.
 *
 * Banner ad logic is disabled. Only the social bar reload is active.
 */

const SOCIAL_BAR_SRC = "https://biomanos.org/14/e83c3df1d025804eca4fb0e8e81cf573";
const POPUNDER_SRC = "https://benchform.org/1/c19e1e6d63fdb8e71ba6429815871d40";

function reloadSocialBar() {
  // Remove existing social bar script tags so the new one loads fresh
  const existing = document.querySelectorAll(
    'script[src*="biomanos.org/14/e83c3df1d025804eca4fb0e8e81cf573"]'
  );
  existing.forEach((s) => s.remove());

  // Inject new script tag with cache-busting param
  const s = document.createElement("script");
  s.src = SOCIAL_BAR_SRC + "?t=" + Date.now();
  s.setAttribute("data-cfasync", "false");
  s.async = true;
  document.head.appendChild(s);
}

function reloadPopunder() {
  // Remove existing popunder script tags so the new one loads fresh
  const existing = document.querySelectorAll(
    'script[src*="benchform.org/1/c19e1e6d63fdb8e71ba6429815871d40"]'
  );
  existing.forEach((s) => s.remove());

  // Inject new script tag with cache-busting param
  const s = document.createElement("script");
  s.src = POPUNDER_SRC + "?t=" + Date.now();
  s.setAttribute("data-cfasync", "false");
  s.async = true;
  document.head.appendChild(s);
}

/* =====================================================================
   ACTIVE: Social bar reload on video change
   ===================================================================== */
export async function init(ctx) {
  // Reload social bar on every swipe/scroll (sx:video-changed fires on
  // every video change in the swipe feed)
  window.addEventListener("sx:video-changed", () => {
    try { reloadSocialBar(); } catch (e) {}
    try { reloadPopunder(); } catch (e) {}
  });

  // Also reload once on init
  reloadSocialBar();
  reloadPopunder();
}

// Global stubs (prevents console errors if called from console)
window.sxAdsReloadSocialBar = () => { reloadSocialBar(); };
window.sxAdsReloadPopunder = () => { reloadPopunder(); };
window.sxAdsRefresh = () => 0;
window.sxAdsStats = () => ({ count: 0, slots: 0 });
