# AIClipSheet

A Chrome extension that saves any webpage to Google Sheets with an AI-generated summary powered by Gemini.

## Features

- One-click save: captures URL, title, author, publish date, and AI summary
- Configurable columns — choose exactly which fields to save
- Gemini model selector (gemini-2.5-flash, 2.0-flash, 1.5-flash, 1.5-pro)
- Writes directly to your own Google Sheets — no intermediate server
- Free Gemini API tier supported

## Installation (Manual)

Until the extension is published on the Chrome Web Store, install it manually:

1. Download or clone this repository
   ```
   git clone https://github.com/aleclee1005/AIClipSheet.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the `AIClipSheet` folder
5. The extension icon will appear in your toolbar

## Setup

1. Click the extension icon → click the **⚙** settings icon
2. **Columns to Save** — check the fields you want recorded
3. **AI Summary Method** — select "Gemini API" (recommended)
4. **Gemini API Key** — get a free key at [aistudio.google.com](https://aistudio.google.com/apikey) and paste it in
5. **Gemini Model** — default is `gemini-2.5-flash`
6. **Google Account** — click "Connect Google Account" and authorize
7. Click **Save Settings**

## Usage

1. Open any article or webpage
2. Click the AIClipSheet extension icon
3. Click **Save to Sheets**
4. A row is appended to your Google Spreadsheet with the page data and AI summary

## Privacy

This extension does not collect or transmit your data to any third-party server owned by the developer. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## License

MIT License — see [LICENSE](LICENSE)
