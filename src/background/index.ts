// Background service worker for InterviewOS Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('InterviewOS extension installed successfully.');
});

// Handle message routing between content script, popup, and sidepanel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'JOB_DESCRIPTION_EXTRACTED') {
    chrome.storage.local.set({ interviewos_active_jd: request.data }, () => {
      sendResponse({ status: 'success' });
    });
    return true;
  }

  if (request.type === 'OPEN_SIDE_PANEL') {
    // Use sender.tab.windowId when triggered from a content script (job board page click)
    // Fall back to querying the current window when triggered from the popup
    const windowId = sender.tab?.windowId;
    if (windowId && chrome.sidePanel?.open) {
      chrome.sidePanel.open({ windowId })
        .then(() => sendResponse({ status: 'success' }))
        .catch((err) => sendResponse({ status: 'error', error: err.toString() }));
    } else {
      // Popup context: query the focused window
      chrome.windows.getLastFocused((win) => {
        if (!win?.id || !chrome.sidePanel?.open) {
          sendResponse({ status: 'error', error: 'No focused window found' });
          return;
        }
        chrome.sidePanel.open({ windowId: win.id })
          .then(() => sendResponse({ status: 'success' }))
          .catch((err) => sendResponse({ status: 'error', error: err.toString() }));
      });
    }
    return true;
  }

  if (request.type === 'OPEN_FULL_DASHBOARD') {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
    }
    sendResponse({ status: 'success' });
    return true;
  }
});

// Handle Chrome Keyboard Commands (Ctrl+Shift+U / Command+Shift+U)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'rescan-job-page') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id && activeTab.url && !activeTab.url.startsWith('chrome://') && !activeTab.url.startsWith('chrome-extension://')) {
        // Attempt messaging the content script
        chrome.tabs.sendMessage(activeTab.id, { type: 'TRIGGER_PAGE_SCAN_COMMAND' }, (response) => {
          if (chrome.runtime.lastError) {
            console.log('Content script not loaded on tab. Programmatically injecting content.js...');
            // Inject content script on demand
            chrome.scripting.executeScript({
              target: { tabId: activeTab.id! },
              files: ['content.js']
            }).then(() => {
              // Wait 150ms for script initialization and message again
              setTimeout(() => {
                chrome.tabs.sendMessage(activeTab.id!, { type: 'TRIGGER_PAGE_SCAN_COMMAND' }, (retryResponse) => {
                  if (!chrome.runtime.lastError && retryResponse) {
                    console.log('Manual rescan successfully executed after injecting content script.');
                  }
                });
              }, 150);
            }).catch((err) => {
              console.error('Failed to inject content script on demand:', err.message);
            });
          } else {
            console.log('Successfully triggered job rescan via global shortcut command.');
          }
        });
      }
    });
  }
});

