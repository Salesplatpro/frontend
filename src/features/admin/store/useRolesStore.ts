import axios from 'axios'
import { create } from 'zustand'

import { notify } from '@/utils/toastNotifications'

import * as adminService from '../services/adminService'
import { AdminRole, AdminRolePayload } from '../types'

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    return (
      (err.response?.data as { error?: { message?: string } } | undefined)
        ?.error?.message ?? fallback
    )
  }
  return fallback
}

interface RolesState {
  roles: AdminRole[]
  isLoading: boolean
  error: string | null
  fetchRoles: () => Promise<void>
  createRole: (payload: AdminRolePayload) => Promise<boolean>
  updateRole: (id: string, payload: AdminRolePayload) => Promise<boolean>
  deleteRole: (id: string) => Promise<boolean>
  reset: () => void
}

export const useRolesStore = create<RolesState>()((set, get) => ({
  roles: [],
  isLoading: false,
  error: null,
  reset: () => set({ roles: [], isLoading: false, error: null }),
  fetchRoles: async () => {
    set({ isLoading: true, error: null })
    try {
      const roles = await adminService.fetchRoles()
      set({ roles, isLoading: false })
    } catch (err) {
      const message = extractErrorMessage(err, 'Failed to load roles')
      set({ isLoading: false, error: message })
      notify('error', message)
    }
  },
  createRole: async (payload) => {
    try {
      const role = await adminService.createRole(payload)
      // Prepend immediately so the new role is visible without waiting on a
      // round trip, then reconcile with the server's sort order in the background.
      set({ roles: [role, ...get().roles] })
      void get().fetchRoles()
      notify('success', 'Role created')
      return true
    } catch (err) {
      notify('error', extractErrorMessage(err, 'Failed to create role'))
      return false
    }
  },
  updateRole: async (id, payload) => {
    try {
      const updated = await adminService.updateRole(id, payload)
      set({
        roles: get().roles.map((role) => (role.id === id ? updated : role)),
      })
      notify('success', 'Role updated')
      return true
    } catch (err) {
      notify('error', extractErrorMessage(err, 'Failed to update role'))
      return false
    }
  },
  deleteRole: async (id) => {
    try {
      await adminService.deleteRole(id)
      set({ roles: get().roles.filter((role) => role.id !== id) })
      notify('success', 'Role deleted')
      return true
    } catch (err) {
      notify('error', extractErrorMessage(err, 'Failed to delete role'))
      return false
    }
  },
}))
