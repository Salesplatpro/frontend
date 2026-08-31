import 'react-quill/dist/quill.snow.css'

import React, { useRef } from 'react'
import ReactQuill from 'react-quill'

import styles from './RichTextEditor.module.scss'

interface RichTextEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  size?: 'compact' | 'standard'
  invalid?: boolean
}

const TOOLBAR_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'clean'],
  ],
}

const FORMATS = ['bold', 'italic', 'underline', 'list', 'bullet', 'link']

function countWords(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean)
  return words.length
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  id,
  value,
  onChange,
  placeholder,
  maxLength,
  size = 'standard',
  invalid,
}) => {
  const quillRef = useRef<ReactQuill | null>(null)

  const wordCount = value ? countWords(value) : 0
  const isAtLimit = !!maxLength && wordCount >= maxLength

  const handleChange = (html: string) => {
    if (maxLength) {
      const count = countWords(html)
      if (count > maxLength) return
    }
    onChange(html)
  }

  const wrapperClass = [
    styles.wrapper,
    styles[size],
    invalid ? styles.invalid : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      id={id}
      data-field={id}
      tabIndex={-1}
      className={wrapperClass}
      aria-invalid={invalid || undefined}>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={TOOLBAR_MODULES}
        formats={FORMATS}
        className={styles.editor}
      />
      {maxLength && (
        <div className={styles.footer}>
          <span
            className={[styles.wordCount, isAtLimit ? styles.atLimit : '']
              .filter(Boolean)
              .join(' ')}>
            {wordCount} / {maxLength} words
          </span>
        </div>
      )}
    </div>
  )
}

export default RichTextEditor
