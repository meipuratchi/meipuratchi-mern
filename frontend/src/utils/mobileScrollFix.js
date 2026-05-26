/**
 * Mobile Scroll Fix Utility
 * Ensures proper scrolling behavior on mobile devices
 */

export function initMobileScrollFix() {
  // Only run on mobile devices
  if (window.innerWidth > 768) return;

  // Remove any conflicting styles that might prevent scrolling
  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById('root');

  // Ensure proper overflow settings
  html.style.overflowY = 'auto';
  html.style.overflowX = 'hidden';
  html.style.height = '100%';
  html.style.touchAction = 'pan-y';
  html.style.webkitOverflowScrolling = 'touch';

  body.style.overflowY = 'auto';
  body.style.overflowX = 'hidden';
  body.style.minHeight = '100%';
  body.style.position = 'relative';
  body.style.touchAction = 'pan-y';
  body.style.webkitOverflowScrolling = 'touch';

  if (root) {
    root.style.overflowY = 'auto';
    root.style.overflowX = 'hidden';
    root.style.minHeight = '100%';
    root.style.position = 'relative';
    root.style.touchAction = 'pan-y';
    root.style.webkitOverflowScrolling = 'touch';
  }

  // Fix for iOS Safari address bar
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);

  // Prevent body from being locked
  const preventBodyLock = () => {
    if (body.style.overflow === 'hidden' && !document.querySelector('.modal-open')) {
      body.style.overflow = 'auto';
    }
  };

  // Check periodically for body lock
  setInterval(preventBodyLock, 500);

  // Fix for Android Chrome
  if (/Android/i.test(navigator.userAgent)) {
    // Ensure touch events work properly
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  }

  // Fix for iOS Safari
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    // Prevent elastic scrolling from interfering
    document.addEventListener('touchmove', (e) => {
      // Allow scrolling on scrollable elements
      const target = e.target;
      const scrollable = target.closest('[style*="overflow-y: auto"], [style*="overflow: auto"], .pt-main, .pt-chat-messages');
      
      if (!scrollable) {
        // Only prevent default on non-scrollable areas
        const isAtTop = window.pageYOffset === 0;
        const isAtBottom = window.pageYOffset + window.innerHeight >= document.body.scrollHeight;
        
        if ((isAtTop && e.touches[0].clientY > e.touches[0].clientY) || 
            (isAtBottom && e.touches[0].clientY < e.touches[0].clientY)) {
          // Prevent overscroll bounce
        }
      }
    }, { passive: true });
  }

  console.log('Mobile scroll fix initialized');
}

// Auto-initialize on DOM ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileScrollFix);
  } else {
    initMobileScrollFix();
  }
}

export default initMobileScrollFix;
