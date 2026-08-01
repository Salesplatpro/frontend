import { ErrorMessage, Field, FieldArray, useField } from 'formik'
import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Tooltip as ReactTooltip } from 'react-tooltip'

import TextField from '@/components/forms/TextField'

import styles from './AiConfig.module.scss'
import QuestionGenerator from './QuestionGenerator'
import { PersonalityQuestion } from './useGeneratedQuestion'

export interface AiConfigFieldValues {
  name: string
  prescreeningAssessment: string
  minPrescreeningScore: string | number
  cvSimilarity: string
  minCvSimilarityScore: string | number
  noOfCvSimilarCandidates: string | number
  personalizedAssessment: string
  noPersonalizedQuestions: string | number
  personalityEvaluation: string
  noOfEIQuestions: string | number
  noOfSNQuestions: string | number
  noOfTFQuestions: string | number
  noOfJPQuestions: string | number
  uploadedQuestions: string[]
  recruiterGuide: string
}

export const AI_CONFIG_DEFAULT_VALUES: AiConfigFieldValues = {
  name: '',
  prescreeningAssessment: '',
  minPrescreeningScore: '',
  cvSimilarity: '',
  minCvSimilarityScore: '',
  noOfCvSimilarCandidates: '',
  personalizedAssessment: '',
  noPersonalizedQuestions: '',
  personalityEvaluation: '',
  noOfEIQuestions: '',
  noOfSNQuestions: '',
  noOfTFQuestions: '',
  noOfJPQuestions: '',
  uploadedQuestions: [''],
  recruiterGuide: '',
}

const DICHOTOMY_PAIRS = ['EI', 'SN', 'TF', 'JP'] as const

type CountFieldName =
  | 'noOfEIQuestions'
  | 'noOfSNQuestions'
  | 'noOfTFQuestions'
  | 'noOfJPQuestions'

const COUNT_FIELD: Record<(typeof DICHOTOMY_PAIRS)[number], CountFieldName> = {
  EI: 'noOfEIQuestions',
  SN: 'noOfSNQuestions',
  TF: 'noOfTFQuestions',
  JP: 'noOfJPQuestions',
}

export const DICHOTOMY_COUNT_FIELDS = Object.values(COUNT_FIELD)

type ToggleFieldProps = { name: string; label: string; tooltipContent: string }

