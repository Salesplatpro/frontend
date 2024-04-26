import React, { useState, useEffect } from 'react'
import './HireTalents.scss'
import { PostJob } from '../../api/api-communication'
import toast from 'react-hot-toast'
import { Role } from '../../utils/types'
import { getRole } from '../../api/api-communication'

interface FormErrors {
  role?: string
  description?: string
  maxSalary?: string
  minSalary?: string
  experienceLevel?: string
  city?: string
  state?: string
  country?: string
  address?: string
  remote?: boolean
  responsibilities?: string[]
  skills?: string[]
  goals?: string[]
}

const HireTalents: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [formValues, setFormValues] = useState({
    role: '',
    description: '',
    maxSalary: '',
    minSalary: '',
    experienceLevel: '',
    location: { city: '', state: '', country: '' },
    address: '',
    remote: false,
    responsibilities: '',
    skills: '',
    goals: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})

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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    // const newValue = name === 'role' ? [value] : value
    if (name.startsWith('location')) {
      const [locationKey, nestedKey] = name.split('.')
      setFormValues({
        ...formValues,
        location: {
          ...formValues.location,
          [nestedKey]: value,
        },
      })
    } else {
      setFormValues({ ...formValues, [name]: value })
    }

    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateForm(formValues)
    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = await PostJob({
          ...formValues,
          responsibilities: [formValues.responsibilities],
          goals: [formValues.goals],
          skills: [formValues.skills],
        })
        console.log(data)
        console.log(formValues)
        if (data.status) {
          toast.success('Job Post Created successfully')
        } else {
          toast.error(data.message)
        }
      } catch (err) {
        toast.error('An error occurred while creating job post')
      }
    } else {
      setErrors(validationErrors)
      toast.error('Error creating job, check details ')
    }
  }

  const validateForm = (data: typeof formValues): FormErrors => {
    let errors = {} as FormErrors

    // if (!data.role) {
    //   errors.role = 'Role is Required'
    // }
    if (!data.description) {
      errors.description = 'Description is Required'
    }
    if (!data.maxSalary) {
      errors.maxSalary = 'Max Salary is Required'
    }
    if (!data.minSalary) {
      errors.minSalary = 'Min Salary is Required'
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
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={formValues.description}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="maxSalary">maxSalary</label>
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
            <label htmlFor="minSalary">minSalary</label>
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
            <label htmlFor="experienceLevel">experience Level</label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formValues.experienceLevel}
              onChange={handleChange}>
              <option value="senior">Senior</option>
              <option value="intermediate">Intermediate</option>
              <option value="junior">Junior</option>
            </select>
          </div>
          <div className="input">
            <label htmlFor="city">city</label>
            <input
              type="text"
              name="location.city"
              id="city"
              value={formValues.location.city}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>
          <div className="input">
            <label htmlFor="state">state</label>
            <input
              type="text"
              name="location.state"
              id="state"
              value={formValues.location.state}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.state && <span className="error">{errors.state}</span>}
          </div>
          <div className="input">
            <label htmlFor="country">country</label>
            <input
              type="text"
              name="location.country"
              id="country"
              value={formValues.location.country}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.country && <span className="error">{errors.country}</span>}
          </div>
          <div className="input">
            <label htmlFor="address">address</label>
            <input
              type="text"
              name="address"
              id="address"
              value={formValues.address}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
          <div className="input">
            <label htmlFor="remote">remote</label>
            <input
              type="checkbox"
              name="remote"
              id="remote"
              checked={formValues.remote}
              onChange={(e) =>
                setFormValues({ ...formValues, remote: e.target.checked })
              }
              placeholder=""
              // required
            />
            {errors.remote && <span className="error">{errors.remote}</span>}
          </div>
          <div className="input">
            <label htmlFor="responsibilities">responsibilities</label>
            <input
              type="text"
              name="responsibilities"
              id="responsibilities"
              value={formValues.responsibilities}
              onChange={handleChange}
              placeholder="Enter responsibilities, separate each with a comma"
              // required
            />
            {errors.responsibilities && (
              <span className="error">{errors.responsibilities}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="skills">skills</label>
            <input
              type="text"
              name="skills"
              id="skills"
              value={formValues.skills}
              onChange={handleChange}
              placeholder="Enter skills, separate each with a comma"
              // required
            />
            {errors.skills && <span className="error">{errors.skills}</span>}
          </div>
          <div className="input">
            <label htmlFor="goals">goals</label>
            <input
              type="text"
              name="goals"
              id="goals"
              value={formValues.goals}
              onChange={handleChange}
              placeholder="Enter goals, separate each with a comma"
              // required
            />
            {errors.goals && <span className="error">{errors.goals}</span>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default HireTalents
