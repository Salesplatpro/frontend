import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SuggestionChips } from './SuggestionChips'

const { generateFieldMock, notifyMock } = vi.hoisted(() => ({
  generateFieldMock: vi.fn(),
  notifyMock: vi.fn(),
}))

vi.mock('@/redux/api/recruiter', () => ({
  useGenerateJobFieldMutation: () => [generateFieldMock, { isLoading: false }],
}))
vi.mock('@/utils/toastNotifications', () => ({ notify: notifyMock }))

const job = { role: 'Backend Engineer', skills: ['Go'] }

const suggest = (items: string[]) =>
  generateFieldMock.mockReturnValue({
    unwrap: () => Promise.resolve({ data: { suggestions: items } }),
  })

describe('SuggestionChips', () => {
  beforeEach(() => vi.clearAllMocks())

  it('loads suggestions and hides ones already added', async () => {
    suggest(['PostgreSQL', 'go', 'Kafka'])
    render(
      <SuggestionChips
        field="skills"
        current={['Go']}
        job={job}
        onAdd={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /suggest skills/i }))

    expect(
      await screen.findByRole('button', { name: 'Add PostgreSQL' }),
    ).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Add Kafka' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Add go' })).toBeNull()
    expect(generateFieldMock).toHaveBeenCalledWith({ field: 'skills', job })
  })

  it('adds one suggestion when clicked', async () => {
    suggest(['PostgreSQL', 'Kafka'])
    const onAdd = vi.fn()
    render(
      <SuggestionChips field="skills" current={[]} job={job} onAdd={onAdd} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /suggest skills/i }))
    fireEvent.click(await screen.findByRole('button', { name: 'Add Kafka' }))

    expect(onAdd).toHaveBeenCalledWith(['Kafka'])
  })

  it('adds every visible suggestion with "Add all"', async () => {
    suggest(['PostgreSQL', 'Kafka'])
    const onAdd = vi.fn()
    render(
      <SuggestionChips field="goals" current={[]} job={job} onAdd={onAdd} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /suggest goals/i }))
    fireEvent.click(await screen.findByRole('button', { name: 'Add all' }))

    expect(onAdd).toHaveBeenCalledWith(['PostgreSQL', 'Kafka'])
  })

  it('drops suggestions longer than the tag limit', async () => {
    suggest(['x'.repeat(300), 'Kafka'])
    render(
      <SuggestionChips
        field="skills"
        current={[]}
        job={job}
        onAdd={vi.fn()}
        maxLength={250}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /suggest skills/i }))
    await screen.findByRole('button', { name: 'Add Kafka' })
    expect(screen.getAllByRole('button', { name: /^Add / })).toHaveLength(1)
  })

  it('shows nothing extra and reports the error when the AI fails', async () => {
    generateFieldMock.mockReturnValue({
      unwrap: () => Promise.reject({ data: { error: { message: 'Nope' } } }),
    })
    render(
      <SuggestionChips field="skills" current={[]} job={job} onAdd={vi.fn()} />,
    )

    fireEvent.click(screen.getByRole('button', { name: /suggest skills/i }))

    await waitFor(() =>
      expect(notifyMock).toHaveBeenCalledWith('error', 'Nope'),
    )
    expect(screen.queryByRole('list', { name: /ai suggestions/i })).toBeNull()
  })

  it('is disabled without a role or brief', () => {
    render(
      <SuggestionChips field="skills" current={[]} job={{}} onAdd={vi.fn()} />,
    )
    expect(
      screen
        .getByRole('button', { name: /suggest skills/i })
        .hasAttribute('disabled'),
    ).toBe(true)
  })
})
