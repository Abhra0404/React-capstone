import { useMemo } from 'react';
import HealthScore from './HealthScore.jsx';
import NutritionTable from './NutritionTable.jsx';
import IngredientWarnings from './IngredientWarnings.jsx';
import PersonalizedInsights from './PersonalizedInsights.jsx';
import { computeHealthScore } from '../utils/healthScore.js';
import { detectWarnings } from '../utils/ingredientWarnings.js';

export default function ProductDisplay({ product, goal, onGoalChange, onReset }) {
  const { score, category, reasons } = useMemo(() => computeHealthScore(product), [product]);
  const warnings = useMemo(() => detectWarnings(product), [product]);

  return (
    <section className="product">
      <header className="product__header">
        {product.image ? (
          <img className="product__image" src={product.image} alt={product.name} />
        ) : (
          <div className="product__image product__image--placeholder">🥫</div>
        )}
        <div className="product__title">
          <h2>{product.name}</h2>
          {product.brand && <p className="product__brand">{product.brand}</p>}
          <p className="product__meta">
            <span>Barcode: {product.barcode}</span>
            {product.quantity && <span> · {product.quantity}</span>}
            {product.nutriscoreGrade && (
              <span> · Nutri-Score: <strong>{product.nutriscoreGrade.toUpperCase()}</strong></span>
            )}
          </p>
          <button className="btn btn--ghost btn--sm" onClick={onReset}>
            ← Scan another
          </button>
        </div>
      </header>

      <div className="product__grid">
        <HealthScore score={score} category={category} reasons={reasons} />
        <NutritionTable nutrients={product.nutrients} />
      </div>

      <IngredientWarnings warnings={warnings} />

      <PersonalizedInsights product={product} goal={goal} onGoalChange={onGoalChange} />

      {product.ingredientsText && (
        <details className="product__ingredients">
          <summary>Full ingredient list</summary>
          <p>{product.ingredientsText}</p>
        </details>
      )}
    </section>
  );
}
