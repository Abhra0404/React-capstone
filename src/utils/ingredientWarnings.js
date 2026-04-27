// Detects controversial / harmful ingredients in a product.

const HARMFUL_KEYWORDS = [
  { match: /high[-\s]?fructose corn syrup|hfcs/i, label: 'High-Fructose Corn Syrup', severity: 'high' },
  { match: /partially hydrogenated|trans[-\s]?fat/i, label: 'Trans Fats', severity: 'high' },
  { match: /\bmsg\b|monosodium glutamate/i, label: 'Monosodium Glutamate (MSG)', severity: 'medium' },
  { match: /aspartame/i, label: 'Aspartame (artificial sweetener)', severity: 'medium' },
  { match: /sucralose/i, label: 'Sucralose (artificial sweetener)', severity: 'medium' },
  { match: /saccharin/i, label: 'Saccharin (artificial sweetener)', severity: 'medium' },
  { match: /sodium nitrite|sodium nitrate/i, label: 'Sodium Nitrite/Nitrate', severity: 'high' },
  { match: /bha\b|butylated hydroxyanisole/i, label: 'BHA Preservative', severity: 'high' },
  { match: /bht\b|butylated hydroxytoluene/i, label: 'BHT Preservative', severity: 'high' },
  { match: /potassium bromate/i, label: 'Potassium Bromate', severity: 'high' },
  { match: /carrageenan/i, label: 'Carrageenan', severity: 'medium' },
  { match: /palm oil/i, label: 'Palm Oil', severity: 'low' },
  { match: /artificial colou?r|red 40|yellow 5|yellow 6|blue 1|tartrazine/i, label: 'Artificial Colors', severity: 'medium' },
  { match: /artificial flavou?r/i, label: 'Artificial Flavors', severity: 'low' },
  { match: /added sugar|invert sugar|dextrose|glucose syrup|corn syrup/i, label: 'Added Sugars', severity: 'medium' },
];

// Risky additive E-numbers commonly flagged.
const RISKY_E_NUMBERS = new Set([
  'E102', 'E104', 'E110', 'E122', 'E124', 'E129', // azo dyes
  'E211', 'E212', 'E213', // benzoates
  'E220', 'E221', 'E222', 'E223', 'E224', 'E226', 'E227', 'E228', // sulfites
  'E249', 'E250', 'E251', 'E252', // nitrites/nitrates
  'E320', 'E321', // BHA/BHT
  'E407', // carrageenan
  'E621', // MSG
  'E950', 'E951', 'E952', 'E954', 'E955', // artificial sweeteners
]);

export function detectWarnings(product) {
  const warnings = [];
  const seen = new Set();

  const text = product.ingredientsText || '';
  for (const rule of HARMFUL_KEYWORDS) {
    if (rule.match.test(text) && !seen.has(rule.label)) {
      warnings.push({ label: rule.label, severity: rule.severity, source: 'ingredients' });
      seen.add(rule.label);
    }
  }

  for (const add of product.additives || []) {
    const code = add.toUpperCase();
    if (RISKY_E_NUMBERS.has(code) && !seen.has(code)) {
      warnings.push({
        label: `${code} – risky additive`,
        severity: 'medium',
        source: 'additive',
      });
      seen.add(code);
    }
  }

  // Sugar/salt heuristics on nutrients
  const n = product.nutrients || {};
  if (n.sugar != null && n.sugar >= 22.5 && !seen.has('high-sugar')) {
    warnings.push({ label: `Very high sugar (${n.sugar.toFixed(1)} g / 100g)`, severity: 'high', source: 'nutrient' });
    seen.add('high-sugar');
  }
  const saltG = n.salt != null ? n.salt : n.sodium != null ? n.sodium * 2.5 : null;
  if (saltG != null && saltG >= 1.5 && !seen.has('high-salt')) {
    warnings.push({ label: `High salt (${saltG.toFixed(2)} g / 100g)`, severity: 'high', source: 'nutrient' });
    seen.add('high-salt');
  }

  return warnings;
}
