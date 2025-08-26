import 'react-quill/dist/quill.snow.css'

import React, { useEffect, useRef } from 'react'
import ReactQuill from 'react-quill'
import { Tooltip } from 'react-tooltip'

interface RichTextEditorProps {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  className?: string
}

const RichTextEditor = ({
  id,
  value,
  onChange,
  placeholder,
  className = '',
}: RichTextEditorProps) => {
  const quillRef = useRef<ReactQuill | null>(null)

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link', 'strike', 'code'], // Basic toolbar
      [{ header: [1, 2, 3, false] }], // Headers
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      ['link'], // Insert link
      ['clean'], // Remove formatting
    ],
  }

  const tooltipIds = [
    'bold-tooltip',
    'italic-tooltip',
    'underline-tooltip',
    'strike-tooltip',
    'code-tooltip',
    'header-tooltip',
    'list-tooltip',
    'link-tooltip',
    'clean-tooltip',
  ]

  useEffect(() => {
    if (quillRef.current) {
      const buttons = document.querySelectorAll('.ql-toolbar button')

      // Tooltip content based on the format
      const tooltips: { [key: string]: string } = {
        bold: 'Bold',
        italic: 'Italic',
        underline: 'Underline',
        strike: 'Strikethrough',
        code: 'Inline Code',
        header: 'Header',
        list: 'List',
        link: 'Insert Link',
        clean: 'Clear Formatting',
      }

      // Add tooltips to each toolbar button
      buttons.forEach((button) => {
        const format = button.className
          .split(' ')
          .find((cls) => cls.startsWith('ql-'))
          ?.replace('ql-', '')

        if (format) {
          button.setAttribute('data-tooltip-id', `${format}-tooltip`) // Add tooltip ID
          button.setAttribute(
            'data-tooltip-content',
            tooltips[format] || format,
          ) // Set tooltip content
        }
      })
    }
  }, [value])

  return (
    <div
      id={id}
      className={`border border-[#D0D5DD] rounded-lg w-full focus:outline-none overflow-hidden flex flex-col ${className}`}
      style={{ height: '500px' }}>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        className="h-full border-none custom-quill"
      />
      {/* Render the ReactTooltip outside of the editor */}

      {tooltipIds.map((tooltipId) => (
        <Tooltip
          key={tooltipId}
          id={tooltipId}
          place="bottom"
          className="tooltip-wrap"
        />
      ))}
    </div>
  )
}

export default RichTextEditor
