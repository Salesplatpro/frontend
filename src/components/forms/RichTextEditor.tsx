import 'react-quill/dist/quill.snow.css'

import Quill from 'quill'
import React, { useRef } from 'react'
import ReactQuill from 'react-quill'

import styles from './RichTextEditor.module.scss'

// Register custom font families once
const Font = Quill.import('formats/font') as {
  whitelist: string[]
} & typeof Quill
Font.whitelist = ['inter', 'raleway', 'poppins', 'serif', 'monospace']
Quill.register(Font, true)

interface RichTextEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  size?: 'compact' | 'standard'
}

const TOOLBAR_MODULES = {
  toolbar: [
    [
      { font: ['inter', 'raleway', 'poppins', 'serif', 'monospace'] },
      { size: ['small', false, 'large', 'huge'] },
    ],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'clean'],
  ],
}

const FORMATS = [
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'color',
  'background',
  'align',
  'list',
  'bullet',
  'indent',
  'link',
]

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
}) => {
  const quillRef = useRef<ReactQuill | null>(null)

  const wordCount = value ? countWords(value) : 0
  const isAtLimit = !!maxLength && wordCount >= maxLength

  const handleChange = (content: string) => {
    if (maxLength) {
      const count = countWords(content)
      if (count > maxLength) return
    }
    onChange(content)
  }

  const wrapperClass = [styles.wrapper, styles[size]].filter(Boolean).join(' ')

  return (
    <div id={id} className={wrapperClass}>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        modules={TOOLBAR_MODULES}
        formats={FORMATS}
        className="flex-1 border-none custom-quill"
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
