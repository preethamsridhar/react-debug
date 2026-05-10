import { useState, useEffect, useRef } from 'react';

export default function Notifications() {
  const [count, setCount]             = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen]           = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount(count + 1);

      setNotifications((prev) => [
        {
          id: Date.now(),
          type: count % 2 === 0 ? 'alert' : 'lead',
          message: `Alert #${count}: High-intent signal detected`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-widget">
      <button
        className={`notif-bell ${unread > 0 ? 'has-alerts' : ''}`}
        onClick={() => setIsOpen((o) => !o)}
        title="Notifications"
      >
        🔔
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {isOpen && (
        <div className="notif-panel">
          <div className="notif-header">
            <strong>Alerts</strong>
            <span className="notif-count">Tick #{count}</span>
          </div>
          {notifications.length === 0 ? (
            <p className="notif-empty">No new alerts</p>
          ) : (
            <ul className="notif-list">
              {notifications.slice(0, 20).map((n) => (
                <li key={n.id} className={`notif-item notif-${n.type}`}>
                  <span className="notif-msg">{n.message}</span>
                  <span className="notif-time">{n.time}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
