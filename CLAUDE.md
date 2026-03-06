# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev server**: `npm run dev` - Start Vite dev server with hot reload
- **Build**: `npm run build` - Type-check and build for production
- **Preview**: `npm run preview` - Preview production build locally

## Adding shadcn/ui Components

Use the shadcn CLI to add new components:
```bash
npx shadcn@latest add <component-name>
```

Example: `npx shadcn@latest add card`

Components are installed to `src/components/ui/` and can be imported with `@/components/ui/<component>`.

## Architecture

This is a modern React frontend application with:

- **Vite**: Fast build tool and dev server
- **React 19** + **TypeScript**: UI framework with strict type checking
- **Tailwind CSS**: Utility-first styling with CSS variables for theming
- **shadcn/ui**: Accessible, customizable component library built on Radix UI

### Key Directories

- `src/main.tsx` - Application entry point
- `src/App.tsx` - Root component
- `src/components/ui/` - shadcn/ui components
- `src/lib/` - Utility functions (e.g., `cn()` for className merging)
- `components.json` - shadcn/ui configuration

### Path Aliases

The project uses `@/*` path aliases configured in both `tsconfig.json` and `vite.config.ts`:
- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/types` → `src/types`

## Application Features

This is a **spaced repetition flashcard application** for learning and memorization:

### Core Features

1. **Spaced Repetition Algorithm**: Uses exponential intervals to schedule card reviews
   - Correct answers increase the review interval
   - Incorrect answers reset the interval
   - Ease factor adjusts based on performance

2. **Multiple Themes**: Support for multiple quiz topics via JSON files in `public/`
   - Each JSON file represents one theme
   - Format: `{ title, description, isEnabled, cards: [{ id, question, answer }] }`

3. **Statistics Tracking**: Persists learning progress in localStorage
   - Per-card statistics (correct/incorrect counts, intervals, ease factors)
   - Theme-level statistics (progress, accuracy, average ease)
   - Overall progress across all themes

4. **Random Card Order**: Cards are shuffled for each session
5. **Due Card Filtering**: Only shows cards that are due for review

### Routing Structure

The app uses React Router with the following routes:
- `/` - Redirects to `/quiz`
- `/quiz` - Theme selection page with all available themes
- `/quiz/:themeTitle` - Quiz page for a specific theme
- Any other path redirects to `/quiz`

To change the base path for deployment (e.g., `/quick-cards/`), update the `base` property in `vite.config.ts`.

### Key Files

- `src/App.tsx` - Main application with router setup and theme loading
- `src/pages/HomePage.tsx` - Landing page with theme cards and statistics
- `src/pages/QuizPage.tsx` - Quiz interface for a selected theme
- `src/hooks/useQuizState.ts` - Quiz state management with spaced repetition logic
- `src/lib/spaced-repetition.ts` - Spaced repetition algorithm implementation
- `src/lib/storage.ts` - localStorage persistence layer (includes reset functions)
- `src/components/QuizCard.tsx` - Individual flashcard component
- `src/components/ThemeSelector.tsx` - Theme selection dropdown
- `src/components/StatsDialog.tsx` - Statistics popup modal with per-theme reset
- `public/*.json` - Theme data files

### Adding New Themes

1. Create a new JSON file in the `public/` directory with this structure:
```json
{
  "title": "Theme Name",
  "description": "Theme description",
  "isEnabled": true,
  "cards": [
    { "id": 1, "question": "Question?", "answer": "Answer" }
  ]
}
```

2. Add the filename to the `themeFiles` array in `src/App.tsx`:
```typescript
const themeFiles = ['az-message-events.json', 'your-new-theme.json']
```
