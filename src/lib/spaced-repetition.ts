import { CardStats } from '@/types'

const INITIAL_INTERVAL = 1 // 1 day
const INITIAL_EASE_FACTOR = 2.5
const MIN_EASE_FACTOR = 1.3
const EASE_FACTOR_BONUS = 0.15
const EASE_FACTOR_PENALTY = 0.2

export function calculateNextReview(
  stats: CardStats | undefined,
  isCorrect: boolean
): CardStats {
  const now = Date.now()

  if (!stats) {
    // First review
    return {
      cardId: 0,
      themeTitle: '',
      correctCount: isCorrect ? 1 : 0,
      incorrectCount: isCorrect ? 0 : 1,
      lastReviewed: now,
      nextReview: now + (isCorrect ? INITIAL_INTERVAL * 24 * 60 * 60 * 1000 : 0),
      interval: isCorrect ? INITIAL_INTERVAL : 0,
      easeFactor: INITIAL_EASE_FACTOR,
    }
  }

  const newStats = { ...stats }
  newStats.lastReviewed = now

  if (isCorrect) {
    newStats.correctCount++
    newStats.easeFactor = Math.max(
      MIN_EASE_FACTOR,
      stats.easeFactor + EASE_FACTOR_BONUS
    )

    // Calculate new interval using exponential growth
    if (stats.interval === 0) {
      newStats.interval = INITIAL_INTERVAL
    } else {
      newStats.interval = Math.round(stats.interval * stats.easeFactor)
    }

    newStats.nextReview = now + newStats.interval * 24 * 60 * 60 * 1000
  } else {
    newStats.incorrectCount++
    newStats.easeFactor = Math.max(
      MIN_EASE_FACTOR,
      stats.easeFactor - EASE_FACTOR_PENALTY
    )

    // Reset interval on incorrect answer
    newStats.interval = 0
    newStats.nextReview = now
  }

  return newStats
}

export function shouldReviewCard(stats: CardStats | undefined): boolean {
  if (!stats) return true
  return Date.now() >= stats.nextReview
}

export function getDueCards(allStats: CardStats[], cardIds: number[]): number[] {
  const dueCardIds = cardIds.filter((cardId) => {
    const stats = allStats.find((s) => s.cardId === cardId)
    return shouldReviewCard(stats)
  })

  return dueCardIds
}
