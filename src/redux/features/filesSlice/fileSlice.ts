import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FileResult {
  index: number
  result: any
}

interface FileState {
  files: File[]
  results: FileResult[]
}

const initialState: FileState = {
  files: [],
  results: [],
}

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setFiles(state, action: PayloadAction<File[]>) {
      state.files = action.payload
    },
    addFiles(state, action: PayloadAction<File[]>) {
      state.files = [...state.files, ...action.payload]
    },
    removeFile(state, action: PayloadAction<number>) {
      state.files.splice(action.payload, 1)
    },
    saveFileResult: (state, action: PayloadAction<FileResult>) => {
      const { index, result } = action.payload
      state.results[index] = { index, result }
    },
  },
})

export const { setFiles, addFiles, removeFile, saveFileResult } =
  fileSlice.actions

export default fileSlice.reducer
