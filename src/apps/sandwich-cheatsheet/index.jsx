import { useState } from "react";
import { BUILD_CATEGORIES, INGREDIENTS, getIngredient } from "./ingredients.js";
import { getGreyedOut, findClashReason, getFlavorProfile, suggestNext } from "./scoring.js";
import "./canonical.js"; // side-effect: validates canonical sandwiches at load
import RadarChart from "./RadarChart.jsx";

/* ─── DATA: PRESET SANDWICHES ─── */
const SANDWICHES = [
  { name: "Pizza Sub", vibe: "Classic Italian", emoji: "🍕", base: "Roll", cheese: "Raclette", sauce: "Marinara", mustard: null, toppings: ["Pepperoni", "Lil Mama's Peppers"], achar: null, method: "Layer pepperoni under cheese. Air fry 375°F, 3-4 min. Add peppers after.", tip: "Garlic butter the top bun. Shake oregano + parm over the melted cheese right out of the air fryer.", color: "#C41E3A", bg: "#FFF5F5" },
  { name: "BBQ Crunch Melt", vibe: "Sweet & Smoky", emoji: "🔥", base: "Roll", cheese: "Red Dragon", sauce: "Kinder's Roasted Garlic BBQ", mustard: "Chipotle Cerveza (thin spread, top bun)", toppings: ["French Fried Onions", "Lil Mama's Peppers"], achar: "Green Chili (swap for peppers)", method: "Warm chicken IN the sauce first. Pile on roll, cheese on top. Air fry 375°F, 3-4 min. Crunchies after.", tip: "Let the BBQ lead. Mustard is backup, not co-pilot.", color: "#8B4513", bg: "#FDF6EE" },
  { name: "French Onion Sub", vibe: "Deep & Savory", emoji: "🧅", base: "Roll", cheese: "Comté", sauce: null, mustard: "Stout Beer", toppings: ["French Fried Onions"], achar: null, method: "Chicken + Comté on roll. Air fry 375°F, 3-4 min. Pile onions after. Stout mustard on top bun.", tip: "Full send: warm beef broth for dipping on the side.", color: "#5C4033", bg: "#FAF5F0" },
  { name: "Bistro Melt", vibe: "French Café", emoji: "🫕", base: "Roll", cheese: "Raclette or Comté", sauce: null, mustard: "Hefeweizen Lemon & Garlic", toppings: ["Capers", "Dill Pickles"], achar: null, method: "Chicken + cheese on roll. Air fry 375°F, 3-4 min. Mustard on top bun. Capers + pickles after.", tip: "Capers + lemon garlic mustard is the whole move. Don't skip either.", color: "#1B4D3E", bg: "#F0F7F4" },
  { name: "Hot Honey Melt", vibe: "Sweet Heat", emoji: "🍯", base: "Roll", cheese: "Raclette", sauce: "Hot Honey", mustard: null, toppings: ["Dill Pickles", "Pickled Jalapeños"], achar: null, method: "Warm the hot honey briefly, toss chicken to coat. Pile on roll with cheese. Air fry 375°F, 3-4 min. Pickles after.", tip: "Pickles are mandatory — the acid cuts the sweetness. No pickles, no sandwich.", color: "#D4A017", bg: "#FFFBF0" },
  { name: "Mango Achar Melt", vibe: "Funky & Bold", emoji: "🥭", base: "Roll", cheese: "Comté or Raclette", sauce: "Hot Mango Achar (thin spread on roll)", mustard: null, toppings: ["Capers"], achar: "Hot Mango", method: "Thin smear of achar on bottom bun. Chicken + cheese. Air fry 375°F, 3-4 min. Capers on top.", tip: "A little goes a long way. This is the one that makes people ask what you did.", color: "#E07C24", bg: "#FFF8F0" },
  { name: "Sriracha Mayo Melt", vibe: "Creamy Spice", emoji: "🌶️", base: "Roll", cheese: "Red Dragon or Comté", sauce: "Sriracha + Mayo (mixed)", mustard: null, toppings: ["Pickled Jalapeños", "Dill Pickles"], achar: null, method: "Chicken + cheese on roll. Air fry 375°F, 3-4 min. Sriracha mayo + toppings after.", tip: "Start with a little sriracha, taste, add more. Build up to where you want it.", color: "#CC2936", bg: "#FFF5F3" },
  { name: "Fig Jam Special", vibe: "$19 Café Sandwich", emoji: "✨", base: "Roll", cheese: "Red Dragon or Comté", sauce: "Fig Jam (spread on roll)", mustard: null, toppings: ["Lil Mama's Peppers"], achar: null, method: "Fig jam on bottom bun. Chicken + cheese. Air fry 375°F, 3-4 min. Peppers on top.", tip: "Sweet jam + sharp cheese + hot peppers = the holy trinity. Keep it simple.", color: "#6B2D5B", bg: "#F9F3F8" },
  { name: "Breakfast Melt", vibe: "Morning Hero", emoji: "🍳", base: "English Muffin", cheese: "Comté or Raclette", sauce: "Red Hot or Mango Achar", mustard: null, toppings: ["Fried Egg"], achar: "Hot Mango (thin smear, optional)", method: "Fry egg. Toast muffin. Chicken + cheese on muffin, air fry until melted. Stack egg on top.", tip: "Runny yolk IS the sauce. The achar version is the sleeper best thing on the whole list.", color: "#E8A317", bg: "#FFFCF0" },
  { name: "Mini Pizza Muffin", vibe: "Snack Attack", emoji: "🧁", base: "English Muffin", cheese: "Raclette", sauce: "Marinara", mustard: null, toppings: ["Pepperoni", "Pickled Jalapeños"], achar: null, method: "Open-faced. Marinara, chicken, pepperoni, cheese. Air fry 375°F, 3-4 min.", tip: "These are dangerous. You'll eat four before you realize it.", color: "#C41E3A", bg: "#FFF5F5" },
  { name: "Buffalo Ranch", vibe: "The Fallback", emoji: "🦬", base: "Roll or Muffin", cheese: "Any", sauce: "Red Hot + Butter (melted together)", mustard: null, toppings: ["Ranch", "Dill Pickles"], achar: null, method: "Melt butter, stir in red hot. Toss chicken. Pile on roll + cheese. Air fry. Ranch + pickles after.", tip: "You already know this one. It never misses.", color: "#E85D26", bg: "#FFF6F0" },
  { name: "Galbi Cheesesteak", vibe: "Korean-American", emoji: "🥩", base: "Brioche Bun", cheese: "Provolone or Pepper Jack", sauce: "Sriracha Mayo (gochujang mayo is even better)", mustard: null, toppings: ["Shaved Steak", "Pickled Red Onion", "Lettuce"], achar: null, method: "Marinate shaved steak in soy + brown sugar + garlic + sesame + grated pear (or buy pre-marinated galbi). Sear hot, fast. Pile on brioche with cheese, broil briefly to melt. Sriracha mayo + pickled onion + lettuce after.", tip: "The pear in the marinade is the tenderizing secret. Don't skip it.", color: "#8B3A3A", bg: "#FDF5F5" },
];

