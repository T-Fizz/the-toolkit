import { AXES, INGREDIENTS, getIngredient, selectedIds } from "./ingredients.js";

/*
 * SCORING ENGINE
 *
 * Three signals drive whether a candidate ingredient is blocked or greyed:
 *   1. Role budgets — hard limits (max 1 lead sauce, max 1 headliner meat, etc.).
 *   2. Flavor axis balance — an axis over its cap is a clear overload (too sweet, too spicy).
 *   3. Pair affinities — sparse graph of known classic pairings (bonus) and known clashes
 *      (penalty) that the tags alone don't fully capture.
 *
 * Cuisine is intentionally a tiny factor — only penalizes if a selection has 4+ distinct
 * cuisine tags (genuine chaos), not for normal cross-cultural combos.
 */

// ── ROLE BUDGETS ──────────────────────────────────────────────────────
// Hard caps on how many ingredients of a given role can coexist.
export const ROLE_BUDGETS = {
  bread: 1,
  aged_cheese: 2,
  alpine_cheese: 2,
  melting_cheese: 2,
  mild_cheese: 2,
  flavored_cheese: 1,
  blue_cheese: 1,
  lead_sauce: 1,
  creamy_binder: 1,
  bread_treatment: 1,
  mustard: 1,
  headliner_meat: 1,
  accent_meat: 2,
  egg: 1,
  fresh_veg: 3,
  greens: 2,
  pickled: 2,
  crunchy: 2,
};

// Cross-role budgets (sum across multiple roles).
export const GROUP_BUDGETS = {
  total_cheese: 3,       // across aged + alpine + melting + mild + flavored + blue
  total_sauce: 2,        // lead + creamy (bread_treatment is separate)
  total_topping: 6,      // everything in the topping category
};

const CHEESE_ROLES = new Set(["aged_cheese", "alpine_cheese", "melting_cheese", "mild_cheese", "flavored_cheese", "blue_cheese"]);
const SAUCE_ROLES = new Set(["lead_sauce", "creamy_binder"]);

// ── AXIS CAPS ─────────────────────────────────────────────────────────
// Per-axis caps — a sandwich is overloaded only when a specific axis exceeds
// its own cap. Umami and fatty pile naturally in meat-cheese builds (cheesesteak,
// chicken parm), so they're looser. Sweet/spicy/fresh are tighter because
// overdoing them actually ruins the sandwich.
export const AXIS_CAPS = {
  sweet: 10,
  acid:  12,
  umami: 22,
  spicy: 10,
  fatty: 18,
  fresh: 10,
  salty: 15,
};

// ── PAIR AFFINITIES ───────────────────────────────────────────────────
// Sparse graph of notable pairings. Positive = bonus (classic pairing),
// negative = penalty (known clash the tags might not catch). Order-agnostic:
// key is alphabetical "a+b" so each pair lives in one slot.
const pairKey = (a, b) => (a < b ? `${a}+${b}` : `${b}+${a}`);

