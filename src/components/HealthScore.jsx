export default function HealthScore({ score, category, reasons }) {
  const dash = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (dash / 100) * circumference;

  return (
    <div className={`health health--${category.color}`}>
      <div className="health__ring">
        <svg viewBox="0 0 120 120" width="140" height="140">
          <circle cx="60" cy="60" r="52" className="health__ring-bg" />
          <circle
            cx="60"
            cy="60"
            r="52"
            className="health__ring-fg"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="health__score">
          <span className="health__num">{score}</span>
          <span className="health__total">/100</span>
        </div>
      </div>
      <div className="health__meta">
        <h3 className="health__label">
          {category.emoji} {category.label}
        </h3>
        {reasons.length > 0 && (
          <ul className="health__reasons">
            {reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
