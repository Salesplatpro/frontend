export const capitalizeEachWord = (string?: string) => {
  if (!string) return ''
  return string
    .split(' ')
    .map(
      (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(' ')
}
