import React, { useState } from 'react'
// import './Apply.scss'
import './../ApplyForJobs/Apply.scss'
import { SendRecruiterReg, SendTalentReg } from '../../api/api-communication'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import toast from 'react-hot-toast'

interface FormErrors {
  email?: any
  firstName?: string
  lastName?: string
  middleName?: string
  password?: any
  phone?: any
}

const RecruiterRegister: React.FC = () => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    password: '',
    phone: '',
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
      try {
        const data = await SendRecruiterReg(formValues)
        toast.success('Registered successfully')
        navigate('/hire')
      } catch (err) {
        toast.error('An error occurred while registering')
      }
    } else {
      setErrors(validationErrors)
      toast.error('Error registering recruiter details , check your ')
    }
  }

  const validateForm = (data: typeof formValues): FormErrors => {
    let errors = {} as FormErrors

    if (!data.email) {
      errors.email = 'Email is Required'
    }
    if (!data.firstName) {
      errors.firstName = 'firstName is Required'
    }
    if (!data.lastName) {
      errors.lastName = 'lastName is Required'
    }
    if (!data.middleName) {
      errors.middleName = 'middleName is Required'
    }
    if (!data.password) {
      errors.password = 'password is Required'
    }
    if (!data.phone) {
      errors.phone = 'Phone number is Required'
    }
    return errors
  }

  return (
    <div className="apply-job">
      <Navbar />
      <div className="job-hero">
        <h2>Register as a Recruiter</h2>
      </div>
      <div className="job-form">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="email">email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input">
            <label htmlFor="firstName">firstName</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="lastName">lastName</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="middleName">middleName</label>
            <input
              type="text"
              name="middleName"
              id="middleName"
              value={formValues.middleName}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.middleName && (
              <span className="error">{errors.middleName}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="password">password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="phone">phone</label>
            <input
              type="text"
              name="phone"
              id="phone"
              value={formValues.phone}
              onChange={handleChange}
              placeholder=""
              // required
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default RecruiterRegister
