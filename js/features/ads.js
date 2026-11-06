/* js/features/ads.js — Banner ad controller (DISABLED).
 *
 * All banner ad reload logic is commented out below. The biomanos.org
 * banner ad slots have been removed from all HTML pages.
 *
 * To reactivate banner ads with a new provider:
 *   1. Add new ad slot HTML to index.html, discover/index.html,
 *      trending/index.html, ads.html, 404.html
 *   2. Uncomment the functions below and update selectors/URLs
 *   3. Re-register the sx:video-changed listener in init()
 *
 * Social bar / pop / tab-guard scripts are NOT touched here — they are
 * loaded as standalone <script> tags directly in the HTML pages.
 */

/* =====================================================================
   DISABLED: Banner slot collection
   ===================================================================== */
// let slots = [];
// let queue = Promise.resolve();
// let batches = 0;

// function collectSlots() {
//   const found = [];
//   try {
//     document.querySelectorAll("[data-ad-slot]").forEach((el) => {
//       const type = el.getAttribute("data-ad-type") || "atoptions";
//       if (type === "container") {
//         const src = el.getAttribute("data-ad-src") || "";
//         const container = el.getAttribute("data-ad-container") || "";
//         if (!src || !container) return;
//         found.push({ el, type, src, container, async: el.getAttribute("data-ad-async") === "1" });
//       } else {
//         const key = el.getAttribute("data-ad-key") || "";
//         const host = el.getAttribute("data-ad-host") || "https://biomanos.org/22";
//         const w = parseInt(el.getAttribute("data-ad-w") || "0", 10) || 0;
//         const h = parseInt(el.getAttribute("data-ad-h") || "0", 10) || 0;
//         if (!key) return;
//         found.push({ el, type: "atoptions", key, host, w, h });
//       }
//     });
//   } catch (e) {}
//   return found;
// }

/* =====================================================================
   DISABLED: Script injection
   ===================================================================== */
// function injectScript(container, src, isAsync) {
//   return new Promise((resolve) => {
//     try {
//       const s = document.createElement("script");
//       s.type = "text/javascript";
//       if (isAsync) s.async = true;
//       try { s.setAttribute("data-cfasync", "false"); } catch (e) {}
//       s.src = src;
//       let done = false;
//       const finish = () => { if (!done) { done = true; resolve(); } };
//       s.onload = () => setTimeout(finish, 250);
//       s.onerror = finish;
//       setTimeout(finish, 8000);
//       container.appendChild(s);
//     } catch (e) {
//       resolve();
//     }
//   });
// }

/* =====================================================================
   DISABLED: Single slot refresh
   ===================================================================== */
// function refreshSlot(s) {
//   return (async () => {
//     try {
//       if (!document.contains(s.el)) return;
//       s.el.innerHTML = "";
//       if (s.type === "container") {
//         const box = document.createElement("div");
//         box.id = s.container;
//         s.el.appendChild(box);
//         await injectScript(s.el, s.src, s.async);
//       } else {
//         try {
//           window.atOptions = { key: s.key, format: "iframe", height: s.h, width: s.w, params: {} };
//         } catch (e) {}
//         await injectScript(s.el, s.host + "/" + s.key, false);
//       }
//     } catch (e) {}
//   })();
// }

/* =====================================================================
   DISABLED: Batch runner
   ===================================================================== */
// function runBatch(reason) {
//   batches++;
//   slots.forEach((s) => {
//     queue = queue.then(() => refreshSlot(s));
//   });
//   queue = queue.catch(() => {});
// }

// function maybeBatch() {
//   return slots.length > 0;
// }

/* =====================================================================
   DISABLED: Per-video-change trigger
   ===================================================================== */
// function onVideoChanged() {
//   // Every scroll = one batch. No counter, no floor, no watch timer.
//   if (maybeBatch()) {
//     runBatch("scroll");
//   }
// }

/* =====================================================================
   DISABLED: Clear ad slots
   ===================================================================== */
// function clearAdSlots() {
//   try {
//     document.querySelectorAll("[data-ad-slot]").forEach((el) => {
//       el.innerHTML = "";
//     });
//   } catch (e) {}
// }

/* =====================================================================
   DISABLED: Wait for video then load ads
   ===================================================================== */
// function waitForVideoThenLoadAds() {
//   const video = document.getElementById("main-video");
//   const startAds = () => {
//     slots = collectSlots();
//     if (!slots.length) return;
//     runBatch("video-ready");
//   };
//   if (!video) {
//     startAds();
//     return;
//   }
//   if (video.readyState >= 2) {
//     startAds();
//   } else {
//     video.addEventListener("loadeddata", startAds, { once: true });
//   }
//   setTimeout(startAds, 15000);
// }

/* =====================================================================
   DISABLED: Module init
   ===================================================================== */
// export async function init(ctx) {
//   // Clear any pre-loaded ad scripts from static HTML so ads don't load
//   // before the video is ready.
//   clearAdSlots();
//   waitForVideoThenLoadAds();
//   // Scroll-only: every sx:video-changed (swipe) replays all banner slots.
//   // No scroll = no reload.
//   window.addEventListener("sx:video-changed", () => {
//     try { onVideoChanged(); } catch (e) {}
//   });
//   // Manual trigger (console/debug): window.sxAdsRefresh().
//   window.sxAdsRefresh = () => {
//     if (maybeBatch()) runBatch("manual");
//     return batches;
//   };
//   window.sxAdsStats = () => ({ batches, slots: slots.length });
// }

/* =====================================================================
   ACTIVE: No-op exports (prevents import errors in main.js)
   ===================================================================== */
export async function init(ctx) {
  // Banner ads are disabled. No-op to keep main.js import working.
  // Uncomment the functions above and call them here to re-enable.
  return;
}

// Global stubs (prevents console errors if called from console)
window.sxAdsRefresh = () => 0;
window.sxAdsStats = () => ({ count: 0, slots: 0 });
