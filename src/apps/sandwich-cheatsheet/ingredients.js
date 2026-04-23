/*
 * INGREDIENTS — single source of truth. Each ingredient has:
 *   cat: category (base|cheese|sauce|mustard|topping) — also the BUILD_CATEGORIES id
 *   label: display name
 *   group: UI subgroup within category (optional)
 *   role: functional slot (drives role budgets — at most N of a role per sandwich)
 *   cuisines: flavor-tradition tags (low weight in scoring)
 *   weight: how strongly this ingredient's flavor contributes (1=garnish, 2=normal, 3=dominant, 4=overwhelming)
 *   flavor: per-axis intensity 0-5 on { sweet, acid, umami, spicy, fatty, fresh, salty }
 *   textures: tags like crunchy/melty/wet — used for texture diversity scoring
 *
 * BUILD_CATEGORIES is derived from this object so the UI and scoring share one source.
 */

export const AXES = ["sweet", "acid", "umami", "spicy", "fatty", "fresh", "salty"];

const F = (sweet = 0, acid = 0, umami = 0, spicy = 0, fatty = 0, fresh = 0, salty = 0) => ({
  sweet, acid, umami, spicy, fatty, fresh, salty,
});

export const INGREDIENTS = {
  // ═══ BASES ═══════════════════════════════════════════════════════════
  roll:           { cat: "base", label: "Sandwich Roll",    role: "bread",   cuisines: ["american"],  weight: 1, flavor: F(0,0,1,0,0,0,1), textures: ["soft", "firm"] },
  sandwich_bread: { cat: "base", label: "Sandwich Bread",   role: "bread",   cuisines: ["american"],  weight: 1, flavor: F(1,0,0,0,0,0,0), textures: ["soft"] },
  sourdough:      { cat: "base", label: "Sourdough",        role: "bread",   cuisines: ["universal"], weight: 1, flavor: F(0,1,1,0,0,0,0), textures: ["firm", "chewy"] },
  ciabatta:       { cat: "base", label: "Ciabatta",         role: "bread",   cuisines: ["italian"],   weight: 1, flavor: F(0,0,1,0,0,0,0), textures: ["crispy", "open", "chewy"] },
  brioche_bun:    { cat: "base", label: "Brioche Bun",      role: "bread",   cuisines: ["french"],    weight: 1, flavor: F(2,0,0,0,2,0,0), textures: ["soft", "enriched"] },
  pretzel_roll:   { cat: "base", label: "Pretzel Roll",     role: "bread",   cuisines: ["german"],    weight: 1, flavor: F(0,0,1,0,0,0,3), textures: ["chewy", "dense"] },
  baguette:       { cat: "base", label: "Baguette",         role: "bread",   cuisines: ["french"],    weight: 1, flavor: F(0,0,1,0,0,0,0), textures: ["crispy", "chewy"] },
  croissant:      { cat: "base", label: "Croissant",        role: "bread",   cuisines: ["french"],    weight: 1, flavor: F(1,0,0,0,3,0,0), textures: ["flaky", "enriched"] },
  muffin:         { cat: "base", label: "English Muffin",   role: "bread",   cuisines: ["british"],   weight: 1, flavor: F(0,0,1,0,0,0,0), textures: ["craggy", "firm"] },

  // ═══ CHEESES ═════════════════════════════════════════════════════════
  // Aged & Sharp — bold, don't drown
  beechers:       { cat: "cheese", label: "Beecher's Aged",      group: "Aged & Sharp",        role: "aged_cheese",     cuisines: ["american"], weight: 3, flavor: F(0,0,4,0,2,0,3), textures: ["firm", "crumbly"] },
  dubliner:       { cat: "cheese", label: "Dubliner",            group: "Aged & Sharp",        role: "aged_cheese",     cuisines: ["british"],  weight: 3, flavor: F(0,0,3,0,3,0,2), textures: ["firm"] },
  sharp_cheddar:  { cat: "cheese", label: "Extra Sharp Cheddar", group: "Aged & Sharp",        role: "aged_cheese",     cuisines: ["american"], weight: 3, flavor: F(0,0,3,0,3,0,2), textures: ["firm", "melty"] },
  aged_gouda:     { cat: "cheese", label: "Aged Gouda",          group: "Aged & Sharp",        role: "aged_cheese",     cuisines: ["dutch"],    weight: 3, flavor: F(2,0,3,0,3,0,1), textures: ["firm"] },
  manchego:       { cat: "cheese", label: "Manchego",            group: "Aged & Sharp",        role: "aged_cheese",     cuisines: ["spanish"],  weight: 3, flavor: F(0,0,3,0,3,0,2), textures: ["firm"] },
  parmigiano:     { cat: "cheese", label: "Parmigiano",          group: "Aged & Sharp",        role: "aged_cheese",     cuisines: ["italian"],  weight: 3, flavor: F(0,0,5,0,2,0,4), textures: ["firm", "crumbly"] },
  // Alpine & Nutty — permissive
  comte:          { cat: "cheese", label: "Comté",               group: "Alpine & Nutty",      role: "alpine_cheese",   cuisines: ["french"],   weight: 2, flavor: F(0,0,3,0,3,1,0), textures: ["melty"] },
  gruyere:        { cat: "cheese", label: "Gruyère",             group: "Alpine & Nutty",      role: "alpine_cheese",   cuisines: ["french"],   weight: 2, flavor: F(0,0,3,0,3,0,1), textures: ["melty"] },
  // Classic Melters
  raclette:       { cat: "cheese", label: "Raclette",            group: "Classic Melters",     role: "melting_cheese",  cuisines: ["french"],   weight: 2, flavor: F(0,0,2,0,3,0,1), textures: ["melty"] },
  mozzarella:     { cat: "cheese", label: "Mozzarella",          group: "Classic Melters",     role: "melting_cheese",  cuisines: ["italian"],  weight: 2, flavor: F(0,0,1,0,2,0,0), textures: ["melty"] },
  provolone:      { cat: "cheese", label: "Provolone",           group: "Classic Melters",     role: "melting_cheese",  cuisines: ["italian"],  weight: 2, flavor: F(0,0,2,0,2,0,1), textures: ["melty"] },
  havarti:        { cat: "cheese", label: "Havarti",             group: "Classic Melters",     role: "melting_cheese",  cuisines: ["scandi"],   weight: 2, flavor: F(1,0,1,0,3,0,0), textures: ["melty"] },
  monterey_jack:  { cat: "cheese", label: "Monterey Jack",       group: "Classic Melters",     role: "melting_cheese",  cuisines: ["american"], weight: 2, flavor: F(0,0,1,0,2,0,0), textures: ["melty"] },
  // Mild & Sweet
  honey_gouda:    { cat: "cheese", label: "Honey Gouda",         group: "Mild & Sweet",        role: "mild_cheese",     cuisines: ["dutch"],    weight: 2, flavor: F(3,0,1,0,3,0,0), textures: ["firm", "melty"] },
  std_gouda:      { cat: "cheese", label: "Standard Gouda",      group: "Mild & Sweet",        role: "mild_cheese",     cuisines: ["dutch"],    weight: 2, flavor: F(1,0,1,0,3,0,0), textures: ["melty"] },
  brie:           { cat: "cheese", label: "Brie",                group: "Mild & Sweet",        role: "mild_cheese",     cuisines: ["french"],   weight: 2, flavor: F(0,0,2,0,4,0,0), textures: ["creamy"] },
  // Flavored & Specialty
  red_dragon:     { cat: "cheese", label: "Red Dragon",          group: "Flavored & Specialty", role: "flavored_cheese", cuisines: ["british"],  weight: 3, flavor: F(0,0,3,1,3,0,2), textures: ["firm", "melty"] },
  pepper_jack:    { cat: "cheese", label: "Pepper Jack",         group: "Flavored & Specialty", role: "flavored_cheese", cuisines: ["american"], weight: 2, flavor: F(0,0,1,2,2,0,1), textures: ["melty"] },
  goat_cheese:    { cat: "cheese", label: "Goat Cheese",         group: "Flavored & Specialty", role: "flavored_cheese", cuisines: ["french", "mediterranean"], weight: 2, flavor: F(0,2,1,0,3,0,1), textures: ["creamy", "crumbly"] },
  gorgonzola:     { cat: "cheese", label: "Gorgonzola",          group: "Flavored & Specialty", role: "blue_cheese",     cuisines: ["italian"],  weight: 3, flavor: F(0,0,4,0,3,0,3), textures: ["crumbly", "creamy"] },
  feta:           { cat: "cheese", label: "Feta",                group: "Flavored & Specialty", role: "flavored_cheese", cuisines: ["mediterranean"], weight: 2, flavor: F(0,2,1,0,2,0,3), textures: ["crumbly"] },

  // ═══ SAUCES ══════════════════════════════════════════════════════════
  // Lead sauces (one per sandwich)
  bbq:              { cat: "sauce", label: "Kinder's BBQ",              group: "Lead",    role: "lead_sauce",      cuisines: ["american_bbq"],  weight: 3, flavor: F(3,0,3,1,0,0,1), textures: ["wet"] },
  marinara:         { cat: "sauce", label: "Marinara",                  group: "Lead",    role: "lead_sauce",      cuisines: ["italian"],       weight: 3, flavor: F(1,3,3,0,0,0,0), textures: ["wet"] },
  buffalo:          { cat: "sauce", label: "Buffalo (Red Hot + Butter)", group: "Lead",   role: "lead_sauce",      cuisines: ["american"],      weight: 3, flavor: F(0,2,0,3,2,0,1), textures: ["wet"] },
  hot_honey:        { cat: "sauce", label: "Hot Honey",                 group: "Lead",    role: "lead_sauce",      cuisines: ["nashville"],     weight: 3, flavor: F(4,0,0,3,0,0,0), textures: ["wet"] },
  fig_jam:          { cat: "sauce", label: "Fig Jam",                   group: "Lead",    role: "lead_sauce",      cuisines: ["mediterranean", "american"], weight: 3, flavor: F(4,0,1,0,0,0,0), textures: ["chunky"] },
  mango_achar:      { cat: "sauce", label: "Hot Mango Achar",           group: "Lead",    role: "lead_sauce",      cuisines: ["indian"],        weight: 3, flavor: F(2,2,2,3,0,0,0), textures: ["chunky"] },
  green_chili_achar:{ cat: "sauce", label: "Green Chili Achar",         group: "Lead",    role: "lead_sauce",      cuisines: ["indian"],        weight: 3, flavor: F(0,2,0,3,0,2,0), textures: ["chunky"] },
  pesto:            { cat: "sauce", label: "Pesto",                     group: "Lead",    role: "lead_sauce",      cuisines: ["italian"],       weight: 3, flavor: F(0,0,3,0,2,4,1), textures: ["chunky"] },
  // Creamy binders (one per sandwich)
  mayo:             { cat: "sauce", label: "Mayo",                      group: "Creamy",  role: "creamy_binder",   cuisines: ["universal"],     weight: 1, flavor: F(0,1,0,0,3,0,0), textures: ["creamy"] },
  aioli:            { cat: "sauce", label: "Aioli (garlic mayo)",       group: "Creamy",  role: "creamy_binder",   cuisines: ["mediterranean"], weight: 2, flavor: F(0,1,1,0,3,0,0), textures: ["creamy"] },
  sriracha_mayo:    { cat: "sauce", label: "Sriracha Mayo",             group: "Creamy",  role: "creamy_binder",   cuisines: ["asian"],         weight: 2, flavor: F(0,1,0,2,2,0,0), textures: ["creamy"] },
  ranch:            { cat: "sauce", label: "Ranch",                     group: "Creamy",  role: "creamy_binder",   cuisines: ["american"],      weight: 2, flavor: F(0,1,0,0,2,1,1), textures: ["creamy"] },
  // Bread treatment (one per sandwich, separate role)
  garlic_butter:    { cat: "sauce", label: "Garlic Butter",             group: "Butter (bread treatment)", role: "bread_treatment", cuisines: ["italian"], weight: 2, flavor: F(0,0,1,0,3,0,1), textures: ["creamy"] },
  // None
  no_sauce:         { cat: "sauce", label: "None (let cheese star)",    group: "None",    role: "null_choice",     cuisines: [],                weight: 0, flavor: F(), textures: [] },

  // ═══ MUSTARDS ════════════════════════════════════════════════════════
  chipotle_cerveza: { cat: "mustard", label: "Chipotle Cerveza",        role: "mustard", cuisines: ["american_bbq"], weight: 2, flavor: F(0,2,1,2,0,0,1), textures: ["creamy"] },
  lemon_garlic:     { cat: "mustard", label: "Lemon & Garlic",          role: "mustard", cuisines: ["mediterranean"], weight: 2, flavor: F(0,3,0,0,0,2,1), textures: ["creamy"] },
  stout_beer:       { cat: "mustard", label: "Stout Beer",              role: "mustard", cuisines: ["german"],       weight: 2, flavor: F(0,1,2,0,0,0,1), textures: ["creamy"] },
  no_mustard:       { cat: "mustard", label: "None",                    role: "null_choice", cuisines: [],           weight: 0, flavor: F(), textures: [] },

  // ═══ TOPPINGS ════════════════════════════════════════════════════════
  // Meats (one headliner per sandwich; accent meats can layer with most)
  chicken:          { cat: "topping", label: "Chicken",        group: "Meat", role: "headliner_meat", cuisines: ["universal"], weight: 3, flavor: F(0,0,2,0,2,0,1), textures: ["soft", "firm"] },
  turkey:           { cat: "topping", label: "Turkey",         group: "Meat", role: "headliner_meat", cuisines: ["american"],  weight: 2, flavor: F(0,0,2,0,1,0,1), textures: ["soft"] },
  shaved_steak:     { cat: "topping", label: "Shaved Steak",   group: "Meat", role: "headliner_meat", cuisines: ["american", "asian"], weight: 3, flavor: F(0,0,4,0,3,0,1), textures: ["soft", "firm"] },
  bacon:            { cat: "topping", label: "Bacon",          group: "Meat", role: "accent_meat",    cuisines: ["universal"], weight: 2, flavor: F(0,0,3,1,3,0,2), textures: ["crispy"] },
  pepperoni:        { cat: "topping", label: "Pepperoni",      group: "Meat", role: "accent_meat",    cuisines: ["italian"],   weight: 2, flavor: F(0,0,2,2,2,0,2), textures: ["crispy", "firm"] },
  prosciutto:       { cat: "topping", label: "Prosciutto",     group: "Meat", role: "headliner_meat", cuisines: ["italian"],   weight: 3, flavor: F(0,0,3,0,2,0,3), textures: ["delicate"] },
  pastrami:         { cat: "topping", label: "Pastrami",       group: "Meat", role: "headliner_meat", cuisines: ["jewish_deli"], weight: 3, flavor: F(0,0,3,1,2,0,3), textures: ["soft"] },
  // Egg
  egg:              { cat: "topping", label: "Fried Egg",      group: "Egg",  role: "egg",            cuisines: ["breakfast"], weight: 2, flavor: F(0,0,1,0,2,0,0), textures: ["runny", "soft"] },
  // Fresh Veg & Greens
  tomato:           { cat: "topping", label: "Tomato Slices",       group: "Fresh Veg & Greens", role: "fresh_veg", cuisines: ["universal"], weight: 1, flavor: F(1,2,1,0,0,2,0), textures: ["wet", "soft"] },
  arugula:          { cat: "topping", label: "Arugula",             group: "Fresh Veg & Greens", role: "greens",    cuisines: ["italian", "mediterranean"], weight: 1, flavor: F(0,0,0,1,0,3,0), textures: ["fresh"] },
  lettuce:          { cat: "topping", label: "Lettuce",             group: "Fresh Veg & Greens", role: "greens",    cuisines: ["universal"], weight: 1, flavor: F(0,0,0,0,0,2,0), textures: ["crisp", "fresh"] },
  avocado:          { cat: "topping", label: "Avocado",             group: "Fresh Veg & Greens", role: "fresh_veg", cuisines: ["universal"], weight: 2, flavor: F(0,0,0,0,3,1,0), textures: ["creamy"] },
  roasted_red_pepper:{cat: "topping", label: "Roasted Red Pepper",  group: "Fresh Veg & Greens", role: "fresh_veg", cuisines: ["mediterranean"], weight: 2, flavor: F(2,0,2,0,0,1,0), textures: ["soft"] },
  // Pickled & Brined
  pickled_red_onion:{ cat: "topping", label: "Pickled Red Onion",   group: "Pickled & Brined",   role: "pickled",   cuisines: ["universal"], weight: 1, flavor: F(0,2,0,0,0,1,0), textures: ["crisp"] },
  lil_mamas:        { cat: "topping", label: "Lil Mama's Peppers",  group: "Pickled & Brined",   role: "pickled",   cuisines: ["italian"],   weight: 1, flavor: F(1,2,0,1,0,0,0), textures: ["crisp"] },
  french_onions:    { cat: "topping", label: "French Fried Onions", group: "Pickled & Brined",   role: "crunchy",   cuisines: ["american"],  weight: 1, flavor: F(0,0,2,0,1,0,1), textures: ["crispy", "crunchy"] },
  dill_pickles:     { cat: "topping", label: "Dill Pickles",        group: "Pickled & Brined",   role: "pickled",   cuisines: ["universal"], weight: 1, flavor: F(0,3,0,0,0,1,1), textures: ["crisp"] },
  pickled_japs:     { cat: "topping", label: "Pickled Jalapeños",   group: "Pickled & Brined",   role: "pickled",   cuisines: ["universal"], weight: 1, flavor: F(0,2,0,3,0,0,0), textures: ["crisp"] },
  capers:           { cat: "topping", label: "Capers",              group: "Pickled & Brined",   role: "pickled",   cuisines: ["mediterranean"], weight: 1, flavor: F(0,3,0,0,0,0,3), textures: ["soft"] },
};

