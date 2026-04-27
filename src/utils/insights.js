// Generates personalized insights based on user goals and product nutrients.

export const GOALS = [
  { id: 'none', label: 'No specific goal' },
  { id: 'weight-loss', label: 'Weight loss' },
  { id: 'muscle-gain', label: 'Muscle gain' },
  { id: 'diabetic', label: 'Diabetic-friendly' },
  { id: 'heart', label: 'Heart-healthy' },
];

export function getInsights(product, goal) {
  if (!goal || goal === 'none') return [];
  const n = product.nutrients || {};
  const tips = [];

  if (goal === 'weight-loss') {
    if (n.energyKcal != null && n.energyKcal >= 400)
      tips.push({ tone: 'warn', text: `High calorie density (${Math.round(n.energyKcal)} kcal / 100g) — limit portions.` });
    if (n.sugar != null && n.sugar >= 10)
      tips.push({ tone: 'warn', text: 'Sugar content may stall weight-loss goals.' });
    if (n.fiber != null && n.fiber >= 5)
      tips.push({ tone: 'good', text: 'Good fiber content helps you feel full longer.' });
  }

  if (goal === 'muscle-gain') {
    if (n.protein != null && n.protein >= 12)
      tips.push({ tone: 'good', text: `Solid protein source (${n.protein.toFixed(1)} g / 100g).` });
    else if (n.protein != null && n.protein < 5)
      tips.push({ tone: 'warn', text: 'Low protein — pair with a protein-rich food.' });
    if (n.energyKcal != null && n.energyKcal < 150)
      tips.push({ tone: 'info', text: 'Low calorie density — may need larger portions for a surplus.' });
  }

  if (goal === 'diabetic') {
    if (n.sugar != null && n.sugar >= 5)
      tips.push({ tone: 'warn', text: `Sugar content (${n.sugar.toFixed(1)} g / 100g) may spike blood glucose.` });
    if (n.sugar != null && n.sugar < 5)
      tips.push({ tone: 'good', text: 'Low sugar content — generally diabetic-friendly.' });
    if (n.fiber != null && n.fiber >= 3)
      tips.push({ tone: 'good', text: 'Fiber helps slow sugar absorption.' });
  }

  if (goal === 'heart') {
    if (n.saturatedFat != null && n.saturatedFat >= 5)
      tips.push({ tone: 'warn', text: 'High saturated fat — limit for heart health.' });
    const saltG = n.salt != null ? n.salt : n.sodium != null ? n.sodium * 2.5 : null;
    if (saltG != null && saltG >= 1.5)
      tips.push({ tone: 'warn', text: `High salt (${saltG.toFixed(2)} g / 100g) — bad for blood pressure.` });
    if (n.fiber != null && n.fiber >= 5)
      tips.push({ tone: 'good', text: 'Fiber supports cardiovascular health.' });
  }

  if (tips.length === 0) {
    tips.push({ tone: 'info', text: 'No specific concerns for this goal based on available data.' });
  }
  return tips;
}
