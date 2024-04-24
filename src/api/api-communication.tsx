import {
  FormTalentLogin,
  FormTalentReg,
  FormTalentProfile,
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

export const TalentCreation = async (formValues: FormTalentProfile) => {
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
