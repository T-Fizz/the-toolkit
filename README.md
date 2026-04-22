# The Toolkit

A small, growing collection of personal tools. Vite + React + Tailwind v4, managed with [Takumi](https://github.com/takumi-build/takumi).

## Structure

```
src/
  apps/
    sandwich-cheatsheet/
      index.jsx      ← one folder per app, self-contained
  App.jsx            ← landing page + router
  main.jsx
```

## Develop

```bash
takumi build        # vite build
npm run dev         # vite dev server
```

## Add a new tool

1. Create `src/apps/<name>/index.jsx` exporting a default React component.
2. Import it in `src/App.jsx` and add to the `apps` list + `<Routes>`.