export const PAIR_AFFINITIES = Object.freeze(Object.fromEntries([
  // ── Classic bonuses (+2 to +4) ──
  // Italian / caprese / pizza-sub
  ["marinara", "mozzarella", 4],
  ["marinara", "parmigiano", 3],
  ["marinara", "pepperoni", 3],
  ["marinara", "provolone", 3],
  ["marinara", "ciabatta", 2],
  ["pesto", "mozzarella", 3],
  ["pesto", "goat_cheese", 3],
  ["pesto", "tomato", 3],
  ["pesto", "chicken", 2],
  ["pesto", "ciabatta", 2],
  ["pesto", "prosciutto", 3],
  ["garlic_butter", "mozzarella", 3],
  ["garlic_butter", "parmigiano", 3],
  ["garlic_butter", "pepperoni", 2],
  ["garlic_butter", "marinara", 3],
  ["mozzarella", "tomato", 3],
  // Fig + aged / creamy
  ["fig_jam", "brie", 4],
  ["fig_jam", "aged_gouda", 3],
  ["fig_jam", "prosciutto", 4],
  ["fig_jam", "arugula", 2],
  ["fig_jam", "goat_cheese", 3],
  ["fig_jam", "aioli", 2],
  ["fig_jam", "gorgonzola", 3],
  ["fig_jam", "manchego", 2],
  ["fig_jam", "sourdough", 2],
  // BBQ / American
  ["bbq", "sharp_cheddar", 3],
  ["bbq", "red_dragon", 3],
  ["bbq", "chicken", 2],
  ["bbq", "shaved_steak", 2],
  ["bbq", "french_onions", 2],
  ["bbq", "chipotle_cerveza", 3],
  // Buffalo
  ["buffalo", "ranch", 4],
  ["buffalo", "gorgonzola", 3],
  ["buffalo", "chicken", 3],
  ["buffalo", "monterey_jack", 2],
  ["buffalo", "dill_pickles", 2],
  // Nashville hot / hot honey
  ["hot_honey", "chicken", 3],
  ["hot_honey", "sharp_cheddar", 2],
  ["hot_honey", "dill_pickles", 3],
  ["hot_honey", "pickled_japs", 2],
  // NY deli / pastrami
  ["pastrami", "stout_beer", 4],
  ["pastrami", "sourdough", 3],
  ["pastrami", "rye_would_be_ideal", 0], // placeholder — no rye in base set yet
  ["pastrami", "gruyere", 2],
  ["pastrami", "dill_pickles", 2],
  ["pastrami", "pretzel_roll", 2],
  // French onion sub
  ["comte", "stout_beer", 3],
  ["comte", "french_onions", 3],
  // Mediterranean / Greek
  ["feta", "arugula", 3],
  ["feta", "tomato", 3],
  ["feta", "lemon_garlic", 3],
  ["feta", "roasted_red_pepper", 3],
  ["feta", "aioli", 2],
  // Goat cheese + roasted pepper / pesto
  ["goat_cheese", "roasted_red_pepper", 3],
  // Cheesesteak / shaved steak
  ["shaved_steak", "provolone", 4],
  ["shaved_steak", "raclette", 2],
  ["shaved_steak", "french_onions", 3],
  ["shaved_steak", "sriracha_mayo", 2],
  ["shaved_steak", "pepper_jack", 3],
  ["shaved_steak", "roll", 2],
  // Achar pairings
  ["mango_achar", "comte", 2],
  ["mango_achar", "raclette", 2],
  ["mango_achar", "chipotle_cerveza", 2],
  ["green_chili_achar", "bbq", 2],          // user-validated combo earlier
  ["green_chili_achar", "chipotle_cerveza", 2],
  // Club / breakfast
  ["chicken", "bacon", 2],
  ["turkey", "bacon", 2],
  ["egg", "bacon", 2],
  ["egg", "muffin", 3],
  ["egg", "sharp_cheddar", 2],
  ["egg", "havarti", 2],
  // Freshness pairings (arugula/tomato cut through fat-heavy builds)
  ["arugula", "prosciutto", 3],
  ["arugula", "pesto", 2],
  ["arugula", "goat_cheese", 2],
  ["arugula", "aioli", 2],
  ["arugula", "mozzarella", 2],
  ["arugula", "parmigiano", 2],
  ["tomato", "arugula", 2],
  ["tomato", "aioli", 2],
  ["tomato", "provolone", 2],
  ["avocado", "bacon", 3],
  ["avocado", "chicken", 2],
  ["avocado", "turkey", 2],
  ["avocado", "pepper_jack", 2],
  ["lettuce", "turkey", 1],
  ["lettuce", "bacon", 1],
  ["pickled_red_onion", "shaved_steak", 2],
  ["pickled_red_onion", "turkey", 2],
  // Lemon garlic bright builds
  ["lemon_garlic", "capers", 3],
  ["lemon_garlic", "arugula", 2],
  ["lemon_garlic", "comte", 2],

  // ── Clash penalties (-2 to -5) — on top of role budgets; these are flavor-theory overrides ──
  ["honey_gouda", "fig_jam", -4],
  ["honey_gouda", "hot_honey", -4],
  ["honey_gouda", "mango_achar", -3],
  ["honey_gouda", "bbq", -3],
  ["parmigiano", "sriracha_mayo", -3],
  ["parmigiano", "ranch", -3],
  ["parmigiano", "bbq", -3],
  ["parmigiano", "buffalo", -3],
  ["parmigiano", "hot_honey", -3],
  ["parmigiano", "fig_jam", -3],
  ["gorgonzola", "bbq", -3],
  ["gorgonzola", "marinara", -2],
  ["gorgonzola", "buffalo", -3],
  ["gorgonzola", "hot_honey", -3],
  ["beechers", "bbq", -3],
  ["beechers", "marinara", -3],
  ["beechers", "buffalo", -3],
  ["beechers", "hot_honey", -3],
  ["dubliner", "bbq", -3],
  ["dubliner", "marinara", -3],
  ["dubliner", "buffalo", -3],
  ["dubliner", "hot_honey", -3],
  ["brie", "bbq", -3],
  ["brie", "buffalo", -3],
  ["brie", "marinara", -3],
  ["brie", "pepperoni", -3],
  ["feta", "bbq", -3],
  ["feta", "buffalo", -3],
  ["feta", "mango_achar", -3],
  ["feta", "green_chili_achar", -3],
  ["feta", "sriracha_mayo", -3],
  ["feta", "ranch", -3],
  ["feta", "pepperoni", -3],
  ["feta", "pastrami", -3],
  ["feta", "chipotle_cerveza", -3],
  ["feta", "stout_beer", -3],
  ["goat_cheese", "bbq", -3],
  ["goat_cheese", "buffalo", -3],
  ["goat_cheese", "pepperoni", -3],
  ["mozzarella", "bbq", -3],
  ["mozzarella", "buffalo", -3],
  ["mozzarella", "pastrami", -3],
  ["aged_gouda", "marinara", -3],
  ["aged_gouda", "buffalo", -3],
  ["aged_gouda", "green_chili_achar", -3],
  ["manchego", "bbq", -3],
  ["manchego", "buffalo", -3],
  ["manchego", "green_chili_achar", -3],
  ["pepper_jack", "buffalo", -2],
  ["pepper_jack", "green_chili_achar", -2],
  ["capers", "bbq", -3],
  ["capers", "buffalo", -3],
  ["capers", "hot_honey", -3],
  ["capers", "fig_jam", -3],
  ["capers", "mango_achar", -3],
  ["capers", "honey_gouda", -3],
  ["capers", "brioche_bun", -2],
  ["capers", "croissant", -3],
  ["pepperoni", "buffalo", -3],
  ["pepperoni", "hot_honey", -3],
  ["pepperoni", "fig_jam", -3],
  ["pepperoni", "mango_achar", -3],
  ["pepperoni", "green_chili_achar", -3],
  ["pepperoni", "roasted_red_pepper", -3], // redundant red-on-red
  ["pepperoni", "lemon_garlic", -3],
  ["pepperoni", "stout_beer", -3],
  ["pepperoni", "brie", -3],
  ["pepperoni", "goat_cheese", -3],
  ["pepperoni", "feta", -3],
  ["pepperoni", "croissant", -3],
  ["prosciutto", "bacon", -3],     // redundant cured pork; bacon overwhelms delicate prosciutto
  ["prosciutto", "bbq", -3],
  ["prosciutto", "buffalo", -3],
  ["prosciutto", "ranch", -3],
  ["prosciutto", "sriracha_mayo", -3],
  ["prosciutto", "mango_achar", -3],
  ["prosciutto", "green_chili_achar", -3],
  ["prosciutto", "chipotle_cerveza", -3],
  ["prosciutto", "stout_beer", -3],
  ["turkey", "marinara", -2],
  ["turkey", "pesto", -2],
  ["turkey", "sriracha_mayo", -2],
  ["turkey", "mango_achar", -2],
  ["turkey", "green_chili_achar", -2],
  ["pastrami", "pesto", -3],
  ["pastrami", "marinara", -3],
  ["pastrami", "sriracha_mayo", -3],
  ["pastrami", "ranch", -3],
  ["pastrami", "mango_achar", -3],
  ["pastrami", "green_chili_achar", -3],
  ["pastrami", "mozzarella", -3],
  ["pastrami", "feta", -3],
  ["pastrami", "croissant", -3],
  ["pastrami", "ciabatta", -2],
  ["egg", "bbq", -3],
  ["egg", "marinara", -3],
  ["egg", "buffalo", -3],
  ["egg", "fig_jam", -3],
  ["egg", "green_chili_achar", -3],
  ["egg", "ciabatta", -2],
  ["egg", "pretzel_roll", -2],
  ["egg", "baguette", -3],
  ["egg", "pepperoni", -2],
  ["egg", "capers", -2],
  ["tomato", "buffalo", -2],
  ["tomato", "fig_jam", -2],
  ["tomato", "hot_honey", -2],
  ["tomato", "mango_achar", -2],
  ["tomato", "honey_gouda", -2],
  ["arugula", "bbq", -2],
  ["arugula", "buffalo", -2],
  ["arugula", "mango_achar", -2],
  ["arugula", "green_chili_achar", -2],
  ["arugula", "french_onions", -2],
  ["arugula", "honey_gouda", -2],
  ["avocado", "fig_jam", -2],
  ["avocado", "mango_achar", -2],
  ["avocado", "green_chili_achar", -2],
  ["avocado", "parmigiano", -2],
  ["avocado", "gorgonzola", -2],
  ["roasted_red_pepper", "bbq", -2],
  ["roasted_red_pepper", "buffalo", -2],
  ["roasted_red_pepper", "green_chili_achar", -2],
  ["roasted_red_pepper", "honey_gouda", -2],
  ["roasted_red_pepper", "lil_mamas", -2],          // redundant sweet peppers
  ["french_onions", "marinara", -2],
  ["french_onions", "fig_jam", -2],
  ["french_onions", "mango_achar", -2],
  ["french_onions", "pickled_red_onion", -3],       // redundant onion
  // Base structural failures
  ["sandwich_bread", "buffalo", -3],
  ["ciabatta", "buffalo", -3],
  ["brioche_bun", "buffalo", -3],
  ["baguette", "bbq", -3],
  ["baguette", "buffalo", -3],
  ["baguette", "marinara", -3],
  ["pretzel_roll", "marinara", -3],
  ["pretzel_roll", "pesto", -3],
  ["croissant", "bbq", -3],
  ["croissant", "marinara", -3],
  ["croissant", "buffalo", -3],
  ["croissant", "green_chili_achar", -3],
  ["croissant", "pesto", -3],
  // Lead-sauce vs lead-sauce (role budget handles this, but reinforces tooltip reasons)
  // (skipped — role budget is enough)
  // Sauce profile clashes
  ["marinara", "ranch", -3],
  ["marinara", "sriracha_mayo", -3],
  ["fig_jam", "sriracha_mayo", -3],
  ["fig_jam", "ranch", -3],
  ["hot_honey", "sriracha_mayo", -3],
  ["hot_honey", "ranch", -2],
  ["mango_achar", "ranch", -2],
  ["mango_achar", "sriracha_mayo", -2],
  ["green_chili_achar", "ranch", -2],
  ["green_chili_achar", "sriracha_mayo", -2],
  ["green_chili_achar", "aioli", -2],
  ["mango_achar", "aioli", -2],
  ["bbq", "aioli", -2],
  ["buffalo", "aioli", -3],
  ["buffalo", "mayo", -2],                          // buffalo + ranch is classic, mayo is not
  ["buffalo", "sriracha_mayo", -2],
  ["garlic_butter", "aioli", -3],                   // double garlic
  ["garlic_butter", "honey_gouda", -2],
  ["garlic_butter", "sriracha_mayo", -2],
  ["garlic_butter", "ranch", -2],
  ["garlic_butter", "lemon_garlic", -3],
  ["garlic_butter", "chipotle_cerveza", -2],
  // Mustard clashes
  ["chipotle_cerveza", "marinara", -3],
  ["chipotle_cerveza", "fig_jam", -3],
  ["chipotle_cerveza", "buffalo", -2],
  ["chipotle_cerveza", "ranch", -2],
  ["chipotle_cerveza", "pesto", -3],
  ["chipotle_cerveza", "prosciutto", -2],
  ["lemon_garlic", "bbq", -3],
  ["lemon_garlic", "marinara", -3],
  ["lemon_garlic", "buffalo", -3],
  ["lemon_garlic", "hot_honey", -3],
  ["lemon_garlic", "fig_jam", -3],
  ["lemon_garlic", "green_chili_achar", -2],
  ["lemon_garlic", "ranch", -3],
  ["lemon_garlic", "aioli", -3],                    // double garlic
  ["stout_beer", "bbq", -3],
  ["stout_beer", "marinara", -3],
  ["stout_beer", "buffalo", -3],
  ["stout_beer", "hot_honey", -3],
  ["stout_beer", "fig_jam", -3],
  ["stout_beer", "mango_achar", -3],
  ["stout_beer", "green_chili_achar", -3],
  ["stout_beer", "ranch", -3],
  ["stout_beer", "pesto", -3],
  ["stout_beer", "aioli", -2],
  // Multiple headliner meats — role budget handles, but make it explicit for findReason
  // (skipped — role budget provides clear messaging)
].map(([a, b, v]) => [pairKey(a, b), v])));

