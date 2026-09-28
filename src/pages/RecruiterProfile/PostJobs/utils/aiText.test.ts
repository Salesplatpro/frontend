import { describe, expect, it } from 'vitest'

import { htmlToPlainText, plainTextToHtml } from './aiText'

describe('plainTextToHtml', () => {
  it('wraps each non-empty line in a paragraph', () => {
    expect(plainTextToHtml('About the Role:\n\nBuild APIs\n  ')).toBe(
      '<p>About the Role:</p><p>Build APIs</p>',
    )
  })

  it('escapes HTML so AI text cannot inject markup', () => {
    expect(plainTextToHtml('<script>alert("x")</script> & more')).toBe(
      '<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; more</p>',
    )
  })

  it('returns an empty string for blank input', () => {
    expect(plainTextToHtml('   \n\n ')).toBe('')
  })
})

describe('htmlToPlainText', () => {
  it('turns paragraphs, list items and line breaks into lines', () => {
    expect(
      htmlToPlainText(
        '<p>Intro</p><ul><li>One</li><li>Two</li></ul>Line<br/>Next',
      ),
    ).toBe('Intro\nOne\nTwo\nLine\nNext')
  })

  it('decodes common entities', () => {
    expect(
      htmlToPlainText(
        '<p>A&nbsp;&amp;&nbsp;B &lt;3 &quot;x&quot; it&#39;s</p>',
      ),
    ).toBe('A & B <3 "x" it\'s')
  })

  it('round-trips with plainTextToHtml', () => {
    const text = 'Qualifications:\n5 years of Go & SQL'
    expect(htmlToPlainText(plainTextToHtml(text))).toBe(text)
  })
})
