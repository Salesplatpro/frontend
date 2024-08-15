export const calculateDaysFromCreation = (createdAt: string): number => {
  const creationDate = new Date(createdAt)
  const today = new Date()
  const timeDifference = today.getTime() - creationDate.getTime()
  return Math.floor(timeDifference / (1000 * 3600 * 24))
}