function getAffinity(a, b) {
  return PAIR_AFFINITIES[pairKey(a, b)] ?? 0;
}

// ── PROFILE / BALANCE ────────────────────────────────────────────────
// Sum flavor-axis contributions across all selected ingredients.
// Each ingredient contributes flavor[axis] * weight / 2 (weight damps garnish contribution).
export function getFlavorProfile(selections) {
  const profile = Object.fromEntries(AXES.map((a) => [a, 0]));
  const ids = selectedIds(selections).filter((id) => !id.startsWith("no_"));
  for (const id of ids) {
    const ing = getIngredient(id);
    if (!ing) continue;
    const w = (ing.weight ?? 1) / 2;
    for (const axis of AXES) {
      profile[axis] += (ing.flavor?.[axis] ?? 0) * w;
    }
  }
  return profile;
}

function getRoleCounts(selections) {
  const counts = {};
  const ids = selectedIds(selections).filter((id) => !id.startsWith("no_"));
  for (const id of ids) {
    const ing = getIngredient(id);
    if (!ing || !ing.role) continue;
    counts[ing.role] = (counts[ing.role] ?? 0) + 1;
  }
  return counts;
}

// ── BLOCK / REASON ───────────────────────────────────────────────────
// Evaluate a (possibly hypothetical) selection set against all rules.
// Returns { blocked: bool, reason?: { kind, ... } } where kind is one of:
//   "role_budget" — a role exceeds its cap
//   "group_budget" — total cheese / total topping / etc. exceeds its cap
//   "axis_overload" — a flavor axis exceeds AXIS_CAP
//   "pair_clash" — strong pair penalty (≤ -3) involving the new item
export function evaluate(selections, newlyAddedId = null) {
  const ids = selectedIds(selections).filter((id) => !id.startsWith("no_"));
  const roleCounts = getRoleCounts(selections);

  // 1. Role budgets
  for (const [role, cap] of Object.entries(ROLE_BUDGETS)) {
    if ((roleCounts[role] ?? 0) > cap) {
      // Find offending items of this role to name one
      const offenders = ids.filter((id) => getIngredient(id)?.role === role);
      return {
        blocked: true,
        reason: { kind: "role_budget", role, cap, offenders, message: roleBudgetMessage(role, cap, offenders) },
      };
    }
  }

  // 2. Group budgets
  let totalCheese = 0, totalSauce = 0, totalTopping = 0;
  for (const id of ids) {
    const ing = getIngredient(id);
    if (!ing) continue;
    if (CHEESE_ROLES.has(ing.role)) totalCheese++;
    if (SAUCE_ROLES.has(ing.role)) totalSauce++;
    if (ing.cat === "topping") totalTopping++;
  }
  if (totalCheese > GROUP_BUDGETS.total_cheese) {
    return { blocked: true, reason: { kind: "group_budget", group: "cheese", cap: GROUP_BUDGETS.total_cheese, message: "too many cheeses" } };
  }
  if (totalSauce > GROUP_BUDGETS.total_sauce) {
    return { blocked: true, reason: { kind: "group_budget", group: "sauce", cap: GROUP_BUDGETS.total_sauce, message: "too many sauces" } };
  }
  if (totalTopping > GROUP_BUDGETS.total_topping) {
    return { blocked: true, reason: { kind: "group_budget", group: "topping", cap: GROUP_BUDGETS.total_topping, message: "too many toppings" } };
  }

  // 3. Axis overload (per-axis cap)
  const profile = getFlavorProfile(selections);
  for (const axis of AXES) {
    const cap = AXIS_CAPS[axis];
    if (profile[axis] > cap) {
      return { blocked: true, reason: { kind: "axis_overload", axis, value: profile[axis], message: `too ${axis}` } };
    }
  }

  // 4. Pair clash — strong negative affinity involving the newly added item
  if (newlyAddedId) {
    let worst = null;
    for (const other of ids) {
      if (other === newlyAddedId) continue;
      const v = getAffinity(newlyAddedId, other);
      if (v <= -3 && (!worst || v < worst.v)) worst = { other, v };
    }
    if (worst) {
      const otherLabel = getIngredient(worst.other)?.label ?? worst.other;
      return { blocked: true, reason: { kind: "pair_clash", other: worst.other, otherLabel, value: worst.v, message: `clashes with ${otherLabel}` } };
    }
  }

  return { blocked: false };
}

