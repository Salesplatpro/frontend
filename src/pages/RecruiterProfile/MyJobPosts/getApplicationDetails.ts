export const getApplicationDetails = (data: any) => {
  const talent = data?.data?.application?.talent || {}
  const application = data?.data?.application || {}

  return {
    firstName: talent.firstName || '',
    lastName: talent.lastName || '',
    bio: talent.bio || '',
    experience: talent.experience || '',
    prescreeningScore: talent.prescreeningScore ?? 'No pre-assessment test',
    cvSimilarityScore: application.cvSimilarityScore ?? 'No cv-matching score',
    personalizedScore: application.personalizedScore ?? 'No personality test',
    type: application.mbtiType || 'No personalized test',
    jodStatus: application.status || '',
    cvUrl: talent.cvUrl || null,
    matchVerdict: application.matchVerdict || null,
    matchVerdictReasoning: application.matchVerdictReasoning || null,
    matchRecommendation: application.matchRecommendation || null,
    matchStrengths: application.matchStrengths || null,
    matchWeaknesses: application.matchWeaknesses || null,
    matchRisks: application.matchRisks || null,
  }
}
