import { Field, FieldArray, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { RiDeleteBin6Line } from 'react-icons/ri'

import RadioFieldGroup from '../../../components/Form/RadioFieldGroup'
import TextField from '../../../components/Form/TextField'
import {
  useGetAiConfigQuery,
  usePatchAiConfigMutation,
} from '../../../redux/api/recruiter'
import { JobAiConfig } from '../../../utils'
import { notify } from '../../../utils/toastNotifications'

type EditAiConfigProps = {
  aiConfigId: string
  jobId?: string
}

export const EditAiConfig = ({ aiConfigId }: EditAiConfigProps) => {
  const [aiConfigValues, setAiConfigValues] = useState<JobAiConfig | null>(null)
  const [updateAiConfig] = usePatchAiConfigMutation()
  const { data, isLoading } = useGetAiConfigQuery(aiConfigId)
  const config = data?.data?.config

  useEffect(() => {
    if (config) {
      setAiConfigValues({
        ...config,
        prescreeningAssessment: config.prescreeningAssessment
          ? 'true'
          : 'false',
        cvSimilarity: config.cvSimilarity ? 'true' : 'false',
        personalizedAssessment: config.personalizedAssessment
          ? 'true'
          : 'false',
        personalityEvaluation: config.personalityEvaluation ? 'true' : 'false',
        uploadedQuestions: config.uploadedQuestions?.length
          ? config.uploadedQuestions
          : '',
      })
    }
  }, [data])

  if (isLoading || !aiConfigValues) {
    return <div>Loading...</div>
  }

  return (
    <div className="md:px-4 py-4 md:w-[70%] w-[100%] mx-auto">
      <h2 className="text-[#101828] text-[32px] mt-4 font-bold">AI Configs</h2>
      <p className="text-[#667085] text-[16px] mb-6 font-light">
        Edit your configurations
      </p>

      <Formik
        initialValues={aiConfigValues}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await updateAiConfig({ aiConfigId, data: values }).unwrap()
            notify('success', 'Ai Config updated successfully')
            setSubmitting(false)
          } catch (error: any) {
            console.error('Error updating AI config:', error)
            notify('error', error?.data?.message)
            setSubmitting(false)
          }
        }}>
        {({ values, isSubmitting }) => (
          <Form>
            <TextField label="Name" name="name" placeholder="Name of Job" />

            {/* --- Pre-screening Section --- */}
            <RadioFieldGroup
              name="prescreeningAssessment"
              label="Enable Pre-assessment:"
              options={[
                { value: 'true', label: 'True' },
                { value: 'false', label: 'False' },
              ]}
              icons={<IoIosInformationCircle fontSize={24} color="#000000" />}
              tooltipContent="Automatically screen candidates with a quick initial test before further Evaluation"
            />
            {values.prescreeningAssessment === 'true' && (
              <TextField
                label="Min Pre-assessment Score"
                name="minPrescreeningScore"
                placeholder="Enter score (%)"
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
              icons={<IoIosInformationCircle fontSize={24} color="#000000" />}
              tooltipContent="Match Candidate's CV against job requirements to find best fit"
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

            {/* --- Personalized Assessment Section --- */}
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
                  <div className="flex flex-col mt-4 mb-4">
                    <label className="font-medium mb-1">Questions:</label>
                    <div className="space-y-2">
                      {values.uploadedQuestions.map((q, i) => (
                        <div
                          key={i}
                          className="flex flex-row items-center space-x-1">
                          <Field
                            name={`uploadedQuestions.${i}`}
                            className="border border-[#D0D5DD] p-4 rounded w-full"
                          />
                          <div
                            className="p-2 text-[20px] text-[#667085] cursor-pointer rounded"
                            onClick={() => remove(i)}>
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
                )}
              </FieldArray>
            )}

            <TextField
              label="Recruiter Guide (Optional)"
              name="recruiterGuide"
              placeholder="Enter recruiter guide"
              type="textarea"
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
