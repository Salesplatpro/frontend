import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CvCoverLetter {
  cv: File
  coverLetter: File
}

interface FileResult {
  index: number
  result: any
}

interface FileState {
  files: File[]
  results: FileResult[]
  uploads: boolean[]
  cvCoverLetter: CvCoverLetter[]
  cvCoverLetterResults: FileResult[]
  cvCoverLetterUploads: boolean[]
}

const initialState: FileState = {
  files: [],
  results: [],
  uploads: [],
  cvCoverLetter: [],
  cvCoverLetterResults: [],
  cvCoverLetterUploads: [],
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
    markUploadCompleted: (state, action: PayloadAction<number>) => {
      const index = action.payload
      state.uploads[index] = true
    },
    setCvCoverLetter: (state, action: PayloadAction<CvCoverLetter[]>) => {
      state.cvCoverLetter = action.payload
    },
    addCvCoverLetter(state, action: PayloadAction<CvCoverLetter[]>) {
      state.cvCoverLetter = [...state.cvCoverLetter, ...action.payload]
    },
    saveCvCoverLetterResult: (state, action: PayloadAction<FileResult>) => {
      const { index, result } = action.payload
      state.cvCoverLetterResults[index] = { index, result }
    },
    removeCvCoverLetter(state, action: PayloadAction<number>) {
      state.cvCoverLetter.splice(action.payload, 1)
    },
    markCvCoverLetterUploadCompleted: (
      state,
      action: PayloadAction<number>,
    ) => {
      const index = action.payload
      state.cvCoverLetterUploads[index] = true
    },
  },
})

export const {
  setFiles,
  addFiles,
  removeFile,
  saveFileResult,
  markUploadCompleted,
  setCvCoverLetter,
  addCvCoverLetter,
  saveCvCoverLetterResult,
  markCvCoverLetterUploadCompleted,
  removeCvCoverLetter,
} = fileSlice.actions

export default fileSlice.reducer
