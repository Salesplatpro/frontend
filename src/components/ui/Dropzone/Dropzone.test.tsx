import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'

import { Dropzone } from './Dropzone'

const pdf = (name: string): File =>
  new File(['x'], name, { type: 'application/pdf' })

const renderZone = (
  overrides: Partial<React.ComponentProps<typeof Dropzone>> = {},
) => {
  const onAdd = vi.fn()
  const onRemove = vi.fn()
  const utils = render(
    <Dropzone files={[]} onAdd={onAdd} onRemove={onRemove} {...overrides} />,
  )
  return { onAdd, onRemove, ...utils }
}

/** The hidden input is the only file input in the tree. */
const fileInput = (container: HTMLElement): HTMLInputElement =>
  container.querySelector('input[type="file"]') as HTMLInputElement

describe('Dropzone', () => {
  it('reports files chosen through the picker', () => {
    const { onAdd, container } = renderZone()

    fireEvent.change(fileInput(container), {
      target: { files: [pdf('a.pdf'), pdf('b.pdf')] },
    })

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd.mock.calls[0]?.[0].map((f: File) => f.name)).toEqual([
      'a.pdf',
      'b.pdf',
    ])
  })

  it('reports files dropped onto the zone', () => {
    const { onAdd } = renderZone()
    const zone = screen.getByRole('button', {
      name: /drag cvs here/i,
    })

    fireEvent.drop(zone, { dataTransfer: { files: [pdf('dropped.pdf')] } })

    expect(onAdd).toHaveBeenCalledTimes(1)
    expect(onAdd.mock.calls[0]?.[0][0].name).toBe('dropped.pdf')
  })

  it('ignores a drop with no files', () => {
    const { onAdd } = renderZone()
    const zone = screen.getByRole('button', { name: /drag cvs here/i })

    fireEvent.drop(zone, { dataTransfer: { files: [] } })

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('does not report anything while disabled', () => {
    const { onAdd } = renderZone({ disabled: true })
    const zone = screen.getByRole('button', { name: /drag cvs here/i })

    fireEvent.drop(zone, { dataTransfer: { files: [pdf('a.pdf')] } })

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('lists the selected files with a remove control each', () => {
    const { onRemove } = renderZone({
      files: [pdf('first.pdf'), pdf('second.pdf')],
    })

    expect(screen.getByText('first.pdf')).toBeTruthy()
    expect(screen.getByText('second.pdf')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Remove second.pdf' }))
    expect(onRemove).toHaveBeenCalledWith(1)
  })

  it('shows how many files have been added against the cap', () => {
    renderZone({ files: [pdf('a.pdf')], maxFiles: 50 })
    expect(screen.getByText('1 of 50 added')).toBeTruthy()
  })

  it('says so when the batch is full', () => {
    renderZone({ files: [pdf('a.pdf'), pdf('b.pdf')], maxFiles: 2 })
    expect(screen.getByText(/maximum for one batch/i)).toBeTruthy()
  })

  it('renders each rejection with its reason', () => {
    renderZone({
      rejections: [
        { name: 'photo.png', reason: 'Not a PDF or Word file' },
        { name: 'huge.pdf', reason: 'Too large at 9MB — the limit is 5MB' },
      ],
    })

    expect(screen.getByText("2 files couldn't be added")).toBeTruthy()
    expect(screen.getByText('photo.png')).toBeTruthy()
    expect(screen.getByText(/Not a PDF or Word file/)).toBeTruthy()
    expect(screen.getByText(/the limit is 5MB/)).toBeTruthy()
  })

  it('uses the singular when only one file was rejected', () => {
    renderZone({ rejections: [{ name: 'photo.png', reason: 'Wrong type' }] })
    expect(screen.getByText("1 file couldn't be added")).toBeTruthy()
  })

  it('dismisses rejections when asked', () => {
    const onDismissRejections = vi.fn()
    renderZone({
      rejections: [{ name: 'photo.png', reason: 'Wrong type' }],
      onDismissRejections,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismissRejections).toHaveBeenCalled()
  })

  it('opens the picker from the keyboard', () => {
    const { container } = renderZone()
    const input = fileInput(container)
    const click = vi.spyOn(input, 'click')

    // The zone is a <button>, so Enter and Space activate it natively.
    fireEvent.click(screen.getByRole('button', { name: /drag cvs here/i }))

    expect(click).toHaveBeenCalled()
  })
})
