import '../form.scss'

import { useFormik } from 'formik'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import google from '../../assets/google.png'
import logo from '../../assets/logo.png'
import Salesplat from '../../assets/salesplat.png'
import { CheckBox, TextInput } from '../../components'
import Navbar from '../../components/Navbar'
import { useUserLoginMutation } from '../../redux/api/apiSlice'
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '../../redux/features/authSlice/authSlice'
import { loginSchema } from './AuthValidationSchema'
import { Carousel } from './Carousel'
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
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

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
        toast.success('Logged in successfully')
        const userRole = response.data.user?.userRole
        switch (userRole) {
          case 'recruiter':
            navigate('/recruiterDashboard/postjob')
            break
          case 'talent':
            navigate('/talentDashboard/TalentProfile')
            break
          case 'admin':
            navigate('/adminDashboard/viewcandidates')
            break
          default:
            navigate('/')
        }
      } catch (err: any) {
        dispatch(loginFailure(err.data?.message || 'Failed to login'))
        toast.error(err.data?.message || 'An error occurred while logging in')
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
            <form onSubmit={formik.handleSubmit}>
              <TextInput
                title="Email"
                label="email"
                name="email"
                value={formik.values.email}
                onChange={handleChange}
                placeholder="Email"
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : ''
                }
              />

              <TextInput
                title="Password"
                label="password"
                name="password"
                value={formik.values.password}
                onChange={handleChange}
                isPassword
                placeholder="Enter your password"
                error={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : ''
                }
              />

              <div className="remember-me">
                <CheckBox name="remember" label="Remember me" />
                <div className="forgot-password">Forgot password?</div>
              </div>
              <div className="flex justify-center items-center flex-col">
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    className="w-[93%] rounded-lg bg-[#3c6fd4] border flex justify-center items-center hover:bg-[#4b82e1]"
                    disabled={formik.isSubmitting}>
                    <p className="text-white">Log in</p>
                  </button>
                )}

                <div className="already py-2">
                  Don&apos;t have an account ?{' '}
                  <a href="/talentRegister">Sign up</a>
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
