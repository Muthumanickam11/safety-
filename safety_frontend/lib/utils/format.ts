export const characterCount = (text: string) => {
  return text.length
}

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export const getCharacterLimit = (platform: string) => {
  switch (platform) {
    case "twitter":
      return 280
    case "linkedin":
      return 3000
    case "instagram":
      return 2200
    default:
      return 1000
  }
}
