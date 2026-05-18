const DEFAULT_COLUMNS = ['date', 'url', 'title', 'author', 'published', 'summary'];
const LABEL = { date: 'Date', url: 'URL', title: 'Title', author: 'Author', published: 'Published', summary: 'Summary' };

document.getElementById('options-link').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

// Show sheet link if already connected
chrome.storage.sync.get('sheetId', ({ sheetId }) => {
  if (sheetId) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}`;
    document.getElementById('sheet-url').href = url;
    document.getElementById('sheet-link').style.display = 'flex';
  }
});

// Extract and preview page data on popup open
(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url?.startsWith('http')) return;

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    const data = result.result;
    const { columns } = await chrome.storage.sync.get('columns');
    const enabled = columns || DEFAULT_COLUMNS;

    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const values = {
      date: dateStr,
      url: data.url,
      title: data.title,
      author: data.author || '—',
      published: data.publishedDate || '—',
      summary: null
    };

    const preview = document.getElementById('preview');
    const divider = document.getElementById('preview-divider');

    enabled.forEach(col => {
      const row = document.createElement('div');
      row.className = 'preview-row';

      const label = document.createElement('div');
      label.className = 'preview-label';
      label.textContent = LABEL[col];

      const value = document.createElement('div');
      value.className = 'preview-value';

      if (col === 'summary') {
        value.textContent = 'AI will generate…';
        value.classList.add('ai');
      } else {
        value.textContent = values[col] || '—';
        value.title = values[col] || '';
      }

      row.appendChild(label);
      row.appendChild(value);
      preview.appendChild(row);
    });

    preview.style.display = 'block';
    divider.style.display = 'block';

    // Cache data for save button
    window._pageData = data;
  } catch (e) {
    // Silent fail — preview is optional
  }
})();

document.getElementById('save-btn').addEventListener('click', async () => {
  const btn = document.getElementById('save-btn');
  const status = document.getElementById('status');
  const sheetLink = document.getElementById('sheet-link');

  btn.disabled = true;
  status.className = '';
  status.textContent = 'Generating summary…';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.url?.startsWith('http')) throw new Error('Cannot save this page (not an HTTP page).');

    // Use cached data if available, otherwise re-extract
    let data = window._pageData;
    if (!data) {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      data = result.result;
    }

    const response = await chrome.runtime.sendMessage({ action: 'save', data });
    if (response.error) throw new Error(response.error);

    status.className = 'success';
    status.textContent = '✓ Saved!';

    if (response.sheetId) {
      const url = `https://docs.google.com/spreadsheets/d/${response.sheetId}`;
      document.getElementById('sheet-url').href = url;
      sheetLink.style.display = 'flex';
    }
  } catch (e) {
    status.className = 'error';
    status.textContent = e.message;
  } finally {
    btn.disabled = false;
  }
});
