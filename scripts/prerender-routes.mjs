import { paths } from '../src/paths.ts'

export const SITE_ORIGIN = 'https://auxhr.com'

export const marketingRoutes = [
  paths.home,
  'explore',
  paths.solution,
  'features',
  'resources',
  'customerstories',
  paths.pricing,
  paths.aboutUs,
  paths.faq,
  paths.testimonials,
  paths.privacyPolicy,
  paths.termsConditions,
].map((route) => (route === '/' ? '/' : `/${route}`))
