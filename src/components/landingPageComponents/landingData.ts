import { paths } from '../../paths'
import { ButtonVariant } from './LandingButton'

export const containerPadding = 'px-5 md:px-4 lg:px-20'

export const leftNav = [
  {
    name: 'For Organisations',
    url: '/',
  },
  {
    name: 'For Talents',
    url: '/',
  },
  {
    name: 'Solutions',
    url: '/',
  },
  {
    name: 'Blog',
    url: '/',
  },
  {
    name: 'Pricing',
    url: paths.pricing,
  },
]

export const rightNav = [
  {
    name: 'Get a Demo',
    url: paths.register,
    variant: 'secondary' as ButtonVariant,
  },
  {
    name: 'Login',
    url: paths.login,
    variant: 'secondary' as ButtonVariant,
  },
  {
    name: 'Try it Free',
    url: paths.register,
    variant: 'primary' as ButtonVariant,
  },
]

export const footerData = [
  {
    key: 'Product',
    children: [
      { name: 'Overview', url: '/' },
      { name: 'Features', url: paths.features },
      { name: 'Solution', url: '/' },
      { name: 'Tutorials', url: '/' },
      { name: 'Pricing', url: paths.pricing },
      { name: 'Release', url: '/' },
    ],
  },
  {
    key: 'Company',
    children: [
      { name: 'About us', url: '/' },
      { name: 'Features', url: '/' },
      { name: 'Solution', url: '/' },
      { name: 'Tutorials', url: '/' },
      { name: 'Pricing', url: '/' },
      { name: 'Release', url: '/' },
    ],
  },
  {
    key: 'Resources',
    children: [
      { name: 'Overview', url: '/' },
      { name: 'Features', url: '/' },
      { name: 'Solution', url: '/' },
      { name: 'Tutorials', url: '/' },
      { name: 'Pricing', url: paths.pricing },
      { name: 'Release', url: '/' },
    ],
  },
  {
    key: 'Legal',
    children: [
      { name: 'Terms', url: '/' },
      { name: 'Privacy', url: '/' },
      { name: 'Cookies', url: '/' },
      { name: 'Licences', url: '/' },
    ],
  },
]
