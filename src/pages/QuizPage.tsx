import { useNavigate, useParams } from 'react-router-dom'
import { Theme } from '@/types'
import { QuizCard } from '@/components/QuizCard'
import { StatsDialog } from '@/components/StatsDialog'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useQuizState } from '@/hooks/useQuizState'
import { ArrowLeft } from 'lucide-react'

interface QuizPageProps {
  themes: Theme[]
}

export function QuizPage({ themes }: QuizPageProps) {
  const navigate = useNavigate()
  const { themeTitle } = useParams<{ themeTitle: string }>()
  const currentTheme = themes.find((t) => t.title === decodeURIComponent(themeTitle || ''))

  const { currentCard, currentCardIndex, totalCards, handleAnswer, progress, hasCards } =
    useQuizState(currentTheme || null)

  if (!currentTheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold">Theme not found</h2>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Themes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold">{currentTheme.title}</h1>
          </div>
          <StatsDialog themes={themes} />
        </div>

        {/* Progress Bar */}
        {hasCards && (
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Session Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Quiz Card */}
        <div className="flex flex-col items-center gap-6">
          {currentCard ? (
            <QuizCard
              card={currentCard}
              onAnswer={handleAnswer}
              cardNumber={currentCardIndex + 1}
              totalCards={totalCards}
            />
          ) : (
            <div className="text-center space-y-4 p-8">
              <h2 className="text-2xl font-semibold">All done! 🎉</h2>
              <p className="text-muted-foreground">
                You've reviewed all due cards for this theme.
              </p>
              <p className="text-sm text-muted-foreground">
                Come back later for more reviews based on spaced repetition intervals.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/')} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Themes
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Review Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
