/*
 * Canonical cocktail recipes with exact measurements, technique, glassware.
 *
 *   ingredients:  [{ id, qty, optional?, note? }] — referenced from ingredients.js
 *   technique:    "stir" | "shake" | "build" | "swizzle" | "dry-shake-then-shake"
 *   glass:        display string
 *   garnish:      display string
 *   flavor:       0-5 on each of { bitter, sweet, sour, boozy, herbal, fruity, smoky }
 *   tags:         "classic" | "modern" | "brunch" | "tiki" | "spritz" | "digestif" | "nightcap" | ...
 *   notes:        one-line extra context
 */

export const RECIPES = [
  // ── Gin-forward ─────────────────────────────────────────────────────
  {
    name: "Martini (Dry)", emoji: "🍸", glass: "coupe", technique: "stir", garnish: "olive or lemon twist",
    ingredients: [
      { id: "gin_london_dry", qty: "2.5 oz" },
      { id: "vermouth_dry", qty: "0.5 oz" },
      { id: "orange_bitters", qty: "1 dash", optional: true },
    ],
    flavor: { bitter: 1, sweet: 1, sour: 0, boozy: 5, herbal: 3, fruity: 0, smoky: 0 },
    tags: ["classic", "stirred"],
    notes: "Stir 30 seconds over cracked ice. Chill the glass.",
  },
  {
    name: "Negroni", emoji: "🇮🇹", glass: "rocks, big cube", technique: "stir", garnish: "orange peel",
    ingredients: [
      { id: "gin_london_dry", qty: "1 oz" },
      { id: "campari", qty: "1 oz" },
      { id: "vermouth_sweet", qty: "1 oz" },
    ],
    flavor: { bitter: 4, sweet: 2, sour: 0, boozy: 4, herbal: 3, fruity: 1, smoky: 0 },
    tags: ["classic", "bitter", "aperitif"],
    notes: "Equal parts. Stir, strain over a big cube. Express orange peel.",
  },
  {
    name: "White Negroni", emoji: "🤍", glass: "rocks, big cube", technique: "stir", garnish: "lemon peel",
    ingredients: [
      { id: "gin_london_dry", qty: "1.25 oz" },
      { id: "lillet_blanc", qty: "1 oz" },
      { id: "chartreuse_yellow", qty: "0.75 oz" }, // suze is classic, yellow chartreuse as practical sub
    ],
    flavor: { bitter: 3, sweet: 2, sour: 0, boozy: 4, herbal: 4, fruity: 1, smoky: 0 },
    tags: ["modern", "bitter"],
    notes: "Proper recipe uses Suze; this version uses yellow Chartreuse for its herbal-floral bitterness.",
  },
  {
    name: "Aviation", emoji: "✈️", glass: "coupe", technique: "shake", garnish: "brandied cherry",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "maraschino", qty: "0.5 oz" },
      { id: "creme_de_violette", qty: "0.25 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 2, fruity: 2, smoky: 0 },
    tags: ["classic", "floral"],
  },
  {
    name: "Last Word", emoji: "🌿", glass: "coupe", technique: "shake", garnish: "brandied cherry",
    ingredients: [
      { id: "gin_london_dry", qty: "0.75 oz" },
      { id: "chartreuse_green", qty: "0.75 oz" },
      { id: "maraschino", qty: "0.75 oz" },
      { id: "lime", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 1, sweet: 2, sour: 3, boozy: 3, herbal: 5, fruity: 1, smoky: 0 },
    tags: ["classic", "herbal"],
    notes: "Equal parts. Shake hard — green chartreuse needs aeration.",
  },
  {
    name: "Corpse Reviver #2", emoji: "🪦", glass: "coupe", technique: "shake", garnish: "orange peel",
    ingredients: [
      { id: "gin_london_dry", qty: "0.75 oz" },
      { id: "cointreau", qty: "0.75 oz" },
      { id: "lillet_blanc", qty: "0.75 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
      { id: "absinthe", qty: "rinse the glass", optional: true },
    ],
    flavor: { bitter: 1, sweet: 2, sour: 3, boozy: 3, herbal: 3, fruity: 2, smoky: 0 },
    tags: ["classic"],
  },
  {
    name: "French 75", emoji: "🇫🇷", glass: "flute", technique: "shake-then-top", garnish: "lemon twist",
    ingredients: [
      { id: "gin_london_dry", qty: "1 oz" },
      { id: "lemon", qty: "0.5 oz juice" },
      { id: "simple_syrup", qty: "0.5 oz" },
      { id: "champagne", qty: "top" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 2, fruity: 1, smoky: 0 },
    tags: ["classic", "brunch", "bubbly"],
  },
  {
    name: "Tom Collins", emoji: "🧊", glass: "collins", technique: "shake-then-top", garnish: "lemon + cherry",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "lemon", qty: "1 oz juice" },
      { id: "simple_syrup", qty: "0.75 oz" },
      { id: "soda_water", qty: "top" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 2, herbal: 1, fruity: 1, smoky: 0 },
    tags: ["classic", "long", "refreshing"],
  },
  {
    name: "Gin Fizz", emoji: "✨", glass: "fizz", technique: "dry-shake-then-shake", garnish: "none",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
      { id: "simple_syrup", qty: "0.5 oz" },
      { id: "egg_white", qty: "1" },
      { id: "soda_water", qty: "top" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 2, herbal: 1, fruity: 1, smoky: 0 },
    tags: ["classic", "foamy"],
    notes: "Dry-shake first (no ice) to build foam, then shake with ice.",
  },
  {
    name: "Bee's Knees", emoji: "🐝", glass: "coupe", technique: "shake", garnish: "lemon twist",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
      { id: "honey_syrup", qty: "0.75 oz" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 3, boozy: 2, herbal: 1, fruity: 1, smoky: 0 },
    tags: ["classic", "honey"],
  },
  {
    name: "Gimlet", emoji: "🧪", glass: "coupe", technique: "shake", garnish: "lime wheel",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "lime", qty: "0.75 oz juice" },
      { id: "simple_syrup", qty: "0.5 oz" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 1, fruity: 1, smoky: 0 },
    tags: ["classic", "tart"],
  },
  {
    name: "Clover Club", emoji: "🌺", glass: "coupe", technique: "dry-shake-then-shake", garnish: "raspberries",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "lemon", qty: "0.5 oz juice" },
      { id: "raspberry_syrup", qty: "0.5 oz" },
      { id: "egg_white", qty: "1" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 3, boozy: 2, herbal: 0, fruity: 3, smoky: 0 },
    tags: ["classic", "foamy"],
  },
  {
    name: "Hanky Panky", emoji: "🎩", glass: "coupe", technique: "stir", garnish: "orange peel",
    ingredients: [
      { id: "gin_london_dry", qty: "1.5 oz" },
      { id: "vermouth_sweet", qty: "1.5 oz" },
      { id: "fernet_branca", qty: "2 dashes (~0.125 oz)" },
    ],
    flavor: { bitter: 3, sweet: 2, sour: 0, boozy: 4, herbal: 4, fruity: 0, smoky: 0 },
    tags: ["classic"],
  },
  {
    name: "Bramble", emoji: "🫐", glass: "rocks, crushed ice", technique: "shake", garnish: "blackberry + lemon",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "lemon", qty: "1 oz juice" },
      { id: "simple_syrup", qty: "0.5 oz" },
      { id: "creme_de_mure", qty: "0.5 oz (drizzled on top)" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 3, boozy: 2, herbal: 1, fruity: 4, smoky: 0 },
    tags: ["modern"],
    notes: "Drizzle the mûre over crushed ice so it bleeds down. '80s Dick Bradsell classic.",
  },

  // ── Whiskey-forward ────────────────────────────────────────────────
  {
    name: "Old Fashioned", emoji: "🥃", glass: "rocks, big cube", technique: "build-and-stir", garnish: "orange peel",
    ingredients: [
      { id: "bourbon", qty: "2 oz" },
      { id: "demerara_syrup", qty: "0.25 oz" },
      { id: "angostura", qty: "2 dashes" },
      { id: "orange_bitters", qty: "1 dash", optional: true },
    ],
    flavor: { bitter: 2, sweet: 2, sour: 0, boozy: 5, herbal: 1, fruity: 1, smoky: 0 },
    tags: ["classic", "stirred"],
    notes: "Stir with a couple of cubes, strain over a big cube. Express orange peel over top.",
  },
  {
    name: "Manhattan", emoji: "🏙️", glass: "coupe", technique: "stir", garnish: "brandied cherry",
    ingredients: [
      { id: "rye_whiskey", qty: "2 oz" },
      { id: "vermouth_sweet", qty: "1 oz" },
      { id: "angostura", qty: "2 dashes" },
    ],
    flavor: { bitter: 2, sweet: 2, sour: 0, boozy: 5, herbal: 2, fruity: 1, smoky: 0 },
    tags: ["classic", "stirred"],
  },
  {
    name: "Black Manhattan", emoji: "🖤", glass: "coupe", technique: "stir", garnish: "brandied cherry",
    ingredients: [
      { id: "rye_whiskey", qty: "2 oz" },
      { id: "amaro_averna", qty: "1 oz" },
      { id: "angostura", qty: "1 dash" },
      { id: "orange_bitters", qty: "1 dash" },
    ],
    flavor: { bitter: 3, sweet: 2, sour: 0, boozy: 4, herbal: 3, fruity: 1, smoky: 0 },
    tags: ["modern", "stirred"],
  },
  {
    name: "Sazerac", emoji: "🌊", glass: "rocks (chilled, no ice)", technique: "stir", garnish: "lemon peel (discarded)",
    ingredients: [
      { id: "rye_whiskey", qty: "2 oz" },
      { id: "demerara_syrup", qty: "0.25 oz" },
      { id: "peychauds", qty: "3 dashes" },
      { id: "angostura", qty: "1 dash", optional: true },
      { id: "absinthe", qty: "rinse the glass" },
    ],
    flavor: { bitter: 2, sweet: 1, sour: 0, boozy: 5, herbal: 4, fruity: 0, smoky: 0 },
    tags: ["classic", "stirred"],
    notes: "Rinse the chilled glass with absinthe, dump. Stir everything else, strain in. Twist lemon over, discard.",
  },
  {
    name: "Whiskey Sour", emoji: "🍋", glass: "rocks", technique: "dry-shake-then-shake", garnish: "lemon + cherry",
    ingredients: [
      { id: "bourbon", qty: "2 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
      { id: "simple_syrup", qty: "0.75 oz" },
      { id: "egg_white", qty: "1", optional: true },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 0, fruity: 1, smoky: 0 },
    tags: ["classic"],
  },
  {
    name: "Paper Plane", emoji: "🛩️", glass: "coupe", technique: "shake", garnish: "none",
    ingredients: [
      { id: "bourbon", qty: "0.75 oz" },
      { id: "aperol", qty: "0.75 oz" },
      { id: "amaro_nonino", qty: "0.75 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 2, sweet: 2, sour: 3, boozy: 3, herbal: 2, fruity: 2, smoky: 0 },
    tags: ["modern", "bitter"],
    notes: "Equal parts. Sam Ross classic.",
  },
  {
    name: "Penicillin", emoji: "🩹", glass: "rocks, big cube", technique: "shake", garnish: "candied ginger",
    ingredients: [
      { id: "scotch_blended", qty: "2 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
      { id: "honey_syrup", qty: "0.375 oz" },
      { id: "ginger_syrup", qty: "0.375 oz" },
      { id: "scotch_single_malt", qty: "0.25 oz float", optional: true, note: "Islay peated if possible" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 3, boozy: 3, herbal: 1, fruity: 0, smoky: 3 },
    tags: ["modern"],
    notes: "Sam Ross classic. The smoky float is not optional to its character.",
  },
  {
    name: "Gold Rush", emoji: "🏆", glass: "rocks, big cube", technique: "shake", garnish: "lemon twist",
    ingredients: [
      { id: "bourbon", qty: "2 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
      { id: "honey_syrup", qty: "0.75 oz" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 3, boozy: 3, herbal: 0, fruity: 1, smoky: 0 },
    tags: ["modern"],
  },
  {
    name: "Boulevardier", emoji: "🌆", glass: "rocks, big cube", technique: "stir", garnish: "orange peel",
    ingredients: [
      { id: "bourbon", qty: "1.5 oz" },
      { id: "campari", qty: "1 oz" },
      { id: "vermouth_sweet", qty: "1 oz" },
    ],
    flavor: { bitter: 4, sweet: 2, sour: 0, boozy: 5, herbal: 3, fruity: 1, smoky: 0 },
    tags: ["classic", "bitter"],
    notes: "Whiskey negroni. Classic ratio is 1.5:1:1.",
  },
  {
    name: "Toronto", emoji: "🍁", glass: "rocks, big cube", technique: "stir", garnish: "orange peel",
    ingredients: [
      { id: "rye_whiskey", qty: "2 oz" },
      { id: "fernet_branca", qty: "0.25 oz" },
      { id: "demerara_syrup", qty: "0.25 oz" },
      { id: "angostura", qty: "2 dashes" },
    ],
    flavor: { bitter: 3, sweet: 2, sour: 0, boozy: 5, herbal: 4, fruity: 0, smoky: 0 },
    tags: ["classic", "bitter"],
  },
  {
    name: "Mint Julep", emoji: "🌱", glass: "julep cup / rocks + crushed ice", technique: "muddle-and-swizzle", garnish: "mint bouquet",
    ingredients: [
      { id: "bourbon", qty: "2.5 oz" },
      { id: "simple_syrup", qty: "0.5 oz" },
      { id: "mint", qty: "8-10 leaves" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 0, boozy: 4, herbal: 4, fruity: 0, smoky: 0 },
    tags: ["classic"],
    notes: "Gently bruise mint with syrup; fill with crushed ice and bourbon; swizzle.",
  },

  // ── Rum ────────────────────────────────────────────────────────────
  {
    name: "Daiquiri", emoji: "🥥", glass: "coupe", technique: "shake", garnish: "lime wheel",
    ingredients: [
      { id: "rum_white", qty: "2 oz" },
      { id: "lime", qty: "0.75 oz juice" },
      { id: "simple_syrup", qty: "0.75 oz" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 1, fruity: 1, smoky: 0 },
    tags: ["classic"],
    notes: "The real one. Not frozen, not strawberry.",
  },
  {
    name: "Mojito", emoji: "🌿", glass: "collins, crushed ice", technique: "build-and-swizzle", garnish: "mint bouquet + lime",
    ingredients: [
      { id: "rum_white", qty: "2 oz" },
      { id: "lime", qty: "0.75 oz juice" },
      { id: "simple_syrup", qty: "0.5 oz" },
      { id: "mint", qty: "8 leaves" },
      { id: "soda_water", qty: "top" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 2, herbal: 3, fruity: 1, smoky: 0 },
    tags: ["classic", "long", "refreshing"],
  },
  {
    name: "Dark 'n Stormy", emoji: "⛈️", glass: "collins", technique: "build", garnish: "lime wedge",
    ingredients: [
      { id: "rum_dark", qty: "2 oz" },
      { id: "ginger_beer", qty: "4 oz" },
      { id: "lime", qty: "0.5 oz juice" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 2, boozy: 2, herbal: 0, fruity: 1, smoky: 1 },
    tags: ["classic", "long"],
  },
  {
    name: "Jungle Bird", emoji: "🦜", glass: "rocks", technique: "shake", garnish: "pineapple frond",
    ingredients: [
      { id: "rum_dark", qty: "1.5 oz" },
      { id: "campari", qty: "0.75 oz" },
      { id: "pineapple_juice", qty: "1.5 oz" },
      { id: "lime", qty: "0.5 oz juice" },
      { id: "demerara_syrup", qty: "0.5 oz" },
    ],
    flavor: { bitter: 3, sweet: 2, sour: 2, boozy: 3, herbal: 1, fruity: 3, smoky: 0 },
    tags: ["tiki", "bitter"],
  },
  {
    name: "Mai Tai", emoji: "🌺", glass: "rocks, crushed ice", technique: "shake", garnish: "mint + lime",
    ingredients: [
      { id: "rum_aged", qty: "1 oz" },
      { id: "rum_dark", qty: "1 oz" },
      { id: "cointreau", qty: "0.5 oz" },
      { id: "orgeat", qty: "0.5 oz" },
      { id: "lime", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 3, boozy: 3, herbal: 1, fruity: 2, smoky: 0 },
    tags: ["classic", "tiki"],
    notes: "Trader Vic version. Dark rum float on top.",
  },
  {
    name: "Air Mail", emoji: "📮", glass: "flute", technique: "shake-then-top", garnish: "lime twist",
    ingredients: [
      { id: "rum_aged", qty: "1.5 oz" },
      { id: "lime", qty: "0.5 oz juice" },
      { id: "honey_syrup", qty: "0.5 oz" },
      { id: "champagne", qty: "top" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 2, boozy: 3, herbal: 0, fruity: 1, smoky: 0 },
    tags: ["classic", "bubbly"],
  },

  // ── Tequila / Mezcal ───────────────────────────────────────────────
  {
    name: "Margarita", emoji: "🧂", glass: "coupe or rocks (salt rim)", technique: "shake", garnish: "lime wheel",
    ingredients: [
      { id: "tequila_blanco", qty: "2 oz" },
      { id: "cointreau", qty: "1 oz" },
      { id: "lime", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 1, fruity: 1, smoky: 0 },
    tags: ["classic"],
  },
  {
    name: "Tommy's Margarita", emoji: "🌵", glass: "rocks", technique: "shake", garnish: "lime wheel",
    ingredients: [
      { id: "tequila_blanco", qty: "2 oz" },
      { id: "lime", qty: "1 oz juice" },
      { id: "agave_syrup", qty: "0.5 oz" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 1, fruity: 0, smoky: 0 },
    tags: ["modern"],
  },
  {
    name: "Paloma", emoji: "🕊️", glass: "highball (salt rim)", technique: "build", garnish: "lime wedge",
    ingredients: [
      { id: "tequila_blanco", qty: "2 oz" },
      { id: "lime", qty: "0.5 oz juice" },
      { id: "grapefruit", qty: "2 oz juice" },
      { id: "simple_syrup", qty: "0.25 oz", optional: true },
      { id: "soda_water", qty: "top" },
    ],
    flavor: { bitter: 1, sweet: 2, sour: 3, boozy: 2, herbal: 0, fruity: 3, smoky: 0 },
    tags: ["classic", "long", "refreshing"],
  },
  {
    name: "Oaxaca Old Fashioned", emoji: "🏜️", glass: "rocks, big cube", technique: "stir", garnish: "orange peel (flamed)",
    ingredients: [
      { id: "tequila_reposado", qty: "1.5 oz" },
      { id: "mezcal", qty: "0.5 oz" },
      { id: "agave_syrup", qty: "0.25 oz" },
      { id: "angostura", qty: "2 dashes" },
    ],
    flavor: { bitter: 1, sweet: 1, sour: 0, boozy: 5, herbal: 1, fruity: 1, smoky: 3 },
    tags: ["modern", "stirred"],
  },
  {
    name: "Naked and Famous", emoji: "🔥", glass: "coupe", technique: "shake", garnish: "none",
    ingredients: [
      { id: "mezcal", qty: "0.75 oz" },
      { id: "aperol", qty: "0.75 oz" },
      { id: "chartreuse_yellow", qty: "0.75 oz" },
      { id: "lime", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 2, sweet: 2, sour: 3, boozy: 3, herbal: 3, fruity: 2, smoky: 3 },
    tags: ["modern"],
  },
  {
    name: "Division Bell", emoji: "🔔", glass: "coupe", technique: "shake", garnish: "grapefruit twist",
    ingredients: [
      { id: "mezcal", qty: "1 oz" },
      { id: "aperol", qty: "0.75 oz" },
      { id: "maraschino", qty: "0.5 oz" },
      { id: "lime", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 2, sweet: 2, sour: 3, boozy: 3, herbal: 2, fruity: 2, smoky: 3 },
    tags: ["modern"],
  },

  // ── Cognac / Brandy ────────────────────────────────────────────────
  {
    name: "Sidecar", emoji: "🏍️", glass: "coupe (sugar rim)", technique: "shake", garnish: "orange twist",
    ingredients: [
      { id: "cognac", qty: "2 oz" },
      { id: "cointreau", qty: "0.75 oz" },
      { id: "lemon", qty: "0.75 oz juice" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 3, boozy: 3, herbal: 1, fruity: 2, smoky: 0 },
    tags: ["classic"],
  },

  // ── Vodka ──────────────────────────────────────────────────────────
  {
    name: "Moscow Mule", emoji: "🫏", glass: "copper mug", technique: "build", garnish: "lime wedge",
    ingredients: [
      { id: "vodka", qty: "2 oz" },
      { id: "lime", qty: "0.5 oz juice" },
      { id: "ginger_beer", qty: "4 oz" },
    ],
    flavor: { bitter: 0, sweet: 2, sour: 2, boozy: 2, herbal: 0, fruity: 1, smoky: 0 },
    tags: ["classic", "long"],
  },
  {
    name: "Espresso Martini", emoji: "☕", glass: "coupe", technique: "shake", garnish: "3 coffee beans",
    ingredients: [
      { id: "vodka", qty: "1.5 oz" },
      { id: "kahlua", qty: "0.5 oz" },
      { id: "cold_brew", qty: "1 oz" },
      { id: "simple_syrup", qty: "0.25 oz" },
    ],
    flavor: { bitter: 2, sweet: 2, sour: 0, boozy: 3, herbal: 0, fruity: 0, smoky: 1 },
    tags: ["modern"],
    notes: "Shake hard for the foam. Cold brew concentrate = cleaner than instant espresso.",
  },
  {
    name: "Vesper", emoji: "🕴️", glass: "coupe", technique: "shake (per Bond) or stir", garnish: "lemon twist",
    ingredients: [
      { id: "gin_london_dry", qty: "2 oz" },
      { id: "vodka", qty: "0.5 oz" },
      { id: "lillet_blanc", qty: "0.25 oz" },
    ],
    flavor: { bitter: 1, sweet: 1, sour: 0, boozy: 5, herbal: 2, fruity: 0, smoky: 0 },
    tags: ["classic", "stirred"],
  },

  // ── Aperitif / Spritz / Low-ABV ────────────────────────────────────
  {
    name: "Aperol Spritz", emoji: "🍊", glass: "wine glass", technique: "build", garnish: "orange slice",
    ingredients: [
      { id: "aperol", qty: "3 oz" },
      { id: "champagne", qty: "3 oz" },
      { id: "soda_water", qty: "1 oz splash" },
    ],
    flavor: { bitter: 2, sweet: 2, sour: 1, boozy: 1, herbal: 1, fruity: 3, smoky: 0 },
    tags: ["spritz", "low-abv", "aperitif"],
  },
  {
    name: "Americano", emoji: "🌅", glass: "highball", technique: "build", garnish: "orange slice",
    ingredients: [
      { id: "campari", qty: "1.5 oz" },
      { id: "vermouth_sweet", qty: "1.5 oz" },
      { id: "soda_water", qty: "top" },
    ],
    flavor: { bitter: 3, sweet: 2, sour: 0, boozy: 1, herbal: 2, fruity: 1, smoky: 0 },
    tags: ["classic", "low-abv", "bitter"],
  },
  {
    name: "Hugo Spritz", emoji: "🌸", glass: "wine glass", technique: "build", garnish: "mint + lime",
    ingredients: [
      { id: "st_germain", qty: "1 oz" },
      { id: "champagne", qty: "3 oz" },
      { id: "soda_water", qty: "1 oz" },
      { id: "lime", qty: "0.25 oz juice" },
      { id: "mint", qty: "6 leaves" },
    ],
    flavor: { bitter: 0, sweet: 3, sour: 1, boozy: 1, herbal: 3, fruity: 2, smoky: 0 },
    tags: ["spritz", "low-abv", "floral"],
  },
];
