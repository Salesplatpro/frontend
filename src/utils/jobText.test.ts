import { describe, expect, it } from 'vitest'

import {
  cleanPastedHtml,
  resolvePaste,
  richHtmlToMarkdown,
  shouldFormatPlainText,
  textToRichHtml,
} from './jobText'

describe('textToRichHtml', () => {
  it('keeps unstructured text as one paragraph per line', () => {
    expect(textToRichHtml('We are hiring.\n\nJoin a fast team.  ')).toBe(
      '<p>We are hiring.</p><p>Join a fast team.</p>',
    )
  })

  it('returns an empty string for blank input', () => {
    expect(textToRichHtml('   \n\n ')).toBe('')
  })

  it('escapes HTML so pasted or AI text cannot inject markup', () => {
    expect(textToRichHtml('<script>alert("x")</script> & more')).toBe(
      '<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; more</p>',
    )
  })

  it.each([
    ['dashes', '- Own the pipeline\n- Close deals'],
    ['asterisks', '* Own the pipeline\n* Close deals'],
    ['bullet glyphs', '• Own the pipeline\n•Close deals'],
    ['Word plain-text bullets', '·\tOwn the pipeline\no\tClose deals'],
    ['en dashes', '– Own the pipeline\n– Close deals'],
  ])('turns %s into a bulleted list', (_label, text) => {
    expect(textToRichHtml(text)).toBe(
      '<ul><li>Own the pipeline</li><li>Close deals</li></ul>',
    )
  })

  it.each([
    ['1. and 2.', '1. Apply\n2. Interview'],
    ['1) and 2)', '1) Apply\n2) Interview'],
    ['(1) and (2)', '(1) Apply\n(2) Interview'],
    ['a. and b.', 'a. Apply\nb. Interview'],
  ])('turns %s into a numbered list', (_label, text) => {
    expect(textToRichHtml(text)).toBe(
      '<ol><li>Apply</li><li>Interview</li></ol>',
    )
  })

  it.each([
    [
      'a short line ending in a colon',
      'Responsibilities:',
      'Responsibilities:',
    ],
    ['a Markdown heading', '## About the Role', 'About the Role'],
    ['a whole-line bold heading', '**About the Role**', 'About the Role'],
    ['an ALL-CAPS line', 'WHAT WE OFFER', 'WHAT WE OFFER'],
  ])('bolds %s as a section header', (_label, line, heading) => {
    expect(
      textToRichHtml(
        `${line}\nWe ship every week and value ownership above all else in this team.`,
      ),
    ).toBe(
      `<p><strong>${heading}</strong></p><p>We ship every week and value ownership above all else in this team.</p>`,
    )
  })

  it('does not treat a long sentence ending in a colon as a header', () => {
    const line =
      'In this role you will be expected to handle all of the following:'
    expect(textToRichHtml(line)).toBe(`<p>${line}</p>`)
  })

  it('does not treat short all-caps acronyms as a header', () => {
    expect(textToRichHtml('SQL, AWS, GCP')).toBe('<p>SQL, AWS, GCP</p>')
  })

  it('lists short lines under a header whose bullet glyphs were lost', () => {
    expect(
      textToRichHtml(
        'Responsibilities:\n\nOwn the sales pipeline\nClose mid-market deals\nReport weekly to the CEO',
      ),
    ).toBe(
      '<p><strong>Responsibilities:</strong></p><ul><li>Own the sales pipeline</li><li>Close mid-market deals</li><li>Report weekly to the CEO</li></ul>',
    )
  })

  it('does not list a wrapped paragraph under a header', () => {
    expect(
      textToRichHtml(
        'About the Role:\nWe are looking for a talented engineer to join our\ngrowing team in Lagos.',
      ),
    ).toBe(
      '<p><strong>About the Role:</strong></p><p>We are looking for a talented engineer to join our</p><p>growing team in Lagos.</p>',
    )
  })

  it('does not list a single line under a header', () => {
    expect(textToRichHtml('About the Role:\nWe build payments.')).toBe(
      '<p><strong>About the Role:</strong></p><p>We build payments.</p>',
    )
  })

  it('bolds the label of a "Label: value" line', () => {
    expect(textToRichHtml('Years of Experience: 3+')).toBe(
      '<p><strong>Years of Experience:</strong> 3+</p>',
    )
  })

  it('does not bold the start of a sentence that contains a colon', () => {
    expect(textToRichHtml('We offer the following: health, pension')).toBe(
      '<p>We offer the following: health, pension</p>',
    )
  })

  it('renders inline bold and italic', () => {
    expect(
      textToRichHtml('- **Must** have *strong* closing skills and __grit__'),
    ).toBe(
      '<ul><li><strong>Must</strong> have <em>strong</em> closing skills and <strong>grit</strong></li></ul>',
    )
  })

  it.each([
    'Use snake_case_names in code',
    'Multiply 2*3*4',
    'Send file_name.pdf today',
    'a * b',
  ])('leaves "%s" untouched', (text) => {
    expect(textToRichHtml(text)).toBe(`<p>${text}</p>`)
  })

  it('turns AI Markdown output into editor HTML', () => {
    expect(
      textToRichHtml(
        '**About the Role**\nYou will lead *enterprise* sales.\n\n**Responsibilities**\n- Own the pipeline\n- Close deals',
      ),
    ).toBe(
      '<p><strong>About the Role</strong></p><p>You will lead <em>enterprise</em> sales.</p><p><strong>Responsibilities</strong></p><ul><li>Own the pipeline</li><li>Close deals</li></ul>',
    )
  })
})

