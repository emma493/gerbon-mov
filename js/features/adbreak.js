/* js/features/adbreak.js — Ad Break interstitial.
 *
 * After every 3–5 video scrolls (randomized threshold), redirects to ads.html
 * which shows a full-screen ad page. Clicking the WATCH AD button opens the
 * Adsterra Smartlink in a new tab and returns to index.html.
 *
 * Mirrors the scroll-count pattern from the reference script.js:
 *   - sessionStorage.scrollCount   -> increments on every video change
 *   - sessionStorage.targetScrolls -> random 3-5 threshold
 * When scrollCount >= targetScrolls, redirect to ads.html.
 *
 * SMARTLINK_URL is the Live Cams / Adsterra Smartlink.
 */

const SMARTLINK_URL = "https://araplhn.org/4/f4da12d7aaa67cd61f6a1196381da654";

const SCROLL_COUNT_KEY = "scrollCount";
const TARGET_SCROLLS_KEY = "targetScrolls";
const RETURN_FLAG_KEY = "shortxx_adbreak_return";

function getRandomAdScrollTarget() {
  return Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
}

function getCount() {
  try {
    return parseInt(sessionStorage.getItem(SCROLL_COUNT_KEY) || "0", 10) || 0;
  } catch (e) { return 0; }
}
function setCount(n) {
  try { sessionStorage.setItem(SCROLL_COUNT_KEY, String(n)); } catch (e) {}
}
function incrementCount() {
  const c = getCount() + 1;
  setCount(c);
  return c;
}
function resetCount() {
  setCount(0);
}

function getTarget() {
  try {
    const t = sessionStorage.getItem(TARGET_SCROLLS_KEY);
    if (t) return parseInt(t, 10);
  } catch (e) {}
  const target = getRandomAdScrollTarget();
  try { sessionStorage.setItem(TARGET_SCROLLS_KEY, String(target)); } catch (e) {}
  return target;
}

function showAdBreak() {
  // Redirect to the standalone ad break page.
  window.location.href = "ads.html";
}

function checkAndTriggerAd() {
  const count = incrementCount();
  const target = getTarget();

  if (count >= target) {
    // Reset counter and pick a new random threshold (3-5) for next cycle.
    resetCount();
    try { sessionStorage.setItem(TARGET_SCROLLS_KEY, String(getRandomAdScrollTarget())); } catch (e) {}
    showAdBreak();
    return true;
  }
  return false;
}

export async function init(ctx) {
  // If we just returned from ads.html, don't trigger another break immediately.
  try {
    const returning = sessionStorage.getItem(RETURN_FLAG_KEY);
    if (returning) {
      sessionStorage.removeItem(RETURN_FLAG_KEY);
      resetCount();
      // Also set a fresh random target so the next cycle starts clean.
      try { sessionStorage.setItem(TARGET_SCROLLS_KEY, String(getRandomAdScrollTarget())); } catch (e) {}
    }
  } catch (e) {}

  // Listen for video changes (every swipe/next) to count scrolls.
  window.addEventListener("sx:video-changed", () => {
    try { checkAndTriggerAd(); } catch (e) {}
  });

  // Debug helpers.
  window.sxAdbreakReset = () => { resetCount(); };
  window.sxAdbreakForce = () => showAdBreak();
  window.sxAdbreakStatus = () => ({ count: getCount(), target: getTarget() });
}