// Derived: BUILD_CATEGORIES preserves category ordering and item ordering for the UI.
// Items are listed in the order they appear in INGREDIENTS (insertion order preserved).
const CATEGORY_ORDER = ["base", "cheese", "sauce", "mustard", "topping"];
const CATEGORY_META = {
  base:    { label: "Base",            multi: false },
  cheese:  { label: "Cheese",          multi: true  },
  sauce:   { label: "Sauce / Spread",  multi: true  },
  mustard: { label: "Mustard",         multi: false },
  topping: { label: "Toppings",        multi: true  },
};

export const BUILD_CATEGORIES = CATEGORY_ORDER.map((catId) => ({
  id: catId,
  label: CATEGORY_META[catId].label,
  multi: CATEGORY_META[catId].multi,
  items: Object.entries(INGREDIENTS)
    .filter(([, ing]) => ing.cat === catId)
    .map(([id, ing]) => ({ id, label: ing.label, ...(ing.group && { group: ing.group }) })),
}));

// Helper: look up an ingredient by id (returns undefined if not found).
export function getIngredient(id) {
  return INGREDIENTS[id];
}

// Helper: list of selected ingredient IDs across all categories.
export function selectedIds(selections) {
  const ids = [];
  for (const [, val] of Object.entries(selections)) {
    if (!val) continue;
    if (Array.isArray(val)) ids.push(...val);
    else if (typeof val === "string") ids.push(val);
  }
  return ids;
}
