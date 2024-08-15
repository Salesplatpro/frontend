type JobLocation = {
  city: string
  state: string
  country: string
}

type JobRole = {
  _id: string
  name: string
  description: string
}

type JobPostedBy = {
  _id: string
  email: string
  firstName: string
  lastName: string
  middleName: string
  userRole: string
  phone: string
  emailVerified: boolean
  active: boolean
  onboarded: boolean
}

export type recruiterJobPostsTypes = {
  location: JobLocation
  _id: string
  role: JobRole
  postedBy: JobPostedBy
  description: string
  maxSalary: number
  minSalary: number
  experienceLevel: string
  address: string
  remote: boolean
  responsibilities: string[]
  skills: string[]
  goals: string[]
  noOfApplicants: number
  createdAt: string
  updatedAt: string
  __v: number
  aiConfig: string
}
