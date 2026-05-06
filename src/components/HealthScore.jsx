import { Activity, CheckCircle, AlertOctagon, Info } from 'lucide-react';

export default function HealthScore({ score, category, reasons }) {
  const dash = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (dash / 100) * circumference;

  const Icon = category.color === 'green' ? CheckCircle : 
               category.color === 'red' ? AlertOctagon : Info;

  return (
    <div 
      className={`health-card glass-panel-light health-${category.color}`}
    >
      <div className="health-card__header">
        <div className="card-title-wrap">
          <Activity size={20} className={`icon-${category.color}`} />
          <h3>Health Score</h3>
        </div>
        <span className={`health-pill health-pill-${category.color}`}>{category.label}</span>
      </div>
      
      <div className="health-card__content">
        <div className="health-ring-container">
          <svg viewBox="0 0 120 120" width="140" height="140">
            <circle cx="60" cy="60" r="52" className="health-ring-bg" />
            <circle
              cx="60"
              cy="60"
              r="52"
              className="health-ring-fg"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="health-score-value">
            <span 
              className="health-num"
            >
              {score}
            </span>
            <span className="health-total">/100</span>
          </div>
        </div>

        <div className="health-meta">
          <div className="health-label">
            <Icon size={24} className={`icon-${category.color}`} />
            <span>{category.label}</span>
          </div>
          
          {reasons.length > 0 && (
            <ul className="health-reasons-list">
              {reasons.map((r, i) => (
                <li 
                  key={i}
                >
                  <span className={`bullet bg-${category.color}`}></span> {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
