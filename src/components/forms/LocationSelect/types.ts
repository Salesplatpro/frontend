export interface LocationValue {
  name: string
  /** ISO code from country-state-city. Empty for city (the dataset has no city isoCode). */
  isoCode: string
}

export interface LocationFormValue {
  country: LocationValue
  state: LocationValue
  city: LocationValue
}
