# AIClipSheet

A Chrome extension that saves any webpage to Google Sheets with an AI-generated summary powered by Gemini.

## Features

- One-click save: captures URL, title, author, publish date, and AI summary
- Configurable columns — choose exactly which fields to save
- Customizable Summary Prompt — write your own instruction for how AI summarizes pages
- Gemini model selector (gemini-2.5-flash, 2.0-flash, 1.5-flash, 1.5-pro)
- Writes directly to your own Google Sheets — no intermediate server
- Free Gemini API tier supported

## Installation

### Chrome Web Store (recommended)

*(Coming soon)*

### Manual Installation (Developer Mode)

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
4. **Summary Prompt** — optionally customize how AI summarizes pages (leave blank for default)
5. **Gemini API Key** — get a free key at [aistudio.google.com](https://aistudio.google.com/apikey) and paste it in
6. **Gemini Model** — default is `gemini-2.5-flash`
7. **Google Account** — click "Connect Google Account" and authorize
8. Click **Save Settings**

## Usage

1. Open any article or webpage
2. Click the AIClipSheet extension icon
3. Click **Save to Sheets**
4. A row is appended to your Google Spreadsheet with the page data and AI summary

## Custom Summary Prompt Examples

| Prompt | Output |
|--------|--------|
| *(blank — uses default)* | 3 bullet points in the article's language |
| `Summarize in 1 sentence under 50 words:` | Single concise sentence |
| `List 5 key takeaways as a numbered list:` | Numbered list |
| `この記事を日本語で3行にまとめてください：` | Japanese 3-line summary |

## Disclaimer

Use at your own risk. Do not use this extension on pages containing sensitive personal or financial information.

## Privacy

This extension does not collect or transmit your data to any third-party server owned by the developer. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## License

MIT License — see [LICENSE](LICENSE)
