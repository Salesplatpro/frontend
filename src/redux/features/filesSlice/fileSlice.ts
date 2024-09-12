import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FileState {
  files: File[]
}

const initialState: FileState = {
  files: [],
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
  },
})

export const { setFiles, addFiles, removeFile } = fileSlice.actions

export default fileSlice.reducer
