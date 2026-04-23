import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { INGREDIENTS, CATEGORIES, starterBar } from "./ingredients.js";
import { availableRecipes, oneBottleAway, similarRecipes, matchRecipe } from "./scoring.js";
import RadarChart from "./RadarChart.jsx";

const STORAGE_KEY = "cocktail-bar-v1";

// Hard-lock filter for tag labels — keeps junk values ("", null, undefined,
// whitespace, "untagged") from ever reaching the UI.
function isValidTag(t) {
  if (typeof t !== "string") return false;
  const trimmed = t.trim();
  if (!trimmed) return false;
  if (trimmed.toLowerCase() === "untagged") return false;
  return true;
}

function loadBar() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr);
  } catch {
    // ignore parse errors; fall through to default
  }
  return null;
}

function saveBar(bar) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...bar]));
  } catch {
    // ignore quota errors
  }
}

export default function CocktailBuilder() {
  const [bar, setBar] = useState(() => loadBar() ?? starterBar());
  const [view, setView] = useState(() => (loadBar() ? "menu" : "setup"));
  const [expanded, setExpanded] = useState(null);
  const [filterTag, setFilterTag] = useState(null);

  useEffect(() => { saveBar(bar); }, [bar]);

  const { canMake, closeEnough } = useMemo(() => availableRecipes(bar), [bar]);
  const shopping = useMemo(() => oneBottleAway(bar), [bar]);

  const toggle = (id) => {
    setBar((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Hard-lock: only real, non-empty, non-placeholder tags make it into the filter set.
  // Anything falsy, non-string, whitespace-only, or literally "untagged" is dropped.
  const allTags = useMemo(() => {
    const s = new Set();
    for (const r of canMake) {
      for (const t of r.recipe.tags ?? []) {
        if (isValidTag(t)) s.add(t);
      }
    }
    return [...s].sort();
  }, [canMake]);

  const filteredCanMake = filterTag
    ? canMake.filter((r) => (r.recipe.tags ?? []).filter(isValidTag).includes(filterTag))
    : canMake;

  const TABS = [
    { id: "menu", label: `Menu${canMake.length ? ` (${canMake.length})` : ""}` },
    { id: "shopping", label: "Shopping" },
    { id: "setup", label: "Bar" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", fontFamily: "'Georgia', serif", color: "#F5F0EB", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2C1810 0%, #1A1A1A 100%)", padding: "32px 20px 24px", borderBottom: "2px solid #3D2B1F" }}>
        <div style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#B8956A", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Home Bar</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>Cocktail<br />Builder</h1>
        <div style={{ fontSize: 14, color: "#8A7B6B", marginTop: 8, fontStyle: "italic" }}>"What can I make tonight?"</div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #3D2B1F", position: "sticky", top: 0, zIndex: 10, background: "#1A1A1A" }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setView(tab.id)} style={{
            flex: 1, padding: "14px 4px", border: "none",
            borderBottom: view === tab.id ? "2px solid #B8956A" : "2px solid transparent",
            background: "transparent", color: view === tab.id ? "#F5F0EB" : "#6B5D4F",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui, sans-serif",
            letterSpacing: 1, textTransform: "uppercase", transition: "all 0.2s",
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {/* ═══ MENU TAB ═══ */}
        {view === "menu" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {canMake.length === 0 && (
              <div style={{ padding: "32px 16px", color: "#6B5D4F", fontStyle: "italic", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
                No drinks yet — add a few bottles in the <b>Bar</b> tab.
              </div>
            )}

            {allTags.length > 0 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                <TagPill label="all" active={!filterTag} onClick={() => setFilterTag(null)} />
                {allTags.map((t) => (
                  <TagPill key={t} label={t} active={filterTag === t} onClick={() => setFilterTag(t)} />
                ))}
              </div>
            )}

            {filteredCanMake.map(({ recipe, substitutes }) => (
              <RecipeCard
                key={recipe.name}
                recipe={recipe}
                substitutes={substitutes}
                isExpanded={expanded === recipe.name}
                onToggle={() => setExpanded(expanded === recipe.name ? null : recipe.name)}
                bar={bar}
              />
            ))}

            {closeEnough.length > 0 && (
              <>
                <div style={{ marginTop: 24, marginBottom: 8, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#B8956A", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
                  One bottle away
                </div>
                {closeEnough.map(({ recipe, missing }) => (
                  <div key={recipe.name} style={{
                    background: "#1E1E1E", border: "1px dashed #3D2B1F", borderRadius: 10,
                    padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <span style={{ fontSize: 22 }}>{recipe.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#C5B8A8" }}>{recipe.name}</div>
                      <div style={{ fontSize: 11, color: "#6B5D4F", fontFamily: "system-ui, sans-serif" }}>
                        need: {missing.map((m) => INGREDIENTS[m]?.label ?? m).join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* ═══ SHOPPING TAB ═══ */}
        {view === "shopping" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#B8956A", fontFamily: "system-ui, sans-serif", fontWeight: 600, marginBottom: 4 }}>
              High-ROI bottles
            </div>
            <div style={{ fontSize: 12, color: "#6B5D4F", fontFamily: "system-ui, sans-serif", marginBottom: 8 }}>
              Buying any of these would unlock new cocktails. Ranked by # unlocked.
            </div>
            {shopping.length === 0 && (
              <div style={{ padding: "16px", color: "#6B5D4F", fontStyle: "italic", fontFamily: "system-ui, sans-serif", textAlign: "center" }}>
                Your bar is fully stocked for every recipe we know about. Time to add more recipes.
              </div>
            )}
            {shopping.slice(0, 15).map((row) => (
              <div key={row.id} style={{
                background: "#242424", border: "1px solid #333", borderRadius: 10, padding: "12px 14px",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#F5F0EB" }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: "#6B5D4F", fontFamily: "system-ui, sans-serif", marginTop: 2 }}>
                    unlocks: {row.unlocks.slice(0, 4).join(", ")}
                    {row.unlocks.length > 4 ? ` + ${row.unlocks.length - 4} more` : ""}
                  </div>
                </div>
                <div style={{
                  background: "#B8956A22", color: "#E8D5A0", padding: "4px 10px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600, fontFamily: "system-ui, sans-serif",
                }}>
                  +{row.unlocks.length}
                </div>
                <button
                  onClick={() => toggle(row.id)}
                  style={{
                    background: "transparent", border: "1px solid #3D2B1F", color: "#B8956A",
                    padding: "6px 12px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                    fontFamily: "system-ui, sans-serif", letterSpacing: 0.5,
                  }}
                >
                  I have it
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ═══ BAR SETUP TAB ═══ */}
        {view === "setup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 12, color: "#6B5D4F", fontFamily: "system-ui, sans-serif" }}>
              Check off what's on your bar. Saved automatically.
            </div>
            {CATEGORIES.map((cat) => {
              const items = Object.entries(INGREDIENTS).filter(([, v]) => v.cat === cat.id);
              return (
                <div key={cat.id}>
                  <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#B8956A", marginBottom: 8, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
                    {cat.label}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map(([id, ing]) => {
                      const on = bar.has(id);
                      return (
                        <button
                          key={id}
                          onClick={() => toggle(id)}
                          style={{
                            padding: "8px 12px", borderRadius: 8,
                            border: on ? "2px solid #B8956A" : "1px solid #3A3A3A",
                            background: on ? "#B8956A22" : "#242424",
                            color: on ? "#E8D5A0" : "#C5B8A8",
                            fontSize: 12, cursor: "pointer", fontFamily: "system-ui, sans-serif",
                          }}
                        >
                          {on ? "✓ " : ""}{ing.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function TagPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#B8956A22" : "transparent",
        border: `1px solid ${active ? "#B8956A" : "#3D2B1F"}`,
        color: active ? "#E8D5A0" : "#8A7B6B",
        padding: "4px 10px", borderRadius: 20,
        fontSize: 11, cursor: "pointer",
        fontFamily: "system-ui, sans-serif", letterSpacing: 0.5, textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );
}

function RecipeCard({ recipe, substitutes, isExpanded, onToggle, bar }) {
  const similar = isExpanded ? similarRecipes(recipe, 3).filter(({ recipe: r }) => matchRecipe(r, bar).can) : [];
  return (
    <div
      onClick={onToggle}
      style={{
        background: isExpanded ? "#221E18" : "#242424",
        border: `1px solid ${isExpanded ? "#B8956A44" : "#333"}`,
        borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s ease",
      }}
    >
      <div style={{ padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>{recipe.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#F5F0EB" }}>{recipe.name}</div>
          <div style={{ fontSize: 12, color: "#7A6B5B", fontFamily: "system-ui, sans-serif", marginTop: 2 }}>
            {recipe.glass} · {recipe.technique}
            {substitutes.length > 0 && (
              <span style={{ color: "#B8956A" }}> · {substitutes.length} sub{substitutes.length > 1 ? "s" : ""}</span>
            )}
          </div>
        </div>
        <div style={{ color: isExpanded ? "#B8956A" : "#555", fontSize: 18, transition: "transform 0.2s", transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)" }}>+</div>
      </div>

      {isExpanded && (
        <div style={{ padding: "0 14px 16px", fontFamily: "system-ui, sans-serif" }} onClick={(e) => e.stopPropagation()}>
          {/* Ingredients */}
          <div style={{ background: "#1A1A1A", border: "1px solid #333", borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6 }}>Ingredients</div>
            {recipe.ingredients.map((line, i) => {
              const sub = substitutes.find((s) => s.need === line.id);
              const ing = INGREDIENTS[line.id];
              return (
                <div key={i} style={{ fontSize: 13, color: line.optional ? "#6B5D4F" : "#D5CBC0", marginBottom: 2, display: "flex", gap: 10, alignItems: "baseline" }}>
                  <span style={{ minWidth: 80, color: "#8A7B6B" }}>{line.qty}</span>
                  <span>
                    {ing?.label ?? line.id}
                    {line.optional && <span style={{ color: "#6B5D4F", fontStyle: "italic" }}> (optional)</span>}
                    {sub && (
                      <span style={{ color: "#B8956A", marginLeft: 6, fontStyle: "italic" }}>
                        → using {INGREDIENTS[sub.have]?.label}
                      </span>
                    )}
                    {line.note && <span style={{ color: "#6B5D4F", marginLeft: 6 }}>({line.note})</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Method + garnish */}
          <div style={{ background: "#1A1A1A", border: "1px solid #333", borderRadius: 8, padding: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6 }}>Method</div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: "#C5B8A8" }}>
              {recipe.technique === "stir" && "Stir with ice ~30 seconds until properly chilled and diluted. Strain."}
              {recipe.technique === "shake" && "Shake hard with ice 10-12 seconds. Strain."}
              {recipe.technique === "dry-shake-then-shake" && "Dry-shake (no ice) to build foam, 10 sec. Add ice, shake another 10 sec. Strain."}
              {recipe.technique === "build" && "Build directly in the serving glass over ice. Stir briefly."}
              {recipe.technique === "build-and-stir" && "Build in the glass, stir until chilled."}
              {recipe.technique === "build-and-swizzle" && "Build in the glass with crushed ice. Swizzle (spin a bar spoon between palms) to mix."}
              {recipe.technique === "muddle-and-swizzle" && "Muddle the herb gently with syrup. Add spirit and crushed ice, swizzle to mix."}
              {recipe.technique === "shake-then-top" && "Shake the base ingredients with ice, strain into glass, top with the bubbly/soda."}
              {recipe.notes && (
                <div style={{ marginTop: 8, color: "#8A7B6B", fontStyle: "italic", fontSize: 12 }}>{recipe.notes}</div>
              )}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#8A7B6B" }}>
              Garnish: {recipe.garnish}
            </div>
          </div>

          {/* Flavor radar */}
          <div style={{ background: "#1A1A1A", border: "1px solid #333", borderRadius: 8, padding: 12, marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <RadarChart profile={recipe.flavor} size={150} max={5} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6 }}>Profile</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {(recipe.tags ?? []).filter(isValidTag).map((t) => (
                  <span key={t} style={{
                    background: "#2A2418", border: "1px solid #3D3020",
                    color: "#B8956A", padding: "2px 8px", borderRadius: 10,
                    fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Similar drinks you can also make */}
          {similar.length > 0 && (
            <div style={{ background: "#1A1A1A", border: "1px solid #333", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6 }}>In the neighborhood</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {similar.map(({ recipe: r }) => (
                  <span key={r.name} style={{
                    background: "#2A2418", border: "1px solid #3D3020",
                    color: "#E8D5A0", padding: "4px 10px", borderRadius: 20,
                    fontSize: 12,
                  }}>{r.emoji} {r.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
