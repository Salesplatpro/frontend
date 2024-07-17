import '../form.scss'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { SendTalentReg } from '../../api/api-communication'
import Navbar from '../../components/Navbar'
import { CheckBox, TextInput } from "../../components/InputField";
import logo from '../../assets/logo.png';
import google from '../../assets/google.png';
import salesplate from '../../assets/salesplat.png';
import { Carousel } from "./Carousel";
import { Button } from "../../components";

interface FormErrors {
  email?: any
  firstName?: string
  lastName?: string
  middleName?: string
  password?: any
  phone?: any
}

const TalentRegister: React.FC = () => {
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
        const data = await SendTalentReg(formValues)
        toast.success('Registered successfully')
        navigate('/login')
      } catch (err) {
        toast.error('An error occurred while Registering')
      }
    } else {
      setErrors(validationErrors)
      toast.error('Error registering user details')
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
    <div>
      <Navbar />
      <div className="talentReg">
        <div className="apply-job">
          <div className="job-hero">
            <img className="logo" src={logo}/>
           <div>
             <div className="create-account">Create account</div>
             <div className="details">Please enter your details</div>
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
                required
                placeholder="Enter your name"
                error={errors.firstName}
              />
              <TextInput
                title="Last Name"
                label="lastName"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                error={errors.lastName}
              />
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
                title="Phone Number"
                label="phoneNumber"
                name="phoneNumber"
                value={formValues.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                error={errors.phone}
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
              <TextInput
                title="Confirm Password"
                label="confirmPassword"
                name="confirmPassword"
                value={formValues.password}
                onChange={handleChange}
                isPassword
                placeholder="Enter your password"
                error={errors.password}
              />
              <div>
               <div className="remember-me">
                 <CheckBox name="remember" label="Remember me" />
                 <div className="forgot-password">Forgot password?</div>
               </div>
                <div className="buttons">
                  <Button title="Sign Up" />
                  <div className="already">Already have an account? <a href="/login">Log in</a></div>
                  <Button
                    title="Continue with Google"
                    variant="secondary"
                    element={<img src={google} />}
                  />
                  <Button
                    title="Continue with Salesplat"
                    variant="secondary"
                    element={<img src={salesplate} />}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="carousel">
          <Carousel />
        </div>
      </div>
      {/*<div>© 2024 Salesplat. All rights reserved.</div>*/}
    </div>
  )
}

export default TalentRegister
