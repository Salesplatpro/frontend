import '../form.scss'

import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import * as Yup from 'yup'

import google from '../../assets/google.png'
import logo from '../../assets/logo.png'
import Salesplat from '../../assets/salesplat.png'
import { CheckBox, TextInput } from '../../components'
import Navbar from '../../components/Navbar'
// import { SendRecruiterReg, SendTalentReg } from '../../api/api-communication'
import {
  useRecruiterRegMutation,
  useTalentRegMutation,
} from '../../redux/api/apiSlice'
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from '../../redux/features/authSlice/authSlice'
import { Carousel } from './Carousel'
import DropDown from './DropDown'
import Loading from './Loading'
import Modal from './Modal'

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm Password is required'),
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  phone: Yup.string().required('Phone Number is required'),
  userType: Yup.string()
    .oneOf(['talent', 'recruiter'], 'User type is required')
    .required('User type is required'),
})

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
    setLoading(true) // Set loading to true when submission starts

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

      // Dispatch success action and handle the response
      dispatch(
        signupSuccess({
          user: response.data.user,
          token: response.data.token,
        }),
      )
      toast.success('Signed up successfully')
      setModalName(`${values.lastName}`)
      setIsModalOpen(true)
    } catch (err: any) {
      console.error('DisplayError signing up:', err)

      // Handle error response
      dispatch(
        signupFailure(
          err.response?.data?.message || 'An error occurred while signing up',
        ),
      )
      toast.error(
        err.response?.data?.message || 'An error occurred while signing up',
      )
    } finally {
      setLoading(false) // Set loading to false when submission is complete
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
                  <div className="flex my-2">
                    <Field
                      name="userType"
                      component={DropDown}
                      label="Register as :"
                      options={userTypeData}
                    />
                  </div>

                  <ErrorMessage
                    name="userType"
                    component="p"
                    className="text-red-500 text-sm"
                  />
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

                    <button
                      type="button"
                      className="absolute inset-y-11 right-0 flex items-center justify-center px-3 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>

                    {values.password && values.password.length < 8 && (
                      <p className="text-red-500 font-raleway text-sm font-normal leading-[21.38px]">
                        Password must be at least 8 characters (containing
                        uppercase, number, special characters)
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <Field
                      title="Confirm Password"
                      label="confirmPassword"
                      name="confirmPassword"
                      as={TextInput} // Add padding to the right to make space for the icon
                      isPassword={!showConfirmPassword}
                      placeholder="Confirm your password"
                      className="pr-10" // Add padding to the right to make space for the icon
                    />
                    <button
                      type="button"
                      className="absolute inset-y-11 right-0 flex items-center px-3 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }>
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>

                    {values.confirmPassword &&
                      values.confirmPassword !== values.password && (
                        <p className="text-red-500 text-sm">
                          Passwords do not match
                        </p>
                      )}
                    {values.confirmPassword &&
                      values.confirmPassword === values.password && (
                        <p className="text-green-500 text-sm">
                          Passwords match
                        </p>
                      )}
                  </div>
                  <div className="remember-me">
                    <CheckBox name="remember" label="Remember me" />
                    <div className="forgot-password">Forgot password ?</div>
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

      {/* Modal Component */}
      {isModalOpen && <Modal onClose={closeModal} name={modalName} />}
    </div>
  )
}

export default SignIn
