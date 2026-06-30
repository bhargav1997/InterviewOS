import { extractJobDescriptionFromDOM } from './jobExtractors';

console.log('InterviewOS Content Script loaded.');

// Auto-extract job description on load if on a recognized job board
try {
  const jd = extractJobDescriptionFromDOM();
  if (jd && jd.rawText && jd.rawText.length > 100) {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'JOB_DESCRIPTION_EXTRACTED', data: jd });
    }
  }
} catch (e) {
  console.log('InterviewOS job auto-extraction skipped:', e);
}

// Perform active page scanning and animate the floating badge feedback
export function performActiveScan() {
  const badge = document.getElementById('interviewos-floating-badge');
  if (badge) {
    badge.innerHTML = `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#eab308; animate: pulse 1s infinite;"></span>
      <span>Scanning Page...</span>
    `;
    badge.style.borderColor = '#eab308';
  }

  // Brief delay to simulate and visually show scanning state
  setTimeout(() => {
    try {
      const jd = extractJobDescriptionFromDOM();
      if (jd && jd.rawText && jd.rawText.length > 50) {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ type: 'JOB_DESCRIPTION_EXTRACTED', data: jd });
          
          if (badge) {
            badge.innerHTML = `
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#10b981;"></span>
              <span>Scanned: ${jd.title.substring(0, 15)}...</span>
            `;
            badge.style.borderColor = '#10b981';
            
            setTimeout(() => {
              badge.innerHTML = `
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#10b981;"></span>
                <span>InterviewOS Co-Pilot</span>
              `;
              badge.style.borderColor = '#334155';
            }, 3000);
          }
        }
      } else {
        if (badge) {
          badge.innerHTML = `
            <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#ef4444;"></span>
            <span>No Job Detected</span>
          `;
          badge.style.borderColor = '#ef4444';
          
          setTimeout(() => {
            badge.innerHTML = `
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#10b981;"></span>
              <span>InterviewOS Co-Pilot</span>
            `;
            badge.style.borderColor = '#334155';
          }, 3000);
        }
      }
    } catch (err) {
      console.error('Scan failed:', err);
    }
  }, 400);
}

// Inject floating extension action button on job boards
function injectFloatingBadge() {
  if (document.getElementById('interviewos-floating-badge')) return;

  const badge = document.createElement('div');
  badge.id = 'interviewos-floating-badge';
  badge.style.position = 'fixed';
  badge.style.bottom = '24px';
  badge.style.right = '24px';
  badge.style.zIndex = '999999';
  badge.style.backgroundColor = '#0f172a';
  badge.style.color = '#f8fafc';
  badge.style.border = '1px solid #334155';
  badge.style.borderRadius = '30px';
  badge.style.padding = '8px 16px';
  badge.style.display = 'flex';
  badge.style.alignItems = 'center';
  badge.style.gap = '8px';
  badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  badge.style.fontSize = '12px';
  badge.style.fontWeight = '600';
  badge.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5)';
  badge.style.cursor = 'pointer';
  badge.style.transition = 'all 0.2s ease';

  badge.innerHTML = `
    <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#10b981;"></span>
    <span>InterviewOS Co-Pilot</span>
  `;

  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'translateY(-2px)';
    if (badge.style.borderColor === 'rgb(51, 65, 85)' || badge.style.borderColor === '#334155') {
      badge.style.borderColor = '#6366f1';
    }
  });

  badge.addEventListener('mouseleave', () => {
    badge.style.transform = 'translateY(0)';
    if (badge.style.borderColor === 'rgb(99, 102, 241)' || badge.style.borderColor === '#6366f1') {
      badge.style.borderColor = '#334155';
    }
  });

  badge.addEventListener('click', () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage({ type: 'OPEN_SIDE_PANEL' });
    }
  });

  document.body.appendChild(badge);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectFloatingBadge);
} else {
  injectFloatingBadge();
}

// Bind manual webpage keyboard shortcut: Alt + Shift + R to rescan
// Use capture phase (true) to intercept keyboard events before page scripts block them
const handleRescanShortcut = (e: KeyboardEvent) => {
  const isKeyR = e.code === 'KeyR' || e.key?.toLowerCase() === 'r';
  if (e.altKey && e.shiftKey && isKeyR) {
    e.preventDefault();
    e.stopPropagation();
    performActiveScan();
  }
};

window.addEventListener('keydown', handleRescanShortcut, true);
document.addEventListener('keydown', handleRescanShortcut, true);

// Monitor and attach keydown listeners inside iframes (e.g. Indeed job panes)
function monitorIframes() {
  document.querySelectorAll('iframe').forEach(iframe => {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc && !(iframeDoc as any).interviewosShortcutBound) {
        iframeDoc.addEventListener('keydown', handleRescanShortcut, true);
        (iframeDoc as any).interviewosShortcutBound = true;
      }
    } catch {
      // Ignore cross-origin iframe security errors
    }
  });
}

// Repeatedly search for newly rendered iframes (SPA layouts dynamically create frames)
setInterval(monitorIframes, 2000);

// Listen for explicit manual extraction triggers from extension UI / commands
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'EXTRACT_JOB_DETAILS' || request.type === 'TRIGGER_PAGE_SCAN_COMMAND') {
      performActiveScan();
      // Respond with the extracted job immediately (after brief timeout to allow dom state capture)
      setTimeout(() => {
        const jd = extractJobDescriptionFromDOM();
        sendResponse({ status: 'success', data: jd });
      }, 500);
    }
    return true;
  });
}
