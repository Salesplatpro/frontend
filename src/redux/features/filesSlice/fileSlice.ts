import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ScoutUploadEntry {
  cv: File
  coverLetter: File | null
}

export interface ScoutReport {
  id: string
  cvName: string | null
  cvScore: number | null
  insights: string | null
  coverLetterName: string | null
  coverLetterScore: number | null
  coverLetterInsights: string | null
  evaluationScore: number | null
}

export interface ScoutBatchResult {
  batchId: string
  scoutReports: ScoutReport[]
}

interface FileState {
  scoutUploads: ScoutUploadEntry[]
  scoutBatchResult: ScoutBatchResult | null
}

const initialState: FileState = {
  scoutUploads: [],
  scoutBatchResult: null,
}

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setScoutUploads(state, action: PayloadAction<ScoutUploadEntry[]>) {
      state.scoutUploads = action.payload
      state.scoutBatchResult = null
    },
    removeScoutUpload(state, action: PayloadAction<number>) {
      state.scoutUploads.splice(action.payload, 1)
    },
    setScoutBatchResult(state, action: PayloadAction<ScoutBatchResult>) {
      state.scoutBatchResult = action.payload
    },
    clearScoutUploads(state) {
      state.scoutUploads = []
      state.scoutBatchResult = null
    },
  },
})

export const {
  setScoutUploads,
  removeScoutUpload,
  setScoutBatchResult,
  clearScoutUploads,
} = fileSlice.actions

export default fileSlice.reducer
