import { Routes, Route, Link } from 'react-router-dom'
import SandwichCheatSheet from './apps/sandwich-cheatsheet/index.jsx'

const TOOLS = [
  {
    name: "Sandwich Cheat Sheet",
    path: "/sandwich-cheatsheet",
    description: "Build a sandwich that actually works — food-theory clash detection",
    emoji: "🥪",
  },
]

function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#1A1A1A",
      color: "#F5F0EB",
      fontFamily: "system-ui, sans-serif",
      padding: "48px 24px",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{
          fontSize: 12,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#B8956A",
          marginBottom: 12,
        }}>
          Collection
        </div>
        <h1 style={{
          fontSize: 36,
          fontWeight: 700,
          margin: "0 0 8px",
          fontFamily: "'Georgia', serif",
        }}>
          Snazzy Tools
        </h1>
        <p style={{
          color: "#6B5D4F",
          fontSize: 15,
          marginBottom: 40,
        }}>
          A personal collection of little single-purpose apps that look good and actually do something useful.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {TOOLS.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              style={{
                background: "#242424",
                border: "1px solid #333",
                borderRadius: 12,
                padding: "20px",
                textDecoration: "none",
                color: "#F5F0EB",
                display: "flex",
                alignItems: "center",
                gap: 16,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#B8956A"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = "#333"}
            >
              <div style={{
                fontSize: 32,
                width: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 12,
                background: "#2A2A2A",
                flexShrink: 0,
              }}>
                {tool.emoji}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>
                  {tool.name}
                </div>
                <div style={{ fontSize: 13, color: "#7A6B5B" }}>
                  {tool.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function BackToHome() {
  return (
    <Link
      to="/"
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 20,
        background: "#242424cc",
        backdropFilter: "blur(8px)",
        border: "1px solid #3D2B1F",
        borderRadius: 20,
        padding: "6px 12px",
        color: "#B8956A",
        fontSize: 12,
        fontFamily: "system-ui, sans-serif",
        fontWeight: 600,
        letterSpacing: 1,
        textTransform: "uppercase",
        textDecoration: "none",
      }}
    >
      ← Tools
    </Link>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/sandwich-cheatsheet"
        element={
          <>
            <BackToHome />
            <SandwichCheatSheet />
          </>
        }
      />
    </Routes>
  )
}
