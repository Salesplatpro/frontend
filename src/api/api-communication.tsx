import { baseUrl } from '../utils/baseConfig'

const BASE_URL = baseUrl

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
