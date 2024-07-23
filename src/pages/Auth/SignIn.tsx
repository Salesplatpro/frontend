import '../form.scss'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import google from '../../assets/google.png'
import logo from '../../assets/logo.png'
import Salesplat from '../../assets/salesplat.png'
import { Button, CheckBox, TextInput } from '../../components'
import Navbar from '../../components/Navbar'
import { useUserSignupMutation } from '../../redux/api/apiSlice'
// import {
//   signupFailure,
//   signupStart,
//   signupSuccess,
// } from '../../redux/features/authSlice/authSlice'
import { Carousel } from './Carousel'

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

const SignIn = () => {
  // const [signup] = useUserSignupMutation() // Adjust this if the mutation name is different
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    number: '',
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
      dispatch(signupStart())
      try {
        const response = await signup(formValues).unwrap()
        dispatch(
          signupSuccess({
            user: response.data.user,
            token: response.data.token,
          }),
        )
        toast.success('Signed up successfully')
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
      } catch (err: any) {
        console.log(err)
        dispatch(signupFailure(err.data?.message || 'Failed to sign up'))
        setSubmitLoading(false)
        toast.error(err.data?.message || 'An error occurred while signing up')
      }
    } else {
      setErrors(validationErrors)
      setSubmitLoading(false)
      toast.error('Error signing up user details')
    }
  }

  const validateForm = (data: typeof formValues): FormErrors => {
    let errors = {} as FormErrors

    if (!data.email) {
      errors.email = 'Email is required'
    }
    if (!data.password) {
      errors.password = 'Password is required'
    } else if (data.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }
    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
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
              <div className="create-account">Create account</div>
              <div className="details">Please enter your details.</div>
            </div>
          </div>
          <div className="job-form">
            <form onSubmit={handleSubmit}>
              <TextInput
                title="First Name"
                label="firstName"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                placeholder="Enter your Name"
              />

              <TextInput
                title="Last Name"
                label="lastName"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                placeholder="Enter your Name"
              />

              <TextInput
                title="Email"
                label="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="Email"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}

              <TextInput
                title="Phone Number"
                label="Phone Number"
                name="number"
                value={formValues.number}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />

              <TextInput
                title="Password"
                label="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                isPassword
                placeholder="Enter your password"
              />

              {errors.password ? (
                <p className="text-red-500 font-raleway font-normal leading-[21.38px]">
                  {errors.password}
                </p>
              ) : (
                formValues.password &&
                formValues.password.length < 8 && (
                  <p className="text-red-500 font-raleway font-normal leading-[21.38px]">
                    Password must be at least 8 characters
                  </p>
                )
              )}

              <TextInput
                title="Confirm Password"
                label="confirmPassword"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                isPassword
                placeholder="Confirm your password"
              />

              {formValues.confirmPassword &&
                formValues.confirmPassword !== formValues.password && (
                  <p className="text-red-500">Passwords do not match</p>
                )}
              {formValues.confirmPassword &&
                formValues.confirmPassword === formValues.password && (
                  <p className="text-green-500">Passwords match</p>
                )}

              <div className="remember-me">
                <CheckBox name="remember" label="Remember me" />
                <div className="forgot-password">Forgot password?</div>
              </div>
              <div className="buttons">
                <Button title="Sign Up" />
                <div className="already">
                  Already have an account ? <a href="/login">Log In</a>
                </div>
                <Button
                  title="Continue with Google"
                  variant="secondary"
                  element={<img src={google} alt="google" />}
                />
                <Button
                  title="Continue with Salesplat"
                  variant="secondary"
                  element={<img src={Salesplat} alt="salesplat logo" />}
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

export default SignIn
