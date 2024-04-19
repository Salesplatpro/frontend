import React, { useState } from 'react'
import './HireTalents.scss'

interface FormErrors {
  role?: string
  salaryRange?: string
  location?: string
  jobDesc?: string
}

const HireTalents: React.FC = () => {
  const [formValues, setFormValues] = useState({
    role: '',
    salaryRange: '',
    location: '',
    jobDesc: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })

    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateForm(formValues)
    if (Object.keys(validationErrors).length === 0) {
      console.log(formValues)
    } else {
      setErrors(validationErrors)
    }
  }

  const validateForm = (data: typeof formValues): FormErrors => {
    let errors = {} as FormErrors

    if (!data.role) {
      errors.role = 'Role is Required'
    }
    if (!data.salaryRange) {
      errors.salaryRange = 'Salary Range is Required'
    }
    if (!data.location) {
      errors.location = 'Location is Required'
    }
    if (!data.jobDesc) {
      errors.jobDesc = 'Job Description is Required'
    }
    return errors
  }

  return (
    <div className="hire-talents">
      <div className="talents-hero">
        <h2>Hire Talents</h2>
      </div>
      <div className="talent-form">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="role">Role</label>
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
            <label htmlFor="salaryRange">Salary Range</label>
            <input
              type="text"
              name="salaryRange"
              id="salaryRange"
              value={formValues.salaryRange}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.salaryRange && (
              <span className="error">{errors.salaryRange}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              name="location"
              id="location"
              value={formValues.location}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.location && (
              <span className="error">{errors.location}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="jobDesc">Salary Range</label>
            <input
              type="text"
              name="jobDesc"
              id="jobDesc"
              value={formValues.jobDesc}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.jobDesc && <span className="error">{errors.jobDesc}</span>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default HireTalents
