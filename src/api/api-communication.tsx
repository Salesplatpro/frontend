import {
  FormTalentLogin,
  FormTalentReg,
  FormCreateTalentProfile,
  FormPostJob,
} from '../utils/types'

export const SendTalentReg = async (formValues: FormTalentReg) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues),
  }

  console.log(requestOptions)
  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/auth/register',
      requestOptions,
    )
    const data = await response.json()

    // Check if the response contains the token
    if (!data.data.token) {
      throw new Error('Token not found in response')
    }

    // Extract the token from the response data
    const authToken = data.data.token

    // Store the token in sessionStorage
    sessionStorage.setItem('authToken', authToken)
    return data
  } catch (error) {
    console.error('Error registering User', error)
    throw error
  }
}

export const SendRecruiterReg = async (formValues: FormTalentReg) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues),
  }

  console.log(requestOptions)
  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/auth/register/recruiter',
      requestOptions,
    )
    const data = await response.json()

    // Check if the response contains the token
    if (!data.data.token) {
      throw new Error('Token not found in response')
    }

    // Extract the token from the response data
    const authToken = data.data.token

    // Store the token in sessionStorage
    sessionStorage.setItem('authToken', authToken)
    return data
  } catch (error) {
    console.error('Error registering User', error)
    throw error
  }
}

export const SendTalentLogin = async (formValues: FormTalentLogin) => {
  const loginOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues),
  }

  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/auth/login',
      loginOptions,
    )

    if (!response.ok) {
      throw new Error('Invalid login details')
    }

    const data = await response.json()

    // Check if the response contains the token
    if (!data.data.token) {
      throw new Error('Token not found in response')
    }

    // Extract the token from the response data
    const authToken = data.data.token

    // Store the token in sessionStorage
    sessionStorage.setItem('authToken', authToken)

    return data
  } catch (error) {
    console.error('Error logging User', error)
    throw error
  }
}

export const TalentCreation = async (formValues: FormCreateTalentProfile) => {
  const authToken = sessionStorage.getItem('authToken')

  if (!authToken) {
    throw new Error('Authentication token not found')
  }

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(formValues),
  }

  console.log(requestOptions)

  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/user/profile',
      requestOptions,
    )

    const data = await response.json()

    return data
  } catch (error) {
    console.log('Error posting profile', error)
    throw error
  }
}

export const PostJob = async (formValue: FormPostJob) => {
  const authToken = sessionStorage.getItem('authToken')

  if (!authToken) {
    throw new Error('Authentication required')
  }

  const requestOption = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(formValue),
  }

  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/jobs',
      requestOption,
    )
    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const getRole = async () => {
  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/roles/',
    )
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const uploadCV = async (file: any) => {
  const authToken = sessionStorage.getItem('authToken')

  if (!authToken) {
    throw new Error('Authentication required')
  }

  const formData = new FormData()
  formData.append('file', file)

  const requestOption = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: formData,
  }

  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/uploads',
      requestOption,
    )
    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

// fetch questions based on role
export const roleQuestions = async (id: string) => {
  try {
    const response = await fetch(
      `https://supportpro-backend.onrender.com/v1/roles/${id}/questions`,
    )

    const data = response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

// submit answer
export const quizAnswer = async (quizAnswer) => {
  const authToken = sessionStorage.getItem('authToken')

  if (!authToken) {
    throw new Error('Authentication required')
  }
  const responseReq = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(quizAnswer),
  }
  try {
    const response = await fetch(
      'https://supportpro-backend.onrender.com/v1/questions/answer',
      responseReq,
    )

    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const fetchTalentProfies = async (role?: string) => {
  const token = sessionStorage.getItem('authToken')
  let talentprofiles: string
  if (role) {
    talentprofiles = `https://supportpro-backend.onrender.com/v1/user/profile?roleId=${role}&limit=20&offset=0`
  } else {
    talentprofiles = 'https://supportpro-backend.onrender.com/v1/user/profile'
  }
  try {
    const response = await fetch(talentprofiles, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}
