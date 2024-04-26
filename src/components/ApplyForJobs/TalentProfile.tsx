import React, { useEffect, useState } from 'react'
import './Apply.scss'
import { TalentCreation, getRole } from '../../api/api-communication'
import toast from 'react-hot-toast'
import { Role } from '../../utils/types'

interface FormErrors {
  bio?: string
  role?: []
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: string
}

const TalentProfile: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [formValues, setFormValues] = useState({
    bio: '',
    role: [],
    maxSalary: '',
    minSalary: '',
    experience: '',
    cv: '',
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRole()
        setRoles(data.data)
      } catch (error) {
        console.log('error fetching role', error)
      }
    }
    fetchRoles()
  }, [])

  const [errors, setErrors] = useState<FormErrors>({})

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    const newValue = name === 'role' ? [value] : value
    setFormValues({ ...formValues, [name]: newValue })

    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validateForm(formValues)
    const data = await TalentCreation(formValues)
    console.log(data)
    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = await TalentCreation(formValues)
        if (data.status) {
          toast.success('Profile Created successfully')
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        toast.error('An error occurred while creating Profile')
      }
    } else {
      setErrors(validationErrors)
      toast.error('Error creating profile')
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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formValues.role}
              onChange={handleChange}>
              <option value="">Select a role...</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
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
            <label htmlFor="experience">experience Level</label>
            <select
              id="experience"
              name="experience"
              value={formValues.experience}
              onChange={handleChange}>
              <option value="senior">Senior</option>
              <option value="intermediate">Intermediate</option>
              <option value="junior">Junior</option>
            </select>
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
