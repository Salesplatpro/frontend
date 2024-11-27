import { useState } from 'react'
import { Bounce, toast } from 'react-toastify'

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
      toast.error(`Error generating ${pair} question`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
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
