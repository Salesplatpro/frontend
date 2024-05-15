import React, { useEffect, useState, useLayoutEffect } from 'react'
import '../form.scss'
import { TalentCreation, getRole, uploadCV } from '../../api/api-communication'
import toast from 'react-hot-toast'
import { Role } from '../../utils/types'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/contextHook'

interface FormErrors {
  bio?: string
  role?: []
  maxSalary?: string
  minSalary?: string
  experience?: string
  // cv?: string
}

const TalentProfile: React.FC = () => {
  const auth = useAuth()
  const userProfile = auth?.userInfo?.user?.profile
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [formValues, setFormValues] = useState({
    bio: '',
    role: [],
    maxSalary: '',
    minSalary: '',
    experience: '',
    cv: '',
  })
  // console.log(auth?.isLoggedIn)

  useEffect(() => {
    if (userProfile) {
      setEdit(true)
      const profile = userProfile

      setFormValues({
        bio: profile.bio,
        role: profile.role,
        maxSalary: profile.maxSalary,
        minSalary: profile.minSalary,
        experience: profile.experience,
        cv: profile.cv,
      })
      setIsDisabled(true)
    } else {
      setEdit(false)
    }
  }, [userProfile])

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRole()
        setRoles(data.data)
      } catch (error) {
        console.log('error fetching role', error)
      }
    }
    fetchRoles()
  }, [])

  const [errors, setErrors] = useState<FormErrors>({})

  // no endpoint for this yet
  const handleEdit = () => {
    setIsDisabled(false)
    setEdit(false)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target
    const newValue = name === 'role' ? [value] : value
    setFormValues({ ...formValues, [name]: newValue })

    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const validationErrors = validateForm(formValues)

    const formData = new FormData(e.currentTarget)
    const cvFile = formData.get('cv') as File

    try {
      if (cvFile) {
        const submitCv = await uploadCV(cvFile)
        const updatedFormValue = {
          ...formValues,
          cv: submitCv.data.fileUrl,
        }
        const data = await TalentCreation(updatedFormValue)
        // console.log(submitCv.data.fileUrl)
        if (data.status) {
          toast.success('Profile created successfully')
        } else {
          toast.error(
            data.message || 'An error occurred while creating profile',
          )
        }
        console.log(data)
      } else {
        toast.error('Error uploading cv')
        throw new Error('Error uploading cv')
      }
    } catch (error: any) {
      console.error('error submiting', error)
      toast.error(error.message || 'An error occurred while creating profile')
    }

    // const data = await TalentCreation(formValues)
    // console.log(data)
    // if (Object.keys(validationErrors).length === 0) {
    //   try {
    //     const data = await TalentCreation(formValues)
    //     if (data.status) {
    //       toast.success('Profile Created successfully')
    //     } else {
    //       toast.error(data.message)
    //     }
    //   } catch (err) {
    //     toast.error('An error occurred while creating Profile')
    //   }
    // } else {
    //   setErrors(validationErrors)
    //   toast.error('Error creating profile')
    // }
  }

  const validateForm = (data: typeof formValues): FormErrors => {
    let errors = {} as FormErrors

    if (!data.bio) {
      errors.bio = 'Bio is Required'
    }
    if (!data.role) {
      // errors.role = 'Role is Required'
    }
    if (!data.maxSalary) {
      errors.maxSalary = 'Role is Required'
    }
    if (!data.minSalary) {
      errors.minSalary = 'Role is Required'
    }
    if (!data.experience) {
      errors.experience = 'Salary Range is Required'
    }
    // if (!data.cv) {
    //   errors.cv = 'Job Description is Required'
    // }
    return errors
  }

  // if (!userProfile) {
  //   return <div> loading</div>
  // }

  return (
    <div className="apply-job">
      <div className="job-hero">
        <h2>Create Talent Profile</h2>
      </div>
      <div className="job-form">
        <form onSubmit={handleSubmit}>
          <div className="input">
            <label htmlFor="bio">bio</label>
            <input
              type="text"
              name="bio"
              id="bio"
              value={formValues.bio}
              onChange={handleChange}
              placeholder=""
              disabled={isDisabled}
              // required
            />
            {errors.bio && <span className="error">{errors.bio}</span>}
          </div>
          <div className="input">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              disabled={isDisabled}
              value={formValues.role}
              onChange={handleChange}>
              <option value="">Select a role...</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input">
            <label htmlFor="maxSalary">Max Salary</label>
            <input
              type="text"
              name="maxSalary"
              id="maxSalary"
              value={formValues.maxSalary}
              onChange={handleChange}
              placeholder=""
              disabled={isDisabled}
              // required
            />
            {errors.maxSalary && (
              <span className="error">{errors.maxSalary}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="minSalary">Min Salary</label>
            <input
              type="text"
              name="minSalary"
              id="minSalary"
              value={formValues.minSalary}
              onChange={handleChange}
              placeholder=""
              disabled={isDisabled}
              // required
            />
            {errors.minSalary && (
              <span className="error">{errors.minSalary}</span>
            )}
          </div>
          <div className="input">
            <label htmlFor="experience">experience Level</label>
            <select
              id="experience"
              name="experience"
              value={formValues.experience}
              disabled={isDisabled}
              onChange={handleChange}>
              <option value="senior">Senior</option>
              <option value="intermediate">Intermediate</option>
              <option value="junior">Junior</option>
            </select>
          </div>
          <div className="input">
            <label htmlFor="bio">cv</label>
            <input
              type="file"
              name="cv"
              id="cv"
              disabled={isDisabled}
              // value={cv}
              required
              onChange={handleChange}
              placeholder=""
              accept=".pdf,.doc,.docx"
            />
            {/* {errors.cv && <span className="error">{errors.cv}</span>} */}
          </div>

          {!edit ? (
            <button type="submit">Submit</button>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </form>
      </div>
    </div>
  )
}

export default TalentProfile
