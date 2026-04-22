# The Toolkit

A small, growing collection of personal tools. Vite + React + Tailwind v4.

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
npm install
npm run dev
```

## Add a new tool

1. Create `src/apps/<name>/index.jsx` exporting a default React component.
2. Import it in `src/App.jsx` and add an entry to the `apps` list + a `<Route>`.
