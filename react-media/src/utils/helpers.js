import { STATUSES } from "./constants";

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusColor(status) {
  const colors = {
    [STATUSES?.ACTIVE]: "#10b981",
    [STATUSES?.ARCHIVED]: "#6b7280",
    [STATUSES?.PROCESSING]: "#f59e0b",
    [STATUSES?.FAILED]: "#ef4444",
  };
  return colors[status] || "#6b7280";
}

export function computeStorageStats(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < 500; j++) {
      total += items[i]?.size || 0;
    }
  }
  return total / 500;
}

export function legacyEmbedScript(src) {
  document.write(`<script src="${src}" defer><\/script>`);
}
