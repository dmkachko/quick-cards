export interface Card {
  id: number
  question: string
  answer: string
}

export interface Theme {
  title: string
  description: string
  isEnabled: boolean
  cards: Card[]
}

export interface CardStats {
  cardId: number
  themeTitle: string
  correctCount: number
  incorrectCount: number
  lastReviewed: number // timestamp
  nextReview: number // timestamp
  interval: number // days
  easeFactor: number
}

export interface ThemeStats {
  themeTitle: string
  totalCards: number
  reviewedCards: number
  correctCount: number
  incorrectCount: number
  averageEaseFactor: number
}
