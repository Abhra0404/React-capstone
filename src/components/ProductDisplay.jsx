import { useMemo, useState } from 'react';
import { ArrowLeft, Package, Tag, AlertTriangle, ChevronDown, Info } from 'lucide-react';
import HealthScore from './HealthScore.jsx';
import NutritionTable from './NutritionTable.jsx';
import IngredientWarnings from './IngredientWarnings.jsx';
import PersonalizedInsights from './PersonalizedInsights.jsx';
import { computeHealthScore } from '../utils/healthScore.js';
import { detectWarnings } from '../utils/ingredientWarnings.js';

export default function ProductDisplay({ product, goal, onGoalChange, onReset }) {
  const { score, category, reasons } = useMemo(() => computeHealthScore(product), [product]);
  const warnings = useMemo(() => detectWarnings(product), [product]);
  const [openSections, setOpenSections] = useState({
    insights: true,
    nutrition: true,
    warnings: true,
    ingredients: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const quickStats = [
    { label: 'Calories', value: product.nutrients?.energyKcal != null ? `${Math.round(product.nutrients.energyKcal)} kcal` : 'N/A' },
    { label: 'Sugar', value: product.nutrients?.sugar != null ? `${Math.round(product.nutrients.sugar * 10) / 10} g` : 'N/A' },
    { label: 'Protein', value: product.nutrients?.protein != null ? `${Math.round(product.nutrients.protein * 10) / 10} g` : 'N/A' },
    { label: 'Salt', value: product.nutrients?.salt != null ? `${Math.round(product.nutrients.salt * 10) / 10} g` : 'N/A' },
  ];

  return (
    <section 
      className="product-dashboard"
    >
      <div className="product-dashboard__nav">
        <button className="btn-ghost-back" onClick={onReset}>
          <ArrowLeft size={18} />
          <span>Scan another product</span>
        </button>
      </div>

      <header 
        className="product-header-card glass-panel-light"
        >
        <div className="product-header__content">
          {product.image ? (
            <img className="product-image-large" src={product.image} alt={product.name} />
          ) : (
            <div className="product-image-large product-image-placeholder">
              <Package size={48} />
            </div>
          )}
          <div className="product-details">
            {product.brand && <span className="product-brand">{product.brand}</span>}
            <h2 className="product-title">{product.name}</h2>
            <div className="product-meta-tags">
              <span className="meta-tag"><Tag size={14}/> {product.barcode}</span>
              {product.quantity && <span className="meta-tag">{product.quantity}</span>}
              {product.nutriscoreGrade && (
                <span className={`meta-tag nutriscore nutriscore-${product.nutriscoreGrade.toLowerCase()}`}>
                  Nutri-Score: {product.nutriscoreGrade.toUpperCase()}
                </span>
              )}
              {product.novaGroup && (
                <span className="meta-tag nova-group">
                  NOVA: {product.novaGroup}
                </span>
              )}
            </div>

            {(product.allergens && product.allergens.length > 0) && (
              <div className="product-badges">
                {product.allergens.map(a => (
                  <span key={a} className="badge-allergen"><AlertTriangle size={12}/> {a}</span>
                ))}
              </div>
            )}

            <div className="product-quick-stats">
              {quickStats.map((stat) => (
                <div key={stat.label} className="quick-stat">
                  <span className="quick-stat__label">{stat.label}</span>
                  <strong className="quick-stat__value">{stat.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="product-grid-main">
        <div className="product-grid-col product-grid-col--primary">
          <HealthScore score={score} category={category} reasons={reasons} />

          <section className={`dashboard-collapsible ${openSections.warnings ? 'is-open' : ''}`}>
            <button
              type="button"
              className="dashboard-collapsible__toggle"
              onClick={() => toggleSection('warnings')}
              aria-expanded={openSections.warnings}
            >
              <span>Ingredient Analysis</span>
              <ChevronDown size={16} className="dashboard-collapsible__chevron" />
            </button>
            <div className="dashboard-collapsible__content">
              <IngredientWarnings warnings={warnings} additives={product.additives} />
            </div>
          </section>

          <section className={`dashboard-collapsible ${openSections.insights ? 'is-open' : ''}`}>
            <button
              type="button"
              className="dashboard-collapsible__toggle"
              onClick={() => toggleSection('insights')}
              aria-expanded={openSections.insights}
            >
              <span>Goals & Insights</span>
              <ChevronDown size={16} className="dashboard-collapsible__chevron" />
            </button>
            <div className="dashboard-collapsible__content">
              <PersonalizedInsights product={product} goal={goal} onGoalChange={onGoalChange} />
            </div>
          </section>
        </div>
        
        <div className="product-grid-col product-grid-col--secondary">
          <section className={`dashboard-collapsible ${openSections.nutrition ? 'is-open' : ''}`}>
            <button
              type="button"
              className="dashboard-collapsible__toggle"
              onClick={() => toggleSection('nutrition')}
              aria-expanded={openSections.nutrition}
            >
              <span>Nutrition Facts</span>
              <ChevronDown size={16} className="dashboard-collapsible__chevron" />
            </button>
            <div className="dashboard-collapsible__content">
              <NutritionTable nutrients={product.nutrients} />
            </div>
          </section>
          
          {product.ingredientsText && (
            <section className={`dashboard-collapsible ${openSections.ingredients ? 'is-open' : ''}`}>
              <button
                type="button"
                className="dashboard-collapsible__toggle"
                onClick={() => toggleSection('ingredients')}
                aria-expanded={openSections.ingredients}
              >
                <span>Full Ingredient List</span>
                <ChevronDown size={16} className="dashboard-collapsible__chevron" />
              </button>
              <div 
                className="dashboard-collapsible__content"
              >
                <div className="ingredients-details glass-panel-light">
                  <h3 className="ingredients-details__title">
                    <Info size={16} className="icon-primary" />
                    <span>Full Ingredient List</span>
                  </h3>
                  <p>{product.ingredientsText}</p>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
