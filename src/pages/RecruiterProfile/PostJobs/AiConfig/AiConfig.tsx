import { Field, FieldArray, Form, Formik } from 'formik'
import React from 'react'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useNavigate, useParams } from 'react-router-dom'
import { Bounce } from 'react-toastify'
import * as Yup from 'yup'

import RadioFieldGroup from '../../../../components/Form/RadioFieldGroup'
import TextField from '../../../../components/Form/TextField'
import { useAiConfigMutation } from '../../../../redux/api/recruiter'
import { notify } from '../../../../utils/toastNotifications'
import QuestionGenerator from './QuestionGenerator'
import useGeneratedQuestion from './useGeneratedQuestion'

const AiConfig = () => {
  const { jobId } = useParams()
  const [aiConfig] = useAiConfigMutation()
  const navigate = useNavigate()
  const { generatedQuestions, generateQuestion, resetQuestion, loadingPairs } =
    useGeneratedQuestion(jobId)

  const initialValues = {
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

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),

    prescreeningAssessment: Yup.string().required('Required'),
    minPrescreeningScore: Yup.number()
      .min(0, 'Min score must be at least 0')
      .when('prescreeningAssessment', (prescreeningAssessment, schema) => {
        return String(prescreeningAssessment) === 'true'
          ? schema.required('Required')
          : schema.notRequired()
      }),

    cvSimilarity: Yup.string().required('Required'),
    minCvSimilarityScore: Yup.number()
      .min(0, 'Min score must be at least 0')
      .when('cvSimilarity', (cvSimilarity, schema) => {
        return String(cvSimilarity) === 'true'
          ? schema.required('Required')
          : schema.notRequired()
      }),

    noOfCvSimilarCandidates: Yup.number()
      .min(0, 'Min number must be at least 0')
      .when('cvSimilarity', (cvSimilarity, schema) => {
        return String(cvSimilarity) === 'true'
          ? schema.required('Required')
          : schema.notRequired()
      }),

    personalizedAssessment: Yup.string().required('Required'),
    noPersonalizedQuestions: Yup.number()
      .min(0, 'Min number must be at least 0')
      .when('personalizedAssessment', (personalizedAssessment, schema) => {
        return String(personalizedAssessment) === 'true'
          ? schema.required('Required')
          : schema.notRequired()
      }),

    personalityEvaluation: Yup.string().required('Required'),

    recruiterGuide: Yup.string().required('Required'),
  })

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    const cleanedValues = { ...values }

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

    try {
      const response = await aiConfig(cleanedValues).unwrap()
      if ('data' in response && response.data) {
        notify('success', response.data?.message || 'Submitted successfully', {
          autoClose: 5000,
        })

        navigate('/recruiterDashboard/myjobposts')
      }
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error.message ||
        'An error occurred while processing your request'

      notify('error', errorMessage, {
        autoClose: 5000,
        transition: Bounce,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="md:px-4 py-4 md:w-[70%] w-[100%] mx-auto">
      <h2 className="text-[#101828] text-[32px] mt-4 font-bold">AI Configs</h2>
      <p className="text-[#667085] text-[16px] mb-6 font-light">
        Select your configurations
      </p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ values, isSubmitting }) => (
          <Form>
            <TextField label="Name" name="name" placeholder="Enter name" />

            <RadioFieldGroup
              name="prescreeningAssessment"
              label="Enable Pre-assessment:"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
            {values.prescreeningAssessment === 'true' && (
              <TextField
                label="Min Pre-assessment Score"
                name="minPrescreeningScore"
                placeholder="Enter score"
                type="number"
              />
            )}

            <RadioFieldGroup
              name="cvSimilarity"
              label="Enable CV Similarity:"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
            {values.cvSimilarity === 'true' && (
              <>
                <TextField
                  label="Min CV Similarity Score"
                  name="minCvSimilarityScore"
                  placeholder="Enter score"
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

            <RadioFieldGroup
              name="personalizedAssessment"
              label="Enable Personalized Assessment:"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
            />
            {values.personalizedAssessment === 'true' && (
              <TextField
                label="Number of Personalized Questions"
                name="noPersonalizedQuestions"
                placeholder="Enter number"
                type="number"
              />
            )}

            <RadioFieldGroup
              name="personalityEvaluation"
              label="Enable Personality Evaluation:"
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
              ]}
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

                    <div className="flex flex-col mt-4 mb-4">
                      <label
                        htmlFor="personalityQuestion"
                        className="font-medium mb-1">
                        Questions:
                      </label>
                      <div className="space-y-2">
                        {values.uploadedQuestions?.map((pQuestion, index) => (
                          <div
                            key={index}
                            className="flex flex-row items-center space-x-1">
                            <Field
                              name={`uploadedQuestions.${index}`}
                              className="border border-[#D0D5DD] p-4 rounded w-full"
                            />
                            <div
                              className="p-2 text-[20px] text-[#667085] cursor-pointer rounded"
                              onClick={() => remove(index)}>
                              <RiDeleteBin6Line />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="px-4 py-2 bg-[#d7e8ff] text-[#006BFF] rounded-3xl border border-[#006BFF]"
                          onClick={() => push('')}>
                          <span className="flex items-center gap-2">
                            <FaPlus /> Add Question
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </FieldArray>
            )}

            <TextField
              label="Recruiter Guide"
              name="recruiterGuide"
              placeholder="Enter recruiter guide"
            />

            <button
              type="submit"
              className="bg-[#3C6FD4] text-white py-3 px-20 rounded hover:bg-blue-700 transition duration-300"
              disabled={isSubmitting}>
              {isSubmitting ? 'Submitting' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AiConfig
