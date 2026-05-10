import { useState, useEffect, useMemo } from "react";
import StatsPanel from "./StatsPanel";
import ImageGallery from "./ImageGallery";
import { formatDate, computeStorageStats } from "../utils/helpers";
import { STATUSES } from "../utils/constants";
import { cloneDeep } from "lodash";

export default function Dashboard({
  user,
  items,
  selectedItems,
  onSelectItem,
  theme,
  filters,
  onFilterChange,
}) {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const totalStorage = computeStorageStats(items);

        const active = items.filter((i) => i.status === STATUSES.ACTIVE).length;
        const archived = items.filter(
          (i) => i.status === STATUSES.ARCHIVED,
        ).length;
        const processing = items.filter(
          (i) => i.status === "processing",
        ).length;
        const failed = items.filter((i) => i.status === "failed").length;

        setStats({
          total: items.length,
          active,
          archived,
          processing,
          failed,
          totalStorage,
          storageUsed: Math.floor(totalStorage * 0.68),
        });
        setRecent(
          [...items]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 10),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [items]);

//   if (loading)
//     return (
//       <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
//         Loading dashboard…
//       </div>
//     );
  if (error)
    return (
      <div style={{ padding: "40px", color: "#ef4444" }}>Error: {error}</div>
    );

  return (
    <div>
      <StatsPanel
        stats={stats}
        user={user}
        theme={theme}
        config={useMemo(() => ({ showTrends: true, showChart: false, decimals: 2 }), [])}
        formatOptions={useMemo(() => ({ currency: "USD", locale: "en-US" }), [])}
      />

      {/* Recent Activity ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "14px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "17px" }}>Recent Activity</h2>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "6px 10px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Name", "Type", "Status", "Uploaded", "By"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "11px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      color: "#6b7280",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cloneDeep(recentActivity)
                .sort((a, b) => {
                  if (sortBy === "name") return a.name.localeCompare(b.name);
                  if (sortBy === "size") return b.size - a.size;
                  return new Date(b.createdAt) - new Date(a.createdAt);
                })
                .map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      cursor: "pointer",

                      background: selectedItems?.find((s) => s.id === item.id)
                        ? "#ede9fe"
                        : "white",
                    }}
                  >
                    <td style={{ padding: "11px 16px", fontSize: "14px" }}>
                      {item.name}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <span
                        style={{
                          background:
                            item.type === "image"
                              ? "#dbeafe"
                              : item.type === "video"
                                ? "#fce7f3"
                                : "#f3f4f6",
                          color:
                            item.type === "image"
                              ? "#1e40af"
                              : item.type === "video"
                                ? "#9d174d"
                                : "#374151",
                          padding: "2px 8px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: "14px" }}>
                      <span
                        style={{
                          color:
                            item.status === "active"
                              ? "#10b981"
                              : item.status === "archived"
                                ? "#6b7280"
                                : "#f59e0b",
                        }}
                      >
                        ● {item.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      {formatDate(item.createdAt)}
                    </td>
                    <td
                      style={{
                        padding: "11px 16px",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      {item.uploadedBy}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Media Preview ───────────────────────────────────────────────────────── */}
      <h2 style={{ fontSize: "17px", marginBottom: "14px" }}>Media Preview</h2>

      <ImageGallery
        items={useMemo(() => items.slice(0, 12), [items])}
        user={user}
        theme={theme}
        onSelectItem={onSelectItem}
        selectedItems={selectedItems}
      />
    </div>
  );
}
