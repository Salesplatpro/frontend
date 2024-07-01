export interface LocationOption {
  name: string
  geoId: number
  countryName?: string;
}

export interface LocationProps {
  locationTitle: string
  geoId: number | null
  isCountry: boolean
  onChange: (geoId: number) => void
}

export interface LocationValues {
  name: string
  geoId: number | null
}

export interface FormValues {
  description: string
  minSalary: string
  maxSalary: string
  experience: string
  location: {
    country: LocationValues
    state: LocationValues
    city: LocationValues
  }
  address: string
  remote: string
  responsibilities: string[]
  skills: string[]
  goals: string[]
}