const PANTRY = {
  "Cheeses — Aged & Sharp": ["Beecher's Aged", "Dubliner / Kerrygold Reserve", "Extra Sharp Cheddar", "Aged Gouda", "Manchego", "Parmigiano"],
  "Cheeses — Alpine & Nutty": ["Comté 18-Month", "Gruyère"],
  "Cheeses — Classic Melters": ["Raclette", "Low-moisture Mozzarella", "Provolone", "Havarti", "Monterey Jack"],
  "Cheeses — Mild & Sweet": ["Honey Gouda", "Standard Gouda", "Brie"],
  "Cheeses — Flavored & Specialty": ["Red Dragon (ale + mustard seed)", "Pepper Jack", "Goat Cheese", "Gorgonzola", "Feta"],
  "Breads & Bases": ["Sandwich Rolls", "English Muffins", "Sliced Sandwich Bread", "Sourdough", "Ciabatta", "Brioche Buns", "Pretzel Rolls", "Baguette", "Croissants"],
  "Sauces": ["Kinder's Roasted Garlic BBQ", "Marinara", "Hot Honey (e.g. Mike's)", "Red Hot", "Sriracha", "Ranch", "Mayo", "Aioli (garlic mayo)", "Pesto (basil)", "Garlic Butter (butter + garlic + parsley)", "Ketchup", "Yellow Mustard"],
  "Fresh Veg & Greens": ["Tomato", "Arugula", "Lettuce", "Avocado", "Roasted Red Pepper", "Pickled Red Onion"],
  "MarketSpice Mustards": ["Chipotle Cerveza", "Hefeweizen Lemon & Garlic", "Stout Beer"],
  "Achars & Spreads": ["Hot Mango Achar", "Green Chili Achar", "Fig Jam (buy this!)", "Wildflower Honey"],
  "Toppings": ["Lil Mama's Peppers", "French Fried Onions", "Dill Pickles", "Pickled Jalapeños", "Capers"],
  "Meats (pick one headliner)": ["Rotisserie Chicken", "Deli Turkey", "Shaved Steak", "Bacon", "Pepperoni", "Prosciutto", "Pastrami"],
  "Protein (other)": ["Eggs"],
};

