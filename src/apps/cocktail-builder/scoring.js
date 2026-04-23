import { INGREDIENTS } from "./ingredients.js";
import { RECIPES } from "./recipes.js";

/*
 * Matching engine.
 *
 *   matchRecipe(recipe, bar) — does the bar cover this recipe? returns
 *     { can: bool, missing: [], substitutes: [{ need, have }] }
 *
 *   availableRecipes(bar) — partition RECIPES into:
 *     { canMake, closeEnough, needMore } — based on how many required
 *     ingredients are covered (exact or acceptable sub).
 *
 *   oneBottleAway(bar) — for every ingredient you DON'T own, compute
 *     how many new canMake recipes buying it would unlock. Ranked.
 */

function has(bar, id) {
  return bar instanceof Set ? bar.has(id) : bar[id];
}

// Does the bar cover this ingredient id — either directly or via an
// acceptable substitute from INGREDIENTS[id].subs[]?
export function coverageFor(bar, id) {
  if (has(bar, id)) return { covered: true, viaSub: null };
  const subs = INGREDIENTS[id]?.subs || [];
  for (const sub of subs) {
    if (has(bar, sub)) return { covered: true, viaSub: sub };
  }
  return { covered: false, viaSub: null };
}

// Non-essential ingredients: water, ice, basic garnish. We never block on these.
const ALWAYS_ASSUMED = new Set(["soda_water"]);

export function matchRecipe(recipe, bar) {
  const missing = [];
  const substitutes = [];
  let hardMissing = 0;

  for (const line of recipe.ingredients) {
    if (line.optional) continue;
    if (ALWAYS_ASSUMED.has(line.id)) continue;
    const { covered, viaSub } = coverageFor(bar, line.id);
    if (!covered) {
      missing.push(line.id);
      hardMissing++;
    } else if (viaSub) {
      substitutes.push({ need: line.id, have: viaSub });
    }
  }
  return { can: hardMissing === 0, missing, substitutes };
}

// Partition all recipes against a bar. canMake = direct or via sub, closeEnough
// = exactly 1 ingredient short, needMore = 2+ short.
export function availableRecipes(bar) {
  const canMake = [];
  const closeEnough = [];
  const needMore = [];
  for (const recipe of RECIPES) {
    const m = matchRecipe(recipe, bar);
    if (m.can) {
      canMake.push({ recipe, ...m });
    } else if (m.missing.length === 1) {
      closeEnough.push({ recipe, ...m });
    } else {
      needMore.push({ recipe, ...m });
    }
  }
  return { canMake, closeEnough, needMore };
}

// For each unowned ingredient, count how many recipes buying it would unlock
// (move from closeEnough or needMore into canMake). Ranked desc.
export function oneBottleAway(bar) {
  const unowned = Object.keys(INGREDIENTS).filter((id) => !has(bar, id));
  const out = [];
  for (const id of unowned) {
    const hypothetical = new Set(bar instanceof Set ? bar : Object.keys(bar));
    hypothetical.add(id);
    let unlocks = [];
    for (const recipe of RECIPES) {
      // Skip ones we can already make
      if (matchRecipe(recipe, bar).can) continue;
      if (matchRecipe(recipe, hypothetical).can) unlocks.push(recipe.name);
    }
    if (unlocks.length > 0) {
      out.push({ id, label: INGREDIENTS[id].label, cat: INGREDIENTS[id].cat, unlocks });
    }
  }
  out.sort((a, b) => b.unlocks.length - a.unlocks.length);
  return out;
}

// Given a recipe, find other recipes with a similar flavor profile (Euclidean
// distance in the 7-axis space). Useful for "drinks in the neighborhood".
const FLAVOR_AXES = ["bitter", "sweet", "sour", "boozy", "herbal", "fruity", "smoky"];

export function similarRecipes(recipe, n = 3) {
  const f1 = recipe.flavor;
  const scored = RECIPES
    .filter((r) => r.name !== recipe.name)
    .map((r) => {
      const f2 = r.flavor;
      let d = 0;
      for (const a of FLAVOR_AXES) d += ((f1[a] ?? 0) - (f2[a] ?? 0)) ** 2;
      return { recipe: r, distance: Math.sqrt(d) };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n);
  return scored;
}
