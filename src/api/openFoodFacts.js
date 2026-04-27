// Fetches product data from the Open Food Facts API.
// Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
const PRODUCT_ENDPOINTS = [
  'https://world.openfoodfacts.org/api/v2/product',
  'https://world.openfoodfacts.org/api/v0/product',
];
const PRODUCT_NOT_FOUND = 'Product not found in the Open Food Facts database.';

export async function fetchProductByBarcode(barcode) {
  const cleanedBarcode = String(barcode ?? '').replace(/\s/g, '');

  if (!/^\d{6,14}$/.test(cleanedBarcode)) {
    throw new Error('Please enter a valid barcode number.');
  }

  let lastError = null;

  for (const endpoint of PRODUCT_ENDPOINTS) {
    try {
      const data = await requestProduct(endpoint, cleanedBarcode);
      if (data.status === 1 && data.product) {
        return normalizeProduct(data.product, cleanedBarcode);
      }
      lastError = new Error(PRODUCT_NOT_FOUND);
    } catch (error) {
      lastError = error;
      if (error.status !== 404) break;
    }
  }

  if (lastError?.message === PRODUCT_NOT_FOUND || lastError?.status === 404) {
    throw new Error(PRODUCT_NOT_FOUND);
  }

  throw lastError || new Error('Unable to reach Open Food Facts right now. Please try again.');
}

async function requestProduct(endpoint, barcode) {
  const url = `${endpoint}/${encodeURIComponent(barcode)}.json`;
  const res = await fetch(url);
  if (res.status === 404) {
    const error = new Error(PRODUCT_NOT_FOUND);
    error.status = 404;
    throw error;
  }
  if (!res.ok) {
    throw new Error(`Open Food Facts request failed (${res.status}).`);
  }
  return res.json();
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
