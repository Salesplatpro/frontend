import { describe, expect, it } from 'vitest'

import { htmlToPlainText } from './aiText'

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
})
