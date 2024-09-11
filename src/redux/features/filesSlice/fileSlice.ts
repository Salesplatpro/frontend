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
  },
})

export const { setFiles } = fileSlice.actions

export default fileSlice.reducer
