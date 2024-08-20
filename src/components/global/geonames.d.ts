// geonames.d.ts
declare module 'geonames.js' {
  interface GeonamesConfig {
    username: string
    lan: string
    encoding: string
  }

  interface Geoname {
    geonameId: number
    name: string
    countryName?: string
    [key: string]: any
  }

  interface GeonamesResponse<T> {
    geonames: T[]
  }

  export default class Geonames {
    constructor(config: GeonamesConfig)

    countryInfo(params: {}): Promise<GeonamesResponse<Geoname>>

    children(params: { geonameId: number }): Promise<GeonamesResponse<Geoname>>

    // Add other methods and properties as necessary
  }
}
