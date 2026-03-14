# Rooster Clash

Initial frontend prototype for a 1v1 rooster fighting game built with React and Vite.

## Current state

- React + Vite setup with hot reload
- Local roster selection flow
- Auto-resolved battles with battle log
- Scalable fighter data model with archetypes
- Combat system tuned to feel longer and less burst-heavy

## Run locally

Install dependencies:

```powershell
npm.cmd install
```

Start the dev server:

```powershell
npm.cmd run dev
```

Build for production:

```powershell
npm.cmd run build
```

Preview the production build:

```powershell
npm.cmd run preview
```

## Project structure

- `src/App.jsx`: main app flow
- `src/components/`: React UI components
- `src/core/`: combat, storage, and opponent generation logic
- `src/data/`: starter fighters and archetypes
- `src/styles/`: app styles
- `public/`: battle sprites

## Notes

- This is still a frontend-only phase.
- Multiplayer backend is not connected yet.
- Some temporary backup image files may still exist in the project root from asset migration cleanup.
