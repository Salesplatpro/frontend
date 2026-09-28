import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  draftOnboardingEmail,
  fetchAdminRecruiters,
  fetchAdminTalents,
  fetchUserOnboarding,
  sendOnboardingEmail,
} from './adminService'

const { getMock, postMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
}))

vi.mock('@/features/auth/services/httpClient', () => ({
  httpClient: { get: getMock, post: postMock },
}))

const envelope = (data: unknown) => ({
  data: { status: true, message: '', data },
})

describe('admin onboarding service', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends onboarding filters with the talent list and drops empty ones', async () => {
    getMock.mockResolvedValue(envelope({ users: [], total: 0 }))
    await fetchAdminTalents({
      limit: 200,
      onboardingStage: 'take_assessment',
      followUp: '',
      search: '',
    })
    expect(getMock).toHaveBeenCalledWith('/admin/talents', {
      params: { limit: 200, onboardingStage: 'take_assessment' },
    })
  })

  it('sends onboarding filters with the recruiter list', async () => {
    getMock.mockResolvedValue(envelope({ users: [], total: 0 }))
    await fetchAdminRecruiters({ followUp: 'progressed' })
    expect(getMock).toHaveBeenCalledWith('/admin/recruiters', {
      params: { followUp: 'progressed' },
    })
  })

  it('loads one user’s onboarding', async () => {
    getMock.mockResolvedValue(envelope({ onboarding: { stage: 'post_job' } }))
    await expect(fetchUserOnboarding('u1')).resolves.toEqual({
      stage: 'post_job',
    })
    expect(getMock).toHaveBeenCalledWith('/admin/users/u1/onboarding')
  })

  it('asks for an AI draft', async () => {
    postMock.mockResolvedValue(envelope({ draft: { subject: 's', body: 'b' } }))
    await expect(draftOnboardingEmail('u1')).resolves.toEqual({
      subject: 's',
      body: 'b',
    })
    expect(postMock).toHaveBeenCalledWith('/admin/users/u1/onboarding/draft')
  })

  it('sends an email, passing confirm only when asked', async () => {
    postMock.mockResolvedValue(envelope({ email: { id: 'e1' } }))
    await sendOnboardingEmail('u1', { subject: 's', body: 'b' })
    await sendOnboardingEmail('u1', { subject: 's', body: 'b', confirm: true })
    expect(postMock).toHaveBeenNthCalledWith(
      1,
      '/admin/users/u1/onboarding/emails',
      {
        subject: 's',
        body: 'b',
      },
    )
    expect(postMock).toHaveBeenNthCalledWith(
      2,
      '/admin/users/u1/onboarding/emails',
      {
        subject: 's',
        body: 'b',
        confirm: true,
      },
    )
  })
})
