import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { clearScoutUploads } from '@/redux/features/filesSlice/fileSlice'
import { store } from '@/redux/store/store'

import { UploadCv } from './UploadCv'

const { navigateMock } = vi.hoisted(() => ({ navigateMock: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )
  return { ...actual, useNavigate: () => navigateMock }
})

vi.mock('@/redux/api/recruiter', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/redux/api/recruiter')>()
  return {
    ...actual,
    useGetCampaignNameQuery: () => ({
      data: { data: { id: 'sj-1', name: 'Q1 Engineering Scout' } },
      isLoading: false,
    }),
  }
})

const pdf = (name: string) =>
  new File(['content'], name, { type: 'application/pdf' })
const image = (name: string) =>
  new File(['content'], name, { type: 'image/png' })

const isDisabled = (el: HTMLElement) => el.hasAttribute('disabled')

const renderAt = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/scout/upload-cv/sj-1']}>
        <Routes>
          <Route path="/scout/upload-cv/:id" element={<UploadCv />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

describe('UploadCv (scout batch file selection)', () => {
  beforeEach(() => {
    store.dispatch(clearScoutUploads())
  })

  it('disables Continue until at least one CV is selected', () => {
    renderAt()
    expect(isDisabled(screen.getByRole('button', { name: /continue/i }))).toBe(
      true,
    )
  })

  it('rejects non-PDF/Word files with a clear inline message', () => {
    renderAt()
    const cvInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    fireEvent.change(cvInput, { target: { files: [image('resume.png')] } })

    expect(
      screen.getByText(/only pdf or word documents are allowed/i),
    ).toBeTruthy()
    expect(isDisabled(screen.getByRole('button', { name: /continue/i }))).toBe(
      true,
    )
  })

  it('enables Continue once valid CVs are selected, and dispatches them to the store on click', () => {
    renderAt()
    const cvInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    fireEvent.change(cvInput, {
      target: { files: [pdf('resume1.pdf'), pdf('resume2.pdf')] },
    })

    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(isDisabled(continueButton)).toBe(false)

    fireEvent.click(continueButton)

    expect(store.getState().file.scoutUploads).toHaveLength(2)
    expect(navigateMock).toHaveBeenCalledWith(
      '/recruiterDashboard/scout/process-cv/sj-1',
    )
  })

  it('blocks continuing when attached cover letters do not match the CV count', () => {
    renderAt()
    const cvInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    fireEvent.change(cvInput, {
      target: { files: [pdf('resume1.pdf'), pdf('resume2.pdf')] },
    })

    fireEvent.click(screen.getByLabelText(/attach a cover letter for each cv/i))
    const fileInputs = document.querySelectorAll('input[type="file"]')
    const coverLetterInput = fileInputs[1] as HTMLInputElement
    fireEvent.change(coverLetterInput, {
      target: { files: [pdf('cover1.pdf')] },
    })

    expect(screen.getByText(/provide one cover letter per cv/i)).toBeTruthy()
    expect(isDisabled(screen.getByRole('button', { name: /continue/i }))).toBe(
      true,
    )
  })
})
