import '../form.scss'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { SendTalentLogin } from '../../api/api-communication'
import google from '../../assets/google.png'
import logo from '../../assets/logo.png'
import salesplate from '../../assets/salesplat.png'
import { Button, CheckBox, TextInput } from '../../components'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/contextHook'
import { useUserLoginMutation } from '../../redux/api/apiSlice'
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '../../redux/features/authSlice/authSlice'
import { Carousel } from './Carousel'

interface FormErrors {
  email?: any
  password?: any
}

const Login: React.FC = () => {
  const [login, isLoading] = useUserLoginMutation()
  const dispatch = useDispatch()
  // const auth = useAuth()
  const navigate = useNavigate()
  const [submitLoading, setSubmitLoading] = useState(false)
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
    setSubmitLoading(true)
    const validationErrors = validateForm(formValues)

    if (Object.keys(validationErrors).length === 0) {
      dispatch(loginStart())
      try {
        // const data = await auth?.login(formValues)
        const response = await login(formValues).unwrap()
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          }),
        )
        toast.success('Logged in successfully')
        if (response && response.data) {
          const userRole = response.data.user?.userRole
          if (userRole === 'recruiter') {
            navigate('/recruiterDashboard/postjob')
          } else if (userRole === 'talent') {
            navigate('/talentDashboard/')
          } else if (userRole === 'admin') {
            navigate('/adminDashboard/viewcandidates')
          } else {
            navigate('/')
          }
        }
      } catch (err) {
        console.log(err)
        dispatch(loginFailure(err.data?.message || 'Failed to login'))
        setSubmitLoading(false)
        toast.error(err.data?.message || 'An error occurred while logging in')
      }
    } else {
      setErrors(validationErrors)
      setSubmitLoading(false)
      toast.error('Error Logging user details')
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
    <div>
      <Navbar />
      <div className="talentReg">
        <div className="apply-job">
          <div className="job-hero">
            <img className="logo" src={logo} alt="company" />
            <div>
              <div className="create-account">Login your account</div>
              <div className="details">Please enter your details</div>
            </div>
          </div>
          <div className="job-form">
            <form onSubmit={handleSubmit}>
              <TextInput
                title="Email"
                label="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Email"
                error={errors.email}
              />
              <TextInput
                title="Password"
                label="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                isPassword
                placeholder="Enter your password"
                error={errors.password}
              />
              <div className="remember-me">
                <CheckBox name="remember" label="Remember me" />
                <div className="forgot-password">Forgot password?</div>
              </div>
              <div className="buttons">
                <Button title="Log In" />
                <div className="already">
                  Don't have an account? <a href="/login">Sign up</a>
                </div>
                <Button
                  title="Continue with Google"
                  variant="secondary"
                  element={<img src={google} alt="google" />}
                />
                <Button
                  title="Continue with Salesplat"
                  variant="secondary"
                  element={<img src={salesplate} alt="salesplat logo" />}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="carousel">
          <Carousel />
        </div>
      </div>
    </div>
  )
}

export default Login
