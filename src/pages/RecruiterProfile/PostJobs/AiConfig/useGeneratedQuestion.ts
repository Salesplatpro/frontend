import { useEffect, useState } from 'react'
import { Bounce } from 'react-toastify'

import {
  useFetchPersonalityQuestionsQuery,
  useGenJpPersonalityMutation,
} from '../../../../redux/api/recruiter'
import { notify } from '../../../../utils/toastNotifications'

export type PersonalityQuestion = {
  id: string
  question: string
}

type QuestionsByPair = Record<string, PersonalityQuestion[]>

const DICHOTOMY_PAIRS = ['EI', 'SN', 'TF', 'JP']

const useGeneratedQuestion = (jobId: string | undefined) => {
  const [genJp] = useGenJpPersonalityMutation()
  const [questionsByPair, setQuestionsByPair] = useState<QuestionsByPair>({})
  const [loadingPairs, setLoadingPairs] = useState<{ [key: string]: boolean }>(
    {},
  )

  const { data } = useFetchPersonalityQuestionsQuery(jobId ?? '', {
    skip: !jobId,
  })

  // Seed per-pair state from already-generated questions (edit mode / reload).
  useEffect(() => {
    const questions = data?.data?.questions
    if (!Array.isArray(questions)) return

    const grouped: QuestionsByPair = {}
    for (const pair of DICHOTOMY_PAIRS) grouped[pair] = []
    for (const q of questions) {
      const pair = q.criteria
      if (pair && grouped[pair]) {
        grouped[pair].push({ id: q.id, question: q.question })
      }
    }
    setQuestionsByPair(grouped)
  }, [data])

  const generateQuestion = async (pair: string) => {
    setLoadingPairs((prevState) => ({ ...prevState, [pair]: true }))
    try {
      const result = await genJp({ jobId, dichotomyPair: pair }).unwrap()
      const newQuestions: PersonalityQuestion[] = result?.data?.questions ?? []
      setQuestionsByPair((prevState) => ({
        ...prevState,
        [pair]: [...(prevState[pair] ?? []), ...newQuestions],
      }))
    } catch (error) {
      console.error(`Error generating ${pair} question:`, error)

      notify('error', `Error generating ${pair} question`, {
        autoClose: 5000,
        transition: Bounce,
      })
    } finally {
      setLoadingPairs((prevState) => ({ ...prevState, [pair]: false }))
    }
  }

  return {
    questionsByPair,
    loadingPairs,
    generateQuestion,
  }
}

export default useGeneratedQuestion
