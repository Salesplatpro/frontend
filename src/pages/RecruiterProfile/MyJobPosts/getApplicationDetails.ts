export const getApplicationDetails = (data: any) => {
  const talent = data?.data?.application?.talent || {}
  const profile = talent.profile || {}
  const application = data?.data?.application || {}

  return {
    firstName: talent.firstName || '',
    lastName: talent.lastName || '',
    bio: profile.bio || '',
    experience: profile.experience || '',
    prescreeningScore: profile.prescreeningScore || 'No pre-assessment test',
    cvSimilarityScore: application.cvSimilarityScore || 'No cv-matching score',
    personalizedScore: application.personalizedScore || 'No personality test',
    type: application.mbtiType || 'No personalized test',
  }
}
