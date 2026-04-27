// Computes a smart health score (0-100) based on per-100g nutrients,
// additive count, and processing level. Returns { score, category, reasons }.

export function computeHealthScore(product) {
  const n = product.nutrients || {};
  const reasons = [];
  let score = 100;

  // Sugar (g per 100g)
  if (n.sugar != null) {
    if (n.sugar >= 22.5) {
      score -= 25;
      reasons.push(`Very high sugar (${n.sugar.toFixed(1)} g / 100g)`);
    } else if (n.sugar >= 10) {
      score -= 12;
      reasons.push(`High sugar (${n.sugar.toFixed(1)} g / 100g)`);
    } else if (n.sugar >= 5) {
      score -= 5;
      reasons.push(`Moderate sugar (${n.sugar.toFixed(1)} g / 100g)`);
    }
  }

  // Saturated fat
  if (n.saturatedFat != null) {
    if (n.saturatedFat >= 5) {
      score -= 15;
      reasons.push(`High saturated fat (${n.saturatedFat.toFixed(1)} g / 100g)`);
    } else if (n.saturatedFat >= 1.5) {
      score -= 6;
      reasons.push(`Moderate saturated fat (${n.saturatedFat.toFixed(1)} g / 100g)`);
    }
  } else if (n.fat != null && n.fat >= 17.5) {
    score -= 10;
    reasons.push(`High total fat (${n.fat.toFixed(1)} g / 100g)`);
  }

  // Salt / Sodium
  const saltG = n.salt != null ? n.salt : n.sodium != null ? n.sodium * 2.5 : null;
  if (saltG != null) {
    if (saltG >= 1.5) {
      score -= 15;
      reasons.push(`High salt (${saltG.toFixed(2)} g / 100g)`);
    } else if (saltG >= 0.3) {
      score -= 5;
      reasons.push(`Moderate salt (${saltG.toFixed(2)} g / 100g)`);
    }
  }

  // Fiber bonus
  if (n.fiber != null) {
    if (n.fiber >= 6) {
      score += 8;
      reasons.push(`Excellent fiber content (${n.fiber.toFixed(1)} g)`);
    } else if (n.fiber >= 3) {
      score += 4;
      reasons.push(`Good fiber content (${n.fiber.toFixed(1)} g)`);
    }
  }

  // Protein bonus
  if (n.protein != null) {
    if (n.protein >= 12) {
      score += 8;
      reasons.push(`High protein (${n.protein.toFixed(1)} g)`);
    } else if (n.protein >= 5) {
      score += 3;
      reasons.push(`Moderate protein (${n.protein.toFixed(1)} g)`);
    }
  }

  // Additives penalty
  const addCount = (product.additives || []).length;
  if (addCount > 0) {
    const penalty = Math.min(20, addCount * 3);
    score -= penalty;
    reasons.push(`${addCount} additive${addCount > 1 ? 's' : ''} detected`);
  }

  // NOVA processing level
  if (product.novaGroup === 4) {
    score -= 10;
    reasons.push('Ultra-processed food (NOVA 4)');
  } else if (product.novaGroup === 3) {
    score -= 5;
    reasons.push('Processed food (NOVA 3)');
  } else if (product.novaGroup === 1) {
    score += 5;
    reasons.push('Unprocessed / minimally processed (NOVA 1)');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  let category;
  if (score >= 70) category = { label: 'Healthy', color: 'green', emoji: '🟢' };
  else if (score >= 45) category = { label: 'Moderate', color: 'yellow', emoji: '🟡' };
  else category = { label: 'Unhealthy', color: 'red', emoji: '🔴' };

  return { score, category, reasons };
}
