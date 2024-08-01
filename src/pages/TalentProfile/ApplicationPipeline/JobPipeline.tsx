import React, { useEffect, useState } from 'react'
import {
  useLazyCvMatchQuery,
  useJobPipelineQuery,
  useLazyGeneratePersonalizedTestQuery,
  useLazyPersonalityTestQuery,
} from '../../../redux/api/talent'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PersonalizedTest from '../TalentAssessment/PersonalizedTest'
import Loading from '../../../components/Loading/Loading'

const JobPipeline = () => {
  const { jobId } = useParams()
  const [jobProgress, setJobProgress] = useState<any>(null)
  const [personalizedQuestion, setPersonalizedQuestion] = useState<any[]>([])
  const currentStage = jobProgress?.currentStage
  const talentId = jobProgress?.talent

  const {
    data: applications,
    error: applicationError,
    isLoading: applicationLoading,
  } = useJobPipelineQuery(jobId || '')

  // const {
  //   data: cvMatchData,
  //   error: cvMatchError,
  //   isLoading: cvMatchLoading,
  // } = useLazyCvMatchQuery(jobId || '')

  const [
    triggerCvMatch,
    { data: cvMatchData, error: cvMatchError, isLoading: cvMatchLoading },
  ] = useLazyCvMatchQuery()

  const [
    triggerGeneratePersonalizedTest,
    {
      data: genPersonalizedData,
      error: genPersonalizedError,
      isLoading: genPersonalizedLoading,
    },
  ] = useLazyGeneratePersonalizedTestQuery()

  const [
    triggerPersonalityTest,
    {
      data: personalityData,
      error: personalityError,
      isLoading: personalityLoading,
    },
  ] = useLazyPersonalityTestQuery()

  // Display application details based on id
  useEffect(() => {
    if (applications) {
      toast.success(applications.message)
      setJobProgress(applications.data?.application || null)
    }

    if (applicationError) {
      toast.error('Error loading application data')
    }
  }, [applications, applicationError])

  // Update personalized questions state when data is available
  useEffect(() => {
    if (genPersonalizedData) {
      setPersonalizedQuestion(genPersonalizedData.data?.questions || [])
    }
    if (genPersonalizedError) {
      toast.error('Error loading personalized test data')
      console.error(genPersonalizedError)
    }
  }, [genPersonalizedData, genPersonalizedError])

  if (
    applicationLoading ||
    cvMatchLoading ||
    genPersonalizedLoading ||
    personalityLoading
  )
    return <Loading />

  if (
    applicationError ||
    cvMatchError ||
    genPersonalizedError ||
    personalityError
  ) {
    toast.error('An error occurred while fetching data')
    return <div>Error loading data</div>
  }

  // Get personalized test on button click
  const getPersonalizedTest = () => {
    if (jobId && talentId) {
      triggerGeneratePersonalizedTest({ jobId, talentId })
    }
  }

  // get cv match on button click
  const getCvMatch = () => {
    if (jobId) {
      triggerCvMatch(jobId)
    }
  }

  // Get personality test on button click
  const getPersonalityTest = () => {
    if (jobId) {
      triggerPersonalityTest(jobId)
    }
    if (personalityData) {
      console.log(personalityData)
    }
  }

  return (
    <div>
      <div>
        <div>
          <h6>{jobProgress?.status || 'Status: N/A'}</h6>
          <h6>{jobProgress?.applicationType || 'Application Type: N/A'}</h6>
          <h6>{currentStage || 'Current Stage: N/A'}</h6>
          <h6>CV SIMILARITY</h6>
          {cvMatchData ? (
            <div>
              <h2>Your CV Match Result</h2>
              <p>{cvMatchData.message}</p>
              <p>{cvMatchData.data?.cvSimilarityScore || 'N/A'}</p>
            </div>
          ) : (
            <div>
              No CV similarity test for this job, move to the next job position.
            </div>
          )}
          {currentStage === 'cv_similarity' ? (
            <button onClick={getCvMatch}>Take CV Match</button>
          ) : currentStage === 'personalized' ? (
            <div>
              <h3>Personalized Test is available. Take the test:</h3>
              <button onClick={getPersonalizedTest}>
                Take Personalized Test
              </button>
              {genPersonalizedData && personalizedQuestion.length > 0 && (
                <div>
                  <PersonalizedTest
                    personalizedQuestion={personalizedQuestion}
                    jobId={jobId || ''}
                  />
                </div>
              )}
            </div>
          ) : currentStage === 'personality' ? (
            <button onClick={getPersonalityTest}>Take Personality Test</button>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default JobPipeline
