import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'The Ratio',
    items: [
      '2 parts bread by weight',
      '1 part protein',
      '1 part vegetable',
      '0.25 part sauce — any more and it leaks',
    ],
  },
  {
    title: 'Build Order (bottom → top)',
    items: [
      'Bottom bread — toasted side in',
      'Sauce #1 (fatty: mayo, butter, aioli)',
      'Protein',
      'Cheese, if melty — do this while warm',
      'Pickled thing (onion, pepper, cornichon)',
      'Crunchy green (lettuce, sprouts, slaw)',
      'Sauce #2 (bright: mustard, vinaigrette, hot sauce)',
      'Top bread',
    ],
  },
  {
    title: 'Pairings that never miss',
    items: [
      'Turkey + brie + fig jam + arugula',
      'Ham + gruyère + dijon + butter',
      'Egg salad + dill + celery + rye',
      'Tomato + mayo + flaky salt + white bread',
      'Mozz + pesto + roasted pepper + ciabatta',
    ],
  },
  {
    title: 'Field Notes',
    items: [
      'Toast the bread if anything is wet.',
      'Salt the tomato 5 min ahead, blot dry.',
      'Pickles go next to protein, not next to bread.',
      'If you can see the fillings from the side, you overbuilt it.',
    ],
  },
]

export default function SandwichCheatsheet() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <nav className="mb-8">
        <Link
          to="/"
          className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← The Toolkit
        </Link>
      </nav>

      <header className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Sandwich Cheat Sheet
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Placeholder content — replace with the artifact from Claude.ai.
        </p>
      </header>

      <div className="space-y-10">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="mb-3 text-lg font-medium text-slate-900 dark:text-slate-100">
              {s.title}
            </h2>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              {s.items.map((item) => (
                <li
                  key={item}
                  className="rounded border border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-900"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