export const ToggleField = ({
  name,
  label,
  tooltipContent,
}: ToggleFieldProps) => {
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

type AiConfigFieldsProps = {
  values: AiConfigFieldValues
  errors: Partial<Record<keyof AiConfigFieldValues, unknown>>
  /** Maps an unprefixed field key (e.g. "personalityEvaluation") to the
   * actual Formik field name to bind to — "personalityEvaluation" when this
   * form owns its own top-level Formik instance, or "aiConfig.personalityEvaluation"
   * when nested inside a combined job-details + AI-config form. */
  fieldName: (key: keyof AiConfigFieldValues) => string
  setFieldValue: (key: keyof AiConfigFieldValues, value: unknown) => void
  jobId: string | undefined
  questionsByPair: Record<string, PersonalityQuestion[]>
  loadingPairs: Record<string, boolean>
  generateQuestion: (pair: string, count?: number) => void
  removeQuestion: (pair: string, questionId: string) => void
}

export const AiConfigFields = ({
  values,
  errors,
  fieldName,
  setFieldValue,
  questionsByPair,
  loadingPairs,
  generateQuestion,
  removeQuestion,
}: AiConfigFieldsProps) => (
  <>
    <TextField
      label="Name"
      name={fieldName('name')}
      placeholder="Name of Job"
    />

    {/* Pre-screening Assessment */}
    <h3 className={styles.sectionHeading}>
      <span className={styles.sectionHeadingBold}>
        Pre-screening assessment
      </span>{' '}
      Automatically filter candidates with a short initial test before detailed
      evaluation.
    </h3>
    <div className={styles.configCard}>
      <ToggleField
        name={fieldName('prescreeningAssessment')}
        label="Enable Pre-screening Assessment"
        tooltipContent="Automatically screen candidates with a quick initial test before further evaluation"
      />
      {values.prescreeningAssessment === 'true' && (
        <TextField
          label="Min Pre-assessment Score"
          name={fieldName('minPrescreeningScore')}
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
      Rank applicants by how closely their CV matches the job requirements.
    </h3>
    <div className={styles.configCard}>
      <ToggleField
        name={fieldName('cvSimilarity')}
        label="Enable CV Similarity"
        tooltipContent="Match candidate's CV against job requirements to find the best fit"
      />
      {values.cvSimilarity === 'true' && (
        <>
          <TextField
            label="Min CV Similarity Score"
            name={fieldName('minCvSimilarityScore')}
            placeholder="Enter score (%)"
            type="number"
          />
          <TextField
            label="Number of Similar CV Candidates"
            name={fieldName('noOfCvSimilarCandidates')}
            placeholder="Enter number"
            type="number"
          />
        </>
      )}
    </div>

    {/* Personalized Assessment */}
    <h3 className={styles.sectionHeading}>
      <span className={styles.sectionHeadingBold}>Personalized assessment</span>{' '}
      Generate role-specific questions tailored to the skills and qualifications
      required.
    </h3>
    <div className={styles.configCard}>
      <ToggleField
        name={fieldName('personalizedAssessment')}
        label="Enable Personalized Assessment"
        tooltipContent="Generate tailored tests based on job-specific skills and qualifications."
      />
      {values.personalizedAssessment === 'true' && (
        <TextField
          label="Number of Personalized Questions"
          name={fieldName('noPersonalizedQuestions')}
          placeholder="Enter number"
          type="number"
        />
      )}
    </div>

    {/* Personality Evaluation */}
    <h3 className={styles.sectionHeading}>
      <span className={styles.sectionHeadingBold}>Personality Evaluation</span>{' '}
      Assess personality traits using MBTI dichotomy pairs to gauge cultural and
      role fit.
    </h3>
    <div className={styles.configCard}>
      <ToggleField
        name={fieldName('personalityEvaluation')}
        label="Enable Personality Evaluation"
        tooltipContent="Assess candidate's personality traits to determine cultural and role fit"
      />

      {values.personalityEvaluation === 'true' && (
        <>
          {DICHOTOMY_PAIRS.map((pair) => (
            <QuestionGenerator
              key={pair}
              pair={pair}
              questions={questionsByPair[pair] ?? []}
              count={values[COUNT_FIELD[pair]]}
              onCountChange={(count) => setFieldValue(COUNT_FIELD[pair], count)}
              isLoading={loadingPairs[pair]}
              onGenerate={() => {
                const rawCount = values[COUNT_FIELD[pair]]
                const count =
                  rawCount === '' || rawCount == null
                    ? undefined
                    : Number(rawCount)
                generateQuestion(pair, count)
              }}
              onRemove={(questionId) => removeQuestion(pair, questionId)}
              countError={
                typeof errors[COUNT_FIELD[pair]] === 'string'
                  ? (errors[COUNT_FIELD[pair]] as string)
                  : undefined
              }
            />
          ))}

          <FieldArray name={fieldName('uploadedQuestions')}>
            {({ remove, push }) => (
              <div className={styles.fieldGroup}>
                <p className={styles.questionsLabel}>
                  Additional custom questions:
                </p>
                <div className={styles.questionsList}>
                  {values.uploadedQuestions?.map((_, index) => (
                    <div key={index} className={styles.questionItem}>
                      <Field
                        name={`${fieldName('uploadedQuestions')}.${index}`}
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
            )}
          </FieldArray>
        </>
      )}
    </div>

    <TextField
      label="Recruiter Guide (Optional)"
      name={fieldName('recruiterGuide')}
      placeholder="Enter recruiter guide"
    />
  </>
)
