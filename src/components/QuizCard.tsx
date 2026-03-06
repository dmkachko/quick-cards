import { useState } from 'react'
import { Card as CardType } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface QuizCardProps {
  card: CardType
  onAnswer: (isCorrect: boolean) => void
  cardNumber: number
  totalCards: number
}

export function QuizCard({ card, onAnswer, cardNumber, totalCards }: QuizCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)

  const handleReveal = () => {
    setShowAnswer(true)
  }

  const handleAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect)
    setShowAnswer(false)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Question</CardTitle>
          <Badge variant="secondary">
            {cardNumber} / {totalCards}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="min-h-[120px] flex items-center justify-center text-center">
          <p className="text-lg">{card.question}</p>
        </div>

        {showAnswer && (
          <div className="border-t pt-6 space-y-2">
            <p className="text-sm text-muted-foreground font-medium">Answer:</p>
            <p className="text-xl font-semibold text-center">{card.answer}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-3">
        {!showAnswer ? (
          <Button onClick={handleReveal} className="w-full" size="lg">
            Show Answer
          </Button>
        ) : (
          <>
            <Button
              onClick={() => handleAnswer(false)}
              variant="destructive"
              className="flex-1"
              size="lg"
            >
              Incorrect
            </Button>
            <Button
              onClick={() => handleAnswer(true)}
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              Correct
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
