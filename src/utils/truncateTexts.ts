export const truncateText = (
  text: string,
  limit: number,
  isExpanded: boolean,
): string => {
  if (isExpanded) return text
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

/** Strips markup, leaving plain text for previews of rich-text content
 * (character-slicing raw HTML would mid-tag-truncate and break markup). */
export const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '')
