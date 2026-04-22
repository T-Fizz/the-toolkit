import { useState } from "react";

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
];

const PANTRY = {
  "Cheeses — Aged & Sharp": ["Beecher's Aged", "Dubliner / Kerrygold Reserve", "Extra Sharp Cheddar", "Aged Gouda", "Manchego", "Parmigiano"],
  "Cheeses — Alpine & Nutty": ["Comté 18-Month", "Gruyère"],
  "Cheeses — Classic Melters": ["Raclette", "Low-moisture Mozzarella", "Provolone", "Havarti", "Monterey Jack"],
  "Cheeses — Mild & Sweet": ["Honey Gouda", "Standard Gouda", "Brie"],
  "Cheeses — Flavored & Specialty": ["Red Dragon (ale + mustard seed)", "Pepper Jack", "Goat Cheese", "Gorgonzola", "Feta"],
  "Breads & Bases": ["Sandwich Rolls", "English Muffins", "Sliced Sandwich Bread", "Sourdough", "Ciabatta", "Brioche Buns", "Pretzel Rolls", "Baguette", "Croissants"],
  "Sauces": ["Kinder's Roasted Garlic BBQ", "Marinara", "Hot Honey (e.g. Mike's)", "Red Hot", "Sriracha", "Ranch", "Mayo", "Aioli (garlic mayo)", "Pesto (basil)", "Ketchup", "Yellow Mustard"],
  "Fresh Veg & Greens": ["Tomato", "Arugula", "Lettuce", "Avocado", "Roasted Red Pepper", "Pickled Red Onion"],
  "MarketSpice Mustards": ["Chipotle Cerveza", "Hefeweizen Lemon & Garlic", "Stout Beer"],
  "Achars & Spreads": ["Hot Mango Achar", "Green Chili Achar", "Fig Jam (buy this!)", "Wildflower Honey"],
  "Toppings": ["Lil Mama's Peppers", "French Fried Onions", "Dill Pickles", "Pickled Jalapeños", "Capers"],
  "Meats (pick one headliner)": ["Rotisserie Chicken", "Deli Turkey", "Bacon", "Pepperoni", "Prosciutto", "Pastrami"],
  "Protein (other)": ["Eggs"],
};

const RULES = [
  { label: "ALWAYS", text: "Warm hot meat (chicken, turkey, pastrami) in the sauce first — don't pile cold" },
  { label: "ALWAYS", text: "Add crunchy toppings AFTER air frying — they'll blow around" },
  { label: "ALWAYS", text: "Air fry at 375°F, 3-4 min — watch the cheese, pull when bubbly" },
  { label: "PAIR", text: "Mango Achar → cheese-forward subs (Comté, Raclette)" },
  { label: "PAIR", text: "Green Chili Achar → saucy builds (BBQ, marinara)" },
  { label: "PAIR", text: "Chipotle Cerveza → BBQ builds" },
  { label: "PAIR", text: "Lemon & Garlic → Beecher's, Comté, lighter builds" },
  { label: "PAIR", text: "Stout Beer → French onion, Dubliner, pastrami" },
  { label: "PAIR", text: "Prosciutto → fig jam, pesto, arugula, brie" },
  { label: "NEVER", text: "Capers on BBQ builds — they clash with sweetness" },
  { label: "NEVER", text: "Drown Beecher's or Dubliner in heavy sauce — let the cheese star" },
  { label: "NEVER", text: "Two headliner meats on one sandwich (chicken + pastrami, etc.)" },
];

