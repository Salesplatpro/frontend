interface FormTalentReg {
  email?: any
  firstName?: string
  lastName?: string
  middleName?: string
  password?: any
  phone?: any
}

interface FormTalentProfile {
  bio?: string
  role?: string | string[]
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: string
}

interface FormTalentLogin {
  email?: any
  password?: any
}

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
    console.log(data)
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
      throw new Error('Login failed')
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