const RULES = [
  { label: "ALWAYS", text: "Warm hot meat (chicken, turkey, pastrami, steak) in the sauce first — don't pile cold" },
  { label: "ALWAYS", text: "Add crunchy toppings AFTER air frying — they'll blow around" },
  { label: "ALWAYS", text: "Air fry at 375°F, 3-4 min — watch the cheese, pull when bubbly" },
  { label: "PAIR", text: "Mango Achar → cheese-forward subs (Comté, Raclette)" },
  { label: "PAIR", text: "Green Chili Achar → saucy builds (BBQ, marinara)" },
  { label: "PAIR", text: "Chipotle Cerveza → BBQ builds" },
  { label: "PAIR", text: "Lemon & Garlic → Beecher's, Comté, lighter builds" },
  { label: "PAIR", text: "Stout Beer → French onion, Dubliner, pastrami" },
  { label: "PAIR", text: "Prosciutto → fig jam, pesto, arugula, brie" },
  { label: "PAIR", text: "Shaved Steak → provolone, pepper jack, french onions, sriracha mayo" },
  { label: "NEVER", text: "Capers on BBQ builds — they clash with sweetness" },
  { label: "NEVER", text: "Drown Beecher's or Dubliner in heavy sauce — let the cheese star" },
  { label: "NEVER", text: "Two headliner meats on one sandwich (chicken + pastrami, etc.)" },
];

