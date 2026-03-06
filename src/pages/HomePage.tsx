import { useNavigate } from 'react-router-dom'
import { Theme } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatsDialog } from '@/components/StatsDialog'
import { getThemeStats } from '@/lib/storage'
import { BookOpen, BarChart3 } from 'lucide-react'

interface HomePageProps {
  themes: Theme[]
}

export function HomePage({ themes }: HomePageProps) {
  const navigate = useNavigate()
  const enabledThemes = themes.filter((t) => t.isEnabled)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">Quick Cards</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-6">
            Master any topic with spaced repetition
          </p>
          <StatsDialog themes={themes} />
        </div>

        {/* Theme Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Available Themes
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {enabledThemes.map((theme) => {
              const stats = getThemeStats(theme.title, theme.cards.length)
              const progress = (stats.reviewedCards / stats.totalCards) * 100

              return (
                <Card
                  key={theme.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/quiz/${encodeURIComponent(theme.title)}`, { replace: false })}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="mb-2">{theme.title}</CardTitle>
                        <CardDescription>{theme.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {theme.cards.length} cards
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {stats.reviewedCards}/{stats.totalCards} reviewed
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {stats.reviewedCards > 0 && (
                        <div className="flex gap-4 text-xs text-muted-foreground pt-2">
                          <span className="text-green-600 dark:text-green-400">
                            ✓ {stats.correctCount} correct
                          </span>
                          <span className="text-red-600 dark:text-red-400">
                            ✗ {stats.incorrectCount} incorrect
                          </span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full mt-4" variant="default">
                      Start Learning
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {enabledThemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No themes available. Add JSON files to the public directory.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Your progress is saved locally. Use spaced repetition to maximize retention.
          </p>
        </div>
      </div>
    </div>
  )
}
