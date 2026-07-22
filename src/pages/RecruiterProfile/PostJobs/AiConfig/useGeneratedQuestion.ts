import { useEffect, useState } from 'react'

import {
  useDeletePersonalityQuestionMutation,
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
  const [deleteQuestion] = useDeletePersonalityQuestionMutation()
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
        autoClose: 2000,
      })
    } finally {
      setLoadingPairs((prevState) => ({ ...prevState, [pair]: false }))
    }
  }

  const removeQuestion = async (pair: string, questionId: string) => {
    const previous = questionsByPair[pair] ?? []
    setQuestionsByPair((prevState) => ({
      ...prevState,
      [pair]: previous.filter((q) => q.id !== questionId),
    }))

    try {
      await deleteQuestion(questionId).unwrap()
    } catch (error) {
      console.error(`Error removing ${pair} question:`, error)
      setQuestionsByPair((prevState) => ({ ...prevState, [pair]: previous }))
      notify('error', `Error removing ${pair} question`, {
        autoClose: 2000,
      })
    }
  }

  return {
    questionsByPair,
    loadingPairs,
    generateQuestion,
    removeQuestion,
  }
}

export default useGeneratedQuestion
