export const sortCvAndCoverLetter = (
  files: File[],
): { cv: File; coverLetter: File }[] => {
  const groupedFiles: { cv: File; coverLetter: File }[] = []

  const getSimilarity = (str1: string, str2: string) => {
    let matches = 0
    const minLength = Math.min(str1.length, str2.length)
    for (let i = 0; i < minLength; i++) {
      if (str1[i] === str2[i]) matches++
    }
    return matches / minLength
  }

  const filePairs: boolean[] = Array(files.length).fill(false)

  files.forEach((file1, index1) => {
    if (filePairs[index1]) return

    let bestMatchIndex = -1
    let highestSimilarity = 0

    files.forEach((file2, index2) => {
      if (index1 !== index2 && !filePairs[index2]) {
        const similarity = getSimilarity(file1.name, file2.name)
        if (similarity > highestSimilarity) {
          highestSimilarity = similarity
          bestMatchIndex = index2
        }
      }
    })

    if (bestMatchIndex !== -1) {
      groupedFiles.push({
        cv: file1,
        coverLetter: files[bestMatchIndex],
      })
      filePairs[index1] = true
      filePairs[bestMatchIndex] = true
    }
  })

  return groupedFiles
}
