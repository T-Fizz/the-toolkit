/*
 * Cocktail bar ingredients — the inventory vocabulary the app knows about.
 * Each entry has:
 *   cat:    category (for grouping in bar setup UI)
 *   label:  display name
 *   subs:   acceptable substitutes (when a recipe calls for X but you have sub Y,
 *           show it as "close enough" — not perfect, but bartender-acceptable)
 *   starter: whether to pre-check this in a "well-stocked generic bar"
 */

export const INGREDIENTS = {
  // ═══ BASE SPIRITS ═══════════════════════════════════════════════════
  gin_london_dry:     { cat: "spirit", label: "Gin (London Dry)",        subs: ["gin_old_tom"], starter: true },
  gin_old_tom:        { cat: "spirit", label: "Gin (Old Tom)",           subs: ["gin_london_dry"], starter: false },
  vodka:              { cat: "spirit", label: "Vodka",                    subs: [], starter: true },
  rye_whiskey:        { cat: "spirit", label: "Rye Whiskey",              subs: ["bourbon"], starter: true },
  bourbon:            { cat: "spirit", label: "Bourbon",                  subs: ["rye_whiskey"], starter: true },
  scotch_blended:     { cat: "spirit", label: "Scotch (Blended)",         subs: ["scotch_single_malt"], starter: false },
  scotch_single_malt: { cat: "spirit", label: "Scotch (Single Malt)",     subs: ["scotch_blended"], starter: false },
  tequila_blanco:     { cat: "spirit", label: "Tequila Blanco",           subs: ["tequila_reposado"], starter: true },
  tequila_reposado:   { cat: "spirit", label: "Tequila Reposado",         subs: ["tequila_blanco"], starter: false },
  mezcal:             { cat: "spirit", label: "Mezcal",                   subs: [], starter: true },
  rum_white:          { cat: "spirit", label: "White Rum",                subs: [], starter: true },
  rum_aged:           { cat: "spirit", label: "Aged Rum",                 subs: ["rum_dark"], starter: true },
  rum_dark:           { cat: "spirit", label: "Dark Rum (Jamaican/Demerara)", subs: ["rum_aged"], starter: false },
  cognac:             { cat: "spirit", label: "Cognac / Brandy",          subs: [], starter: false },
  absinthe:           { cat: "spirit", label: "Absinthe (rinse/spritz)",  subs: ["pastis"], starter: false },
  pastis:             { cat: "spirit", label: "Pastis (Pernod/Ricard)",   subs: ["absinthe"], starter: false },

  // ═══ FORTIFIED WINES ═══════════════════════════════════════════════
  vermouth_dry:       { cat: "fortified", label: "Dry Vermouth",          subs: [], starter: true },
  vermouth_sweet:     { cat: "fortified", label: "Sweet Vermouth",        subs: [], starter: true },
  lillet_blanc:       { cat: "fortified", label: "Lillet Blanc",          subs: ["cocchi_americano"], starter: false },
  cocchi_americano:   { cat: "fortified", label: "Cocchi Americano",      subs: ["lillet_blanc"], starter: false },

  // ═══ LIQUEURS & AMARI ═══════════════════════════════════════════════
  campari:            { cat: "liqueur", label: "Campari",                 subs: [], starter: true },
  aperol:             { cat: "liqueur", label: "Aperol",                  subs: [], starter: true },
  cointreau:          { cat: "liqueur", label: "Cointreau",               subs: ["triple_sec", "grand_marnier"], starter: true },
  triple_sec:         { cat: "liqueur", label: "Triple Sec",              subs: ["cointreau", "grand_marnier"], starter: false },
  grand_marnier:      { cat: "liqueur", label: "Grand Marnier",           subs: ["cointreau"], starter: false },
  maraschino:         { cat: "liqueur", label: "Maraschino (Luxardo)",    subs: [], starter: false },
  chartreuse_green:   { cat: "liqueur", label: "Green Chartreuse",        subs: [], starter: false },
  chartreuse_yellow:  { cat: "liqueur", label: "Yellow Chartreuse",       subs: [], starter: false },
  benedictine:        { cat: "liqueur", label: "Bénédictine",             subs: [], starter: false },
  amaro_nonino:       { cat: "liqueur", label: "Amaro Nonino",            subs: ["amaro_averna"], starter: false },
  amaro_averna:       { cat: "liqueur", label: "Amaro Averna",            subs: ["amaro_nonino"], starter: false },
  fernet_branca:      { cat: "liqueur", label: "Fernet Branca",           subs: [], starter: false },
  creme_de_violette:  { cat: "liqueur", label: "Crème de Violette",       subs: [], starter: false },
  creme_de_mure:      { cat: "liqueur", label: "Crème de Mûre (blackberry)", subs: [], starter: false },
  st_germain:         { cat: "liqueur", label: "St-Germain (elderflower)", subs: [], starter: false },
  kahlua:             { cat: "liqueur", label: "Kahlúa (coffee)",         subs: [], starter: false },
  drambuie:           { cat: "liqueur", label: "Drambuie",                subs: [], starter: false },

  // ═══ SYRUPS ════════════════════════════════════════════════════════
  simple_syrup:       { cat: "syrup", label: "Simple Syrup",              subs: [], starter: true },
  demerara_syrup:     { cat: "syrup", label: "Demerara Syrup",            subs: ["simple_syrup"], starter: false },
  honey_syrup:        { cat: "syrup", label: "Honey Syrup (1:1 honey+water)", subs: [], starter: false },
  agave_syrup:        { cat: "syrup", label: "Agave Syrup",               subs: ["simple_syrup"], starter: false },
  grenadine:          { cat: "syrup", label: "Grenadine (real pomegranate)", subs: [], starter: false },
  orgeat:             { cat: "syrup", label: "Orgeat (almond)",           subs: [], starter: false },
  ginger_syrup:       { cat: "syrup", label: "Ginger Syrup",              subs: [], starter: false },
  raspberry_syrup:    { cat: "syrup", label: "Raspberry Syrup",           subs: [], starter: false },

  // ═══ BITTERS ═══════════════════════════════════════════════════════
  angostura:          { cat: "bitters", label: "Angostura Bitters",       subs: [], starter: true },
  orange_bitters:     { cat: "bitters", label: "Orange Bitters",          subs: [], starter: true },
  peychauds:          { cat: "bitters", label: "Peychaud's Bitters",      subs: [], starter: false },

  // ═══ CITRUS ════════════════════════════════════════════════════════
  lemon:              { cat: "citrus", label: "Lemon",                    subs: [], starter: true },
  lime:               { cat: "citrus", label: "Lime",                     subs: [], starter: true },
  orange:             { cat: "citrus", label: "Orange",                   subs: [], starter: true },
  grapefruit:         { cat: "citrus", label: "Grapefruit",               subs: [], starter: false },

  // ═══ MIXERS & OTHER ════════════════════════════════════════════════
  soda_water:         { cat: "mixer", label: "Soda Water",                subs: [], starter: true },
  tonic_water:        { cat: "mixer", label: "Tonic Water",               subs: [], starter: true },
  ginger_beer:        { cat: "mixer", label: "Ginger Beer",               subs: [], starter: true },
  champagne:          { cat: "mixer", label: "Champagne / Prosecco / Cava", subs: [], starter: false },
  pineapple_juice:    { cat: "mixer", label: "Pineapple Juice",           subs: [], starter: false },
  cold_brew:          { cat: "mixer", label: "Cold Brew / Espresso",      subs: [], starter: false },

  // ═══ FRESH / GARNISH ═══════════════════════════════════════════════
  mint:               { cat: "fresh", label: "Mint (fresh)",              subs: [], starter: false },
  cucumber:           { cat: "fresh", label: "Cucumber",                  subs: [], starter: false },
  egg_white:          { cat: "fresh", label: "Egg White",                 subs: [], starter: false },
};

// Helpful derived groupings for the bar-setup UI.
export const CATEGORIES = [
  { id: "spirit",    label: "Spirits" },
  { id: "fortified", label: "Fortified Wines" },
  { id: "liqueur",   label: "Liqueurs & Amari" },
  { id: "syrup",     label: "Syrups" },
  { id: "bitters",   label: "Bitters" },
  { id: "citrus",    label: "Citrus" },
  { id: "mixer",     label: "Mixers" },
  { id: "fresh",     label: "Fresh / Garnish" },
];

export function ingredient(id) { return INGREDIENTS[id]; }

export function starterBar() {
  return new Set(Object.keys(INGREDIENTS).filter((id) => INGREDIENTS[id].starter));
}
