const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])

export const plainTextToHtml = (text: string): string =>
  text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')

export const htmlToPlainText = (html: string): string =>
  html
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|li|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(
      /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g,
      (entity) => HTML_ENTITIES[entity],
    )
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
