export const sortCvAndCoverLetter = (
  files: File[],
): { file1: string; file2: string }[] => {
  const groupedFiles: { file1: string; file2: string }[] = []

  // A helper function to calculate similarity between two strings
  const getSimilarity = (str1: string, str2: string) => {
    let matches = 0
    const minLength = Math.min(str1.length, str2.length)
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) matches++
    }
    return matches / minLength
  }

  // Sort files based on their similarity to each other
  const filePairs: boolean[] = Array(files.length).fill(false) // To track paired files

  files.forEach((file1, index1) => {
    if (filePairs[index1]) return // Skip if already paired

    let bestMatchIndex = -1
    let highestSimilarity = 0

    // Find the most similar file for the current file
    files.forEach((file2, index2) => {
      if (index1 !== index2 && !filePairs[index2]) {
        const similarity = getSimilarity(file1.name, file2.name)
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity
          bestMatchIndex = index2
        }
      }
    })

    // If a best match was found, pair them
    if (bestMatchIndex !== -1) {
      groupedFiles.push({
        file1: file1.name,
        file2: files[bestMatchIndex].name,
      })
      filePairs[index1] = true
      filePairs[bestMatchIndex] = true
    }
  })

  return groupedFiles
}
