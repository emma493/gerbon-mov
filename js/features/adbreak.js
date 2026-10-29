/* js/features/adbreak.js — Ad Break interstitial.
 *
 * After every 3–5 videos (randomized threshold), redirects to ads.html
 * which shows a full-screen red CTA button. Clicking the button opens the
 * Adsterra Smartlink in a new tab and returns to index.html.
 *
 * Set SMARTLINK_URL below to your Adsterra Smartlink before deploying.
 */

import { store } from "../store.js";

const SMARTLINK_URL = "https://araplhn.org/4/f4da12d7aaa67cd61f6a1196381da654";

const ADBREAK_COUNT_KEY = "shortxx_adbreak_count";
const ADBREAK_THRESHOLD_KEY = "shortxx_adbreak_threshold";
const ADBREAK_LAST_VIDEO_KEY = "shortxx_adbreak_last_video";
const RETURN_FLAG_KEY = "shortxx_adbreak_return";

function getCount() {
  try {
    return parseInt(localStorage.getItem(ADBREAK_COUNT_KEY) || "0", 10) || 0;
  } catch (e) { return 0; }
}
function setCount(n) {
  try { localStorage.setItem(ADBREAK_COUNT_KEY, String(n)); } catch (e) {}
}
function incrementCount() {
  const c = getCount() + 1;
  setCount(c);
  return c;
}
function resetCount() {
  setCount(0);
}

function getThreshold() {
  try {
    const t = localStorage.getItem(ADBREAK_THRESHOLD_KEY);
    if (t) return parseInt(t, 10);
  } catch (e) {}
  const threshold = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
  try { localStorage.setItem(ADBREAK_THRESHOLD_KEY, String(threshold)); } catch (e) {}
  return threshold;
}

function getLastVideoId() {
  try { return localStorage.getItem(ADBREAK_LAST_VIDEO_KEY) || null; } catch (e) { return null; }
}
function setLastVideoId(id) {
  try { localStorage.setItem(ADBREAK_LAST_VIDEO_KEY, id); } catch (e) {}
}

function showAdBreak() {
  // Redirect to the standalone ad break page.
  window.location.href = "ads.html";
}

function onVideoChanged() {
  const currentId = store.videoId || null;
  if (!currentId) return;
  const lastId = getLastVideoId();
  if (currentId === lastId) return; // same video, don't double-count
  setLastVideoId(currentId);
  const count = incrementCount();
  if (count >= getThreshold()) {
    resetCount();
    try { localStorage.removeItem(ADBREAK_THRESHOLD_KEY); } catch (e) {}
    showAdBreak();
  }
}

export async function init(ctx) {
  // If we just returned from ads.html, don't trigger another break immediately.
  try {
    const returning = sessionStorage.getItem(RETURN_FLAG_KEY);
    if (returning) {
      sessionStorage.removeItem(RETURN_FLAG_KEY);
      resetCount();
    }
  } catch (e) {}

  // Listen for video changes to count watched videos.
  window.addEventListener("sx:video-changed", () => {
    try { onVideoChanged(); } catch (e) {}
  });

  // Debug helpers.
  window.sxAdbreakReset = () => { resetCount(); };
  window.sxAdbreakForce = () => showAdBreak();
  window.sxAdbreakStatus = () => ({ count: getCount(), threshold: getThreshold() });
}
