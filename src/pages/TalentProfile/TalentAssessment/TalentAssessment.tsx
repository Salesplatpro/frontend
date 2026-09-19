import { Alert } from '@mui/material'
import Lottie from 'lottie-react'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Spinner } from '@/components/ui/Spinner'
import { useProfile } from '@/features/profile/hooks/useProfile'

import animationData from '../../../assets/Animation - check.json'
import {
  useFetchPretestQuery,
  usePostPretestMutation,
} from '../../../redux/api/talent'
import { notify } from '../../../utils/toastNotifications'
import { Question } from '../../../utils/types'
import styles from './TalentAssessment.module.scss'

const TalentAssessment = () => {
  const { profile } = useProfile()
  const roleId = profile?.userRoles?.[0]?.id
  const location = useLocation()
  const canRetakeAssessment = location.state?.canRetakeAssessment || false
  const { data, error, isLoading } = useFetchPretestQuery(roleId)
  const [postAnswer] = usePostPretestMutation()
  const [questions, setQuestions] = useState<Question[]>([])
  const [formData, setFormData] = useState<{
    roleId: string
    answers: { [key: string]: string }
  }>({ roleId: roleId || '', answers: {} })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Track whether all questions have been answered
  const allAnswered =
    questions.length > 0 &&
    Object.keys(formData.answers).length === questions.length

  useEffect(() => {
    if (data) {
      setQuestions(data.data.questions)
    }
    if (error) {
      notify('error', 'DisplayError fetching questions', {
        autoClose: 2000,
      })
    }
  }, [data, error])

  if (!roleId) {
    return <Alert severity="info">Please complete your profile creation</Alert>
  }

  if (profile?.prescreeningScore && !canRetakeAssessment) {
    return (
      <div className={styles.doneState}>
        <div>
          <Lottie
            animationData={animationData}
            loop={false}
            className={styles.doneAnimation}
          />
        </div>

        <h2 className={styles.doneTitle}>You Have Taken The Test Already</h2>
      </div>
    )
  }

  if (isLoading) return <Spinner fullPage />

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    questionId: string,
  ) => {
    const { value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      answers: {
        ...prevData.answers,
        [questionId]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await postAnswer(formData).unwrap()
      console.log(formData)
      if (response.status) {
        notify('success', `${response.message}`, {
          autoClose: 2000,
        })

        // toast.success(`${response.message} ${response.data.scorePercent}`)
      } else {
        notify(
          'error',
          response.message || 'DisplayError submitting question',
          {
            autoClose: 2000,
          },
        )
      }
    } catch (error) {
      console.log(error)

      notify('error', 'DisplayError submitting quiz', {
        autoClose: 2000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className={styles.page}>
        <div className={styles.intro}>
          <h2 className={styles.title}>Pre-Assessment Test</h2>
          <p className={styles.subtitle}>
            Welcome to your Assessment test, you have 15 Questions to answer in
            this stage.
          </p>
        </div>

        <div className={styles.form}>
          <form onSubmit={handleSubmit}>
            <ul>
              {questions.map((question, i) => (
                <div key={i} className={styles.questionCard}>
                  <div className={styles.questionHeader}>
                    <h3 className={styles.questionText}>{i + 1}.</h3>
                    <h3 className={styles.questionText}>{question.question}</h3>
                  </div>

                  <textarea
                    className={styles.answerInput}
                    placeholder="Answer here"
                    name={`answer-${question.id}`}
                    onChange={(e) => handleChange(e, question.id)}
                    required
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={!allAnswered} // Disable until all questions are answered
                className={`${styles.submitButton} ${
                  allAnswered ? styles.submitEnabled : styles.submitDisabled
                }`}>
                {isSubmitting ? 'Submitting' : 'Submit'}
              </button>
            </ul>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TalentAssessment
