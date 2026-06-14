import { useAuthStore } from '@/features/auth/store/useAuthStore'

export const getToken = (): string | null => useAuthStore.getState().token
