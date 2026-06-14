export function linesToItems(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

export function itemsToLines(items = []) {
  return items.join("\n");
}

export function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(isoDate) {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${isoDate}T00:00:00`));
}
