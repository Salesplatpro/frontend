import '../form.scss'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Bounce } from 'react-toastify'
// import google from '../../assets/google.png'
// import Salesplat from '../../assets/salesplat.png'
import logo from '../../assets/logo.png'
import { CheckBox, PhoneNumberInput, TextInput } from '../../components'
import {
  useRecruiterRegMutation,
  useTalentRegMutation,
} from '../../redux/api/apiSlice'
import {
  signupFailure,
  signupStart,
  signupSuccess,
} from '../../redux/features/authSlice/authSlice'
import { notify } from '../../utils/toastNotifications'
import { SignUpSchema } from './AuthValidationSchema'
import { Carousel } from './Carousel'
import DropDown from './DropDown'
import Loading from './Loading'
import { useNavigate } from 'react-router-dom'
import CheckMark from '../../assets/CheckMark.png'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'

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
      notify('success', `Signed up successfully`, {
        autoClose: 5000,
      })

      setModalName(`${values.lastName}`)
      setIsModalOpen(true)
    } catch (err: any) {
      dispatch(signupFailure(err.data?.message))
      notify(
        'error',
        err.data?.message || 'An error occurred while signing up',
        { autoClose: 5000, transition: Bounce },
      )
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const navigate = useNavigate()

  const handleClose = () => {
    setTimeout(() => {
      closeModal()
      navigate('/login')
    }, 300)
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
                    autoComplete="email"
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
                  <PhoneNumberInput name="phone" label="Phone Number" />

                  <div className="relative">
                    <Field
                      title="Password"
                      name="password"
                      label="password"
                      as={TextInput}
                      autoComplete="current-password"
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
                        className=" w-full rounded-lg bg-[#3c6fd4] px-4 py-2 text-white hover:bg-[#4b82e1]"
                        type="submit">
                        Sign Up
                      </button>
                    )}

                    <div className="already py-2">
                      Already have an account? <a href="/login">Log In</a>
                    </div>
                    {/* <div className=" w-[93%] space-y-4 py-4">
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
                    </div> */}
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

      <Modal open={isModalOpen} onClose={closeModal} center>
        <div className="relative flex flex-col items-center rounded-lg max-w-[550px] min-w-[300px">
          <img
            src={CheckMark}
            alt="checklist"
            className="w-[100px] lg:w-[150px] md:w-[100px]"
          />

          <h2 className="text-[20px] text-center leading-8 lg:text-[28px] font-bold font-raleway">
            Welcome onboard {modalName}
          </h2>
          <p className="text-center px-7 py-2 text-[#667085] text-[15px] lg:text-[18px] font-raleway">
            SupportPro provides you with every opportunity to land your dream
            job with corporate organizations.
          </p>
          <button
            className="close-modal px-14 py-2 my-4 rounded-lg text-white font-raleway font-medium bg-[#3C6FD4] hover:bg-[#4985df]"
            onClick={handleClose}
            aria-label="Close modal">
            Go to Login
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default SignIn
