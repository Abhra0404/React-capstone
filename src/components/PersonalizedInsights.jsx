import { GOALS, getInsights } from '../utils/insights.js';

export default function PersonalizedInsights({ product, goal, onGoalChange }) {
  const tips = getInsights(product, goal);
  return (
    <div className="insights">
      <div className="insights__header">
        <h3>🎯 Personalized Insights</h3>
        <select value={goal} onChange={(e) => onGoalChange(e.target.value)}>
          {GOALS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </select>
      </div>
      {goal === 'none' ? (
        <p className="insights__hint">Pick a goal to get tailored tips.</p>
      ) : (
        <ul className="insights__list">
          {tips.map((t, i) => (
            <li key={i} className={`insights__item insights__item--${t.tone}`}>
              {t.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
