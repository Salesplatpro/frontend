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
    url: '/',
  },
]

export const rightNav = [
  {
    name: 'Get a Demo',
    url: '/',
    variant: 'secondary' as ButtonVariant,
  },
  {
    name: 'Login',
    url: '/',
    variant: 'secondary' as ButtonVariant,
  },
  {
    name: 'Try it Free',
    url: '/',
    variant: 'primary' as ButtonVariant,
  },
]

export const footerData = [
  {
    key: 'Product',
    children: [
      { name: 'Overview', url: '/' },
      { name: 'Features', url: '/' },
      { name: 'Solution', url: '/' },
      { name: 'Tutorials', url: '/' },
      { name: 'Pricing', url: '/' },
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
      { name: 'Pricing', url: '/' },
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
