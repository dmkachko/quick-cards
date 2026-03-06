import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Theme } from '@/types'
import { HomePage } from '@/pages/HomePage'
import { QuizPage } from '@/pages/QuizPage'

function App() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  // Load themes from public directory
  useEffect(() => {
    async function loadThemes() {
      try {
        // You can add more JSON files here as you create them
        const themeFiles = ['az-message-events.json']

        const loadedThemes = await Promise.all(
          themeFiles.map(async (file) => {
            const response = await fetch(`${import.meta.env.BASE_URL}${file}`)
            return response.json()
          })
        )

        setThemes(loadedThemes)
      } catch (error) {
        console.error('Failed to load themes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadThemes()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading themes...</h2>
        </div>
      </div>
    )
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/quiz" element={<HomePage themes={themes} />} />
        <Route path="/quiz/:themeTitle" element={<QuizPage themes={themes} />} />
        <Route path="/" element={<Navigate to="/quiz" replace />} />
        <Route path="*" element={<Navigate to="/quiz" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
