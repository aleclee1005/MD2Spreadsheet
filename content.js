(function () {
  function getMeta(...names) {
    for (const name of names) {
      const el = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );
      if (el?.content) return el.content;
    }
    return '';
  }

  function getAuthor() {
    const meta = getMeta('author', 'article:author', 'og:author', 'twitter:creator');
    if (meta) return meta;
    const el = document.querySelector(
      '[rel="author"], [data-component="byline-block"] p, .author, .byline, [itemprop="author"], .contributor, .article-author, .post-author'
    );
    return el?.innerText?.trim() || '';
  }

  function getBodyText() {
    const selectors = [
      'article', 'main', '[role="main"]',
      '.article-body', '.post-content', '.entry-content', '#content'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && el.innerText.trim().length > 200) {
        return el.innerText.trim().slice(0, 5000);
      }
    }
    return document.body.innerText.trim().slice(0, 5000);
  }

  return {
    url: window.location.href,
    title: getMeta('og:title', 'twitter:title') || document.title,
    author: getAuthor(),
    publishedDate: (() => {
      const meta = getMeta('article:published_time', 'publishedDate', 'date', 'DC.date');
      if (meta) return meta.slice(0, 10);
      const timeEl = document.querySelector('time[datetime]');
      return timeEl?.getAttribute('datetime')?.slice(0, 10) || '';
    })(),
    description: getMeta('og:description', 'twitter:description', 'description') ||
      document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    siteName: getMeta('og:site_name') ||
      document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
      (() => {
        const host = window.location.hostname.replace(/^www\./, '');
        const parts = host.split('.');
        const domain = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
        return domain.charAt(0).toUpperCase() + domain.slice(1);
      })(),
    bodyText: getBodyText()
  };
})();
