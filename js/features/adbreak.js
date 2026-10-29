/* js/features/adbreak.js — Ad Break interstitial.
 *
 * After every 3–5 videos (randomized threshold), an overlay covers the page
 * leaving only the video player + a big red CTA button. Clicking the button
 * opens the Adsterra Smartlink in a new tab. When the user returns to the
 * tab, the overlay disappears and the normal UI returns.
 *
 * Set SMARTLINK_URL below to your Adsterra Smartlink before deploying.
 */

import { store } from "../store.js";

const SMARTLINK_URL = "https://your-adsterra-smartlink.com/go"; // <-- REPLACE THIS

const ADBREAK_COUNT_KEY = "shortxx_adbreak_count";
const ADBREAK_THRESHOLD_KEY = "shortxx_adbreak_threshold";
const ADBREAK_LAST_VIDEO_KEY = "shortxx_adbreak_last_video";

let overlayEl = null;
let isActive = false;
let videoPausedBefore = false;

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

function createOverlay() {
  if (overlayEl) return overlayEl;
  overlayEl = document.createElement("div");
  overlayEl.className = "sx-adbreak-overlay";
  overlayEl.innerHTML = `
    <div class="sx-adbreak-content">
      <div class="sx-adbreak-dot"></div>
      <button id="sx-adbreak-btn" class="sx-adbreak-btn" type="button" aria-label="Continue">
        <span class="sx-adbreak-icon">▶</span>
        <span class="sx-adbreak-text">Watch Now</span>
        <span class="sx-adbreak-sub">Tap to continue</span>
      </button>
      <div class="sx-adbreak-hint">Ad Break</div>
    </div>
  `;
  document.body.appendChild(overlayEl);

  const btn = overlayEl.querySelector("#sx-adbreak-btn");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    openSmartlink();
  });
  return overlayEl;
}

function showAdBreak() {
  if (isActive) return;
  const video = document.getElementById("main-video");
  if (video && !video.paused) {
    videoPausedBefore = true;
    video.pause().catch(() => {});
  } else {
    videoPausedBefore = false;
  }
  createOverlay();
  overlayEl.style.display = "flex";
  document.body.classList.add("sx-adbreak-active");
  isActive = true;
}

function hideAdBreak() {
  if (!isActive) return;
  document.body.classList.remove("sx-adbreak-active");
  if (overlayEl) overlayEl.style.display = "none";
  isActive = false;
  const video = document.getElementById("main-video");
  if (video && videoPausedBefore) {
    video.play().catch(() => {});
  }
  videoPausedBefore = false;
}

function openSmartlink() {
  try { window.open(SMARTLINK_URL, "_blank"); } catch (e) {}
  resetCount();
  hideAdBreak();
}

function onVideoChanged() {
  if (isActive) return;
  const video = document.getElementById("main-video");
  const data = video && video.dataset ? null : null;
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

function restoreUI() {
  if (isActive) hideAdBreak();
}

export async function init(ctx) {
  // Listen for video changes to count watched videos.
  window.addEventListener("sx:video-changed", () => {
    try { onVideoChanged(); } catch (e) {}
  });
  // Restore UI when user returns to the tab.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) restoreUI();
  });
  window.addEventListener("focus", () => restoreUI());

  // Debug helpers.
  window.sxAdbreakReset = () => { resetCount(); hideAdBreak(); };
  window.sxAdbreakForce = () => showAdBreak();
  window.sxAdbreakStatus = () => ({ count: getCount(), threshold: getThreshold(), active: isActive });
}
