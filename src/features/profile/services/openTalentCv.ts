/**
 * Opens the recruiter CV viewer for a talent in a new browser tab.
 */
export function openTalentCv(talentId: string): void {
  window.open(`/view-cv/${talentId}`, '_blank', 'noopener,noreferrer')
}
