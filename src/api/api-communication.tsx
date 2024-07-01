const BASE_URL = 'https://supportpro-backend.onrender.com/v1'
const authToken = sessionStorage.getItem('authToken') || ''

import {
  FormCreateTalentProfile,
  FormPostJob,
  FormTalentLogin,
  FormTalentReg,
  QuestionForm,
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
    const response = await fetch(`${BASE_URL}/auth/register`, requestOptions)
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
      `${BASE_URL}/auth/register/reuruiter`,
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
    const response = await fetch(`${BASE_URL}/auth/login`, loginOptions)

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
  // const authToken = sessionStorage.getItem('authToken')

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
    const response = await fetch(`${BASE_URL}/user/profile`, requestOptions)

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
    const response = await fetch(`${BASE_URL}/jobs`, requestOption)
    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const getRole = async () => {
  try {
    const response = await fetch(`${BASE_URL}/roles?limit=1000`)
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
    const response = await fetch(`${BASE_URL}/uploads`, requestOption)
    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

// fetch questions based on role
export const roleQuestions = async (id: string) => {
  try {
    const response = await fetch(`${BASE_URL}/roles/${id}/questions`)

    const data = response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

// submit answer
export const quizAnswer = async (quizAnswer) => {
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
    const response = await fetch(`${BASE_URL}/questions/answer`, responseReq)

    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const fetchTalentProfies = async (role?: string) => {
  let talentprofiles: string
  if (role) {
    talentprofiles = `${BASE_URL}/user/profile?roleId=${role}&limit=20&offset=0`
  } else {
    talentprofiles = `${BASE_URL}/user/profile`
  }
  try {
    const response = await fetch(talentprofiles, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const filterTalentProfiles = async (filter) => {
  let url = `${BASE_URL}/user/profile?limit=20&offset=0`

  if (filter.role) {
    url += `&roleId=${filter.role}`
  }
  if (filter.experience) {
    url += `&experience=${filter.experience}`
  }
  if (filter.minScore) {
    url += `&minScore=${filter.minScore}`
  }
  if (filter.maxSalary) {
    url += `&maxSalary=${filter.maxSalary}`
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

export const jobProfiles = async (role?: string) => {
  let jobProfiles: string

  if (role) {
    jobProfiles = `${BASE_URL}/jobs?roleId=${role}&limit=10&offset=0`
  } else {
    jobProfiles = `${BASE_URL}/jobs`
  }

  try {
    const response = await fetch(jobProfiles, {
      headers: {
        Authorization: `Bearer ${authToken}`, // Include the token in the Authorization header
      },
    })

    const data = await response.json()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const getTalentMatch = async (roleId) => {
  try {
    const response = await fetch(`${BASE_URL}/jobs/match/${roleId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

// Get Top Talents
export const getTopTalents = async (jobId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/jobs/talents/${jobId}?percentage=40&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
  }
}
// Get Talent Individual Profile
export const individualTalent = async (talentId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/user/profile/${talentId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    throw error
  }
}
