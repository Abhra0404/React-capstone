import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function IngredientWarnings({ warnings, additives }) {
  const hasWarnings = warnings && warnings.length > 0;
  const hasAdditives = additives && additives.length > 0;

  if (!hasWarnings && !hasAdditives) {
    return (
      <div 
        className="warnings-card glass-panel-light warnings-empty"
      >
        <div className="warnings-header">
          <ShieldCheck className="icon-green" size={24} />
          <h3>Clean Ingredients</h3>
        </div>
        <p>No major flagged ingredients or additives detected.</p>
      </div>
    );
  }

  return (
    <div 
      className="warnings-card glass-panel-light"
    >
      <div className="warnings-header">
        <AlertTriangle className={hasWarnings ? "icon-red" : "icon-yellow"} size={24} />
        <h3>Ingredient Analysis</h3>
      </div>
      
      {hasWarnings && (
        <div className="warning-section">
          <h4>Flags</h4>
          <ul className="warnings-list">
            {warnings.map((w, i) => (
              <li key={i} className={`warning-badge warning-${w.severity}`}>
                {w.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasAdditives && (
        <div className="warning-section mt-3">
          <h4>Additives ({additives.length})</h4>
          <ul className="additives-list">
            {additives.map((a, i) => (
              <li key={i} className="additive-badge">{a}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