/* ─── BUILD YOUR OWN: OPTIONS + CLASH SYSTEM ─── */
const BUILD_CATEGORIES = [
  {
    id: "base",
    label: "Base",
    multi: false,
    items: [
      { id: "roll", label: "Sandwich Roll" },
      { id: "sandwich_bread", label: "Sandwich Bread" },
      { id: "sourdough", label: "Sourdough" },
      { id: "ciabatta", label: "Ciabatta" },
      { id: "brioche_bun", label: "Brioche Bun" },
      { id: "pretzel_roll", label: "Pretzel Roll" },
      { id: "baguette", label: "Baguette" },
      { id: "croissant", label: "Croissant" },
      { id: "muffin", label: "English Muffin" },
    ],
  },
  {
    id: "cheese",
    label: "Cheese",
    multi: true,
    items: [
      // Aged & Sharp
      { id: "beechers", label: "Beecher's Aged", group: "Aged & Sharp" },
      { id: "dubliner", label: "Dubliner", group: "Aged & Sharp" },
      { id: "sharp_cheddar", label: "Extra Sharp Cheddar", group: "Aged & Sharp" },
      { id: "aged_gouda", label: "Aged Gouda", group: "Aged & Sharp" },
      { id: "manchego", label: "Manchego", group: "Aged & Sharp" },
      { id: "parmigiano", label: "Parmigiano", group: "Aged & Sharp" },
      // Alpine & Nutty
      { id: "comte", label: "Comté", group: "Alpine & Nutty" },
      { id: "gruyere", label: "Gruyère", group: "Alpine & Nutty" },
      // Classic Melters
      { id: "raclette", label: "Raclette", group: "Classic Melters" },
      { id: "mozzarella", label: "Mozzarella", group: "Classic Melters" },
      { id: "provolone", label: "Provolone", group: "Classic Melters" },
      { id: "havarti", label: "Havarti", group: "Classic Melters" },
      { id: "monterey_jack", label: "Monterey Jack", group: "Classic Melters" },
      // Mild & Sweet
      { id: "honey_gouda", label: "Honey Gouda", group: "Mild & Sweet" },
      { id: "std_gouda", label: "Standard Gouda", group: "Mild & Sweet" },
      { id: "brie", label: "Brie", group: "Mild & Sweet" },
      // Flavored & Specialty
      { id: "red_dragon", label: "Red Dragon", group: "Flavored & Specialty" },
      { id: "pepper_jack", label: "Pepper Jack", group: "Flavored & Specialty" },
      { id: "goat_cheese", label: "Goat Cheese", group: "Flavored & Specialty" },
      { id: "gorgonzola", label: "Gorgonzola", group: "Flavored & Specialty" },
      { id: "feta", label: "Feta", group: "Flavored & Specialty" },
    ],
  },
  {
    id: "sauce",
    label: "Sauce / Spread",
    multi: true,
    items: [
      // Leads
      { id: "bbq", label: "Kinder's BBQ", group: "Lead" },
      { id: "marinara", label: "Marinara", group: "Lead" },
      { id: "buffalo", label: "Buffalo (Red Hot + Butter)", group: "Lead" },
      { id: "hot_honey", label: "Hot Honey", group: "Lead" },
      { id: "fig_jam", label: "Fig Jam", group: "Lead" },
      { id: "mango_achar", label: "Hot Mango Achar", group: "Lead" },
      { id: "green_chili_achar", label: "Green Chili Achar", group: "Lead" },
      { id: "pesto", label: "Pesto", group: "Lead" },
      // Creamy
      { id: "mayo", label: "Mayo", group: "Creamy" },
      { id: "aioli", label: "Aioli (garlic mayo)", group: "Creamy" },
      { id: "sriracha_mayo", label: "Sriracha Mayo", group: "Creamy" },
      { id: "ranch", label: "Ranch", group: "Creamy" },
      // None
      { id: "no_sauce", label: "None (let cheese star)", group: "None" },
    ],
  },
  {
    id: "mustard",
    label: "Mustard",
    multi: false,
    items: [
      { id: "chipotle_cerveza", label: "Chipotle Cerveza" },
      { id: "lemon_garlic", label: "Lemon & Garlic" },
      { id: "stout_beer", label: "Stout Beer" },
      { id: "no_mustard", label: "None" },
    ],
  },
  {
    id: "topping",
    label: "Toppings",
    multi: true,
    items: [
      // Fresh Veg & Greens
      { id: "tomato", label: "Tomato Slices", group: "Fresh Veg & Greens" },
      { id: "arugula", label: "Arugula", group: "Fresh Veg & Greens" },
      { id: "lettuce", label: "Lettuce", group: "Fresh Veg & Greens" },
      { id: "avocado", label: "Avocado", group: "Fresh Veg & Greens" },
      { id: "roasted_red_pepper", label: "Roasted Red Pepper", group: "Fresh Veg & Greens" },
      // Pickled & Brined
      { id: "lil_mamas", label: "Lil Mama's Peppers", group: "Pickled & Brined" },
      { id: "pickled_red_onion", label: "Pickled Red Onion", group: "Pickled & Brined" },
      { id: "french_onions", label: "French Fried Onions", group: "Pickled & Brined" },
      { id: "dill_pickles", label: "Dill Pickles", group: "Pickled & Brined" },
      { id: "pickled_japs", label: "Pickled Jalapeños", group: "Pickled & Brined" },
      { id: "capers", label: "Capers", group: "Pickled & Brined" },
      // Meat
      { id: "chicken", label: "Chicken", group: "Meat" },
      { id: "turkey", label: "Turkey", group: "Meat" },
      { id: "bacon", label: "Bacon", group: "Meat" },
      { id: "pepperoni", label: "Pepperoni", group: "Meat" },
      { id: "prosciutto", label: "Prosciutto", group: "Meat" },
      { id: "pastrami", label: "Pastrami", group: "Meat" },
      // Egg
      { id: "egg", label: "Fried Egg", group: "Egg" },
    ],
  },
];

