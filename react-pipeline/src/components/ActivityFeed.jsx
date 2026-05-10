import { useState, useEffect, useRef } from 'react';
import { usePipeline } from '../context/PipelineContext';

const TYPE_ICON = { call: '📞', email: '✉️', meeting: '🗓', note: '📝' };

export default function ActivityFeed() {
  const { activities, deals } = usePipeline();
  const [visible, setVisible]   = useState(5);
  const containerRef            = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
        setVisible((v) => Math.min(v + 5, activities.length));
      }
    };

    containerRef.current?.addEventListener('scroll', handleScroll);

    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [activities.length]);

  const sorted = [...activities].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
  const sliced = sorted.slice(0, visible);

  const getDealTitle = (dealId) => {
    const d = deals.find((x) => x.id === dealId);
    return d ? d.title : dealId;
  };

  return (
    <div className="activity-feed" ref={containerRef}>
      <h2 className="section-title">Activity Feed</h2>
      <div className="activity-list">
        {sliced.map((activity) => (
          <div key={activity.id} className="activity-item">
            <span className="activity-icon">{TYPE_ICON[activity.type] ?? '•'}</span>
            <div className="activity-body">
              <div className="activity-deal">{getDealTitle(activity.dealId)}</div>
              <div className="activity-note">{activity.note}</div>
              <div className="activity-time">
                {new Date(activity.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {visible < activities.length && (
          <p className="activity-hint">Scroll to load more…</p>
        )}
      </div>
    </div>
  );
}
