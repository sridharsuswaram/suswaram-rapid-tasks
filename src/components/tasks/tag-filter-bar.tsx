"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { TagDisplay } from "@/components/tasks/tag-display";

interface TagFilterBarProps {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
}

export function TagFilterBar({
  availableTags,
  selectedTags,
  onToggleTag,
  onClearFilters,
}: TagFilterBarProps) {
  if (availableTags.length === 0) return null;

  return (
    <motion.div
      className="rounded-2xl bg-card p-4 neu-raised space-y-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">Filter by tags</p>
        {selectedTags.length > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onToggleTag(tag)}
            className="transition-opacity hover:opacity-80"
          >
            <TagDisplay
              tags={[tag]}
              isSelected={selectedTags.includes(tag)}
              clickable
            />
          </button>
        ))}
      </div>

      {selectedTags.length > 0 && (
        <div className="text-xs text-muted-foreground border-t border-border pt-2">
          Showing {selectedTags.length} tag filter{selectedTags.length !== 1 ? "s" : ""}
        </div>
      )}
    </motion.div>
  );
}
