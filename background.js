const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const DEFAULT_COLUMNS = ['date', 'url', 'title', 'author', 'published', 'summary'];
const COLUMN_LABELS = { date: 'Date', url: 'URL', title: 'Title', author: 'Author', published: 'Published', summary: 'Summary' };

function colLetter(n) { return String.fromCharCode(64 + n); }

async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
      else resolve(token);
    });
  });
}

const DEFAULT_SUMMARY_PROMPT = 'Summarize this article in 3 concise bullet points (in the same language as the article). Do not include any intro sentence, just the bullet points:';

async function getSettings() {
  return new Promise(resolve => chrome.storage.sync.get(['geminiApiKey', 'sheetId', 'summaryMode', 'geminiModel', 'columns', 'summaryPrompt'], resolve));
}

async function createSpreadsheet(token, columns) {
  const res = await fetch(SHEETS_API, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ properties: { title: 'AI Clip Sheet' } })
  });
  const data = await res.json();
  if (data.error) throw new Error(`Sheets API error: ${data.error.message}`);
  const sheetId = data.spreadsheetId;
  const endCol = colLetter(columns.length);

  const headerRes = await fetch(`${SHEETS_API}/${sheetId}/values/Sheet1!A1:${endCol}1?valueInputOption=RAW`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [columns.map(c => COLUMN_LABELS[c])] })
  });
  const headerData = await headerRes.json();
  if (headerData.error) throw new Error(`Sheets API error: ${headerData.error.message}`);

  return sheetId;
}

async function generateSummary(apiKey, bodyText, model = 'gemini-2.5-flash', prompt = DEFAULT_SUMMARY_PROMPT) {
  if (!bodyText || bodyText.length < 50) throw new Error('Page body text too short to summarize.');
  console.log('[MD2] Calling Gemini API, model:', model, 'key prefix:', apiKey?.slice(0, 8), 'bodyText length:', bodyText.length);
  const endpoint = `${GEMINI_API_BASE}/${model}:generateContent`;
  const res = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${prompt}\n\n${bodyText}` }]
      }]
    })
  });
  const data = await res.json();
  console.log('[MD2] Gemini response:', JSON.stringify(data).slice(0, 300));
  if (data.error) throw new Error(`Gemini API error: ${data.error.message}`);
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

async function appendRow(token, sheetId, row) {
  const endCol = colLetter(row.length);
  const res = await fetch(
    `${SHEETS_API}/${sheetId}/values/Sheet1!A:${endCol}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] })
    }
  );
  const data = await res.json();
  if (data.error) throw new Error(`Sheets API error: ${data.error.message}`);
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action !== 'save') return;

  (async () => {
    try {
      const { geminiApiKey, sheetId: savedId, summaryMode, geminiModel, columns: savedColumns, summaryPrompt } = await getSettings();
      const columns = savedColumns || DEFAULT_COLUMNS;

      const needsGemini = columns.includes('summary') && summaryMode !== 'ai_formula';
      if (needsGemini && !geminiApiKey) {
        sendResponse({ error: 'Please set your Gemini API key in settings (click the ⚙ icon).' });
        return;
      }

      const token = await getAuthToken();

      let sheetId = savedId;
      if (!sheetId) {
        sheetId = await createSpreadsheet(token, columns);
        chrome.storage.sync.set({ sheetId });
      }

      const { url, title, author, publishedDate, bodyText } = msg.data;

      let summary = '';
      if (columns.includes('summary')) {
        if (summaryMode !== 'ai_formula') {
          summary = await generateSummary(geminiApiKey, bodyText, geminiModel || 'gemini-2.5-flash', summaryPrompt || DEFAULT_SUMMARY_PROMPT);
        } else {
          summary = `=AI("Summarize in 3 bullet points: ${title} ${url}")`;
        }
      }

      const now = new Date();
      const pad = n => String(n).padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const allValues = { date: dateStr, url, title, author, published: publishedDate, summary };
      const row = columns.map(c => allValues[c]);

      await appendRow(token, sheetId, row);
      sendResponse({ success: true, sheetId });
    } catch (e) {
      sendResponse({ error: e.message });
    }
  })();

  return true;
});
