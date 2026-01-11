export interface SeoResult {
  seoScore: number
  keywordDensity: Record<string, number>
  wordCount: number
  readingTime: number
  suggestions: string[]
}

export function analyzeSeo(markdown: string, keywords: string[]): SeoResult {
  const text = markdown.replace(/[#*`_~[\]()]/g, "")
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0)
  const wordCount = words.length

  const keywordDensity: Record<string, number> = {}
  keywords.forEach((kw) => {
    const count = words.filter((w) => w.includes(kw.toLowerCase())).length
    keywordDensity[kw] = wordCount > 0 ? (count / wordCount) * 100 : 0
  })

  // Simple scoring logic
  let seoScore = 50
  if (wordCount > 300) seoScore += 20
  if (keywords.length > 0) seoScore += 10

  const readingTime = Math.ceil(wordCount / 200) // approx 200 words per minute

  const suggestions = []
  if (wordCount < 500) suggestions.push("Consider increasing word count to 500+ for better indexing.")
  if (Object.values(keywordDensity).some((d) => d > 3)) suggestions.push("Keyword stuffing detected. Reduce frequency.")

  return {
    seoScore: Math.min(seoScore, 100),
    keywordDensity,
    wordCount,
    readingTime,
    suggestions,
  }
}

