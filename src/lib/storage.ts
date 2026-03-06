import { CardStats } from '@/types'

const STORAGE_KEY = 'quick-cards-stats'

export function loadStats(): CardStats[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to load stats:', error)
    return []
  }
}

export function saveStats(stats: CardStats[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error('Failed to save stats:', error)
  }
}

export function getCardStats(
  cardId: number,
  themeTitle: string
): CardStats | undefined {
  const stats = loadStats()
  return stats.find((s) => s.cardId === cardId && s.themeTitle === themeTitle)
}

export function updateCardStats(newStats: CardStats): void {
  const stats = loadStats()
  const index = stats.findIndex(
    (s) => s.cardId === newStats.cardId && s.themeTitle === newStats.themeTitle
  )

  if (index >= 0) {
    stats[index] = newStats
  } else {
    stats.push(newStats)
  }

  saveStats(stats)
}

export function getThemeStats(themeTitle: string, totalCards: number) {
  const stats = loadStats().filter((s) => s.themeTitle === themeTitle)

  const reviewedCards = stats.length
  const correctCount = stats.reduce((sum, s) => sum + s.correctCount, 0)
  const incorrectCount = stats.reduce((sum, s) => sum + s.incorrectCount, 0)
  const averageEaseFactor = stats.length > 0
    ? stats.reduce((sum, s) => sum + s.easeFactor, 0) / stats.length
    : 0

  return {
    themeTitle,
    totalCards,
    reviewedCards,
    correctCount,
    incorrectCount,
    averageEaseFactor,
  }
}

export function getAllStats(): CardStats[] {
  return loadStats()
}

export function resetThemeStats(themeTitle: string): void {
  const stats = loadStats()
  const filteredStats = stats.filter((s) => s.themeTitle !== themeTitle)
  saveStats(filteredStats)
}

export function resetAllStats(): void {
  saveStats([])
}
