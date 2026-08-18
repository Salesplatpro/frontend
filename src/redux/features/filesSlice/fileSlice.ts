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
  failures?: Record<string, string>
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
    // Folds a single-file retry's result into the existing batch instead of
    // replacing it, so previously-scored cards aren't lost.
    mergeScoutBatchResult(state, action: PayloadAction<ScoutBatchResult>) {
      if (!state.scoutBatchResult) {
        state.scoutBatchResult = action.payload
        return
      }
      state.scoutBatchResult = {
        batchId: state.scoutBatchResult.batchId,
        scoutReports: [
          ...state.scoutBatchResult.scoutReports,
          ...action.payload.scoutReports,
        ],
      }
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
  mergeScoutBatchResult,
  clearScoutUploads,
} = fileSlice.actions

export default fileSlice.reducer
