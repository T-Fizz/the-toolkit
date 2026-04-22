# Snazzy Tools

A personal collection of little single-purpose apps that look good and actually do something useful. Live at [t-fizz.github.io/the-toolkit](https://t-fizz.github.io/the-toolkit/).

## Structure

```
src/
  apps/
    sandwich-cheatsheet/   ← each tool gets its own folder
      index.jsx
  App.jsx                  ← landing page + router
  main.jsx
```

## Develop

```bash
npm install
npm run dev
```

## Add a new tool

1. Create `src/apps/<name>/index.jsx` with a default-export component.
2. Import it in `src/App.jsx`, add a `<Route>`, and add an entry to `TOOLS`.

## Design guidelines

- **Dark theme:** bg `#1A1A1A`, text `#F5F0EB`, accent `#B8956A`
- **Fonts:** system-ui for UI, Georgia for headings
- **Cards:** bg `#242424`, border `#333`, radius 12
- **Styling:** inline styles only — no CSS frameworks
- **Mobile-first** — these should feel good on a phone
- Each tool stays self-contained in its folder
