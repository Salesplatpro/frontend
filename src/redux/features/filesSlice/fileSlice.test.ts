import { describe, expect, it } from 'vitest'

import reducer, {
  clearScoutUploads,
  removeScoutUpload,
  ScoutBatchResult,
  setScoutBatchResult,
  setScoutUploads,
} from './fileSlice'

const cvFile = (name: string) =>
  new File(['content'], name, { type: 'application/pdf' })

describe('fileSlice (scout uploads)', () => {
  it('starts with no uploads and no batch result', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.scoutUploads).toEqual([])
    expect(state.scoutBatchResult).toBeNull()
  })

  it('setScoutUploads replaces the upload list and clears any stale batch result', () => {
    const withResult = reducer(
      {
        scoutUploads: [],
        scoutBatchResult: { batchId: 'b1', scoutReports: [] },
      },
      setScoutUploads([{ cv: cvFile('a.pdf'), coverLetter: null }]),
    )

    expect(withResult.scoutUploads).toHaveLength(1)
    expect(withResult.scoutBatchResult).toBeNull()
  })

  it('removeScoutUpload removes only the entry at the given index', () => {
    const initial = reducer(
      undefined,
      setScoutUploads([
        { cv: cvFile('a.pdf'), coverLetter: null },
        { cv: cvFile('b.pdf'), coverLetter: null },
        { cv: cvFile('c.pdf'), coverLetter: null },
      ]),
    )

    const afterRemove = reducer(initial, removeScoutUpload(1))

    expect(afterRemove.scoutUploads.map((e) => e.cv.name)).toEqual([
      'a.pdf',
      'c.pdf',
    ])
  })

  it('setScoutBatchResult stores the result without touching pending uploads', () => {
    const initial = reducer(
      undefined,
      setScoutUploads([{ cv: cvFile('a.pdf'), coverLetter: null }]),
    )
    const result: ScoutBatchResult = {
      batchId: 'batch-1',
      scoutReports: [
        {
          id: 'r1',
          cvName: 'a',
          cvScore: 80,
          insights: 'Good fit',
          coverLetterName: null,
          coverLetterScore: null,
          coverLetterInsights: null,
          evaluationScore: 80,
        },
      ],
    }

    const next = reducer(initial, setScoutBatchResult(result))

    expect(next.scoutBatchResult).toEqual(result)
    expect(next.scoutUploads).toHaveLength(1)
  })

  it('clearScoutUploads resets both uploads and the batch result', () => {
    const withData = reducer(
      {
        scoutUploads: [{ cv: cvFile('a.pdf'), coverLetter: null }],
        scoutBatchResult: { batchId: 'b1', scoutReports: [] },
      },
      clearScoutUploads(),
    )

    expect(withData.scoutUploads).toEqual([])
    expect(withData.scoutBatchResult).toBeNull()
  })
})
