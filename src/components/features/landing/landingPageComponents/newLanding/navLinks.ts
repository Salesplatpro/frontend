import { paths } from '@/paths'

export type NavLink = {
  label: string
  href: string
  external?: boolean
}

export const navLinks: NavLink[] = [
  { label: 'Solutions', href: `/${paths.solution}` },
  { label: 'Resources', href: `/${paths.resources}` },
  { label: 'Blog', href: paths.blog, external: true },
  { label: 'Pricing', href: `/${paths.pricing}` },
]