describe('shouldFormatPlainText', () => {
  it.each([
    ['bullets', 'Intro\n- One'],
    ['numbers', 'Steps\n1. One'],
    ['a header', 'Responsibilities:\nOwn the pipeline'],
    ['inline bold', 'Intro\nThis is **important**'],
  ])('is true for multi-line text with %s', (_label, text) => {
    expect(shouldFormatPlainText(text)).toBe(true)
  })

  it.each([
    ['a single line', '- One'],
    ['plain paragraphs', 'We are hiring.\nJoin us.'],
  ])('is false for %s', (_label, text) => {
    expect(shouldFormatPlainText(text)).toBe(false)
  })
})

describe('cleanPastedHtml', () => {
  it('returns null when the HTML needs no fixing', () => {
    expect(
      cleanPastedHtml(
        '<p>Intro</p><ul><li>One</li></ul><p><strong>Bold</strong></p>',
      ),
    ).toBeNull()
  })

  it('unwraps the Google Docs wrapper that would bold the whole paste', () => {
    expect(
      cleanPastedHtml(
        '<b style="font-weight:normal;" id="docs-internal-guid-1234"><p>Intro</p><ul><li>One</li></ul></b>',
      ),
    ).toBe('<p>Intro</p><ul><li>One</li></ul>')
  })

  it('turns Word list paragraphs into list items without their glyphs', () => {
    const html =
      '<p class="MsoListParagraphCxSpFirst" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">·<span>&nbsp;</span></span>Own the pipeline</p>\n' +
      '<p class="MsoListParagraphCxSpLast" style="mso-list:l0 level1 lfo1"><span style="mso-list:Ignore">·<span>&nbsp;</span></span>Close deals</p>'
    expect(cleanPastedHtml(html)).toBe(
      '<ul><li>Own the pipeline</li><li>Close deals</li></ul>\n',
    )
  })

  it('turns numbered Word list paragraphs into an ordered list', () => {
    const html =
      '<p class="MsoListParagraph"><span style="mso-list:Ignore">1.<span> </span></span>Apply</p>' +
      '<p class="MsoListParagraph"><span style="mso-list:Ignore">2.<span> </span></span>Interview</p>'
    expect(cleanPastedHtml(html)).toBe(
      '<ol><li>Apply</li><li>Interview</li></ol>',
    )
  })

  it('turns paragraphs that start with a bullet glyph into list items', () => {
    expect(
      cleanPastedHtml('<p>• Own the pipeline</p><p>• Close deals</p>'),
    ).toBe('<ul><li>Own the pipeline</li><li>Close deals</li></ul>')
  })

  it('turns headings into bold paragraphs', () => {
    expect(cleanPastedHtml('<h2>Benefits</h2><p>Health cover</p>')).toBe(
      '<p><strong>Benefits</strong></p><p>Health cover</p>',
    )
  })
})

describe('resolvePaste', () => {
  it('lets the editor paste normally when there is nothing to improve', () => {
    expect(resolvePaste({ html: '', text: 'Just one line' })).toBeNull()
    expect(
      resolvePaste({
        html: '<ul><li>One</li></ul>',
        text: '- One\n- Two',
      }),
    ).toBeNull()
  })

  it('formats structured plain text that came with no HTML', () => {
    expect(resolvePaste({ html: '', text: '- One\n- Two' })).toBe(
      '<ul><li>One</li><li>Two</li></ul>',
    )
  })

  it('formats the plain text when the HTML carries no formatting', () => {
    expect(
      resolvePaste({
        html: '<div><span style="color:#333">- One</span></div><div><span>- Two</span></div>',
        text: '- One\n- Two',
      }),
    ).toBe('<ul><li>One</li><li>Two</li></ul>')
  })

  it('uses cleaned HTML when the clipboard HTML needed fixing', () => {
    expect(resolvePaste({ html: '<h3>Benefits</h3>', text: 'Benefits' })).toBe(
      '<p><strong>Benefits</strong></p>',
    )
  })
})

describe('richHtmlToMarkdown', () => {
  it('keeps headers, lists and emphasis for the AI', () => {
    expect(
      richHtmlToMarkdown(
        '<p><strong>Responsibilities</strong></p><ul><li>Own the <em>pipeline</em></li><li>Close&nbsp;deals &amp; more</li></ul><p><br></p>',
      ),
    ).toBe('**Responsibilities**\n- Own the *pipeline*\n- Close deals & more')
  })

  it('round-trips through textToRichHtml', () => {
    const html =
      '<p><strong>Responsibilities</strong></p><ul><li>Own the pipeline</li><li>Close deals</li></ul>'
    expect(textToRichHtml(richHtmlToMarkdown(html))).toBe(html)
  })
})