/*
 * CLASHES — food-theory rules (research-backed: Flavor Bible, Food52, Serious Eats,
 * cheese authority guides, Nashville + Korean chicken-sandwich traditions).
 * Each entry: "category:item" → [items it blocks]. Symmetric: A blocks B iff B blocks A.
 *
 * Principles:
 *  1. One lead sauce per sandwich (leads block leads).
 *  2. Creamy binders block each other; each pairs only with leads whose profile matches.
 *  3. Aged/strong cheeses don't get drowned in heavy wet sauces.
 *  4. Pre-sweet cheese (honey gouda) doesn't stack with sweet/sweet-smoky sauces (incl. BBQ).
 *  5. Pepperoni → marinara/BBQ country only.
 *  6. Capers need clean/bright backdrops.
 *  7. Fried egg on breakfast-compatible bases only (blocks ciabatta/baguette/pretzel).
 *  8. Each mustard has a flavor lane (chipotle=BBQ/achar, lemon garlic=bright, stout=dark savory).
 *  9. Selecting "None" blocks every real option in that category.
 * 10. Pesto = Italian herb lead — mozz/goat cheese/tomato/arugula; fights BBQ/aged-British/Asian.
 * 11. Aioli = garlic-mayo Mediterranean lane — blocks other creamies and bold American leads.
 * 12. Bread structure: open-crumb (ciabatta) and crispy-shell (baguette) can't hold wet hot sauce.
 * 13. Cuisine coherence: feta rejects American/Asian sauces; parmigiano rejects non-Italian.
 */