/* ─── SHARED COMPONENTS ─── */
function InfoBlock({ label, value, color }) {
  return (
    <div style={{ background: color + "08", borderRadius: 6, padding: "8px 10px" }}>
      <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 2, fontFamily: "system-ui, sans-serif" }}>{label}</div>
      <div style={{ fontSize: 12, color: "#3A2E24", fontWeight: 500, lineHeight: 1.3, fontFamily: "system-ui, sans-serif" }}>{value}</div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function SandwichCheatSheet() {
  const [view, setView] = useState("sandwiches");
  const [expanded, setExpanded] = useState(null);
  const [selections, setSelections] = useState({
    base: null, cheese: [], sauce: [], mustard: null, topping: [],
  });

  const greyedOut = getGreyedOut(selections);

  const handleSelect = (catId, itemId, multi) => {
    setSelections((prev) => {
      if (multi) {
        const arr = prev[catId] || [];
        return { ...prev, [catId]: arr.includes(itemId) ? arr.filter((x) => x !== itemId) : [...arr, itemId] };
      }
      return { ...prev, [catId]: prev[catId] === itemId ? null : itemId };
    });
  };

  const resetBuild = () => setSelections({ base: null, cheese: [], sauce: [], mustard: null, topping: [] });

  const hasSelections =
    selections.base ||
    (selections.cheese && selections.cheese.length > 0) ||
    (selections.sauce && selections.sauce.length > 0) ||
    (typeof selections.mustard === "string" && !selections.mustard.startsWith("no_")) ||
    (selections.topping && selections.topping.length > 0);

  // Build summary chips
  const getSummaryParts = () => {
    const parts = [];
    BUILD_CATEGORIES.forEach((cat) => {
      const val = selections[cat.id];
      if (!val || (Array.isArray(val) && val.length === 0)) return;
      const values = Array.isArray(val) ? val : [val];
      values.forEach((v) => {
        if (typeof v !== "string" || v.startsWith("no_")) return;
        const item = cat.items.find((i) => i.id === v);
        if (item) parts.push(item.label);
      });
    });
    return parts;
  };

  const TABS = [
    { id: "sandwiches", label: "Builds" },
    { id: "build", label: "Create" },
    { id: "pantry", label: "Pantry" },
    { id: "rules", label: "Rules" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#1A1A1A", fontFamily: "'Georgia', serif", color: "#F5F0EB", paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #2C1810 0%, #1A1A1A 100%)", padding: "32px 20px 24px", borderBottom: "2px solid #3D2B1F" }}>
        <div style={{ fontSize: 12, letterSpacing: 4, textTransform: "uppercase", color: "#B8956A", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>The Definitive Guide</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>Sandwich<br />Cheat Sheet</h1>
        <div style={{ fontSize: 14, color: "#8A7B6B", marginTop: 8, fontStyle: "italic" }}>"What goes with what"</div>
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

        {/* ═══ SANDWICHES TAB ═══ */}
        {view === "sandwiches" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SANDWICHES.map((s, i) => {
              const isOpen = expanded === i;
              return (
                <div key={i} onClick={() => setExpanded(isOpen ? null : i)} style={{
                  background: isOpen ? s.bg : "#242424", border: `1px solid ${isOpen ? s.color + "44" : "#333"}`,
                  borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.25s ease",
                }}>
                  <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 28, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: isOpen ? s.color + "18" : "#2A2A2A", flexShrink: 0 }}>{s.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: isOpen ? s.color : "#F5F0EB", lineHeight: 1.2 }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: isOpen ? "#5A4A3A" : "#7A6B5B", marginTop: 2, fontFamily: "system-ui, sans-serif" }}>{s.vibe} · {s.base} · {s.cheese}</div>
                    </div>
                    <div style={{ color: isOpen ? s.color : "#555", fontSize: 20, fontWeight: 300, transition: "transform 0.2s", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}>+</div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: "0 16px 18px", color: "#3A2E24" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                        <InfoBlock label="Cheese" value={s.cheese} color={s.color} />
                        <InfoBlock label="Base" value={s.base} color={s.color} />
                        {s.sauce && <InfoBlock label="Sauce" value={s.sauce} color={s.color} />}
                        {s.mustard && <InfoBlock label="Mustard" value={s.mustard} color={s.color} />}
                      </div>
                      {s.toppings && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>Toppings</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {s.toppings.map((t, j) => (
                              <span key={j} style={{ background: s.color + "15", border: `1px solid ${s.color}33`, color: s.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, fontFamily: "system-ui, sans-serif" }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {s.achar && (
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>Achar Option</div>
                          <div style={{ fontSize: 13, color: "#5A4A3A", fontFamily: "system-ui, sans-serif" }}>{s.achar}</div>
                        </div>
                      )}
                      <div style={{ background: s.color + "0C", border: `1px solid ${s.color}22`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>Method</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6, color: "#3A2E24", fontFamily: "system-ui, sans-serif" }}>{s.method}</div>
                      </div>
                      <div style={{ background: "#FFF9E6", border: "1px solid #E8D5A0", borderRadius: 8, padding: 12 }}>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#A08B5B", marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>Pro Tip</div>
                        <div style={{ fontSize: 13, lineHeight: 1.5, color: "#5A4A2A", fontStyle: "italic", fontFamily: "system-ui, sans-serif" }}>{s.tip}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ BUILD YOUR OWN TAB ═══ */}
        {view === "build" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#B8956A", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>
                Build Your Own
              </div>
              {hasSelections && (
                <button onClick={resetBuild} style={{
                  background: "transparent", border: "1px solid #444", color: "#8A7B6B",
                  padding: "6px 14px", borderRadius: 20, fontSize: 11, cursor: "pointer",
                  fontFamily: "system-ui, sans-serif", letterSpacing: 0.5,
                }}>Reset</button>
              )}
            </div>

            {BUILD_CATEGORIES.map((cat) => {
              const renderItemButton = (item) => {
                const clashKey = `${cat.id}:${item.id}`;
                const isClash = greyedOut.has(clashKey);
                const isSelected = cat.multi
                  ? (selections[cat.id] || []).includes(item.id)
                  : selections[cat.id] === item.id;
                const reason = isClash ? findClashReason(cat.id, item.id, selections) : null;
                return (
                  <button
                    key={item.id}
                    onClick={() => !isClash && handleSelect(cat.id, item.id, cat.multi)}
                    title={reason || undefined}
                    style={{
                      padding: "10px 16px",
                      borderRadius: 10,
                      border: isSelected
                        ? "2px solid #B8956A"
                        : isClash
                          ? "1px solid #2A2A2A"
                          : "1px solid #3A3A3A",
                      background: isSelected
                        ? "#B8956A22"
                        : isClash
                          ? "#1E1E1E"
                          : "#242424",
                      color: isSelected
                        ? "#E8D5A0"
                        : isClash
                          ? "#444"
                          : "#C5B8A8",
                      fontSize: 13,
                      cursor: isClash ? "not-allowed" : "pointer",
                      fontFamily: "system-ui, sans-serif",
                      transition: "all 0.15s ease",
                      textDecoration: isClash ? "line-through" : "none",
                      position: "relative",
                      opacity: isClash ? 0.5 : 1,
                    }}
                  >
                    {isSelected && <span style={{ marginRight: 4 }}>✓</span>}
                    {item.label}
                  </button>
                );
              };

              const hasGroups = cat.items.some((i) => i.group);
              let itemsContent;
              if (hasGroups) {
                const groupMap = new Map();
                cat.items.forEach((item) => {
                  const g = item.group || "";
                  if (!groupMap.has(g)) groupMap.set(g, []);
                  groupMap.get(g).push(item);
                });
                itemsContent = (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[...groupMap.entries()].map(([groupName, items]) => (
                      <div key={groupName}>
                        <div style={{
                          fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
                          color: "#6B5D4F", marginBottom: 6, fontFamily: "system-ui, sans-serif", fontWeight: 500,
                        }}>
                          {groupName}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {items.map(renderItemButton)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } else {
                itemsContent = (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {cat.items.map(renderItemButton)}
                  </div>
                );
              }

              return (
                <div key={cat.id}>
                  <div style={{
                    fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#B8956A",
                    marginBottom: 10, fontFamily: "system-ui, sans-serif", fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    {cat.label}
                    {cat.multi && <span style={{ fontSize: 9, color: "#6B5D4F", letterSpacing: 0.5, textTransform: "none", fontWeight: 400 }}>(mix ok)</span>}
                  </div>
                  {itemsContent}
                </div>
              );
            })}

            {/* Build Summary + Radar + Method */}
            {hasSelections && (
              <div style={{
                background: "#2A2418",
                border: "1px solid #3D3020",
                borderRadius: 12,
                padding: 16,
                marginTop: 4,
              }}>
                <div style={{
                  fontSize: 10, letterSpacing: 2, textTransform: "uppercase",
                  color: "#B8956A", marginBottom: 10, fontFamily: "system-ui, sans-serif", fontWeight: 600,
                }}>Your Sandwich</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {getSummaryParts().map((p, i) => (
                    <span key={i} style={{
                      background: "#B8956A18", border: "1px solid #B8956A33",
                      color: "#E8D5A0", padding: "5px 12px", borderRadius: 20,
                      fontSize: 12, fontFamily: "system-ui, sans-serif",
                    }}>{p}</span>
                  ))}
                </div>

                {/* Flavor Radar */}
                <div style={{
                  background: "#1A1A1A", borderRadius: 8, padding: 12, marginBottom: 10,
                  border: "1px solid #333", display: "flex", alignItems: "center", gap: 12,
                }}>
                  <RadarChart profile={getFlavorProfile(selections)} size={170} max={10} />
                  <div style={{ flex: 1, fontFamily: "system-ui, sans-serif" }}>
                    <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6 }}>Flavor Profile</div>
                    <div style={{ fontSize: 12, color: "#8A7B6B", lineHeight: 1.5 }}>
                      Each axis is how intense that flavor is in your sandwich (0–10).
                      Balanced builds hit a few axes moderately. One axis pegged ≥ 10 = overloaded.
                    </div>
                  </div>
                </div>

                {/* Suggest next */}
                {getSummaryParts().length >= 2 && (() => {
                  const suggestions = suggestNext(selections, 3);
                  if (suggestions.length === 0) return null;
                  return (
                    <div style={{
                      background: "#1A1A1A", borderRadius: 8, padding: 12, marginBottom: 10,
                      border: "1px solid #333",
                    }}>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Goes well with</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {suggestions.map((s) => {
                          const ing = getIngredient(s.id);
                          return (
                            <button
                              key={s.id}
                              onClick={() => handleSelect(s.cat, s.id, s.cat !== "base" && s.cat !== "mustard")}
                              style={{
                                background: "#B8956A18", border: "1px dashed #B8956A66",
                                color: "#E8D5A0", padding: "5px 12px", borderRadius: 20,
                                fontSize: 12, fontFamily: "system-ui, sans-serif", cursor: "pointer",
                              }}
                            >
                              + {s.label}
                              <span style={{ color: "#8A7B6B", marginLeft: 4, fontSize: 10 }}>({ing?.cat})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Method */}
                <div style={{
                  background: "#1A1A1A", borderRadius: 8, padding: 12,
                  border: "1px solid #333",
                }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>Method</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: "#C5B8A8", fontFamily: "system-ui, sans-serif" }}>
                    {(() => {
                      const HOT_MEAT_IDS = ["chicken", "turkey", "pastrami", "shaved_steak"];
                      const WARM_SAUCES = ["bbq", "marinara", "buffalo", "hot_honey"];
                      const topping = selections.topping || [];
                      const sauces = selections.sauce || [];
                      const hotMeat = topping.find((t) => HOT_MEAT_IDS.includes(t));
                      const hotMeatLabel = hotMeat && INGREDIENTS[hotMeat]?.label.toLowerCase();
                      const hasWarmSauce = sauces.some((s) => WARM_SAUCES.includes(s));
                      const hasGarlicButter = sauces.includes("garlic_butter");
                      const baseLabel = (INGREDIENTS[selections.base]?.label ?? "bread").toLowerCase();
                      const hasCheese = (selections.cheese || []).length > 0;
                      const coldToppings = topping.filter((t) => !HOT_MEAT_IDS.includes(t) && t !== "pepperoni");
                      const hasColdToppings = coldToppings.length > 0;
                      const mustardId = selections.mustard;
                      const hasMustard = typeof mustardId === "string" && !mustardId.startsWith("no_");
                      return (
                        <>
                          {hasGarlicButter ? `Brush garlic butter on the ${baseLabel}, toast until golden. ` : ""}
                          {hotMeat && hasWarmSauce ? `Warm ${hotMeatLabel} in the sauce. ` : ""}
                          {hasGarlicButter ? "Build inside the toasted bread" : `Pile on ${baseLabel}`}
                          {hasCheese ? ", add cheese" : ""}
                          . Air fry 375°F, 3–4 min until bubbly.
                          {hasColdToppings ? " Add cold/crunchy toppings after." : ""}
                          {hasMustard ? " Mustard on the top bun." : ""}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {!hasSelections && (
              <div style={{
                textAlign: "center", padding: "32px 16px",
                color: "#4A3F34", fontSize: 14, fontStyle: "italic",
              }}>
                Tap to build. Clashing combos will grey out as you go.
              </div>
            )}
          </div>
        )}

        {/* ═══ PANTRY TAB ═══ */}
        {view === "pantry" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {Object.entries(PANTRY).map(([category, items]) => (
              <div key={category}>
                <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#B8956A", marginBottom: 10, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>{category}</div>
                <div style={{ background: "#242424", borderRadius: 12, border: "1px solid #333", overflow: "hidden" }}>
                  {items.map((item, j) => (
                    <div key={j} style={{ padding: "12px 16px", borderBottom: j < items.length - 1 ? "1px solid #2E2E2E" : "none", fontSize: 14, color: "#D5CBC0", fontFamily: "system-ui, sans-serif" }}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ background: "#2A2418", border: "1px solid #3D3020", borderRadius: 12, padding: 16, marginTop: 4 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#B8956A", marginBottom: 6, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>Also in the kitchen</div>
              <div style={{ fontSize: 13, color: "#8A7B6B", lineHeight: 1.7, fontFamily: "system-ui, sans-serif" }}>
                Sriracha · Mayo · Ketchup · Yellow Mustard · Butter · Garlic · Spices & staples · Wildflower Honey · French Fried Onions · Dill Pickles · Pickled Jalapeños · Capers
              </div>
            </div>
          </div>
        )}

        {/* ═══ RULES TAB ═══ */}
        {view === "rules" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 11, letterSpacing: 2.5, textTransform: "uppercase", color: "#B8956A", marginBottom: 4, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>Golden Rules</div>
            {RULES.map((rule, i) => (
              <div key={i} style={{ background: "#242424", border: "1px solid #333", borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 1, padding: "3px 8px", borderRadius: 4,
                  flexShrink: 0, marginTop: 2, fontFamily: "system-ui, sans-serif",
                  background: rule.label === "ALWAYS" ? "#1B4D3E22" : rule.label === "PAIR" ? "#B8956A22" : "#C41E3A22",
                  color: rule.label === "ALWAYS" ? "#4A9B7F" : rule.label === "PAIR" ? "#B8956A" : "#E05555",
                  border: `1px solid ${rule.label === "ALWAYS" ? "#4A9B7F33" : rule.label === "PAIR" ? "#B8956A33" : "#E0555533"}`,
                }}>{rule.label}</span>
                <span style={{ fontSize: 13, color: "#C5B8A8", lineHeight: 1.5, fontFamily: "system-ui, sans-serif" }}>{rule.text}</span>
              </div>
            ))}

            <div style={{ background: "#2A2418", border: "1px solid #3D3020", borderRadius: 12, padding: 16, marginTop: 8 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#B8956A", marginBottom: 10, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>Mustard Cheat Sheet</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { m: "Chipotle Cerveza", p: "BBQ sandwiches" },
                  { m: "Lemon & Garlic", p: "Beecher's, Comté, lighter builds" },
                  { m: "Stout Beer", p: "French onion, Dubliner, pastrami" },
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
                    <span style={{ color: "#D5CBC0", fontWeight: 600, minWidth: 110 }}>{x.m}</span>
                    <span style={{ color: "#6B5D4F" }}>→</span>
                    <span style={{ color: "#8A7B6B" }}>{x.p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "#2A2418", border: "1px solid #3D3020", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#B8956A", marginBottom: 10, fontFamily: "system-ui, sans-serif", fontWeight: 600 }}>Achar Cheat Sheet</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { a: "Hot Mango", p: "Cheese-forward (Comté, Raclette)" },
                  { a: "Green Chili", p: "Saucy builds (BBQ, marinara)" },
                ].map((x, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontFamily: "system-ui, sans-serif" }}>
                    <span style={{ color: "#D5CBC0", fontWeight: 600, minWidth: 110 }}>{x.a}</span>
                    <span style={{ color: "#6B5D4F" }}>→</span>
                    <span style={{ color: "#8A7B6B" }}>{x.p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: "center", padding: "24px 0", color: "#4A3F34", fontSize: 14, fontStyle: "italic" }}>
              Now go get that second chicken.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
