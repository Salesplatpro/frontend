import { useState } from 'react'
import toast from 'react-hot-toast'

import { useGenJpPersonalityMutation } from '../../../../redux/api/recruiter'

type GeneratedQuestion = {
  [key: string]: {
    question: string | null
  }
}

const useGeneratedQuestion = (jobId: string | undefined) => {
  const [genJp] = useGenJpPersonalityMutation()
  const [generatedQuestions, setGeneratedQuestions] =
    useState<GeneratedQuestion>({})
  const [loadingPairs, setLoadingPairs] = useState<{ [key: string]: boolean }>(
    {},
  )

  const generateQuestion = async (pair: string) => {
    setLoadingPairs((prevState) => ({ ...prevState, [pair]: true }))
    try {
      const result = await genJp({ jobId, dichotomyPair: pair }).unwrap()
      setGeneratedQuestions((prevState) => ({
        ...prevState,
        [pair]: { question: result?.data?.question?.question || null },
      }))
    } catch (error) {
      console.error(`Error generating ${pair} question:`, error)
      toast.error(`Error generating ${pair} question`)
    } finally {
      setLoadingPairs((prevState) => ({ ...prevState, [pair]: false }))
    }
  }

  const resetQuestion = (pair: string) => {
    setGeneratedQuestions((prevState) => ({
      ...prevState,
      [pair]: { question: null },
    }))
  }

  return {
    generatedQuestions,
    loadingPairs,
    generateQuestion,
    resetQuestion,
  }
}

export default useGeneratedQuestion