const CLASHES = {
  // ── BASE ──
  "base:roll": [],
  "base:sandwich_bread": ["sauce:buffalo"],
  "base:sourdough": [],
  "base:ciabatta": ["sauce:buffalo", "topping:egg", "topping:pastrami"],
  "base:brioche_bun": ["sauce:buffalo", "topping:capers"],
  "base:pretzel_roll": ["sauce:marinara", "sauce:pesto", "topping:egg"],
  "base:baguette": ["sauce:bbq", "sauce:buffalo", "sauce:marinara", "topping:egg"],
  "base:croissant": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:green_chili_achar", "sauce:pesto",
    "topping:pepperoni", "topping:capers", "topping:pastrami",
  ],
  "base:muffin": [],

  // ── CHEESE ──
  "cheese:beechers": ["sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:green_chili_achar", "sauce:pesto"],
  "cheese:dubliner": ["sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:green_chili_achar", "sauce:pesto"],
  "cheese:sharp_cheddar": ["sauce:pesto"],
  "cheese:aged_gouda": ["sauce:marinara", "sauce:buffalo", "sauce:green_chili_achar", "sauce:pesto"],
  "cheese:manchego": ["sauce:bbq", "sauce:buffalo", "sauce:green_chili_achar"],
  "cheese:parmigiano": [
    "sauce:bbq", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar",
    "sauce:sriracha_mayo", "sauce:ranch",
    "topping:avocado",
  ],
  "cheese:comte": [],
  "cheese:gruyere": [],
  "cheese:raclette": [],
  "cheese:mozzarella": ["sauce:bbq", "sauce:buffalo", "topping:pastrami"],
  "cheese:provolone": [],
  "cheese:havarti": [],
  "cheese:monterey_jack": [],
  "cheese:honey_gouda": [
    "sauce:bbq", "sauce:fig_jam", "sauce:hot_honey", "sauce:mango_achar", "sauce:pesto",
    "topping:tomato", "topping:arugula", "topping:roasted_red_pepper",
  ],
  "cheese:std_gouda": [],
  "cheese:brie": ["sauce:bbq", "sauce:buffalo", "sauce:marinara", "sauce:green_chili_achar", "topping:pepperoni"],
  "cheese:red_dragon": ["sauce:pesto"],
  "cheese:pepper_jack": ["sauce:buffalo", "sauce:green_chili_achar"],
  "cheese:goat_cheese": ["sauce:bbq", "sauce:buffalo", "topping:pepperoni"],
  "cheese:gorgonzola": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:green_chili_achar", "sauce:pesto",
    "topping:avocado",
  ],
  "cheese:feta": [                                                                                    // Greek/Mediterranean brined — cuisine coherence
    "sauce:bbq", "sauce:buffalo", "sauce:mango_achar", "sauce:green_chili_achar",
    "sauce:ranch", "sauce:sriracha_mayo",
    "topping:pepperoni", "topping:pastrami",
    "mustard:chipotle_cerveza", "mustard:stout_beer",
  ],

  // ── SAUCES ──
  "sauce:bbq": [
    "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:pesto", "sauce:no_sauce",
    "sauce:aioli",
    "cheese:beechers", "cheese:dubliner", "cheese:aged_gouda", "cheese:manchego", "cheese:parmigiano", "cheese:mozzarella", "cheese:brie", "cheese:goat_cheese", "cheese:gorgonzola", "cheese:honey_gouda", "cheese:feta",
    "topping:capers", "topping:egg", "topping:arugula", "topping:roasted_red_pepper", "topping:prosciutto",
    "mustard:lemon_garlic", "mustard:stout_beer",
    "base:baguette", "base:croissant",
  ],
  "sauce:marinara": [
    "sauce:bbq", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:pesto", "sauce:no_sauce",
    "sauce:sriracha_mayo", "sauce:ranch",
    "cheese:beechers", "cheese:dubliner", "cheese:aged_gouda", "cheese:brie", "cheese:gorgonzola",
    "topping:capers", "topping:french_onions", "topping:egg", "topping:turkey", "topping:pastrami",
    "mustard:lemon_garlic", "mustard:stout_beer", "mustard:chipotle_cerveza",
    "base:pretzel_roll", "base:croissant", "base:baguette",
  ],
  "sauce:buffalo": [
    "sauce:bbq", "sauce:marinara", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:pesto", "sauce:no_sauce",
    "sauce:mayo", "sauce:sriracha_mayo", "sauce:aioli",
    "cheese:beechers", "cheese:dubliner", "cheese:aged_gouda", "cheese:manchego", "cheese:parmigiano", "cheese:mozzarella", "cheese:brie", "cheese:pepper_jack", "cheese:goat_cheese", "cheese:gorgonzola", "cheese:feta",
    "topping:capers", "topping:pepperoni", "topping:egg", "topping:lil_mamas", "topping:tomato", "topping:arugula", "topping:roasted_red_pepper", "topping:prosciutto",
    "mustard:chipotle_cerveza", "mustard:lemon_garlic", "mustard:stout_beer",
    "base:sandwich_bread", "base:ciabatta", "base:brioche_bun", "base:baguette", "base:croissant",
  ],
  "sauce:hot_honey": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:pesto", "sauce:no_sauce",
    "sauce:sriracha_mayo", "sauce:ranch",
    "cheese:beechers", "cheese:dubliner", "cheese:honey_gouda", "cheese:parmigiano", "cheese:gorgonzola",
    "topping:capers", "topping:pepperoni", "topping:egg", "topping:tomato",
    "mustard:lemon_garlic", "mustard:stout_beer",
  ],
  "sauce:fig_jam": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:pesto", "sauce:no_sauce",
    "sauce:sriracha_mayo", "sauce:ranch",
    "cheese:honey_gouda", "cheese:parmigiano",
    "topping:capers", "topping:pepperoni", "topping:french_onions", "topping:tomato", "topping:avocado",
    "mustard:chipotle_cerveza", "mustard:lemon_garlic", "mustard:stout_beer",
  ],
  "sauce:mango_achar": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:green_chili_achar", "sauce:pesto", "sauce:no_sauce",
    "sauce:sriracha_mayo", "sauce:ranch", "sauce:aioli",
    "cheese:honey_gouda", "cheese:parmigiano", "cheese:feta",
    "topping:capers", "topping:pepperoni", "topping:french_onions", "topping:tomato", "topping:arugula", "topping:avocado", "topping:turkey", "topping:prosciutto", "topping:pastrami",
    "mustard:stout_beer",
  ],
  "sauce:green_chili_achar": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:pesto", "sauce:no_sauce",
    "sauce:sriracha_mayo", "sauce:ranch", "sauce:aioli",
    "cheese:beechers", "cheese:dubliner", "cheese:aged_gouda", "cheese:manchego", "cheese:parmigiano", "cheese:brie", "cheese:pepper_jack", "cheese:gorgonzola", "cheese:feta",
    "topping:capers", "topping:pepperoni", "topping:egg", "topping:arugula", "topping:roasted_red_pepper", "topping:avocado", "topping:turkey", "topping:prosciutto", "topping:pastrami",
    "mustard:lemon_garlic", "mustard:stout_beer",
    "base:croissant",
  ],
  "sauce:pesto": [                                                                                    // Italian basil-olive oil-pine-nut-parm lead
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:no_sauce",
    "sauce:sriracha_mayo", "sauce:ranch",
    "cheese:beechers", "cheese:dubliner", "cheese:sharp_cheddar", "cheese:aged_gouda", "cheese:honey_gouda", "cheese:red_dragon", "cheese:gorgonzola",
    "topping:turkey", "topping:pastrami",
    "mustard:chipotle_cerveza", "mustard:stout_beer",
    "base:pretzel_roll", "base:croissant",
  ],
  // Creamy binders
  "sauce:mayo": ["sauce:sriracha_mayo", "sauce:ranch", "sauce:aioli", "sauce:no_sauce", "sauce:buffalo"],
  "sauce:aioli": [                                                                                    // garlic mayo — Mediterranean lane
    "sauce:mayo", "sauce:sriracha_mayo", "sauce:ranch", "sauce:no_sauce",
    "sauce:bbq", "sauce:buffalo", "sauce:mango_achar", "sauce:green_chili_achar",
    "mustard:lemon_garlic", "mustard:stout_beer",
  ],
  "sauce:sriracha_mayo": [
    "sauce:mayo", "sauce:ranch", "sauce:aioli", "sauce:no_sauce",
    "sauce:buffalo", "sauce:fig_jam", "sauce:marinara", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:hot_honey", "sauce:pesto",
    "cheese:parmigiano", "cheese:feta",
    "topping:turkey", "topping:prosciutto", "topping:pastrami",
  ],
  "sauce:ranch": [
    "sauce:mayo", "sauce:sriracha_mayo", "sauce:aioli", "sauce:no_sauce",
    "sauce:marinara", "sauce:fig_jam", "sauce:hot_honey", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:pesto",
    "cheese:parmigiano", "cheese:feta",
    "topping:prosciutto", "topping:pastrami",
    "mustard:chipotle_cerveza", "mustard:lemon_garlic", "mustard:stout_beer",
  ],
  "sauce:no_sauce": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:pesto",
    "sauce:mayo", "sauce:aioli", "sauce:sriracha_mayo", "sauce:ranch",
  ],

  // ── MUSTARD ──
  "mustard:chipotle_cerveza": [
    "sauce:marinara", "sauce:fig_jam", "sauce:buffalo", "sauce:ranch", "sauce:pesto",
    "cheese:feta",
    "topping:prosciutto",
  ],
  "mustard:lemon_garlic": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:green_chili_achar", "sauce:ranch", "sauce:aioli",
    "topping:pepperoni",
  ],
  "mustard:stout_beer": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar", "sauce:ranch", "sauce:pesto", "sauce:aioli",
    "cheese:feta",
    "topping:pepperoni", "topping:prosciutto",
  ],

  // ── TOPPINGS ──
  "topping:capers": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar",
    "cheese:honey_gouda",
    "topping:egg", "topping:pepperoni",
    "base:brioche_bun", "base:croissant",
  ],
  "topping:pepperoni": [
    "sauce:buffalo", "sauce:hot_honey", "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar",
    "cheese:brie", "cheese:goat_cheese", "cheese:feta",
    "topping:capers", "topping:egg", "topping:roasted_red_pepper", "topping:turkey", "topping:pastrami",
    "mustard:lemon_garlic", "mustard:stout_beer",
    "base:croissant",
  ],
  "topping:egg": [
    "sauce:bbq", "sauce:marinara", "sauce:buffalo", "sauce:fig_jam", "sauce:green_chili_achar",
    "topping:pepperoni", "topping:capers",
    "base:ciabatta", "base:pretzel_roll", "base:baguette",
  ],
  "topping:french_onions": [
    "sauce:marinara", "sauce:fig_jam", "sauce:mango_achar",
    "topping:pickled_red_onion", "topping:arugula",
  ],
  "topping:lil_mamas": ["sauce:buffalo"],
  // Fresh Veg & Greens
  "topping:tomato": [                                                                                 // sweet/acidic fresh fruit — wrong with sweet-hot or sweet-smoky sauces
    "sauce:buffalo", "sauce:fig_jam", "sauce:hot_honey", "sauce:mango_achar",
    "cheese:honey_gouda",
  ],
  "topping:arugula": [                                                                                // peppery bitter green — heat/smoke flatten the pepper note
    "sauce:bbq", "sauce:buffalo", "sauce:mango_achar", "sauce:green_chili_achar",
    "cheese:honey_gouda",
    "topping:french_onions",
  ],
  "topping:lettuce": [],                                                                              // neutral — pairs with almost anything
  "topping:avocado": [
    "sauce:fig_jam", "sauce:mango_achar", "sauce:green_chili_achar",
    "cheese:parmigiano", "cheese:gorgonzola",
  ],
  "topping:roasted_red_pepper": [                                                                     // Mediterranean — wants goat cheese / pesto / feta
    "sauce:bbq", "sauce:buffalo", "sauce:green_chili_achar",
    "cheese:honey_gouda",
    "topping:pepperoni",
  ],
  "topping:pickled_red_onion": ["topping:french_onions"],
  // Meat — one headliner per sandwich; club-style exceptions noted in code (chicken + bacon OK)
  "topping:bacon": [],                                                                                // universal
  "topping:chicken": ["topping:turkey", "topping:pastrami"],                                         // two headliner proteins = confused sandwich
  "topping:turkey": [                                                                                 // mild deli — avocado/swiss/cranberry territory
    "topping:chicken", "topping:pepperoni", "topping:prosciutto", "topping:pastrami",
    "sauce:marinara", "sauce:pesto", "sauce:sriracha_mayo", "sauce:mango_achar", "sauce:green_chili_achar",
  ],
  "topping:prosciutto": [                                                                             // cured Italian — fig/pesto/arugula/brie territory
    "topping:turkey", "topping:pastrami",
    "sauce:bbq", "sauce:buffalo", "sauce:ranch", "sauce:sriracha_mayo", "sauce:mango_achar", "sauce:green_chili_achar",
    "mustard:chipotle_cerveza", "mustard:stout_beer",
  ],
  "topping:pastrami": [                                                                               // NY deli — rye/stout mustard/swiss territory
    "topping:chicken", "topping:turkey", "topping:prosciutto", "topping:pepperoni",
    "sauce:pesto", "sauce:marinara", "sauce:sriracha_mayo", "sauce:ranch", "sauce:mango_achar", "sauce:green_chili_achar",
    "cheese:mozzarella", "cheese:feta",
    "base:croissant", "base:ciabatta",
  ],
};

