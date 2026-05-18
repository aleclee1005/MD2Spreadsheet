const DEFAULT_COLUMNS = ['date', 'url', 'title', 'author', 'published', 'summary'];

async function load() {
  const { geminiApiKey, sheetId, summaryMode, geminiModel, columns } = await chrome.storage.sync.get(['geminiApiKey', 'sheetId', 'summaryMode', 'geminiModel', 'columns']);
  if (geminiApiKey) document.getElementById('gemini-key').value = geminiApiKey;
  if (summaryMode) document.getElementById('summary-mode').value = summaryMode;
  if (geminiModel) document.getElementById('gemini-model').value = geminiModel;

  const enabled = columns || DEFAULT_COLUMNS;
  DEFAULT_COLUMNS.forEach(col => {
    document.getElementById(`col-${col}`).checked = enabled.includes(col);
  });

  if (sheetId) {
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}`;
    document.getElementById('sheet-status').textContent = 'Connected';
    document.getElementById('sheet-status').style.color = '#1a7340';
    const link = document.getElementById('sheet-open');
    link.href = url;
    link.style.display = 'inline';
  }
}

document.getElementById('save-btn').addEventListener('click', async () => {
  const geminiApiKey = document.getElementById('gemini-key').value.trim();
  const summaryMode = document.getElementById('summary-mode').value;
  const geminiModel = document.getElementById('gemini-model').value;
  const columns = DEFAULT_COLUMNS.filter(col => document.getElementById(`col-${col}`).checked);

  if (columns.length === 0) {
    const msg = document.getElementById('msg');
    msg.textContent = 'Please select at least one column.';
    msg.style.color = '#c0392b';
    setTimeout(() => { msg.textContent = ''; msg.style.color = '#1a7340'; }, 2000);
    return;
  }

  await chrome.storage.sync.set({ geminiApiKey, summaryMode, geminiModel, columns });
  const msg = document.getElementById('msg');
  msg.textContent = '✓ Saved!';
  msg.style.color = '#1a7340';
  setTimeout(() => { msg.textContent = ''; }, 2000);
});

document.getElementById('connect-btn').addEventListener('click', () => {
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (chrome.runtime.lastError || !token) {
      document.getElementById('sheet-status').textContent = 'Auth failed: ' + (chrome.runtime.lastError?.message || 'unknown error');
      document.getElementById('sheet-status').style.color = '#c0392b';
      return;
    }
    document.getElementById('sheet-status').textContent = 'Connected';
    document.getElementById('sheet-status').style.color = '#1a7340';
  });
});

document.getElementById('disconnect-btn').addEventListener('click', () => {
  chrome.identity.getAuthToken({ interactive: false }, (token) => {
    if (token) chrome.identity.removeCachedAuthToken({ token });
  });
  chrome.storage.sync.remove('sheetId');
  document.getElementById('sheet-status').textContent = 'Disconnected';
  document.getElementById('sheet-status').style.color = '#555';
  document.getElementById('sheet-open').style.display = 'none';
});

load();
