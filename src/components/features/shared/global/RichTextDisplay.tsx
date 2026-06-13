import DOMPurify from 'dompurify'
import React from 'react'

interface RichTextDisplayProps {
  content: string
  className?: string
}

const RichTextDisplay = ({ content, className = '' }: RichTextDisplayProps) => {
  const cleanContent = DOMPurify.sanitize(content || '', {
    ALLOWED_TAGS: [
      'p',
      'br',
      'ul',
      'ol',
      'li',
      'strong',
      'em',
      'u',
      's',
      'code',
      'h1',
      'h2',
      'h3',
      'a',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  )
}

export default RichTextDisplay
