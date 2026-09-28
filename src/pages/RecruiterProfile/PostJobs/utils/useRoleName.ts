import { useGetRoleQuery } from '@/redux/api/talent'
import { Role } from '@/utils/types'

/** A job's role is stored as a role id, or as a typed name for a role that doesn't exist yet. */
export const useRoleName = (roleValue: string): string => {
  const { data } = useGetRoleQuery({})
  const roles: Role[] = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.data?.roles)
    ? data.data.roles
    : []
  const match = roles.find((role) => String(role.id) === roleValue)
  return match?.name ?? roleValue
}
