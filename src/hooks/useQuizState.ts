import { useState, useEffect, useMemo } from 'react'
import { Card, CardStats, Theme } from '@/types'
import { calculateNextReview, getDueCards } from '@/lib/spaced-repetition'
import { getCardStats, updateCardStats, getAllStats } from '@/lib/storage'

export function useQuizState(theme: Theme | null) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [shuffledCards, setShuffledCards] = useState<Card[]>([])
  const [stats, setStats] = useState<CardStats[]>([])

  // Load stats when theme changes
  useEffect(() => {
    setStats(getAllStats())
  }, [theme])

  // Shuffle cards and filter for due cards when theme changes
  useEffect(() => {
    if (!theme) {
      setShuffledCards([])
      setCurrentCardIndex(0)
      return
    }

    const allCardIds = theme.cards.map((c) => c.id)
    const themeStats = stats.filter((s) => s.themeTitle === theme.title)
    const dueCardIds = getDueCards(themeStats, allCardIds)

    // If no cards are due, show all cards (for new themes or when all are reviewed)
    const cardsToShow =
      dueCardIds.length > 0
        ? theme.cards.filter((c) => dueCardIds.includes(c.id))
        : theme.cards

    // Shuffle using Fisher-Yates algorithm
    const shuffled = [...cardsToShow]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setShuffledCards(shuffled)
    setCurrentCardIndex(0)
  }, [theme, stats])

  const currentCard = shuffledCards[currentCardIndex]

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentCard || !theme) return

    const existingStats = getCardStats(currentCard.id, theme.title)
    const newStats = calculateNextReview(existingStats, isCorrect)
    newStats.cardId = currentCard.id
    newStats.themeTitle = theme.title

    updateCardStats(newStats)
    setStats(getAllStats())

    // Move to next card
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      // Restart from beginning when reaching the end
      setCurrentCardIndex(0)
    }
  }

  const progress = useMemo(() => {
    if (shuffledCards.length === 0) return 0
    return ((currentCardIndex + 1) / shuffledCards.length) * 100
  }, [currentCardIndex, shuffledCards.length])

  return {
    currentCard,
    currentCardIndex,
    totalCards: shuffledCards.length,
    handleAnswer,
    progress,
    hasCards: shuffledCards.length > 0,
  }
}
