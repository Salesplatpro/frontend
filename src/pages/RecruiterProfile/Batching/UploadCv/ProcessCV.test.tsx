import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearScoutUploads,
  setScoutUploads,
} from '@/redux/features/filesSlice/fileSlice'
import { store } from '@/redux/store/store'

import { ProcessCV } from './ProcessCV'

const { navigateMock, uploadBatchMock, notifyMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  uploadBatchMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('../../../../redux/api/recruiter', async (importOriginal) => {
  const actual = await importOriginal<
    typeof import('../../../../redux/api/recruiter')
  >()
  return {
    ...actual,
    useUploadScoutCvBatchMutation: () => [
      uploadBatchMock,
      { isLoading: false },
    ],
    useGetCampaignNameQuery: () => ({
      data: { data: { id: 'sj-1', name: 'Q1 Engineering Scout' } },
      isLoading: false,
    }),
  }
})

vi.mock('../../../../utils/toastNotifications', () => ({
  notify: notifyMock,
}))

const pdf = (name: string) =>
  new File(['content'], name, { type: 'application/pdf' })

const renderAt = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/scout/process-cv/sj-1']}>
        <Routes>
          <Route path="/scout/process-cv/:id" element={<ProcessCV />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('ProcessCV (atomic scout batch submission)', () => {
  beforeEach(() => {
    store.dispatch(clearScoutUploads())
    uploadBatchMock.mockReset()
    notifyMock.mockReset()
  })

  it('shows an empty state and no submit button when no CVs are pending', () => {
    renderAt()

    expect(screen.getByText('No CVs selected')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /score/i })).toBeNull()
  })

  it('submits the whole batch in one request and renders every result once it succeeds', async () => {
    store.dispatch(
      setScoutUploads([
        { cv: pdf('resume1.pdf'), coverLetter: null },
        { cv: pdf('resume2.pdf'), coverLetter: null },
      ]),
    )
    uploadBatchMock.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          data: {
            batchId: 'batch-1',
            scoutReports: [
              { id: 'r1', cvName: 'resume1', evaluationScore: 82 },
              { id: 'r2', cvName: 'resume2', evaluationScore: 65 },
            ],
          },
        }),
    })
    renderAt()

    fireEvent.click(screen.getByRole('button', { name: /score 2 cvs/i }))

    await waitFor(() => {
      expect(uploadBatchMock).toHaveBeenCalledTimes(1)
      expect(store.getState().file.scoutBatchResult?.batchId).toBe('batch-1')
    })

    expect(
      screen.getByRole('button', { name: /upload another batch/i }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: /view scout job/i })).toBeTruthy()
    // Once results are in, per-file entries are no longer individually deletable.
    expect(screen.queryByRole('button', { name: /score 2 cvs/i })).toBeNull()
  })

  it('shows the batch-level failure message and per-file reason, and keeps the uploads editable', async () => {
    store.dispatch(
      setScoutUploads([
        { cv: pdf('good.pdf'), coverLetter: null },
        { cv: pdf('corrupt.pdf'), coverLetter: null },
      ]),
    )
    uploadBatchMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          data: {
            error: {
              message:
                '1 of 2 CV(s) could not be scored — no results were saved for this batch',
              fields: {
                'corrupt.pdf': 'Unable to extract text from corrupt.pdf',
              },
            },
          },
        }),
    })
    renderAt()

    fireEvent.click(screen.getByRole('button', { name: /score 2 cvs/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/1 of 2 cv\(s\) could not be scored/i),
      ).toBeTruthy()
      expect(
        screen.getByText('Unable to extract text from corrupt.pdf'),
      ).toBeTruthy()
    })

    // Nothing was persisted — the batch remains resubmittable, not replaced by result buttons.
    expect(screen.getByRole('button', { name: /score 2 cvs/i })).toBeTruthy()
    expect(store.getState().file.scoutBatchResult).toBeNull()
  })
})
