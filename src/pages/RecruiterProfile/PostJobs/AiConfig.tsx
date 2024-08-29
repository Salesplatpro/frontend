import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import * as Yup from 'yup'

import { aiConfigs } from '../../../api/api-communication'
import { Button } from '../../../components'
import {
  useAiConfigMutation,
  useGenJpPersonalityMutation,
  useGenJpPersonalityQuery,
  usePatchAiConfigMutation,
} from '../../../redux/api/recruiter'
import { configProps } from '../../../utils/jobPostTypes'

const validationSchema = Yup.object({
  // prescreeningAssessment: Yup.string().required('Required'),
  // minPrescreeningScore: Yup.number()
  //   .required('Required')
  //   .min(0, 'Min score must be at least 0'),
  // cvSimilarity: Yup.string().required('Required'),
  // minCvSimilarityScore: Yup.number()
  //   .required('Required')
  //   .min(0, 'Min score must be at least 0'),
  // noOfCvSimilarCandidates: Yup.number()
  //   .required('Required')
  //   .min(0, 'Min number must be at least 0'),
  // personalizedAssessment: Yup.string().required('Required'),
  // noPersonalizedQuestions: Yup.number()
  //   .required('Required')
  //   .min(0, 'Min number must be at least 0'),
  // personalityEvaluation: Yup.string().required('Required'),
  // uploadedQuestions: Yup.array().of(
  //   Yup.string().required('Question is required'),
  // ),
})

