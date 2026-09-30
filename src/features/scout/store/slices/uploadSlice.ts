import { StateCreator } from 'zustand'

import { ALLOWED_CV_MIMETYPES, MAX_BATCH_SIZE, MAX_CV_BYTES } from '../../types'
import type { ScoutStore } from '../useScoutStore'

export type RejectedFile = {
  name: string
  reason: string
}

export type UploadSlice = {
  /** Files the recruiter has picked but not yet submitted. */
  cvFiles: File[]
  rejectedFiles: RejectedFile[]
  /** One key per upload session, so a double-submit can't start two runs. */
  idempotencyKey: string
  addCvFiles: (files: File[]) => void
  removeCvFile: (index: number) => void
  clearRejectedFiles: () => void
  resetUpload: () => void
}

const newIdempotencyKey = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `scout-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`

export const uploadInitialState = {
  cvFiles: [] as File[],
  rejectedFiles: [] as RejectedFile[],
  idempotencyKey: newIdempotencyKey(),
}

const sizeInMb = (bytes: number) =>
  Math.round((bytes / (1024 * 1024)) * 10) / 10

/**
 * Validates a pick and appends what survives.
 *
 * Appending (rather than replacing) is deliberate: the previous implementation
 * overwrote the selection every time the picker was reopened, so adding a file
 * silently dropped everything chosen before it. Files already picked are skipped by
 * name and size so re-selecting the same folder doesn't duplicate them.
 */
export const createUploadSlice: StateCreator<
  ScoutStore,
  [],
  [],
  UploadSlice
> = (set) => ({
  ...uploadInitialState,

  addCvFiles: (files) =>
    set((state) => {
      const accepted: File[] = []
      const rejected: RejectedFile[] = []
      const seen = new Set(
        state.cvFiles.map((file) => `${file.name}:${file.size}`),
      )

      for (const file of files) {
        const fingerprint = `${file.name}:${file.size}`

        if (seen.has(fingerprint)) continue

        if (
          !ALLOWED_CV_MIMETYPES.includes(
            file.type as (typeof ALLOWED_CV_MIMETYPES)[number],
          )
        ) {
          rejected.push({
            name: file.name,
            reason: 'Not a PDF or Word file',
          })
          continue
        }

        if (file.size > MAX_CV_BYTES) {
          rejected.push({
            name: file.name,
            reason: `Too large at ${sizeInMb(file.size)}MB — the limit is 5MB`,
          })
          continue
        }

        if (state.cvFiles.length + accepted.length >= MAX_BATCH_SIZE) {
          rejected.push({
            name: file.name,
            reason: `You can upload ${MAX_BATCH_SIZE} CVs at a time`,
          })
          continue
        }

        seen.add(fingerprint)
        accepted.push(file)
      }

      return {
        cvFiles: [...state.cvFiles, ...accepted],
        rejectedFiles: rejected,
      }
    }),

  removeCvFile: (index) =>
    set((state) => ({
      cvFiles: state.cvFiles.filter((_, i) => i !== index),
    })),

  clearRejectedFiles: () => set({ rejectedFiles: [] }),

  // A fresh key too: the next upload is a different run, and reusing the key would
  // make the server hand back the previous one.
  resetUpload: () =>
    set({
      cvFiles: [],
      rejectedFiles: [],
      idempotencyKey: newIdempotencyKey(),
    }),
})
