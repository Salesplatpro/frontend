import 'react-quill/dist/quill.snow.css'

import React from 'react'
import ReactQuill from 'react-quill'

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
  maxLength,
  className = '',
}: RichTextEditorProps) => {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link'], // Basic toolbar
    ],
  }

  return (
    <div
      id={id}
      className={`border border-[#D0D5DD] rounded-lg w-full focus:outline-none overflow-hidden flex flex-col ${className}`}
      style={{ height: '200px' }}>
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        className="h-full border-none custom-quill"
      />
    </div>
  )
}

export default RichTextEditor
