document.getElementById('options-link').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

chrome.storage.sync.get('sheetId', ({ sheetId }) => {
  if (sheetId) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}`;
    document.getElementById('sheet-url').href = url;
    document.getElementById('sheet-link').style.display = 'block';
  }
});

document.getElementById('save-btn').addEventListener('click', async () => {
  const btn = document.getElementById('save-btn');
  const status = document.getElementById('status');
  const sheetLink = document.getElementById('sheet-link');

  btn.disabled = true;
  status.className = '';
  status.textContent = 'Extracting page content…';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url?.startsWith('http')) {
      throw new Error('Cannot save this page (not an HTTP page).');
    }

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    const data = result.result;
    status.textContent = 'Generating summary…';

    const response = await chrome.runtime.sendMessage({ action: 'save', data });

    if (response.error) throw new Error(response.error);

    status.className = 'success';
    status.textContent = '✓ Saved!';

    if (response.sheetId) {
      const url = `https://docs.google.com/spreadsheets/d/${response.sheetId}`;
      document.getElementById('sheet-url').href = url;
      sheetLink.style.display = 'block';
    }
  } catch (e) {
    status.className = 'error';
    status.textContent = e.message;
  } finally {
    btn.disabled = false;
  }
});
