import React, { useState } from 'react'
import './Apply.scss'
import { TalentCreation } from '../../api/api-communication'
import toast from 'react-hot-toast'

interface FormErrors {
  bio?: string
  role?: string[]
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: string
}

const TalentProfile: React.FC = () => {
  const [formValues, setFormValues] = useState({
    bio: '',
    role: '',
    maxSalary: '',
    minSalary: '',
    experience: '',
    cv: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })

    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateForm(formValues)
    if (Object.keys(validationErrors).length === 0) {
      const data = await TalentCreation({
        ...formValues,
        role: [formValues.role],
      })
      console.log(data)
      return data
    } else {
      setErrors(validationErrors)
    }
  }

  const validateForm = (data: typeof formValues): FormErrors => {
    let errors = {} as FormErrors

    if (!data.bio) {
      errors.bio = 'Bio is Required'
    }
    if (!data.role) {
      // errors.role = 'Role is Required'
    }
    if (!data.maxSalary) {
      errors.maxSalary = 'Role is Required'
    }
    if (!data.minSalary) {
      errors.minSalary = 'Role is Required'
    }
    if (!data.experience) {
      errors.experience = 'Salary Range is Required'
    }
    if (!data.cv) {
      errors.cv = 'Job Description is Required'
    }
    return errors
  }

  return (
    <div className="apply-job">
      <div className="job-hero">
        <h2>Create Talent Profile</h2>
      </div>
      <div className="job-form">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="bio">bio</label>
            <input
              type="text"
              name="bio"
              id="bio"
              value={formValues.bio}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.bio && <span className="error">{errors.bio}</span>}
          </div>

          <div className="input">
            <label htmlFor="role">role</label>
            <input
              type="text"
              name="role"
              id="role"
              value={formValues.role}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.role && <span className="error">{errors.role}</span>}
          </div>
          <div className="input">
            <label htmlFor="maxSalary">Max Salary</label>
            <input
              type="text"
              name="maxSalary"
              id="maxSalary"
              value={formValues.maxSalary}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.maxSalary && (
              <span className="error">{errors.maxSalary}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="minSalary">Min Salary</label>
            <input
              type="text"
              name="minSalary"
              id="minSalary"
              value={formValues.minSalary}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.minSalary && (
              <span className="error">{errors.minSalary}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="experience">Experience</label>
            <input
              type="text"
              name="experience"
              id="experience"
              value={formValues.experience}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.experience && (
              <span className="error">{errors.experience}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="bio">CV</label>
            <input
              type="file"
              name="cv"
              id="cv"
              value={formValues.cv}
              onChange={handleChange}
              placeholder=""
              accept=".pdf,.doc,.docx"
              // required
            />
            {errors.cv && <span className="error">{errors.cv}</span>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default TalentProfile
