// Fetches product data from the Open Food Facts API.
// Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
const BASE = 'https://world.openfoodfacts.org/api/v2/product';

export async function fetchProductByBarcode(barcode) {
  const url = `${BASE}/${encodeURIComponent(barcode)}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Network error (${res.status})`);
  }
  const data = await res.json();
  if (data.status !== 1 || !data.product) {
    throw new Error('Product not found in the Open Food Facts database.');
  }
  return normalizeProduct(data.product, barcode);
}

function normalizeProduct(p, barcode) {
  const n = p.nutriments || {};
  return {
    barcode,
    name: p.product_name || p.generic_name || 'Unknown product',
    brand: p.brands || '',
    image: p.image_front_url || p.image_url || '',
    quantity: p.quantity || '',
    categories: p.categories || '',
    ingredientsText: p.ingredients_text || '',
    additives: (p.additives_tags || []).map((t) => t.replace(/^en:/, '').toUpperCase()),
    allergens: (p.allergens_tags || []).map((t) => t.replace(/^en:/, '')),
    nutriscoreGrade: p.nutriscore_grade || null,
    novaGroup: p.nova_group || null,
    nutrients: {
      // per 100g where available
      energyKcal: numberOrNull(n['energy-kcal_100g'] ?? n['energy-kcal']),
      protein: numberOrNull(n.proteins_100g ?? n.proteins),
      carbs: numberOrNull(n.carbohydrates_100g ?? n.carbohydrates),
      sugar: numberOrNull(n.sugars_100g ?? n.sugars),
      fat: numberOrNull(n.fat_100g ?? n.fat),
      saturatedFat: numberOrNull(n['saturated-fat_100g'] ?? n['saturated-fat']),
      fiber: numberOrNull(n.fiber_100g ?? n.fiber),
      salt: numberOrNull(n.salt_100g ?? n.salt),
      sodium: numberOrNull(n.sodium_100g ?? n.sodium),
    },
  };
}

function numberOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
