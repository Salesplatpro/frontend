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
    url: paths.solution,
  },
  {
    name: 'Blog',
    url: paths.blog,
  },
  {
    name: 'Pricing',
    url: paths.pricing,
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
    url: paths.login,
    variant: 'secondary' as ButtonVariant,
  },
  {
    name: 'Try it Free',
    url: paths.talentRegister,
    variant: 'primary' as ButtonVariant,
  },
]

export const footerData = [
  {
    key: 'Product',
    children: [
      { name: 'For Organizations', url: '/' },
      { name: 'For Talents', url: '/' },
      { name: 'Features', url: paths.features },
      { name: 'Pricing', url: paths.pricing },
      { name: 'FAQ', url: paths.faq },
    ],
  },
  {
    key: 'Company',
    children: [
      { name: 'About us', url: paths.aboutUs },
      { name: 'Support', url: '/' },
      { name: 'Solutions', url: paths.solution },
    ],
  },
  {
    key: 'Resources',
    children: [
      { name: 'Blog', url: '/' },
      { name: 'Testimonials', url: paths.testimonials },
    ],
  },
  {
    key: 'Legal',
    children: [
      { name: 'Terms', url: '/' },
      { name: 'Privacy', url: '/' },
      { name: 'Cookies', url: '/' },
    ],
  },
]
