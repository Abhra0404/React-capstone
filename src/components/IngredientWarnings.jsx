export default function IngredientWarnings({ warnings }) {
  if (!warnings || warnings.length === 0) {
    return (
      <div className="warnings warnings--empty">
        <h3>⚠️ Ingredient Warnings</h3>
        <p className="warnings__none">No major flagged ingredients detected. ✅</p>
      </div>
    );
  }
  return (
    <div className="warnings">
      <h3>⚠️ Ingredient Warnings</h3>
      <ul className="warnings__list">
        {warnings.map((w, i) => (
          <li key={i} className={`badge badge--${w.severity}`}>
            {w.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
