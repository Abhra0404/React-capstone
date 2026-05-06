import { Target, Lightbulb, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { GOALS, getInsights } from '../utils/insights.js';

export default function PersonalizedInsights({ product, goal, onGoalChange }) {
  const tips = getInsights(product, goal);
  
  return (
    <div 
      className="insights-card glass-panel-light"
    >
      <div className="insights-header">
        <div className="insights-title">
          <Target size={20} className="icon-primary" />
          <h3>Goals & Insights</h3>
        </div>
        <div className="insights-goal-picker">
          <label htmlFor="goal-select" className="insights-goal-label">Goal</label>
          <select id="goal-select" className="insights-select" value={goal} onChange={(e) => onGoalChange(e.target.value)}>
            {GOALS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {goal === 'none' ? (
        <div className="insights-empty">
          <Lightbulb size={24} className="icon-muted" />
          <p>Select a diet goal above to get tailored insights.</p>
        </div>
      ) : (
        <ul className="insights-list">
          {tips.map((t, i) => {
            const Icon = t.tone === 'good' ? CheckCircle2 : t.tone === 'warn' ? AlertCircle : Info;
            return (
              <li 
                key={i} 
                className={`insight-item insight-${t.tone}`}
              >
                <div className={`insight-icon icon-${t.tone}`}>
                  <Icon size={18} />
                </div>
                <p>{t.text}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
