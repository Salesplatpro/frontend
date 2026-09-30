import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { MAX_BATCH_SIZE, MAX_CV_BYTES } from '../types'
import { useScoutStore } from './useScoutStore'

const pdf = (name: string, size = 1024): File => {
  const file = new File(['x'], name, { type: 'application/pdf' })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

const docx = (name: string): File =>
  new File(['x'], name, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  })

const png = (name: string): File => new File(['x'], name, { type: 'image/png' })

const store = () => useScoutStore.getState()

beforeEach(() => {
  store().resetScout()
})

afterEach(() => {
  store().resetScout()
})

describe('upload slice', () => {
  it('accepts PDF and Word files', () => {
    store().addCvFiles([pdf('a.pdf'), docx('b.docx')])
    expect(store().cvFiles).toHaveLength(2)
    expect(store().rejectedFiles).toHaveLength(0)
  })

  it('appends across separate picks instead of replacing', () => {
    store().addCvFiles([pdf('a.pdf')])
    store().addCvFiles([pdf('b.pdf')])
    expect(store().cvFiles.map((file) => file.name)).toEqual(['a.pdf', 'b.pdf'])
  })

  it('skips a file already picked, so re-selecting a folder does not duplicate', () => {
    store().addCvFiles([pdf('a.pdf')])
    store().addCvFiles([pdf('a.pdf'), pdf('b.pdf')])
    expect(store().cvFiles.map((file) => file.name)).toEqual(['a.pdf', 'b.pdf'])
  })

  it('removes one file by index and leaves the rest in order', () => {
    store().addCvFiles([pdf('a.pdf'), pdf('b.pdf'), pdf('c.pdf')])
    store().removeCvFile(1)
    expect(store().cvFiles.map((file) => file.name)).toEqual(['a.pdf', 'c.pdf'])
  })

  it('rejects a file that is not a PDF or Word document, with a reason', () => {
    store().addCvFiles([png('photo.png')])
    expect(store().cvFiles).toHaveLength(0)
    expect(store().rejectedFiles).toEqual([
      { name: 'photo.png', reason: 'Not a PDF or Word file' },
    ])
  })

  it('rejects a file over the size limit', () => {
    store().addCvFiles([pdf('huge.pdf', MAX_CV_BYTES + 1)])
    expect(store().cvFiles).toHaveLength(0)
    expect(store().rejectedFiles[0]?.reason).toContain('5MB')
  })

  it('accepts a file exactly at the size limit', () => {
    store().addCvFiles([pdf('exact.pdf', MAX_CV_BYTES)])
    expect(store().cvFiles).toHaveLength(1)
  })

  it(`accepts exactly ${MAX_BATCH_SIZE} files`, () => {
    store().addCvFiles(
      Array.from({ length: MAX_BATCH_SIZE }, (_, i) => pdf(`cv-${i}.pdf`)),
    )
    expect(store().cvFiles).toHaveLength(MAX_BATCH_SIZE)
    expect(store().rejectedFiles).toHaveLength(0)
  })

  it('rejects the file that would exceed the batch cap', () => {
    store().addCvFiles(
      Array.from({ length: MAX_BATCH_SIZE + 1 }, (_, i) => pdf(`cv-${i}.pdf`)),
    )
    expect(store().cvFiles).toHaveLength(MAX_BATCH_SIZE)
    expect(store().rejectedFiles).toHaveLength(1)
    expect(store().rejectedFiles[0]?.reason).toContain(String(MAX_BATCH_SIZE))
  })

  it('keeps the good files from a mixed pick', () => {
    store().addCvFiles([
      pdf('good.pdf'),
      png('bad.png'),
      docx('also-good.docx'),
    ])
    expect(store().cvFiles.map((file) => file.name)).toEqual([
      'good.pdf',
      'also-good.docx',
    ])
    expect(store().rejectedFiles).toHaveLength(1)
  })

  it('clears rejections without touching the accepted files', () => {
    store().addCvFiles([pdf('good.pdf'), png('bad.png')])
    store().clearRejectedFiles()
    expect(store().rejectedFiles).toHaveLength(0)
    expect(store().cvFiles).toHaveLength(1)
  })

  it('keeps one idempotency key across picks, and regenerates it on reset', () => {
    const key = store().idempotencyKey
    store().addCvFiles([pdf('a.pdf')])
    store().addCvFiles([pdf('b.pdf')])
    expect(store().idempotencyKey).toBe(key)

    store().resetUpload()
    expect(store().idempotencyKey).not.toBe(key)
    expect(store().cvFiles).toHaveLength(0)
  })
})

describe('campaign draft slice', () => {
  const draft = {
    name: 'Q1 AE hiring',
    role: 'role-1',
    experienceLevel: '4-6 years',
    jobBrief: 'brief',
    recruiterGuide: 'guide',
    mustHaveSkills: ['negotiation'],
    niceToHaveSkills: [],
    workMode: 'remote',
    location: {
      country: { name: '', isoCode: '' },
      state: { name: '', isoCode: '' },
      city: { name: '', isoCode: '' },
    },
    shortlistSize: 5,
  }

  it('saves and clears a draft', () => {
    store().saveDraft(draft)
    expect(store().draft?.name).toBe('Q1 AE hiring')
    store().clearDraft()
    expect(store().draft).toBeNull()
  })
})

describe('search slice', () => {
  const criteria = {
    description: 'An enterprise AE who has sold to banks',
    role: '',
    experienceLevel: '',
    workMode: '',
    location: {
      country: { name: '', isoCode: '' },
      state: { name: '', isoCode: '' },
      city: { name: '', isoCode: '' },
    },
  }

  it('resets to the first page when new criteria are set', () => {
    store().setSearchPage(3)
    store().setCriteria(criteria)
    expect(store().page).toBe(0)
  })

  it('keeps the criteria when only the page changes', () => {
    store().setCriteria(criteria)
    store().setSearchPage(2)
    expect(store().page).toBe(2)
    expect(store().criteria?.description).toBe(criteria.description)
  })
})

describe('results slice', () => {
  it('tracks the open drawer and the active tab', () => {
    store().openCvDetails('cv-1')
    expect(store().openCvId).toBe('cv-1')
    store().closeCvDetails()
    expect(store().openCvId).toBeNull()

    store().setActiveTab('unreadable')
    expect(store().activeTab).toBe('unreadable')
  })

  it('defaults to sorting by the AI-assigned rank', () => {
    expect(store().sortKey).toBe('rank')
    expect(store().sortDirection).toBe('asc')
  })
})

describe('resetScout', () => {
  it('clears every slice but keeps the actions callable', () => {
    store().addCvFiles([pdf('a.pdf')])
    store().setActiveTab('all')
    store().openCvDetails('cv-9')

    store().resetScout()

    expect(store().cvFiles).toHaveLength(0)
    expect(store().activeTab).toBe('shortlist')
    expect(store().openCvId).toBeNull()
    // Replacing the whole store would have dropped the actions with the state.
    expect(typeof store().addCvFiles).toBe('function')
  })

  it('does not persist the selected files, which are not serialisable', () => {
    store().addCvFiles([pdf('a.pdf')])
    const persisted = window.localStorage.getItem('scout-store')
    expect(persisted ?? '').not.toContain('cvFiles')
  })
})
