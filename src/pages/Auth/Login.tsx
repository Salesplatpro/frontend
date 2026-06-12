import '../form.scss'

import { useFormik } from 'formik'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
// import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Bounce } from 'react-toastify'

// import google from '../../assets/google.png'
import logo from '../../assets/logo.png'
// import Salesplat from '../../assets/salesplat.png'
import { CheckBox, TextInput } from '../../components'
import { useLoginRedirect } from '../../hooks/useLoginRedirect'
import { useUserLoginMutation } from '../../redux/api/apiSlice'
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '../../redux/features/authSlice/authSlice'
import { notify } from '../../utils/toastNotifications'
import { loginSchema } from './AuthValidationSchema'
import { Carousel } from './Carousel'
import ForgotPasswordModal from './ForgotPasswordModal'
import Loading from './Loading'

interface LoginFormValues {
  email: string
  password: string
}

const defaultLoginFormValues: LoginFormValues = {
  email: '',
  password: '',
}

const Login: React.FC = () => {
  const [login] = useUserLoginMutation()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useLoginRedirect()

  const formik = useFormik<LoginFormValues>({
    initialValues: defaultLoginFormValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      dispatch(loginStart())

      setLoading(true)

      try {
        const response = await login(values).unwrap()
        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          }),
        )

        notify('success', `Logged in successfully`, {
          autoClose: 5000,
        })

        // const userRole = response.data.user?.userRole

        // if (redirectTo) {
        //   navigate(redirectTo)
        //   return
        // }

        // switch (userRole) {
        //   case 'recruiter':
        //     navigate('/recruiterDashboard/dashboard')
        //     break
        //   case 'talent':
        //     navigate('/talentDashboard/TalentProfile')
        //     break
        //   case 'admin':
        //     navigate('/adminDashboard/viewcandidates')
        //     break
        //   default:
        //     navigate('/')
        // }
      } catch (err: any) {
        dispatch(loginFailure(err.data?.message))

        notify(
          'error',
          err.data?.message || 'An error occurred while logging in',
          { autoClose: 5000, transition: Bounce },
        )
      } finally {
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
    formik.setFieldTouched(name, true)
  }

  const handleForgot = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div>
      <div className="talentReg">
        <div className="apply-job lg:mb-60">
          <div className="job-hero">
            <img className="logo" src={logo} alt="company" />
            <div>
              <div className="create-account">Login your account</div>
              <div className="details">Please enter your details</div>
            </div>
          </div>
          <div className="job-form">
            <form onSubmit={formik.handleSubmit}>
              <TextInput
                title="Email"
                label="email"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={handleChange}
                placeholder="Email"
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ''
                }
              />

              <div className="relative">
                <TextInput
                  title="Password"
                  label="password"
                  name="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={handleChange}
                  isPassword={!showPassword}
                  placeholder="Enter your password"
                  error={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : ''
                  }
                />

                <button
                  type="button"
                  className="absolute inset-y-11 right-0 flex items-center justify-center px-3 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              <div className="remember-me">
                <CheckBox name="remember" label="Remember me" />
                <div className="forgot-password" onClick={handleForgot}>
                  Forgot password?
                </div>
              </div>
              <div className="flex justify-center items-center flex-col">
                {loading ? (
                  <Loading />
                ) : (
                  <button className=" w-full rounded-lg bg-primary-strong px-4 py-2 text-white hover:bg-[#4b82e1]">
                    Log in
                  </button>
                )}

                <div className="already py-2">
                  Don&apos;t have an account ?{' '}
                  <a href="/talentRegister">Sign up</a>
                </div>
                {/* <div className=" w-[93%] space-y-4 py-4">
                  <button className="w-[100%] rounded-lg border flex justify-center items-center hover:bg-[#f7f7f7]">
                    <img
                      src={google}
                      alt="google"
                      className="w-[30px] h-[30px]"
                    />
                    <p className="text-[16px] text-grey-700 font-raleway font-semibold leading-[24px]">
                      Continue with Google
                    </p>
                  </button>

                  <button className="w-[100%] rounded-lg border flex justify-center items-center hover:bg-[#f7f7f7]">
                    <img
                      src={Salesplat}
                      alt="salesplat logo"
                      className="w-[30px] h-[30px]"
                    />
                    <p className="text-[16px] text-grey-700 font-raleway font-semibold leading-[24px]">
                      Continue with Salesplat
                    </p>
                  </button>
                </div> */}
              </div>
            </form>
          </div>
        </div>
        <div className="carousel">
          <Carousel />
        </div>
      </div>
      {isModalOpen && <ForgotPasswordModal onClose={closeModal} email={''} />}
    </div>
  )
}

export default Login
