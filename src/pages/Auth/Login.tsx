import '../form.scss'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { SendTalentLogin } from '../../api/api-communication'
import Navbar from '../../components/Navbar'
import { useAuth } from '../../context/contextHook'

interface FormErrors {
  email?: any
  password?: any
}

const Login: React.FC = () => {
  const auth = useAuth()
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
      try {
        const data = await auth?.login(formValues)
        // console.log(data.data)
        toast.success('Logged in successfully')
        if (data && data.data) {
          const userRole = data.data.user?.userRole
          if (userRole === 'recruiter') {
            navigate('/recruiterDashboard/postjob')
          } else if (userRole === 'talent') {
            navigate('/talentDashboard/talentProfile')
            window.location.reload()
          } else if (userRole === 'admin') {
            navigate('/adminDashboard/viewcandidates')
          } else {
            navigate('/')
          }
        }
      } catch (err) {
        console.log(err)
        setSubmitLoading(false)
        toast.error('An error occurred while logging in')
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
    <div className="apply-job">
      <Navbar />
      <div className="job-hero">
        <h5 className='text-blue-900 font-extrabold text-center'>LOGIN AS A TALENT OR RECRUITER HERE</h5>
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

          <button type="submit">
            {!submitLoading ? 'Submit' : 'Submitting..'}
          </button>
        </form>

        <h6 style={{ marginTop: '10px' }}>
          Dont have an account{' '}
          <a href="talentRegister" style={{ textDecoration: 'none' }}>
            Register as a Talent
          </a>
        </h6>
        <h6 style={{ marginTop: '10px' }}>
          Dont have an account{' '}
          <a href="recruiterRegister" style={{ textDecoration: 'none' }}>
            Register as a Recruiter
          </a>
        </h6>
      </div>
    </div>
  )
}

export default Login
