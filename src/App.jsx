import { Link, Route, Routes } from 'react-router-dom'
import SandwichCheatsheet from './apps/sandwich-cheatsheet/index.jsx'

const apps = [
  {
    slug: 'sandwich-cheatsheet',
    name: 'Sandwich Cheat Sheet',
    description: 'Build a better sandwich. Ratios, pairings, and field notes.',
  },
]

function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          The Toolkit
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          A small, growing collection of personal tools.
        </p>
      </header>

      <ul className="space-y-3">
        {apps.map((app) => (
          <li key={app.slug}>
            <Link
              to={`/${app.slug}`}
              className="group block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-medium text-slate-900 dark:text-slate-100">
                  {app.name}
                </h2>
                <span className="text-sm text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  →
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {app.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sandwich-cheatsheet" element={<SandwichCheatsheet />} />
      </Routes>
    </div>
  )
}
