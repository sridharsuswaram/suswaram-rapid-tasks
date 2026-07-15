// Tag color mapping
const TAG_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  work: { bg: "#dbeafe", text: "#1e40af", emoji: "💼" },
  urgent: { bg: "#fee2e2", text: "#991b1b", emoji: "🚨" },
  idea: { bg: "#fef3c7", text: "#92400e", emoji: "💡" },
  personal: { bg: "#f3e8ff", text: "#6b21a8", emoji: "👤" },
  goal: { bg: "#dcfce7", text: "#166534", emoji: "🎯" },
  learning: { bg: "#e0e7ff", text: "#3730a3", emoji: "📚" },
};

export function getTagColor(tag: string) {
  const lowerTag = tag.toLowerCase();
  return TAG_COLORS[lowerTag] || {
    bg: "#f3f4f6",
    text: "#374151",
    emoji: "🏷️",
  };
}

export function getAllTagEmojis() {
  return Object.entries(TAG_COLORS).map(([tag, { emoji }]) => ({
    tag,
    emoji,
  }));
}
