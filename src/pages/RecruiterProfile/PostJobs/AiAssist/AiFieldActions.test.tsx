import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AiFieldActions } from './AiFieldActions'

const { generateFieldMock, notifyMock } = vi.hoisted(() => ({
  generateFieldMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('@/redux/api/recruiter', () => ({
  useGenerateJobFieldMutation: () => [generateFieldMock, { isLoading: false }],
}))
vi.mock('@/utils/toastNotifications', () => ({ notify: notifyMock }))

const job = { role: 'Backend Engineer' }

describe('AiFieldActions', () => {
  beforeEach(() => vi.clearAllMocks())

  it('offers a single "write" button while the field is empty', () => {
    render(
      <AiFieldActions
        field="jobBrief"
        value=""
        job={job}
        onApply={vi.fn()}
        writeLabel="Write the brief with AI"
      />,
    )
    expect(
      screen.getByRole('button', { name: 'Write the brief with AI' }),
    ).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Shorter' })).toBeNull()
  })

  it('offers rewrite options once the field has text', () => {
    render(
      <AiFieldActions
        field="jobBrief"
        value="<p>Some brief</p>"
        job={job}
        onApply={vi.fn()}
      />,
    )
    for (const name of ['Rewrite', 'Shorter', 'More detail', 'Friendlier']) {
      expect(screen.getByRole('button', { name })).toBeTruthy()
    }
  })

  it('sends plain text to the AI and applies the answer as editor HTML', async () => {
    generateFieldMock.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { text: 'Short line\nSecond' } }),
    })
    const onApply = vi.fn()
    render(
      <AiFieldActions
        field="requirements"
        value="<p>Long &amp; detailed</p>"
        job={job}
        onApply={onApply}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Shorter' }))

    await waitFor(() =>
      expect(onApply).toHaveBeenCalledWith('<p>Short line</p><p>Second</p>'),
    )
    expect(generateFieldMock).toHaveBeenCalledWith({
      field: 'requirements',
      action: 'shorter',
      currentText: 'Long & detailed',
      job,
    })
  })

  it('does not send currentText when writing an empty field', async () => {
    generateFieldMock.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { text: 'Fresh' } }),
    })
    render(
      <AiFieldActions field="jobBrief" value="" job={job} onApply={vi.fn()} />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Write with AI' }))
    await waitFor(() => expect(generateFieldMock).toHaveBeenCalled())
    expect(generateFieldMock.mock.calls[0][0].currentText).toBeUndefined()
  })

  it('can undo the last AI change', async () => {
    generateFieldMock.mockReturnValue({
      unwrap: () => Promise.resolve({ data: { text: 'New' } }),
    })
    const onApply = vi.fn()
    render(
      <AiFieldActions
        field="jobBrief"
        value="<p>Old</p>"
        job={job}
        onApply={onApply}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Rewrite' }))
    const undo = await screen.findByRole('button', { name: 'Undo' })
    fireEvent.click(undo)

    expect(onApply).toHaveBeenLastCalledWith('<p>Old</p>')
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull()
  })

  it('shows an error and leaves the field alone when the AI fails', async () => {
    generateFieldMock.mockReturnValue({
      unwrap: () =>
        Promise.reject({ data: { error: { message: 'AI unavailable' } } }),
    })
    const onApply = vi.fn()
    render(
      <AiFieldActions
        field="jobBrief"
        value="<p>Old</p>"
        job={job}
        onApply={onApply}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Rewrite' }))

    await waitFor(() =>
      expect(notifyMock).toHaveBeenCalledWith('error', 'AI unavailable'),
    )
    expect(onApply).not.toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull()
  })

  it('is disabled until there is a role or brief to work from', () => {
    render(
      <AiFieldActions field="jobBrief" value="" job={{}} onApply={vi.fn()} />,
    )
    expect(
      screen
        .getByRole('button', { name: 'Write with AI' })
        .hasAttribute('disabled'),
    ).toBe(true)
    expect(screen.getByText(/pick a role first/i)).toBeTruthy()
  })
})