function getGreyedOut(selections) {
  const greyed = new Set();
  for (const [catId, val] of Object.entries(selections)) {
    if (!val) continue;
    const values = Array.isArray(val) ? val : [val];
    for (const v of values) {
      const key = `${catId}:${v}`;
      if (CLASHES[key]) {
        CLASHES[key].forEach((c) => greyed.add(c));
      }
    }
  }
  return greyed;
}

// Return the label of the first selected item whose clash list blocks this one
function findClashCulprit(catId, itemId, selections) {
  const target = `${catId}:${itemId}`;
  for (const [selCat, val] of Object.entries(selections)) {
    if (!val) continue;
    const values = Array.isArray(val) ? val : [val];
    for (const v of values) {
      const selKey = `${selCat}:${v}`;
      if (CLASHES[selKey]?.includes(target)) {
        const cat = BUILD_CATEGORIES.find((c) => c.id === selCat);
        const item = cat?.items.find((i) => i.id === v);
        return item?.label ?? v;
      }
    }
  }
  return null;
}

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

  const hasSelections = selections.base || (selections.cheese && selections.cheese.length > 0) || (selections.sauce && selections.sauce.length > 0) || (selections.mustard && selections.mustard.length > 0) || (selections.topping && selections.topping.length > 0);

  // Build summary
  const getSummaryParts = () => {
    const parts = [];
    BUILD_CATEGORIES.forEach((cat) => {
      const val = selections[cat.id];
      if (!val || (Array.isArray(val) && val.length === 0)) return;
      const values = Array.isArray(val) ? val : [val];
      values.forEach((v) => {
        if (v.startsWith("no_")) return;
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
                const culprit = isClash ? findClashCulprit(cat.id, item.id, selections) : null;
                return (
                  <button
                    key={item.id}
                    onClick={() => !isClash && handleSelect(cat.id, item.id, cat.multi)}
                    title={culprit ? `Clashes with ${culprit}` : undefined}
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

            {/* Build Summary */}
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
                <div style={{
                  background: "#1A1A1A", borderRadius: 8, padding: 12,
                  border: "1px solid #333",
                }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#8A7B6B", marginBottom: 6, fontFamily: "system-ui, sans-serif" }}>Method</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, color: "#C5B8A8", fontFamily: "system-ui, sans-serif" }}>
                    {(() => {
                      const HOT_MEATS = ["chicken", "turkey", "pastrami"];
                      const topping = selections.topping || [];
                      const hotMeat = topping.find((t) => HOT_MEATS.includes(t));
                      const hotMeatLabel = hotMeat && BUILD_CATEGORIES.find((c) => c.id === "topping").items.find((i) => i.id === hotMeat)?.label.toLowerCase();
                      const wantsSauce = (selections.sauce || []).some((s) => !["no_sauce", "mayo", "aioli", "ranch"].includes(s));
                      const baseItem = BUILD_CATEGORIES.find((c) => c.id === "base").items.find((i) => i.id === selections.base);
                      const baseLabel = (baseItem?.label ?? "bread").toLowerCase();
                      const hasCheese = (selections.cheese || []).length > 0;
                      const coldToppings = topping.filter((t) => !HOT_MEATS.includes(t) && !["pepperoni"].includes(t));
                      const hasColdToppings = coldToppings.length > 0;
                      const mustardId = selections.mustard;
                      const hasMustard = typeof mustardId === "string" && !mustardId.startsWith("no_");
                      return (
                        <>
                          {hotMeat && wantsSauce ? `Warm ${hotMeatLabel} in the sauce. ` : ""}
                          Pile on {baseLabel}
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
                  { m: "Stout Beer", p: "French onion, Dubliner" },
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
