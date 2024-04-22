import React, { useState } from 'react'
import './Apply.scss'
import { SendTalentLogin } from '../../api/api-communication'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar'
import toast from 'react-hot-toast'

interface FormErrors {
  email?: any
  password?: any
}

const TalentLogin: React.FC = () => {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
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
        const data = await SendTalentLogin(formValues)
        toast.success('Successfully Logged in')
        console.log('Successfully Logged in user', data)
        navigate('/apply')
      } catch (error) {
        toast.error('Log in Unsuccessfull')
      }
    } else {
      setErrors(validationErrors)
    }
  }

  const validateForm = (data: typeof formValues): FormErrors => {
    let errors = {} as FormErrors

    if (!data.email) {
      errors.email = 'Email is Required'
    }
    if (!data.password) {
      errors.password = 'password is Required'
    }
    return errors
  }

  return (
    <div className="apply-job">
      <Navbar />
      <div className="job-hero">
        <h2>TALENT LOGIN</h2>
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

          <button type="submit">Submit</button>
        </form>

        <h6 className="">
          Dont have an account <a href="talentRegister">Register</a>
        </h6>
      </div>
    </div>
  )
}

export default TalentLogin
