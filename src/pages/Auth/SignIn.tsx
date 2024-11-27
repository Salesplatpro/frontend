import '../form.scss'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
// import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Bounce, toast } from 'react-toastify'

import google from '../../assets/google.png'
import logo from '../../assets/logo.png'
import Salesplat from '../../assets/salesplat.png'
import { CheckBox, TextInput } from '../../components'
import {
  useRecruiterRegMutation,
  useTalentRegMutation,
} from '../../redux/api/apiSlice'
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from '../../redux/features/authSlice/authSlice'
import { SignUpSchema } from './AuthValidationSchema'
import { Carousel } from './Carousel'
import DropDown from './DropDown'
import Loading from './Loading'
import Modal from './Modal'

const SignIn = () => {
  const [SendTalentReg] = useTalentRegMutation()
  const [SendRecruiterReg] = useRecruiterRegMutation()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalName, setModalName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    dispatch(signupStart())
    setLoading(true)

    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, userType, ...formValues } = values

      let response
      if (userType === 'talent') {
        response = await SendTalentReg(formValues).unwrap()
      } else if (userType === 'recruiter') {
        response = await SendRecruiterReg(formValues).unwrap()
      } else {
        throw new Error('Invalid user type')
      }

      dispatch(
        signupSuccess({
          user: response.data.user,
          token: response.data.token,
        }),
      )
      toast.success('Signed up successfully', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
      setModalName(`${values.lastName}`)
      setIsModalOpen(true)
    } catch (err: any) {
      dispatch(signupFailure(err.data?.message))
      toast.error(err.data?.message || 'An error occurred while signing up', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      })
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const userTypeData = [
    { value: '', label: 'Choose an option' },
    { value: 'talent', label: 'Talent' },
    { value: 'recruiter', label: 'Recruiter' },
  ]

  return (
    <div>
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
            <Formik
              initialValues={{
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
                phone: '',
                userType: '',
              }}
              validationSchema={SignUpSchema}
              onSubmit={handleSubmit}>
              {({ values }) => (
                <Form>
                  <Field
                    title="First Name"
                    label="firstName"
                    name="firstName"
                    type="text"
                    as={TextInput}
                    placeholder="Enter your First Name"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  <Field
                    title="Last Name"
                    label="lastName"
                    name="lastName"
                    type="text"
                    as={TextInput}
                    placeholder="Enter your Last Name"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  <Field
                    title="Email"
                    label="Email"
                    name="email"
                    as={TextInput}
                    type="email"
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                  <div className="flex flex-col my-2 space-y-1">
                    <Field
                      name="userType"
                      label="Register as :"
                      component={DropDown}
                      options={userTypeData}
                    />
                    <ErrorMessage
                      name="userType"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <Field
                    title="Phone Number"
                    label="Phone Number"
                    name="phone"
                    as={TextInput}
                    type="number"
                    placeholder="Enter Phone Number"
                  />
                  <ErrorMessage
                    name="phone"
                    component="p"
                    className="text-red-500 text-sm"
                  />

                  <div className="relative">
                    <Field
                      title="Password"
                      name="password"
                      label="password"
                      as={TextInput}
                      isPassword={!showPassword}
                      placeholder="Enter your password"
                      type={showPassword ? 'text' : 'password'}
                    />

                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-11 right-0 flex items-center justify-center px-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>

                  <div className="relative">
                    <Field
                      title="Confirm Password"
                      label="confirmPassword"
                      name="confirmPassword"
                      as={TextInput}
                      isPassword={!showConfirmPassword}
                      placeholder="Confirm your password"
                      className="pr-10"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-11 right-0 flex items-center px-3 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }>
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  <div className="remember-me">
                    <CheckBox name="remember" label="Remember me" />
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    {loading ? (
                      <Loading />
                    ) : (
                      <button
                        className="w-[93%] rounded-lg bg-[#3c6fd4] border flex justify-center items-center hover:bg-[#4b82e1]"
                        type="submit">
                        <p className="text-white">Sign Up</p>
                      </button>
                    )}

                    <div className="already py-2">
                      Already have an account? <a href="/login">Log In</a>
                    </div>
                    <div className=" w-[93%] space-y-4 py-4">
                      <button className="w-[100%] rounded-lg border flex justify-center items-center hover:bg-[#f7f7f7]">
                        <img
                          src={google}
                          alt="google"
                          className="w-[30px] h-[30px]"
                        />
                        <p className="text-[16px] text-[#344054] font-raleway font-semibold leading-[24px]">
                          Continue with Google
                        </p>
                      </button>

                      <button className="w-[100%] rounded-lg border flex justify-center items-center hover:bg-[#f7f7f7]">
                        <img
                          src={Salesplat}
                          alt="salesplat logo"
                          className="w-[30px] h-[30px]"
                        />
                        <p className="text-[16px] text-[#344054] font-raleway font-semibold leading-[24px]">
                          Continue with Salesplat
                        </p>
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <div className="carousel">
          <Carousel />
        </div>
      </div>

      {isModalOpen && <Modal onClose={closeModal} name={modalName} />}
    </div>
  )
}

export default SignIn
