chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'openPopup') {
    if (typeof chrome.action.openPopup === 'function') {
      chrome.action.openPopup().catch(() => {
        // openPopup is only available in Chrome 127+ and may fail if the popup
        // is already open or the window is not focused. That's fine — the user
        // can click the extension icon and the pending state will be there.
      });
    }
  }
});
