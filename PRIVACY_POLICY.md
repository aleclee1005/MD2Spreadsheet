# Privacy Policy for AI Clip Sheet

_Last updated: May 19, 2026_

## Overview

AI Clip Sheet is a Chrome browser extension that saves webpage content to the user's own Google Sheets using the Google Sheets API and generates summaries via the Google Gemini API. This policy explains what data is accessed, how it is used, and what is never collected.

## Data Accessed

When you click "Save to Sheets", the extension accesses the following data from the active browser tab:

| Data | Purpose |
|---|---|
| Page URL | Recorded as a reference link in your spreadsheet |
| Page title | Recorded in your spreadsheet |
| Author metadata | Recorded in your spreadsheet (if available on the page) |
| Publication date | Recorded in your spreadsheet (if available on the page) |
| Page body text (up to 5,000 characters) | Sent to the Google Gemini API to generate a summary |

## How Data Is Used

- **Page content** is sent directly to the [Google Gemini API](https://ai.google.dev/) using your own API key to generate a text summary. This is a direct call from your browser to Google's servers.
- **Summary and metadata** are written to a Google Spreadsheet in your own Google Drive using the [Google Sheets API](https://developers.google.com/sheets), authenticated via your own Google account.
- Your **Gemini API key** is stored locally in Chrome's `storage.sync` and is only used to authenticate requests to the Gemini API.

## Data We Do NOT Collect

The developer of this extension does **not**:

- Operate any backend server or database
- Collect, receive, store, or transmit your personal data, browsing history, or page content to any server controlled by the developer
- Track your usage or activity in any way
- Share any data with third parties beyond the Google APIs listed above

All data flows directly between your browser, Google Sheets, and Google Gemini — the developer has no access to any of it.

## Third-Party Services

This extension relies on the following Google services, each governed by Google's own privacy policies:

- [Google Sheets API](https://developers.google.com/sheets)
- [Google Drive API](https://developers.google.com/drive)
- [Google Gemini API](https://ai.google.dev/)
- [Google Identity / OAuth 2.0](https://developers.google.com/identity)

Please refer to [Google's Privacy Policy](https://policies.google.com/privacy) for details on how Google handles your data.

## Data Retention

The extension stores the following data locally in your browser via Chrome's `storage.sync`:

- Your Gemini API key
- Your Google Spreadsheet ID
- Your selected settings (columns, model, summary method)

This data remains on your device and synced across your Chrome profile. You can clear it at any time by clicking "Disconnect" in the extension settings or removing the extension.

## Contact

If you have questions about this privacy policy, please open an issue at:
[https://github.com/aleclee1005/AIClipSheet/issues](https://github.com/aleclee1005/AIClipSheet/issues)
