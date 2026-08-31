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
  prescreeningAssessment: 'true',
  minPrescreeningScore: '',
  cvSimilarity: '',
  minCvSimilarityScore: '',
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

const InfoTip = ({ id, content }: { id: string; content: string }) => (
  <>
    <span
      className={styles.tooltipTrigger}
      data-tooltip-id={id}
      aria-label={content}>
      <IoIosInformationCircle fontSize={20} />
    </span>
    <ReactTooltip id={id} content={content} place="top" variant="info" />
  </>
)

type ToggleFieldProps = {
  name: string
  label: string
  tooltipContent: string
}

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
        <InfoTip id={`${name}-tooltip`} content={tooltipContent} />
      </div>
      <ErrorMessage name={name} component="div" className={styles.fieldError} />
    </div>
  )
}

export const DICHOTOMY_ERROR_KEY = 'personalityDichotomy' as const

type AiConfigFieldsProps = {
  values: AiConfigFieldValues
  errors: Partial<
    Record<keyof AiConfigFieldValues | typeof DICHOTOMY_ERROR_KEY, unknown>
  >
  fieldName: (
    key: keyof AiConfigFieldValues | typeof DICHOTOMY_ERROR_KEY,
  ) => string
  setFieldValue: (key: keyof AiConfigFieldValues, value: unknown) => void
  jobId: string | undefined
  questionsByPair: Record<string, PersonalityQuestion[]>
  loadingPairs: Record<string, boolean>
  generateQuestion: (pair: string, count?: number) => void
  removeQuestion: (pair: string, questionId: string) => void
}