const AiConfig = () => {
  const { jobId } = useParams()
  const [aiConfigId, setAiConfigId] = useState(null)
  const [aiConfig] = useAiConfigMutation()
  const [genJp] = useGenJpPersonalityMutation()
  const [generatedQuestions, setGeneratedQuestions] = useState({})

  const handleGenerate = async (pair) => {
    try {
      // const jobId = '6656d664569637cd6b14e8ad' // Replace with dynamic value if needed

      const result = await genJp({ jobId, dichotomyPair: pair }).unwrap()
      setGeneratedQuestions((prevState) => ({
        ...prevState,
        [pair]: result?.data?.question || null,
      }))
    } catch (error) {
      console.error(`Error generating ${pair}:`, error)
    }
  }

  const handleAddQuestion = (push, pair) => {
    const question = generatedQuestions[pair]?.question
    if (question) {
      push(question)
      setGeneratedQuestions((prevState) => ({
        ...prevState,
        [pair]: null,
      }))
    }
  }

  const initialValue: configProps = {
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

  const onSubmit = async (values: configProps, { setSubmitting }) => {
    try {
      const data = await aiConfig(values)
      console.log('Form Values:', data)
      console.log(data.data.message)
      console.log(data.data.data.config._id)

      if (data.data.status) {
        toast.success(data.data.message)
        setAiConfigId(data.data.data.config._id)
      } else {
        toast.error(data.data.message)
      }
    } catch (error) {
      console.error('Error during form submission:', error)
      toast.error('An unexpected error occurred. Please try again later.')
    } finally {
      setSubmitting(false)
    }

    console.log('Form Submission')
  }

  return (
    <div className="p-8 bg-[#FCFCFC] shadow-md rounded w-[70%] mx-auto">
      <div>
        <h2 className="text-[#101828] text-[30px] mt-2 font-bold">
          AI Configs
        </h2>
        <p className="text-[#667085] text-[16px] mt-2 mb-6 font-light">
          Select your configurations
        </p>
      </div>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        {({ errors, touched, values, isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="name">
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-6">
              <h5 className="font-bold text-[18px] mb-2">
                Pre-screening assessment{' '}
                <span className="font-light text-[14px]">
                  (These are the list of questions needed to be answered)
                </span>
              </h5>
              <div className="border border-gray-300 p-5 mt-2 rounded-lg shadow-lg w-full md:w-[60%]">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p id="enable-pre-assess" className="font-medium">
                    Enable Pre-assessment:
                  </p>
                  <label
                    htmlFor="prescreeningAssessmentTrue"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="prescreeningAssessmentTrue"
                      name="prescreeningAssessment"
                      value="true"
                    />
                    <span>True</span>
                  </label>
                  <label
                    htmlFor="prescreeningAssessmentFalse"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="prescreeningAssessmentFalse"
                      name="prescreeningAssessment"
                      value="false"
                    />
                    <span>False</span>
                  </label>
                  {errors.prescreeningAssessment &&
                  touched.prescreeningAssessment ? (
                    <div className="text-red-500 text-sm">
                      {errors.prescreeningAssessment}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="minPrescreeningScore"
                    className="font-medium mb-1">
                    Min pre-assessment score:
                  </label>
                  <Field
                    type="text"
                    id="minPrescreeningScore"
                    name="minPrescreeningScore"
                    className="border border-gray-300 rounded p-2"
                  />
                  {errors.minPrescreeningScore &&
                  touched.minPrescreeningScore ? (
                    <div className="text-red-500 text-sm">
                      {errors.minPrescreeningScore}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {/* CV SIMILARITY */}
            <div className="mb-6">
              <h5 className="font-bold text-[18px] mb-2">
                Cv similarity Test{' '}
                <span className="font-light text-[14px]">
                  (Do you want the AI to run a CV check for you)
                </span>
              </h5>
              <div className="border border-gray-300 p-5 mt-2 rounded-lg shadow-lg w-full md:w-[60%]">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p id="cvSimilarity" className="font-medium">
                    Enable CV similarity:
                  </p>
                  <label
                    htmlFor="cvSimilarityTrue"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="cvSimilarityTrue"
                      name="cvSimilarity"
                      value="true"
                    />
                    <span>True</span>
                  </label>
                  <label
                    htmlFor="cvSimilarityFalse"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="cvSimilarityFalse"
                      name="cvSimilarity"
                      value="false"
                    />
                    <span>False</span>
                  </label>
                  {errors.cvSimilarity && touched.cvSimilarity ? (
                    <div className="text-red-500 text-sm">
                      {errors.cvSimilarity}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="minCvSimilarityScore"
                    className="font-medium mb-1">
                    Min CV similarity score:
                  </label>
                  <Field
                    type="text"
                    id="minCvSimilarityScore"
                    name="minCvSimilarityScore"
                    className="border border-gray-300 rounded p-2"
                  />
                  {errors.minCvSimilarityScore &&
                  touched.minCvSimilarityScore ? (
                    <div className="text-red-500 text-sm">
                      {errors.minCvSimilarityScore}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="noOfCvSimilarCandidates"
                    className="font-medium mb-1">
                    Number of similar CV candidates:
                  </label>
                  <Field
                    type="text"
                    id="noOfCvSimilarCandidates"
                    name="noOfCvSimilarCandidates"
                    className="border border-gray-300 rounded p-2"
                  />
                  {errors.noOfCvSimilarCandidates &&
                  touched.noOfCvSimilarCandidates ? (
                    <div className="text-red-500 text-sm">
                      {errors.noOfCvSimilarCandidates}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Personalized assessment */}
            <div className="mb-6">
              <h5 className="font-bold text-[18px] mb-2">
                Personalized assessment{' '}
                <span className="font-light text-[14px]">
                  (These are the list of questions needed to be answered)
                </span>
              </h5>
              <div className="border border-gray-300 p-5 mt-2 rounded-lg shadow-lg w-full md:w-[60%]">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p id="enable-pre-assess" className="font-medium">
                    Enable Personalized assessment:
                  </p>
                  <label
                    htmlFor="personalizedAssessmentTrue"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="personalizedAssessmentTrue"
                      name="personalizedAssessment"
                      value="true"
                    />
                    <span>True</span>
                  </label>
                  <label
                    htmlFor="personalizedAssessmentFalse"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="personalizedAssessmentFalse"
                      name="personalizedAssessment"
                      value="false"
                    />
                    <span>False</span>
                  </label>
                  {errors.personalizedAssessment &&
                  touched.personalizedAssessment ? (
                    <div className="text-red-500 text-sm">
                      {errors.personalizedAssessment}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="noPersonalizedQuestions"
                    className="font-medium mb-1">
                    Number of Personalized Questions:
                  </label>
                  <Field
                    type="text"
                    id="noPersonalizedQuestions"
                    name="noPersonalizedQuestions"
                    className="border border-gray-300 rounded p-2"
                  />
                  {errors.noPersonalizedQuestions &&
                  touched.noPersonalizedQuestions ? (
                    <div className="text-red-500 text-sm">
                      {errors.noPersonalizedQuestions}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Personality evaluation */}
            <div className="mb-6">
              <h5 className="font-bold text-[18px] mb-2">
                Personality Evaluation{' '}
                <span className="font-light text-[14px]">
                  (These are the list of questions needed to be answered)
                </span>
              </h5>
              <div className="border border-gray-300 p-5 mt-2 rounded-lg shadow-lg w-full md:w-[60%]">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p id="enable-pre-assess" className="font-medium">
                    Enable Personality evaluation:
                  </p>
                  <label
                    htmlFor="personalityEvaluationTrue"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="personalityEvaluationTrue"
                      name="personalityEvaluation"
                      value="true"
                    />
                    <span>True</span>
                  </label>
                  <label
                    htmlFor="personalityEvaluationFalse"
                    className="flex items-center space-x-2">
                    <Field
                      type="radio"
                      id="personalityEvaluationFalse"
                      name="personalityEvaluation"
                      value="false"
                    />
                    <span>False</span>
                  </label>
                  {errors.personalityEvaluation &&
                  touched.personalityEvaluation ? (
                    <div className="text-red-500 text-sm">
                      {errors.personalityEvaluation}
                    </div>
                  ) : null}
                </div>

                <FieldArray name="uploadedQuestions">
                  {({ remove, push }) => (
                    <>
                      {['EI', 'SN', 'TF', 'JP'].map((pair) => (
                        <div key={pair} className="mb-4">
                          <h3>Dichotomy Pair {pair}</h3>
                          <button
                            type="button"
                            onClick={() => handleGenerate(pair)}
                            className="p-2 bg-blue-500 text-white rounded mr-2">
                            {!generatedQuestions[pair]
                              ? `Generate ${pair}`
                              : `Regenerate ${pair}`}
                          </button>
                          {generatedQuestions[pair] && (
                            <>
                              <p>{generatedQuestions[pair].question}</p>
                              <button
                                type="button"
                                onClick={() => handleAddQuestion(push, pair)}
                                className="p-2 bg-green-500 text-white rounded">
                                Add {pair} Question
                              </button>
                            </>
                          )}
                        </div>
                      ))}

                      <div className="flex flex-col mt-4">
                        <label
                          htmlFor="personalityQuestion"
                          className="font-medium mb-1">
                          Questions:
                        </label>
                        <div className="space-y-2">
                          {values.uploadedQuestions.map((pQuestion, index) => (
                            <div key={index} className="flex flex-row">
                              <Field
                                name={`uploadedQuestions.${index}`}
                                className="w-full p-2 border border-gray-300 rounded mr-2"
                              />
                              <button
                                type="button"
                                className="p-2 bg-red-500 text-white rounded"
                                onClick={() => remove(index)}>
                                -
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                            onClick={() => push('')}>
                            Add Question
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </FieldArray>

                {errors.uploadedQuestions && touched.uploadedQuestions ? (
                  <div className="text-red-500 text-sm">
                    {errors.uploadedQuestions}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-bold" htmlFor="recruiterGuide">
                Recruiter Guide
              </label>
              <Field
                type="text"
                id="recruiterGuide"
                name="recruiterGuide"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="recruiterGuide"
                component="div"
                className="text-red-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                disabled={isSubmitting}>
                Submit
              </button>
            </div>
            {/* <div>
              {aiConfigId !== null ? (
                <Link to={`/recruiterDashboard/postjob/${aiConfigId}`}>
                  <button
                    // type="submit"
                    // disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    Next
                  </button>
                </Link>
              ) : (
                ''
              )}
            </div> */}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AiConfig

// 66c72696098d396108227ac4
