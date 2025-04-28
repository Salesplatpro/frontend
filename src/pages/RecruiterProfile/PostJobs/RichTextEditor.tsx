import 'react-quill/dist/quill.snow.css'

import React, { useState } from 'react'
import ReactQuill from 'react-quill'

const RichTextEditor = () => {
  const [editorHtml, setEditorHtml] = useState('')
  return (
    <div>
      <ReactQuill theme="snow" value={editorHtml} onChange={setEditorHtml} />
    </div>
  )
}

export default RichTextEditor