function roleBudgetMessage(role, cap, offenders) {
  const labels = offenders.map((id) => getIngredient(id)?.label ?? id);
  if (role === "lead_sauce") return `one lead sauce max (${labels.join(" & ")})`;
  if (role === "creamy_binder") return `one creamy binder max (${labels.join(" & ")})`;
  if (role === "bread_treatment") return `one bread treatment max`;
  if (role === "headliner_meat") return `one headliner meat max (${labels.join(" & ")})`;
  if (role === "accent_meat") return `max ${cap} accent meats`;
  if (role === "flavored_cheese") return `only one flavored/specialty cheese`;
  if (role === "blue_cheese") return `only one blue cheese`;
  if (role === "pickled") return `max ${cap} pickled items`;
  if (role === "greens") return `max ${cap} greens`;
  if (role === "fresh_veg") return `max ${cap} fresh veg items`;
  return `too many ${role.replace("_", " ")}`;
}

// ── COMPUTE GREYED SET ───────────────────────────────────────────────
// For each unselected ingredient, would adding it block the selection?
// Returns a Set of `${cat}:${id}` keys that should be greyed out in the UI.
export function getGreyedOut(selections) {
  const greyed = new Set();
  for (const [id, ing] of Object.entries(INGREDIENTS)) {
    if (isSelected(selections, ing.cat, id)) continue;
    const hypothetical = addToSelection(selections, ing.cat, id);
    const { blocked } = evaluate(hypothetical, id);
    if (blocked) greyed.add(`${ing.cat}:${id}`);
  }
  return greyed;
}

