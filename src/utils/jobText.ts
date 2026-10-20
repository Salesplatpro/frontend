// Turns job description text into the HTML the job editor stores. Output is
// limited to tags both the Quill editor (components/forms/RichTextEditor) and
// RichTextDisplay's sanitiser keep: p, strong, em, ul, ol, li.

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

const BULLET_LINE = /^\s*(?:[•●○◦▪■·➢✓✔→]\s*|[-*–]\s+|o\t)(\S.*)$/
const NUMBERED_LINE = /^\s*(?:\(?\d{1,2}[.)]|[a-z][.)])\s+(\S.*)$/
const MARKDOWN_HEADING = /^#{1,6}\s+(\S.*)$/
const WHOLE_LINE_BOLD = /^(\*\*|__)(\S(?:.*\S)?)\1(:?)$/
const LABEL_LINE = /^([A-Z][A-Za-z0-9 &/'()-]*):\s+(\S.*)$/
const LABEL_SMALL_WORDS = new Set([
  'of',
  'and',
  'the',
  'per',
  'to',
  'for',
  'in',
  'a',
  'an',
  'or',
  '&',
])

const BOLD = /(\*\*|__)(\S(?:[\s\S]*?\S)?)\1/
const ITALIC = /(^|[\s([{"'])(\*|_)(\S(?:[\s\S]*?\S)?)\2(?=$|[\s)\]}.,;:!?"'])/

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length

const renderItalic = (text: string): string => {
  let html = ''
  let rest = text
  for (let match = ITALIC.exec(rest); match; match = ITALIC.exec(rest)) {
    html += `${escapeHtml(
      rest.slice(0, match.index) + match[1],
    )}<em>${escapeHtml(match[3])}</em>`
    rest = rest.slice(match.index + match[0].length)
  }
  return html + escapeHtml(rest)
}

const renderInline = (text: string): string => {
  let html = ''
  let rest = text
  for (let match = BOLD.exec(rest); match; match = BOLD.exec(rest)) {
    html += `${renderItalic(rest.slice(0, match.index))}<strong>${renderItalic(
      match[2],
    )}</strong>`
    rest = rest.slice(match.index + match[0].length)
  }
  return html + renderItalic(rest)
}

const headingText = (line: string): string | null => {
  const markdown = MARKDOWN_HEADING.exec(line)
  if (markdown) return markdown[1]

  const bold = WHOLE_LINE_BOLD.exec(line)
  if (bold) return `${bold[2]}${bold[3]}`

  if (line.endsWith(':') && line.length <= 60 && wordCount(line) <= 8) {
    return line
  }

  if (
    line.length <= 60 &&
    !/\d/.test(line) &&
    line === line.toUpperCase() &&
    /[A-Z]{4}/.test(line)
  ) {
    return line
  }

  return null
}

// "Location", "Job Type", "Years of Experience" — but not a sentence such as
// "We offer the following".
const isLabel = (label: string) => {
  const words = label.split(/\s+/).filter(Boolean)
  return (
    words.length <= 4 &&
    words.every(
      (word) => /^[A-Z0-9(]/.test(word) || LABEL_SMALL_WORDS.has(word),
    )
  )
}

type Line =
  | { kind: 'blank' }
  | { kind: 'bullet' | 'numbered' | 'heading'; text: string }
  | { kind: 'label'; label: string; text: string }
  | { kind: 'text'; text: string }

const classify = (raw: string): Line => {
  const line = raw.trim()
  if (!line) return { kind: 'blank' }

  const bullet = BULLET_LINE.exec(raw)
  if (bullet) return { kind: 'bullet', text: bullet[1].trim() }

  const numbered = NUMBERED_LINE.exec(raw)
  if (numbered) return { kind: 'numbered', text: numbered[1].trim() }

  const heading = headingText(line)
  if (heading !== null) return { kind: 'heading', text: heading }

  const label = LABEL_LINE.exec(line)
  if (label && isLabel(label[1])) {
    return { kind: 'label', label: label[1], text: label[2] }
  }

  return { kind: 'text', text: line }
}

// A line under a heading that reads like a list entry whose glyph was lost
// (PDF and LinkedIn copies): short, one sentence, and not the lowercase
// continuation of a wrapped paragraph.
const isImplicitListItem = (line: Line) =>
  line.kind === 'text' &&
  wordCount(line.text) <= 20 &&
  !/[.!?]\s+\S/.test(line.text) &&
  !/^[a-z]/.test(line.text)

const splitLines = (text: string) =>
  text
    .replace(/\r\n?/g, '\n')
    .replace(/\u00a0/g, ' ')
    .split('\n')

export const textToRichHtml = (text: string): string => {
  const lines = splitLines(text).map(classify)
  const blocks: string[] = []

  const pushList = (tag: 'ul' | 'ol', items: string[]) => {
    blocks.push(
      `<${tag}>${items
        .map((item) => `<li>${renderInline(item)}</li>`)
        .join('')}</${tag}>`,
    )
  }

  let index = 0
  while (index < lines.length) {
    const line = lines[index]

    if (line.kind === 'blank') {
      index += 1
    } else if (line.kind === 'bullet' || line.kind === 'numbered') {
      const items: string[] = []
      while (index < lines.length && lines[index].kind === line.kind) {
        items.push((lines[index] as { text: string }).text)
        index += 1
      }
      pushList(line.kind === 'bullet' ? 'ul' : 'ol', items)
    } else if (line.kind === 'heading') {
      blocks.push(`<p><strong>${renderInline(line.text)}</strong></p>`)
      index += 1

      let start = index
      while (start < lines.length && lines[start].kind === 'blank') start += 1
      let end = start
      while (end < lines.length && isImplicitListItem(lines[end])) end += 1
      if (end - start >= 2) {
        pushList(
          'ul',
          lines
            .slice(start, end)
            .map((item) => (item as { text: string }).text),
        )
        index = end
      }
    } else if (line.kind === 'label') {
      blocks.push(
        `<p><strong>${renderInline(line.label)}:</strong> ${renderInline(
          line.text,
        )}</p>`,
      )
      index += 1
    } else {
      blocks.push(`<p>${renderInline(line.text)}</p>`)
      index += 1
    }
  }

  return blocks.join('')
}

/** True when pasted plain text carries structure worth turning into lists or bold. */
export const shouldFormatPlainText = (text: string): boolean => {
  const lines = splitLines(text).filter((line) => line.trim())
  if (lines.length < 2) return false
  return lines.some((raw) => {
    const kind = classify(raw).kind
    return (
      kind === 'bullet' ||
      kind === 'numbered' ||
      kind === 'heading' ||
      BOLD.test(raw)
    )
  })
}

const RICH_HTML_MARKUP = /<(?:ul|ol|li|b|strong|em|i|u|h[1-6])[\s>]/i
const RICH_HTML_STYLE =
  /font-weight:\s*(?:bold|[6-9]00)|font-style:\s*italic|mso-list/i

const LIST_GLYPH = /^\s*(?:[•●○◦▪■·➢✓✔→]\s*|[-*–]\s+)/
const ORDERED_MARKER = /^\s*(?:\(?\d{1,2}|[a-z])[.)]/i

// Word puts the bullet glyph or number in a span styled `mso-list:Ignore`.
const takeWordListMarker = (paragraph: Element): string => {
  let marker = ''
  paragraph.querySelectorAll('[style]').forEach((element) => {
    if (/mso-list:\s*ignore/i.test(element.getAttribute('style') ?? '')) {
      marker += element.textContent ?? ''
      element.remove()
    }
  })
  return marker
}

const stripLeadingGlyph = (paragraph: Element) => {
  const walker = paragraph.ownerDocument.createTreeWalker(
    paragraph,
    NodeFilter.SHOW_TEXT,
  )
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent ?? ''
    if (!text.trim()) continue
    node.textContent = text.replace(LIST_GLYPH, '')
    return
  }
}

const previousElement = (node: Element): Element | null => {
  let sibling = node.previousSibling
  while (
    sibling &&
    sibling.nodeType === Node.TEXT_NODE &&
    !sibling.textContent?.trim()
  ) {
    sibling = sibling.previousSibling
  }
  return sibling?.nodeType === Node.ELEMENT_NODE ? (sibling as Element) : null
}

const LIST_MARK = 'data-job-text-list'

const moveIntoList = (paragraph: Element, tag: 'ul' | 'ol') => {
  const doc = paragraph.ownerDocument
  const item = doc.createElement('li')
  while (paragraph.firstChild) item.appendChild(paragraph.firstChild)

  const previous = previousElement(paragraph)
  if (
    previous?.tagName.toLowerCase() === tag &&
    previous.hasAttribute(LIST_MARK)
  ) {
    previous.appendChild(item)
    paragraph.remove()
    return
  }
  const list = doc.createElement(tag)
  list.setAttribute(LIST_MARK, '')
  list.appendChild(item)
  paragraph.replaceWith(list)
}

/**
 * Fixes clipboard HTML that Quill 1 would otherwise mangle: the Google Docs
 * wrapper that bolds a whole paste, Word's paragraph-based lists, paragraphs
 * that start with a bullet glyph, and headings the editor has no format for.
 * Returns null when nothing needed changing so the editor's own paste runs.
 */
export const cleanPastedHtml = (html: string): string | null => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  let changed = false

  doc.querySelectorAll('b[id^="docs-internal-guid"]').forEach((wrapper) => {
    wrapper.replaceWith(...Array.from(wrapper.childNodes))
    changed = true
  })

  doc.querySelectorAll('p').forEach((paragraph) => {
    const isWordList =
      /^MsoListParagraph/i.test(paragraph.getAttribute('class') ?? '') ||
      /mso-list/i.test(paragraph.getAttribute('style') ?? '')
    if (isWordList) {
      const marker = takeWordListMarker(paragraph)
      moveIntoList(paragraph, ORDERED_MARKER.test(marker) ? 'ol' : 'ul')
      changed = true
    } else if (LIST_GLYPH.test(paragraph.textContent ?? '')) {
      stripLeadingGlyph(paragraph)
      moveIntoList(paragraph, 'ul')
      changed = true
    }
  })

  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const paragraph = doc.createElement('p')
    const strong = doc.createElement('strong')
    while (heading.firstChild) strong.appendChild(heading.firstChild)
    paragraph.appendChild(strong)
    heading.replaceWith(paragraph)
    changed = true
  })

  if (!changed) return null
  doc
    .querySelectorAll(`[${LIST_MARK}]`)
    .forEach((list) => list.removeAttribute(LIST_MARK))
  return doc.body.innerHTML
}

/**
 * HTML to insert for a paste into the job editor, or null to let the editor
 * paste normally.
 */
export const resolvePaste = ({
  html,
  text,
}: {
  html: string
  text: string
}): string | null => {
  if (html) {
    const cleaned = cleanPastedHtml(html)
    if (cleaned !== null) return cleaned
    if (RICH_HTML_MARKUP.test(html) || RICH_HTML_STYLE.test(html)) return null
  }
  return shouldFormatPlainText(text) ? textToRichHtml(text) : null
}

/** Editor HTML as the Markdown subset the AI reads and writes. */
export const richHtmlToMarkdown = (html: string): string =>
  html
    .replace(/<\s*(?:strong|b)(?:\s[^>]*)?>/gi, '**')
    .replace(/<\/\s*(?:strong|b)\s*>/gi, '**')
    .replace(/<\s*(?:em|i)(?:\s[^>]*)?>/gi, '*')
    .replace(/<\/\s*(?:em|i)\s*>/gi, '*')
    .replace(/<\s*li(?:\s[^>]*)?>/gi, '- ')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(?:p|li|h[1-6]|ul|ol)\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(
      /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;/g,
      (entity) => HTML_ENTITIES[entity],
    )
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && line !== '**' && line !== '*')
    .join('\n')
