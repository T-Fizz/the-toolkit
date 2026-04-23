import { evaluate } from "./scoring.js";

/*
 * CANONICAL SANDWICHES — build specs that MUST evaluate() clean.
 * If any of these fail, the scoring weights / role budgets are over-restrictive
 * and should be tuned. Ran at module load; logs a warning to the console in dev.
 *
 * Each entry lists every ingredient ID that would be selected to build that
 * sandwich. Selections object shape matches what the UI uses.
 */

function sel(base, cheese, sauce, mustard, topping) {
  return { base, cheese, sauce, mustard, topping };
}

export const CANONICAL_SANDWICHES = [
  { name: "Caprese", build: sel("ciabatta", ["mozzarella"], ["pesto"], null, ["tomato", "arugula"]) },
  { name: "Italian Sub", build: sel("ciabatta", ["provolone"], ["marinara", "aioli"], null, ["pepperoni", "lil_mamas"]) },
  { name: "Chicken Parm (garlic bread)", build: sel("ciabatta", ["mozzarella", "parmigiano"], ["marinara", "garlic_butter"], null, ["chicken"]) },
  { name: "Fig & Brie Chicken", build: sel("sourdough", ["brie"], ["fig_jam", "aioli"], null, ["chicken", "arugula"]) },
  { name: "Fig Prosciutto", build: sel("sourdough", ["aged_gouda"], ["fig_jam"], null, ["prosciutto", "arugula"]) },
  { name: "Nashville Hot Chicken", build: sel("brioche_bun", ["sharp_cheddar"], ["hot_honey", "mayo"], null, ["chicken", "dill_pickles", "pickled_japs"]) },
  { name: "NY Pastrami", build: sel("sourdough", ["gruyere"], [], "stout_beer", ["pastrami", "dill_pickles"]) },
  { name: "Greek Chicken", build: sel("ciabatta", ["feta"], ["aioli"], "lemon_garlic", ["chicken", "roasted_red_pepper", "arugula", "tomato"]) },
  { name: "BBQ Cheddar Chicken", build: sel("roll", ["sharp_cheddar", "red_dragon"], ["bbq"], "chipotle_cerveza", ["chicken", "french_onions"]) },
  { name: "Buffalo Ranch Chicken", build: sel("brioche_bun", ["monterey_jack"], ["buffalo", "ranch"], null, ["chicken", "dill_pickles"]) },
  { name: "Classic Breakfast Melt", build: sel("muffin", ["sharp_cheddar"], ["mayo"], null, ["egg", "bacon"]) },
  { name: "French Onion Sub", build: sel("baguette", ["comte"], [], "stout_beer", ["chicken", "french_onions"]) },
  { name: "Cheesesteak", build: sel("roll", ["provolone"], [], null, ["shaved_steak", "french_onions"]) },
  { name: "Korean-style Steak", build: sel("brioche_bun", ["pepper_jack"], ["sriracha_mayo"], null, ["shaved_steak", "pickled_red_onion", "lettuce"]) },
  { name: "Goat Cheese + Roasted Pepper", build: sel("sourdough", ["goat_cheese"], ["pesto"], null, ["chicken", "roasted_red_pepper", "arugula"]) },
  { name: "Turkey Club", build: sel("sandwich_bread", ["sharp_cheddar"], ["mayo"], null, ["turkey", "bacon", "lettuce", "tomato"]) },
  { name: "Cheese Melt Only (no protein)", build: sel("sourdough", ["comte", "raclette"], ["garlic_butter"], null, []) },
];

// Validate at module load — dev only (silent in prod).
if (typeof process === "undefined" || process.env?.NODE_ENV !== "production") {
  const failures = [];
  for (const { name, build } of CANONICAL_SANDWICHES) {
    const { blocked, reason } = evaluate(build);
    if (blocked) failures.push({ name, reason });
  }
  if (failures.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[sandwich-cheatsheet] ${failures.length} canonical sandwich(es) fail scoring:`,
      failures,
    );
  } else {
    // eslint-disable-next-line no-console
    console.info(`[sandwich-cheatsheet] all ${CANONICAL_SANDWICHES.length} canonical sandwiches pass ✓`);
  }
}
