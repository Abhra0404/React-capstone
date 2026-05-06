import { PieChart } from 'lucide-react';

const ROWS = [
  { key: 'energyKcal', label: 'Calories', unit: 'kcal', max: 500, color: '#f59e0b' },
  { key: 'protein', label: 'Protein', unit: 'g', max: 30, color: '#3b82f6' },
  { key: 'carbs', label: 'Carbs', unit: 'g', max: 60, color: '#8b5cf6' },
  { key: 'sugar', label: 'Sugar', unit: 'g', max: 25, color: '#ef4444' },
  { key: 'fat', label: 'Fat', unit: 'g', max: 30, color: '#f97316' },
  { key: 'saturatedFat', label: 'Sat. Fat', unit: 'g', max: 10, color: '#dc2626' },
  { key: 'fiber', label: 'Fiber', unit: 'g', max: 10, color: '#10b981' },
  { key: 'salt', label: 'Salt', unit: 'g', max: 3, color: '#a8a29e' },
];

export default function NutritionTable({ nutrients }) {
  return (
    <div 
      className="nutrition-card glass-panel-light"
    >
      <div className="nutrition-header">
        <div className="nutrition-title">
          <PieChart size={20} className="icon-blue" />
          <h3>Nutrition Facts</h3>
        </div>
        <span className="nutrition-per">per 100g</span>
      </div>
      
      <div className="nutrition-list">
        {ROWS.map(({ key, label, unit, max, color }, index) => {
          const v = nutrients?.[key];
          const hasValue = v != null;
          const percentage = hasValue ? Math.min(100, (v / max) * 100) : 0;
          const level = !hasValue ? 'N/A' : percentage > 70 ? 'High' : percentage > 35 ? 'Medium' : 'Low';
          const levelClass = level === 'N/A' ? 'na' : level.toLowerCase();
          
          return (
            <div key={key} className="nutrition-row">
              <div className="nutrition-row-header">
                <span className="nutrition-label">{label}</span>
                <span className="nutrition-value">
                  {hasValue ? `${formatNumber(v)}${unit}` : '—'}
                </span>
              </div>
              <div className="nutrition-row-footer">
                <span className={`nutrition-level nutrition-level-${levelClass}`}>{level}</span>
              </div>
              {hasValue && (
                <div className="nutrition-bar-bg">
                  <div 
                    className="nutrition-bar-fg"
                    style={{ backgroundColor: color, width: `${percentage}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatNumber(n) {
  if (n >= 100) return Math.round(n);
  return Math.round(n * 10) / 10;
}
