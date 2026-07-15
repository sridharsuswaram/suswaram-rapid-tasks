"use client";

import { getTagColor } from "@/lib/tag-colors";

interface TagDisplayProps {
  tags: string[];
  onClick?: (tag: string) => void;
  clickable?: boolean;
  isSelected?: boolean;
}

export function TagDisplay({
  tags,
  onClick,
  clickable = false,
  isSelected = false,
}: TagDisplayProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => {
        const colors = getTagColor(tag);
        return (
          <button
            key={tag}
            onClick={() => clickable && onClick?.(tag)}
            style={{
              backgroundColor: colors.bg,
              color: colors.text,
              borderWidth: isSelected ? "2px" : "0px",
              borderColor: colors.text,
            }}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
              clickable ? "hover:opacity-80 cursor-pointer" : ""
            }`}
          >
            <span>{colors.emoji}</span>
            <span>{tag}</span>
          </button>
        );
      })}
    </div>
  );
}
