import { Field, FieldArray, Form, Formik } from 'formik'
import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useParams } from 'react-router-dom'

import RadioFieldGroup from '@/components/forms/RadioFieldGroup'
import TextField from '@/components/forms/TextField'
import { Button } from '@/components/ui/Button'

import styles from './AiConfig.module.scss'
import { aiConfigValidationSchema } from './aiConfigValidationSchema'
import QuestionGenerator from './QuestionGenerator'
import useGeneratedQuestion from './useGeneratedQuestion'

interface AiConfigValues {
  name: string
  jobId: string
  prescreeningAssessment: string
  minPrescreeningScore: string | number
  cvSimilarity: string
  minCvSimilarityScore: string | number
  noOfCvSimilarCandidates: string | number
  personalizedAssessment: string
  noPersonalizedQuestions: string | number
  personalityEvaluation: string
  uploadedQuestions: string[]
  recruiterGuide: string
}

const AiConfig = () => {
  const { jobId } = useParams()
  const { generatedQuestions, generateQuestion, resetQuestion, loadingPairs } =
    useGeneratedQuestion(jobId)

  const initialValues: AiConfigValues = {
    name: '',
    jobId: jobId || '',
    prescreeningAssessment: '',
    minPrescreeningScore: '',
    cvSimilarity: '',
    minCvSimilarityScore: '',
    noOfCvSimilarCandidates: '',
    personalizedAssessment: '',
    noPersonalizedQuestions: '',
    personalityEvaluation: '',
    uploadedQuestions: [''],
    recruiterGuide: '',
  }

  const handleSubmit = (values: AiConfigValues) => {
    const cleanedValues: Partial<AiConfigValues> = { ...values }

    if (values.prescreeningAssessment === 'false') {
      delete cleanedValues.minPrescreeningScore
    }
    if (values.cvSimilarity === 'false') {
      delete cleanedValues.minCvSimilarityScore
      delete cleanedValues.noOfCvSimilarCandidates
    }
    if (values.personalizedAssessment === 'false') {
      delete cleanedValues.noPersonalizedQuestions
    }
    if (values.personalityEvaluation === 'false') {
      delete cleanedValues.uploadedQuestions
    }
    if (!values.recruiterGuide) {
      delete cleanedValues.recruiterGuide
    }

    console.log('AI config payload:', cleanedValues)
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>AI Configs</h2>
      <p className={styles.subheading}>Select your configurations</p>

      <Formik
        initialValues={initialValues}
        validationSchema={aiConfigValidationSchema}
        onSubmit={handleSubmit}>
        {({ values, isSubmitting }) => (
          <Form>
            <TextField label="Name" name="name" placeholder="Name of Job" />

            {/* Pre-screening Assessment */}
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionHeadingBold}>
                Pre-screening assessment
              </span>{' '}
              (These are the list of questions needed to be answered)
            </h3>
            <div className={styles.configCard}>
              <RadioFieldGroup
                name="prescreeningAssessment"
                label="Enable Pre-assessment:"
                options={[
                  { value: 'true', label: 'True' },
                  { value: 'false', label: 'False' },
                ]}
                icons={<IoIosInformationCircle fontSize={24} color="#000000" />}
                tooltipContent="Automatically screen candidates with a quick initial test before further evaluation"
              />
              {values.prescreeningAssessment === 'true' && (
                <TextField
                  label="Min Pre-assessment Score"
                  name="minPrescreeningScore"
                  placeholder="Enter score (%)"
                  type="number"
                />
              )}
            </div>

            {/* CV Similarity */}
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionHeadingBold}>
                CV Similarity assessment
              </span>{' '}
              (These are the list of questions needed to be answered)
            </h3>
            <div className={styles.configCard}>
              <RadioFieldGroup
                name="cvSimilarity"
                label="Enable CV Similarity:"
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
                icons={<IoIosInformationCircle fontSize={24} color="#000000" />}
                tooltipContent="Match candidate's CV against job requirements to find the best fit"
              />
              {values.cvSimilarity === 'true' && (
                <>
                  <TextField
                    label="Min CV Similarity Score"
                    name="minCvSimilarityScore"
                    placeholder="Enter score (%)"
                    type="number"
                  />
                  <TextField
                    label="Number of Similar CV Candidates"
                    name="noOfCvSimilarCandidates"
                    placeholder="Enter number"
                    type="number"
                  />
                </>
              )}
            </div>

            {/* Personalized Assessment */}
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionHeadingBold}>
                Personalized assessment
              </span>{' '}
              (These are the list of questions needed to be answered)
            </h3>
            <div className={styles.configCard}>
              <RadioFieldGroup
                name="personalizedAssessment"
                label="Enable Personalized Assessment:"
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
                icons={<IoIosInformationCircle fontSize={24} color="#000000" />}
                tooltipContent="Generate tailored tests based on job-specific skills and qualifications."
              />
              {values.personalizedAssessment === 'true' && (
                <TextField
                  label="Number of Personalized Questions"
                  name="noPersonalizedQuestions"
                  placeholder="Enter number"
                  type="number"
                />
              )}
            </div>

            {/* Personality Evaluation */}
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionHeadingBold}>
                Personality Evaluation
              </span>{' '}
              (These are the list of questions needed to be answered)
            </h3>
            <div className={styles.configCard}>
              <RadioFieldGroup
                name="personalityEvaluation"
                label="Enable Personality Evaluation:"
                options={[
                  { value: 'true', label: 'Yes' },
                  { value: 'false', label: 'No' },
                ]}
                icons={<IoIosInformationCircle fontSize={24} color="#000000" />}
                tooltipContent="Assess candidate's personality traits to determine cultural and role fit"
              />

              {values.personalityEvaluation === 'true' && (
                <FieldArray name="uploadedQuestions">
                  {({ remove, push }) => (
                    <>
                      {['EI', 'SN', 'TF', 'JP'].map((pair) => (
                        <QuestionGenerator
                          key={pair}
                          pair={pair}
                          generatedQuestion={generatedQuestions[pair]?.question}
                          isLoading={loadingPairs[pair]}
                          onGenerate={() => generateQuestion(pair)}
                          onAddQuestion={() => {
                            const question = generatedQuestions[pair]?.question
                            if (question) {
                              push(question)
                              resetQuestion(pair)
                            }
                          }}
                        />
                      ))}

                      <div className={styles.fieldGroup}>
                        <p className={styles.questionsLabel}>Questions:</p>
                        <div className={styles.questionsList}>
                          {values.uploadedQuestions?.map((_, index) => (
                            <div key={index} className={styles.questionItem}>
                              <Field
                                name={`uploadedQuestions.${index}`}
                                className={styles.questionInput}
                                placeholder={`Question ${index + 1}`}
                              />
                              <button
                                type="button"
                                className={styles.deleteButton}
                                onClick={() => remove(index)}
                                aria-label={`Remove question ${index + 1}`}>
                                <RiDeleteBin6Line />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className={styles.addButton}
                          onClick={() => push('')}>
                          <FaPlus /> Add Question
                        </button>
                      </div>
                    </>
                  )}
                </FieldArray>
              )}
            </div>

            <TextField
              label="Recruiter Guide (Optional)"
              name="recruiterGuide"
              placeholder="Enter recruiter guide"
            />

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}>
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AiConfig
