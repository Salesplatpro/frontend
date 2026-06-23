import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  useField,
  useFormikContext,
} from 'formik'
import React, { useEffect } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useNavigate, useParams } from 'react-router-dom'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import TextField from '@/components/forms/TextField'
import { Button } from '@/components/ui/Button'
import { useAiConfigDraftStore } from '@/features/jobs/store/useAiConfigDraftStore'
import { useAiConfigMutation } from '@/redux/api/recruiter'
import { notify } from '@/utils/toastNotifications'

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

type ToggleFieldProps = { name: string; label: string; tooltipContent: string }

const ToggleField = ({ name, label, tooltipContent }: ToggleFieldProps) => {
  const [field, , helpers] = useField(name)
  const checked = field.value === 'true'
  return (
    <div className={styles.toggleRow}>
      <p className={styles.toggleLabel}>{label}</p>
      <div className={styles.toggleRight}>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          className={[
            styles.toggleTrack,
            checked ? styles.toggleTrackOn : '',
          ].join(' ')}
          onClick={() => helpers.setValue(checked ? 'false' : 'true')}>
          <span
            className={[
              styles.toggleThumb,
              checked ? styles.toggleThumbOn : '',
            ].join(' ')}
          />
        </button>
        <span data-tooltip-id={`${name}-tooltip`}>
          <IoIosInformationCircle fontSize={24} color="#000000" />
        </span>
        <ReactTooltip
          id={`${name}-tooltip`}
          content={tooltipContent}
          place="bottom"
          variant="info"
        />
      </div>
      <ErrorMessage name={name} component="div" className={styles.fieldError} />
    </div>
  )
}

const FormObserver: React.FC<{ saveDraft: (v: unknown) => void }> = ({
  saveDraft,
}) => {
  const { values } = useFormikContext<AiConfigValues>()
  useEffect(() => {
    saveDraft(values)
  }, [values, saveDraft])
  return null
}

const DEFAULT_VALUES: AiConfigValues = {
  name: '',
  jobId: '',
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

const AiConfig = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [aiConfigMutation] = useAiConfigMutation()
  const { drafts, saveDraft, clearDraft } = useAiConfigDraftStore()
  const { generatedQuestions, generateQuestion, resetQuestion, loadingPairs } =
    useGeneratedQuestion(jobId)

  const savedDraft = drafts[jobId ?? '']
  const hadDraft = savedDraft != null
  const initialValues: AiConfigValues =
    savedDraft != null
      ? ({
          ...(savedDraft as AiConfigValues),
          jobId: jobId ?? '',
        } as AiConfigValues)
      : { ...DEFAULT_VALUES, jobId: jobId ?? '' }

  const onSubmit = async (
    values: AiConfigValues,
    { setSubmitting }: FormikHelpers<AiConfigValues>,
  ) => {
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

    const payload = {
      ...cleanedValues,
      prescreeningAssessment: cleanedValues.prescreeningAssessment === 'true',
      cvSimilarity: cleanedValues.cvSimilarity === 'true',
      personalizedAssessment: cleanedValues.personalizedAssessment === 'true',
      personalityEvaluation: cleanedValues.personalityEvaluation === 'true',
    }

    try {
      await aiConfigMutation(payload).unwrap()
      clearDraft(jobId ?? '')
      notify('success', 'AI config saved!')
      navigate('/recruiterDashboard/myjobposts')
    } catch (err: unknown) {
      const apiMessage = (err as { data?: { message?: string } })?.data?.message
      notify(
        'error',
        apiMessage ??
          'Failed to save AI config. Your progress has been saved — please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <h2 className={styles.heading}>AI Configs</h2>
      <p className={styles.subheading}>Select your configurations</p>

      <Formik
        initialValues={initialValues}
        validationSchema={aiConfigValidationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {({ values, isSubmitting }) => (
          <Form>
            <FormObserver saveDraft={(v) => saveDraft(jobId ?? '', v)} />

            {hadDraft && (
              <div className={styles.draftBanner}>Draft restored</div>
            )}

            <TextField label="Name" name="name" placeholder="Name of Job" />

            {/* Pre-screening Assessment */}
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionHeadingBold}>
                Pre-screening assessment
              </span>{' '}
              Automatically filter candidates with a short initial test before
              detailed evaluation.
            </h3>
            <div className={styles.configCard}>
              <ToggleField
                name="prescreeningAssessment"
                label="Enable Pre-screening Assessment"
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
              Rank applicants by how closely their CV matches the job
              requirements.
            </h3>
            <div className={styles.configCard}>
              <ToggleField
                name="cvSimilarity"
                label="Enable CV Similarity"
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
              Generate role-specific questions tailored to the skills and
              qualifications required.
            </h3>
            <div className={styles.configCard}>
              <ToggleField
                name="personalizedAssessment"
                label="Enable Personalized Assessment"
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
              Assess personality traits using MBTI dichotomy pairs to gauge
              cultural and role fit.
            </h3>
            <div className={styles.configCard}>
              <ToggleField
                name="personalityEvaluation"
                label="Enable Personality Evaluation"
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
                Save AI Config
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AiConfig
