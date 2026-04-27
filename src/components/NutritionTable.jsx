const ROWS = [
  { key: 'energyKcal', label: 'Calories', unit: 'kcal' },
  { key: 'protein', label: 'Protein', unit: 'g' },
  { key: 'carbs', label: 'Carbohydrates', unit: 'g' },
  { key: 'sugar', label: 'Sugar', unit: 'g' },
  { key: 'fat', label: 'Fat', unit: 'g' },
  { key: 'saturatedFat', label: 'Saturated Fat', unit: 'g' },
  { key: 'fiber', label: 'Fiber', unit: 'g' },
  { key: 'salt', label: 'Salt', unit: 'g' },
];

export default function NutritionTable({ nutrients }) {
  return (
    <div className="nutrition">
      <h3>Nutrition <span className="nutrition__per">per 100 g</span></h3>
      <ul className="nutrition__grid">
        {ROWS.map(({ key, label, unit }) => {
          const v = nutrients?.[key];
          return (
            <li key={key} className="nutrition__cell">
              <span className="nutrition__label">{label}</span>
              <span className="nutrition__value">
                {v == null ? '—' : `${formatNumber(v)} ${unit}`}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function formatNumber(n) {
  if (n >= 100) return Math.round(n);
  return Math.round(n * 10) / 10;
}
