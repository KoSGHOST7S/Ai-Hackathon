(function () {
  const match = window.location.pathname.match(/^\/courses\/(\d+)\/assignments\/(\d+)/);
  if (!match) return;

  const courseId = match[1];
  const assignmentId = match[2];
  const logoUrl = chrome.runtime.getURL('logo-32.png');

  function injectButton() {
    if (document.getElementById('assignmint-btn')) return;

    const target = document.querySelector('.right-of-crumbs');
    if (!target) return;

    const btn = document.createElement('button');
    btn.id = 'assignmint-btn';
    btn.type = 'button';

    const img = document.createElement('img');
    img.src = logoUrl;
    img.alt = '';
    img.style.cssText = 'width:15px;height:15px;display:block;flex-shrink:0;';

    const span = document.createElement('span');
    span.textContent = 'Open in Assignmint';

    btn.appendChild(img);
    btn.appendChild(span);

    btn.style.cssText = [
      'display:inline-flex',
      'align-items:center',
      'gap:6px',
      'padding:4px 10px 4px 8px',
      'border:1.5px solid #4BA87A',
      'border-radius:6px',
      'background:#fff',
      'color:#2d6e4f',
      'font-size:12.5px',
      'font-weight:600',
      'font-family:inherit',
      'cursor:pointer',
      'white-space:nowrap',
      'line-height:1.4',
      'vertical-align:middle',
      'margin-right:6px',
    ].join(';');

    btn.addEventListener('mouseenter', () => { btn.style.background = '#edfaf3'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = '#fff'; });
    btn.addEventListener('mousedown', () => { btn.style.background = '#d6f5e6'; });
    btn.addEventListener('mouseup', () => { btn.style.background = '#edfaf3'; });

    btn.addEventListener('click', () => {
      chrome.storage.local.set({ pendingAnalyze: { courseId, assignmentId } });
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });

    target.insertBefore(btn, target.firstChild);
  }

  // Breadcrumbs are server-rendered, should be present at document_idle
  injectButton();

  // Fallback for slower loads
  if (!document.getElementById('assignmint-btn')) {
    document.addEventListener('DOMContentLoaded', injectButton);
  }
})();
