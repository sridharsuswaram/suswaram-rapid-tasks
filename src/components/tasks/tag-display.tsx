"use client";

interface TagDisplayProps {
  tags: string[];
  onClick?: (tag: string) => void;
  clickable?: boolean;
}

export function TagDisplay({ tags, onClick, clickable = false }: TagDisplayProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => clickable && onClick?.(tag)}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
            clickable
              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30 cursor-pointer"
              : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
          }`}
        >
          <span>🏷️</span>
          <span>{tag}</span>
        </button>
      ))}
    </div>
  );
}
