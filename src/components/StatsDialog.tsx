import { useState } from 'react'
import { Theme } from '@/types'
import { getThemeStats, getAllStats, resetThemeStats } from '@/lib/storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RotateCcw } from 'lucide-react'

interface StatsDialogProps {
  themes: Theme[]
  onStatsReset?: () => void
}

export function StatsDialog({ themes, onStatsReset }: StatsDialogProps) {
  const [allStats, setAllStats] = useState(getAllStats())

  const themeStats = themes.map((theme) =>
    getThemeStats(theme.title, theme.cards.length)
  )

  const handleResetTheme = (themeTitle: string) => {
    resetThemeStats(themeTitle)
    setAllStats(getAllStats())
    onStatsReset?.()
  }

  const totalReviews = allStats.reduce(
    (sum, s) => sum + s.correctCount + s.incorrectCount,
    0
  )
  const totalCorrect = allStats.reduce((sum, s) => sum + s.correctCount, 0)
  const totalIncorrect = allStats.reduce((sum, s) => sum + s.incorrectCount, 0)
  const accuracy = totalReviews > 0 ? (totalCorrect / totalReviews) * 100 : 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Stats</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Learning Statistics</DialogTitle>
          <DialogDescription>
            Track your progress across all themes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{totalReviews}</div>
                  <div className="text-sm text-muted-foreground">Total Reviews</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {totalCorrect}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {totalIncorrect}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Accuracy</span>
                  <span className="font-medium">{accuracy.toFixed(1)}%</span>
                </div>
                <Progress value={accuracy} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Per-Theme Stats */}
          <div className="space-y-3">
            <h3 className="font-semibold">Theme Statistics</h3>
            {themeStats.map((stats) => (
              <Card key={stats.themeTitle}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base">{stats.themeTitle}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {stats.reviewedCards}/{stats.totalCards} cards
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Reset theme progress"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset Theme Progress?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all learning statistics for "{stats.themeTitle}".
                              You'll start fresh with all cards. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleResetTheme(stats.themeTitle)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Reset
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="font-medium text-green-600">
                        {stats.correctCount}
                      </div>
                      <div className="text-xs text-muted-foreground">Correct</div>
                    </div>
                    <div>
                      <div className="font-medium text-red-600">
                        {stats.incorrectCount}
                      </div>
                      <div className="text-xs text-muted-foreground">Incorrect</div>
                    </div>
                    <div>
                      <div className="font-medium">
                        {stats.averageEaseFactor.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Ease</div>
                    </div>
                  </div>
                  <Progress
                    value={(stats.reviewedCards / stats.totalCards) * 100}
                    className="h-1.5"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