// Return a short human reason if adding this candidate would be blocked, else null.
export function findClashReason(catId, itemId, selections) {
  if (isSelected(selections, catId, itemId)) return null;
  const hypothetical = addToSelection(selections, catId, itemId);
  const { blocked, reason } = evaluate(hypothetical, itemId);
  if (!blocked) return null;
  return reason?.message ?? "clash";
}

// ── SUGGEST NEXT ─────────────────────────────────────────────────────
// Return top N ingredients (by positive-score delta) that would improve the
// current selection without getting blocked. Diversified: at most one item
// per category, and we favor items that fill under-represented flavor axes
// (e.g. recommend arugula when a sandwich is fatty-heavy with no freshness).
const LOW_AXIS_THRESHOLD = 2;                                                           // an axis below this is "under-represented"
const BALANCE_BONUS = 1.5;                                                               // bonus per under-represented axis an item raises
export function suggestNext(selections, n = 3) {
  const selectedIdSet = new Set(selectedIds(selections));
  const current = scoreFixed(selections);
  const currentProfile = getFlavorProfile(selections);
  const lowAxes = new Set(AXES.filter((a) => currentProfile[a] < LOW_AXIS_THRESHOLD));

  const candidates = [];
  for (const [id, ing] of Object.entries(INGREDIENTS)) {
    if (ing.role === "null_choice") continue;
    if (selectedIdSet.has(id)) continue;
    const hypothetical = addToSelection(selections, ing.cat, id);
    const { blocked } = evaluate(hypothetical, id);
    if (blocked) continue;
    const after = scoreFixed(hypothetical);
    let delta = after - current;
    // Bonus for raising an under-represented axis
    for (const axis of lowAxes) {
      if ((ing.flavor?.[axis] ?? 0) >= 2) delta += BALANCE_BONUS;
    }
    if (delta > 0) candidates.push({ id, label: ing.label, cat: ing.cat, delta });
  }
  candidates.sort((a, b) => b.delta - a.delta);

  // Diversify: at most one item per category until we have n suggestions;
  // if not enough categories represented, fall through to raw order.
  const picked = [];
  const seenCats = new Set();
  for (const c of candidates) {
    if (picked.length >= n) break;
    if (seenCats.has(c.cat)) continue;
    picked.push(c);
    seenCats.add(c.cat);
  }
  // If we still have slots left, fill with best remaining (even same category)
  for (const c of candidates) {
    if (picked.length >= n) break;
    if (!picked.includes(c)) picked.push(c);
  }
  return picked;
}

// A simple positive-only score for suggestion ranking: sum of pair affinities
// + small bonus for filling empty roles on canonical sandwiches.
function scoreFixed(selections) {
  const ids = selectedIds(selections).filter((id) => !id.startsWith("no_"));
  let s = 0;
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      s += getAffinity(ids[i], ids[j]);
    }
  }
  return s;
}

// ── SELECTION HELPERS ────────────────────────────────────────────────
function isSelected(selections, cat, id) {
  const v = selections[cat];
  if (Array.isArray(v)) return v.includes(id);
  return v === id;
}

function addToSelection(selections, cat, id) {
  const v = selections[cat];
  const isMulti = Array.isArray(v) || (v === null && (cat === "cheese" || cat === "sauce" || cat === "topping"));
  if (isMulti) {
    return { ...selections, [cat]: [...(Array.isArray(v) ? v : []), id] };
  }
  return { ...selections, [cat]: id };
}
