export interface FormTalentReg {
  email?: any
  firstName?: string
  lastName?: string
  middleName?: string
  password?: any
  phone?: any
}

export interface FormCreateTalentProfile {
  bio?: string
  role?: string | string[]
  maxSalary?: string
  minSalary?: string
  experience?: string
  cv?: string
}

export interface FormTalentLogin {
  email?: any
  password?: any
}

export interface FormPostJob {
  role?: string
  description?: string
  maxSalary?: string
  minSalary?: string
  experienceLevel?: string
  city?: string
  state?: string
  country?: string
  // location?: locationType
  address?: string
  remote?: boolean
  responsibilities?: string[]
  skills?: string[]
  goals?: string[]
}

export interface Role {
  _id?: number
  name?: string
}
