export const truncateText = (
  text: string,
  limit: number,
  isExpanded: boolean,
): string => {
  if (isExpanded) return text
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}
