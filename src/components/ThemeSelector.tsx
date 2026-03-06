import { Theme } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ThemeSelectorProps {
  themes: Theme[]
  currentTheme: Theme | null
  onThemeChange: (theme: Theme) => void
}

export function ThemeSelector({
  themes,
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const enabledThemes = themes.filter((t) => t.isEnabled)

  return (
    <div className="w-full max-w-md">
      <Select
        value={currentTheme?.title}
        onValueChange={(title) => {
          const theme = themes.find((t) => t.title === title)
          if (theme) onThemeChange(theme)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          {enabledThemes.map((theme) => (
            <SelectItem key={theme.title} value={theme.title}>
              {theme.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentTheme && (
        <p className="text-sm text-muted-foreground mt-2">
          {currentTheme.description}
        </p>
      )}
    </div>
  )
}