const SectionHead = ({
  title,
  summary,
  tooltipId,
  tooltip,
}: {
  title: string
  summary: string
  tooltipId: string
  tooltip: string
}) => (
  <div className={styles.sectionHead}>
    <h3 className={styles.sectionHeading}>
      <span className={styles.sectionHeadingBold}>{title}</span>
      <InfoTip id={tooltipId} content={tooltip} />
    </h3>
    <p className={styles.sectionSummary}>{summary}</p>
  </div>
)

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
    <section className={styles.configSection}>
      <SectionHead
        title="Configuration name"
        summary="A short label so you can tell this screening setup apart from other jobs."
        tooltipId="ai-config-name-section"
        tooltip="Shown only to your team. Candidates never see this name."
      />
      <div className={styles.configCard}>
        <TextField
          label="Name"
          name={fieldName('name')}
          placeholder="e.g. Backend engineer — default screen"
          tooltip="Internal label for this AI screening setup. It does not appear on the public job post."
        />
      </div>
    </section>

    <section className={styles.configSection}>
      <SectionHead
        title="Pre-screening assessment"
        summary="Uses the candidate’s global pre-assessment score (from their role and CV). It is not a per-job quiz."
        tooltipId="ai-config-prescreen-section"
        tooltip="Every talent takes one global pre-assessment. You set the minimum score they must already have before they can continue on this job. Candidates do not retake it per job, and they will not see a Prescreening step on the job page."
      />
      <div className={styles.configCard}>
        <TextField
          label="Minimum pre-assessment score"
          name={fieldName('minPrescreeningScore')}
          placeholder="Enter score (%)"
          type="number"
          tooltip="Candidates below this percentage are filtered out automatically. Typical bars sit between 50 and 80 depending on how selective the role is."
        />
      </div>
    </section>

    <section className={styles.configSection}>
      <SectionHead
        title="CV similarity"
        summary="Ranks applicants by how closely their CV matches this job. The numeric match is recruiter-only."
        tooltipId="ai-config-cv-section"
        tooltip="When enabled, we score each CV against the job brief and requirements. You see the match on the application panel. Candidates never see their CV match score, so they are not discouraged by a number."
      />
      <div className={styles.configCard}>
        <ToggleField
          name={fieldName('cvSimilarity')}
          label="Enable CV similarity"
          tooltipContent="Turn this on to auto-score CVs against this job. Off means CVs are not ranked by similarity for this posting."
        />
        {values.cvSimilarity === 'true' && (
          <TextField
            label="Minimum CV similarity score"
            name={fieldName('minCvSimilarityScore')}
            placeholder="Enter score (%)"
            type="number"
            tooltip="Applicants below this CV match percentage will not advance. Leave this as a realistic bar — 60–75 is a common range."
          />
        )}
      </div>
    </section>

    <section className={styles.configSection}>
      <SectionHead
        title="Personalized assessment"
        summary="Generates role-specific open questions from the job, the candidate’s CV, and your recruiter guide."
        tooltipId="ai-config-personalized-section"
        tooltip="Candidates answer written questions tailored to this role and their CV. Answers are saved and they can review them later on the job page. Use this to test real hiring scenarios, not trivia."
      />
      <div className={styles.configCard}>
        <ToggleField
          name={fieldName('personalizedAssessment')}
          label="Enable personalized assessment"
          tooltipContent="When on, each applicant gets unique questions generated from this job and their CV. When off, this stage is skipped in the pipeline."
        />
        {values.personalizedAssessment === 'true' && (
          <TextField
            label="Number of personalized questions"
            name={fieldName('noPersonalizedQuestions')}
            placeholder="Enter number"
            type="number"
            tooltip="How many open-ended questions each candidate must answer. 4–8 usually covers several hiring scenarios without fatiguing applicants."
          />
        )}
      </div>
    </section>

    <section className={styles.configSection}>
      <SectionHead
        title="Personality evaluation"
        summary="Workplace scenarios mapped to MBTI dichotomies, plus any custom questions you add."
        tooltipId="ai-config-personality-section"
        tooltip="Candidates answer open workplace questions. We infer personality preferences for culture and working-style fit. Generate questions per dichotomy, then optionally add your own. Candidates can reopen their submitted answers on the job page."
      />
      <div className={styles.configCard}>
        <ToggleField
          name={fieldName('personalityEvaluation')}
          label="Enable personality evaluation"
          tooltipContent="When on, personality is a required stage in this job’s pipeline. When off, applicants skip it entirely."
        />

        {values.personalityEvaluation === 'true' && (
          <>
            {DICHOTOMY_PAIRS.map((pair) => (
              <QuestionGenerator
                key={pair}
                pair={pair}
                questions={questionsByPair[pair] ?? []}
                count={values[COUNT_FIELD[pair]]}
                onCountChange={(count) =>
                  setFieldValue(COUNT_FIELD[pair], count)
                }
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

            {typeof errors[DICHOTOMY_ERROR_KEY] === 'string' && (
              <div className={styles.fieldError}>
                {errors[DICHOTOMY_ERROR_KEY] as string}
              </div>
            )}

            <FieldArray name={fieldName('uploadedQuestions')}>
              {({ remove, push }) => (
                <div className={styles.fieldGroup}>
                  <p className={styles.questionsLabel}>
                    Additional custom questions
                    <InfoTip
                      id="ai-config-custom-questions"
                      content="Your own questions, asked alongside generated personality items. Use them for must-have role scenarios the MBTI pairs do not cover. Candidates will see and later review their answers."
                    />
                  </p>
                  <div className={styles.questionsList}>
                    {values.uploadedQuestions?.map((_, index) => (
                      <div key={index} className={styles.questionItem}>
                        <Field
                          name={`${fieldName('uploadedQuestions')}.${index}`}
                          className={styles.questionInput}
                          placeholder={`Question ${index + 1}`}
                          aria-label={`Custom personality question ${
                            index + 1
                          }`}
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
                    <FaPlus /> Add question
                  </button>
                </div>
              )}
            </FieldArray>
          </>
        )}
      </div>
    </section>

    <section className={styles.configSection}>
      <SectionHead
        title="Recruiter guide"
        summary="Optional scoring notes the AI uses when writing and grading personalized questions."
        tooltipId="ai-config-guide-section"
        tooltip="Tell the AI what ‘good’ looks like for this hire — must-have skills, red flags, seniority bar. Candidates never see this text, but it shapes their questions and scores."
      />
      <div className={styles.configCard}>
        <TextField
          label="Recruiter guide (optional)"
          name={fieldName('recruiterGuide')}
          placeholder="What should a strong answer demonstrate for this role?"
          tooltip="Internal grading brief. Used when generating and scoring personalized questions. Not shown to candidates."
        />
      </div>
    </section>
  </>
)
