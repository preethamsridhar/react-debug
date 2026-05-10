import { useRef, useEffect, forwardRef, memo } from "react";
import { formatFileSize } from "../utils/helpers";

function StatsPanel({ stats, user, theme, config, formatOptions }) {
  const cardRefs = useRef([]);

  useEffect(() => {
    if (!stats) return;

    cardRefs.current.forEach((card) => {
      if (!card) return;
      const height = card.offsetHeight;
      card.style.minHeight = `${height}px`;
      const rect = card.getBoundingClientRect();
      card.style.paddingBottom = `${Math.max(rect.height * 0.05, 8)}px`;
    });
  }, [stats]);

  if (!stats) return null;

  const storagePercent = stats.storageUsed
    ? Math.round((stats.storageUsed / stats.totalStorage) * 100)
    : 0;

  return (
    <div className="stats-grid">
      <MetricCard
        ref={(el) => {
          cardRefs.current[0] = el;
        }}
        label="Total Assets"
        value={stats.total.toLocaleString()}
        trend="+12% this month"
        user={user}
        theme={theme}
        config={config}
        formatOptions={formatOptions}
      />
      <MetricCard
        ref={(el) => {
          cardRefs.current[1] = el;
        }}
        label="Active"
        value={stats.active.toLocaleString()}
        trend="+5% this month"
        highlight
        user={user}
        theme={theme}
        config={config}
        formatOptions={formatOptions}
      />
      <MetricCard
        ref={(el) => {
          cardRefs.current[2] = el;
        }}
        label="Processing"
        value={stats.processing.toLocaleString()}
        trend={stats.processing > 5 ? "▲ above normal" : "Normal"}
        warning={stats.processing > 5}
        user={user}
        theme={theme}
        config={config}
        formatOptions={formatOptions}
      />
      <MetricCard
        ref={(el) => {
          cardRefs.current[3] = el;
        }}
        label="Storage Used"
        value={formatFileSize(stats.storageUsed || 0)}
        subValue={`${storagePercent}% of quota`}
        warning={storagePercent > 80}
        danger={storagePercent > 95}
        user={user}
        theme={theme}
        config={config}
        formatOptions={formatOptions}
      />
    </div>
  );
}

const MetricCard = forwardRef(function MetricCard(
  {
    label,
    value,
    trend,
    subValue,
    highlight,
    warning,
    danger,
    user,
    theme,
    config,
    formatOptions,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        "stat-card",
        highlight ? "highlight" : "",
        warning ? "warning" : "",
        danger ? "danger" : "",
      ].join(" ")}
    >
      <h3>{label}</h3>

      <MetricValue
        value={value}
        user={user}
        theme={theme}
        config={config}
        formatOptions={formatOptions}
      />
      {trend && (
        <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#10b981" }}>
          {trend}
        </p>
      )}
      {subValue && (
        <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6b7280" }}>
          {subValue}
        </p>
      )}
    </div>
  );
});

function MetricValue({ value, user, theme, config, formatOptions }) {
  // user, theme, config, formatOptions are all unused here
  return <div className="stat-value">{value}</div>;
}

export default memo(StatsPanel);
