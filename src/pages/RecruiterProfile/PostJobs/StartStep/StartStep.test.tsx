import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { StartStep } from './StartStep'

const { generateMock, generateFileMock, notifyMock } = vi.hoisted(() => ({
  generateMock: vi.fn(),
  generateFileMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('@/redux/api/recruiter', () => ({
  useGenerateJobContentMutation: () => [generateMock, { isLoading: false }],
  useGenerateJobContentFromFileMutation: () => [
    generateFileMock,
    { isLoading: false },
  ],
}))

vi.mock('@/redux/api/talent', () => ({
  useGetRoleQuery: () => ({
    data: { data: [{ id: 'role-1', name: 'backend engineer' }] },
  }),
}))

vi.mock('@/utils/toastNotifications', () => ({ notify: notifyMock }))

const resolved = (content: unknown) => ({
  unwrap: () => Promise.resolve({ data: { content } }),
})

const DESCRIPTION = 'Backend engineer in Lagos, hybrid, Go and Postgres'

const setup = (props: Partial<React.ComponentProps<typeof StartStep>> = {}) => {
  const onGenerated = vi.fn()
  const onStartFromScratch = vi.fn()
  render(
    <StartStep
      onGenerated={onGenerated}
      onStartFromScratch={onStartFromScratch}
      {...props}
    />,
  )
  return { onGenerated, onStartFromScratch }
}

describe('StartStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('offers the three ways to start', () => {
    setup()
    expect(screen.getByRole('button', { name: /describe it/i })).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /import a job description/i }),
    ).toBeTruthy()
    expect(
      screen.getByRole('button', { name: /start from scratch/i }),
    ).toBeTruthy()
  })

  it('keeps "Write my job post" disabled until the description is long enough', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: /describe it/i }))
    const submit = screen.getByRole('button', { name: /write my job post/i })
    expect(submit.hasAttribute('disabled')).toBe(true)

    fireEvent.change(screen.getByLabelText(/describe the job/i), {
      target: { value: 'too short' },
    })
    expect(submit.hasAttribute('disabled')).toBe(true)

    fireEvent.change(screen.getByLabelText(/describe the job/i), {
      target: { value: DESCRIPTION },
    })
    expect(submit.hasAttribute('disabled')).toBe(false)
  })

  it('sends the description as a prompt and hands back the mapped form', async () => {
    generateMock.mockReturnValue(
      resolved({ role: 'Backend Engineer', skills: ['Go'] }),
    )
    const { onGenerated } = setup()

    fireEvent.click(screen.getByRole('button', { name: /describe it/i }))
    fireEvent.change(screen.getByLabelText(/describe the job/i), {
      target: { value: `  ${DESCRIPTION}  ` },
    })
    fireEvent.click(screen.getByRole('button', { name: /write my job post/i }))

    await waitFor(() => expect(onGenerated).toHaveBeenCalled())
    expect(generateMock).toHaveBeenCalledWith({ prompt: DESCRIPTION })
    const [values, filledCount] = onGenerated.mock.calls[0]
    expect(values.role).toBe('role-1')
    expect(values.skills).toEqual(['Go'])
    expect(filledCount).toBe(2)
  })

  it('shows the API error and stays on the page when generation fails', async () => {
    generateMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({ data: { error: { message: 'LLM is down' } } }),
    })
    const { onGenerated } = setup()

    fireEvent.click(screen.getByRole('button', { name: /describe it/i }))
    fireEvent.change(screen.getByLabelText(/describe the job/i), {
      target: { value: DESCRIPTION },
    })
    fireEvent.click(screen.getByRole('button', { name: /write my job post/i }))

    await waitFor(() =>
      expect(notifyMock).toHaveBeenCalledWith('error', 'LLM is down'),
    )
    expect(onGenerated).not.toHaveBeenCalled()
  })

  it('treats an empty AI response as an error', async () => {
    generateMock.mockReturnValue(resolved(undefined))
    const { onGenerated } = setup()

    fireEvent.click(screen.getByRole('button', { name: /describe it/i }))
    fireEvent.change(screen.getByLabelText(/describe the job/i), {
      target: { value: DESCRIPTION },
    })
    fireEvent.click(screen.getByRole('button', { name: /write my job post/i }))

    await waitFor(() =>
      expect(notifyMock).toHaveBeenCalledWith(
        'error',
        expect.stringMatching(/did not return a job/i),
      ),
    )
    expect(onGenerated).not.toHaveBeenCalled()
  })

  it('sends pasted text as sourceText', async () => {
    generateMock.mockReturnValue(resolved({ role: 'Designer' }))
    const { onGenerated } = setup()

    fireEvent.click(
      screen.getByRole('button', { name: /import a job description/i }),
    )
    fireEvent.change(screen.getByLabelText(/paste your job description/i), {
      target: { value: 'We are hiring a designer to own our design system.' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Fill in the form' }))

    await waitFor(() => expect(onGenerated).toHaveBeenCalled())
    expect(generateMock).toHaveBeenCalledWith({
      sourceText: 'We are hiring a designer to own our design system.',
    })
    expect(generateFileMock).not.toHaveBeenCalled()
  })

  it('uploads a chosen file instead of the pasted text', async () => {
    generateFileMock.mockReturnValue(resolved({ role: 'Designer' }))
    const { onGenerated } = setup()

    fireEvent.click(
      screen.getByRole('button', { name: /import a job description/i }),
    )
    const file = new File(['job text'], 'jd.pdf', { type: 'application/pdf' })
    fireEvent.change(screen.getByLabelText(/upload a file/i), {
      target: { files: [file] },
    })
    expect(screen.getByText('jd.pdf')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Fill in the form' }))

    await waitFor(() => expect(onGenerated).toHaveBeenCalled())
    const sent = generateFileMock.mock.calls[0][0] as FormData
    expect(sent.get('file')).toBe(file)
    expect(generateMock).not.toHaveBeenCalled()
  })

  it('rejects files over 5 MB before uploading', () => {
    setup()
    fireEvent.click(
      screen.getByRole('button', { name: /import a job description/i }),
    )
    const big = new File(['x'], 'big.pdf', { type: 'application/pdf' })
    Object.defineProperty(big, 'size', { value: 6 * 1024 * 1024 })
    fireEvent.change(screen.getByLabelText(/upload a file/i), {
      target: { files: [big] },
    })

    expect(notifyMock).toHaveBeenCalledWith(
      'error',
      expect.stringMatching(/over 5 MB/i),
    )
    expect(screen.queryByText('big.pdf')).toBeNull()
    expect(
      screen
        .getByRole('button', { name: 'Fill in the form' })
        .hasAttribute('disabled'),
    ).toBe(true)
  })

  it('lets the recruiter remove a chosen file', () => {
    setup()
    fireEvent.click(
      screen.getByRole('button', { name: /import a job description/i }),
    )
    const file = new File(['job'], 'jd.docx')
    fireEvent.change(screen.getByLabelText(/upload a file/i), {
      target: { files: [file] },
    })
    fireEvent.click(screen.getByRole('button', { name: /remove jd.docx/i }))
    expect(screen.queryByText('jd.docx')).toBeNull()
  })

  it('starts from scratch', () => {
    const { onStartFromScratch } = setup()
    fireEvent.click(screen.getByRole('button', { name: /start from scratch/i }))
    expect(onStartFromScratch).toHaveBeenCalled()
  })

  it('offers to continue an unfinished draft', () => {
    const onContinueDraft = vi.fn()
    setup({ hasDraft: true, onContinueDraft })
    fireEvent.click(
      screen.getByRole('button', { name: /continue your draft/i }),
    )
    expect(onContinueDraft).toHaveBeenCalled()
  })

  it('hides the draft banner when there is no draft', () => {
    setup({ hasDraft: false, onContinueDraft: vi.fn() })
    expect(
      screen.queryByRole('button', { name: /continue your draft/i }),
    ).toBeNull()
  })
})
