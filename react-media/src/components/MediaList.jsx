import { useState } from "react";
import { formatFileSize, formatDate } from "../utils/helpers";

export default function MediaList({ items, user, theme, onSelectItem }) {
  const [filter, setFilter] = useState("all");

  const filteredItems = items.filter((item) =>
    filter === "all" ? true : item.type === filter,
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        {["all", "image", "video", "document", "audio"].map((type) => (
          <button
            key={type}
            className={`btn${filter === type ? "" : " btn-secondary"}`}
            onClick={() => setFilter(type)}
          >
            {type === "all"
              ? "All Assets"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
        Showing <strong>{filteredItems.length.toLocaleString()}</strong> assets
        {filteredItems.length === 10_000 && (
          <span style={{ color: "#f59e0b", marginLeft: "8px" }}>
            — scroll to load all rows (no virtualisation)
          </span>
        )}
      </p>

      <div className="media-list">
        {filteredItems.map((item) => (
          <MediaListItem
            key={item.id}
            item={item}
            onSelectItem={onSelectItem}
            user={user}
          />
        ))}
      </div>
    </div>
  );
}

function MediaListItem({ item, onSelectItem, user }) {
  const TYPE_COLORS = {
    image: { bg: "#dbeafe", text: "#1e40af" },
    video: { bg: "#fce7f3", text: "#9d174d" },
    document: { bg: "#d1fae5", text: "#065f46" },
    audio: { bg: "#fef3c7", text: "#92400e" },
  };
  const colors = TYPE_COLORS[item.type] || { bg: "#f3f4f6", text: "#374151" };

  return (
    <div className="media-list-item" onClick={() => onSelectItem(item)}>
      <span
        style={{
          background: colors.bg,
          color: colors.text,
          padding: "3px 10px",
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 600,
          minWidth: "72px",
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {item.type}
      </span>

      <span
        style={{
          flex: 1,
          fontSize: "14px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {item.name}
      </span>

      <span
        style={{
          fontSize: "13px",
          color: "#6b7280",
          minWidth: "80px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {formatFileSize(item.size)}
      </span>

      <span
        style={{
          fontSize: "13px",
          color: "#6b7280",
          minWidth: "110px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {formatDate(item.createdAt)}
      </span>

      <span
        style={{
          fontSize: "12px",
          minWidth: "80px",
          textAlign: "right",
          flexShrink: 0,
          color:
            item.status === "active"
              ? "#10b981"
              : item.status === "failed"
                ? "#ef4444"
                : item.status === "archived"
                  ? "#6b7280"
                  : "#f59e0b",
        }}
      >
        ● {item.status}
      </span>
    </div>
  );
}
