import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaPlus } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import * as Yup from 'yup'

import {
  useAiConfigMutation,
  useGenJpPersonalityMutation,
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
      console.error(`Error generating ${pair} question:`, error)
      toast.error(`Error generating ${pair} question`)
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
    // conditionally submit the the aiconfig
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

    // console.log('Cleaned Submission Values:', cleanedValues)
    // console.log(values)
    try {
      const data = await aiConfig(cleanedValues)

      if (data && data.status) {
        toast.success(data.data?.message || 'Submitted successful')
        setAiConfigId(data.data?.data?.config?._id)
      } else {
        toast.error(data?.error?.data?.message || 'An error occurred.')
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.')
    } finally {
      setSubmitting(false)
    }

    console.log('Form Submission')
  }

  return (
    <div className="p-8 w-[70%] mx-auto">
      <div>
        <h2 className="text-[#101828] text-[32px] mt-4 font-bold">
          AI Configs
        </h2>
        <p className="text-[#667085] text-[16px] mb-6 font-light">
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
              <label
                className="font-bold text-[14px] text-[#434144]"
                htmlFor="name">
                Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="block border border-[#D0D5DD] p-4 rounded w-full"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-6">
              <h5 className="font-bold text-[16px] text-[#434144]">
                Pre-screening assessment{' '}
                <span className="font-light text-[14px]">
                  (These are the list of questions needed to be answered)
                </span>
              </h5>
              <div className="bg-[#E7E7E7] p-5 mt-2 rounded-lg shadow w-full">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p
                    id="enable-pre-assess"
                    className="font-semibold text-[16px] text-[#434144] flex-1">
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
                    className="font-medium text-[14px] text-[#434144] mb-1">
                    Min pre-assessment score:
                  </label>
                  <Field
                    type="text"
                    id="minPrescreeningScore"
                    name="minPrescreeningScore"
                    placeholder="Enter score"
                    className="block border border-[#D0D5DD] p-4 rounded w-full"
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
              <h5 className="font-bold text-[16px] text-[#434144] mb-2">
                Cv similarity Test{' '}
                <span className="font-light text-[14px]">
                  (Do you want the AI to run a CV check for you)
                </span>
              </h5>
              <div className="bg-[#E7E7E7] p-5 mt-2 rounded-lg shadow w-full">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p
                    id="cvSimilarity"
                    className="font-semibold text-[16px] text-[#434144] flex-1">
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
                    className="font-medium text-[14px] text-[#434144] mb-1">
                    Min CV similarity score:
                  </label>
                  <Field
                    type="text"
                    id="minCvSimilarityScore"
                    name="minCvSimilarityScore"
                    placeholder="Enter score"
                    className="block border border-[#D0D5DD] p-4 rounded w-full"
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
                    className="font-medium text-[14px] text-[#434144] mb-1 mt-2">
                    Number of similar CV candidates:
                  </label>
                  <Field
                    type="text"
                    id="noOfCvSimilarCandidates"
                    name="noOfCvSimilarCandidates"
                    placeholder="Enter number"
                    className="block border border-[#D0D5DD] p-4 rounded w-full"
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
              <h5 className="font-bold text-[16px] text-[#434144]">
                Personalized assessment{' '}
                <span className="font-light text-[14px]">
                  (These are the list of questions needed to be answered)
                </span>
              </h5>
              <div className="bg-[#E7E7E7] p-5 mt-2 rounded-lg shadow w-full">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p
                    id="enable-pre-assess"
                    className="font-semibold text-[16px] text-[#434144] flex-1">
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
                    className="font-medium text-[14px] text-[#434144] mb-1">
                    Number of Personalized Questions:
                  </label>
                  <Field
                    type="text"
                    id="noPersonalizedQuestions"
                    name="noPersonalizedQuestions"
                    className="block border border-[#D0D5DD] p-4 rounded w-full"
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
              <h5 className="font-bold text-[16px] text-[#434144] mb-2">
                Personality Evaluation{' '}
                <span className="font-light text-[14px]">
                  (These are the list of questions needed to be answered)
                </span>
              </h5>
              <div className="bg-[#E7E7E7] p-5 mt-2 rounded-lg shadow w-full">
                <div className="flex flex-row items-center space-x-4 mb-4">
                  <p
                    id="enable-pre-assess"
                    className="font-semibold text-[16px] text-[#434144] flex-1">
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
                          <h3 className="font-semibold text-[14px] text-[#434144] mb-1">
                            Dichotomy Pair {pair}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleGenerate(pair)}
                            className="p-2 bg-[#3C6FD4] text-white text-[14px] rounded mr-2">
                            {!generatedQuestions[pair]
                              ? `Generate ${pair}`
                              : `Regenerate ${pair}`}
                          </button>
                          {generatedQuestions[pair] && (
                            <div className="bg-white shadow-md p-4 rounded-lg my-3">
                              <p>{generatedQuestions[pair].question}</p>
                              <button
                                type="button"
                                onClick={() => handleAddQuestion(push, pair)}
                                className="px-4 mt-2 py-2 bg-[#d7e8ff] text-[#006BFF] rounded-3xl border border-[#006BFF] b-2 hover:bg-[#92bfff]">
                                <span className="flex items-center gap-2">
                                  <FaPlus /> Add {pair} Question
                                </span>
                              </button>
                            </div>
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
                            <div
                              key={index}
                              className="flex flex-row items-center relative">
                              <Field
                                name={`uploadedQuestions.${index}`}
                                className="border border-[#D0D5DD] p-4 rounded w-full"
                              />
                              <div
                                className="p-2 text-[18px] text-[#667085] cursor-pointer rounded absolute right-2"
                                onClick={() => remove(index)}>
                                <RiDeleteBin6Line />
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="px-4 py-2 bg-[#d7e8ff] text-[#006BFF] rounded-3xl border border-[#006BFF] b-2 hover:bg-[#92bfff]"
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

                {errors.uploadedQuestions && touched.uploadedQuestions ? (
                  <div className="text-red-500 text-sm">
                    {errors.uploadedQuestions}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mb-4">
              <label
                className="font-bold text-[14px] text-[#434144] block"
                htmlFor="recruiterGuide">
                Recruiter Guide
              </label>
              <Field
                type="text"
                id="recruiterGuide"
                name="recruiterGuide"
                className="border border-[#D0D5DD] p-4 rounded w-full"
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
                className="bg-[#3C6FD4] text-white py-3 px-20 rounded hover:bg-blue-700 transition duration-300"
                disabled={isSubmitting}>
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AiConfig

// 66c72696098d396108227ac4
