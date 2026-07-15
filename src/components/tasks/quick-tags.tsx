"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

const QUICK_TAG_PRESETS = [
  { emoji: "💼", label: "work" },
  { emoji: "🚨", label: "urgent" },
  { emoji: "💡", label: "idea" },
  { emoji: "👤", label: "personal" },
  { emoji: "🎯", label: "goal" },
  { emoji: "📚", label: "learning" },
];

interface QuickTagsProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function QuickTags({ tags, onTagsChange }: QuickTagsProps) {
  const [customInput, setCustomInput] = useState("");

  const togglePresetTag = (label: string) => {
    if (tags.includes(label)) {
      onTagsChange(tags.filter((t) => t !== label));
    } else {
      onTagsChange([...tags, label]);
    }
  };

  const addCustomTag = () => {
    if (customInput.trim() && !tags.includes(customInput.trim())) {
      onTagsChange([...tags, customInput.trim()]);
      setCustomInput("");
    }
  };

  const removeTag = (tag: string) => {
    onTagsChange(tags.filter((t) => t !== tag));
  };

  return (
    <motion.div
      className="space-y-3 rounded-2xl bg-card p-4 neu-raised"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-xs font-semibold text-muted-foreground">Quick Tags</p>

      {/* Quick Tag Presets */}
      <div className="flex flex-wrap gap-2">
        {QUICK_TAG_PRESETS.map((preset) => (
          <motion.button
            key={preset.label}
            onClick={() => togglePresetTag(preset.label)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
              tags.includes(preset.label)
                ? "bg-blue-500 text-white"
                : "bg-background text-muted-foreground hover:bg-background/80"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{preset.emoji}</span>
            <span>{preset.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
          placeholder="Add custom tag..."
          className="flex-1 rounded-lg bg-background px-3 py-1.5 text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addCustomTag}
          className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Selected Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          {tags.map((tag) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-600 dark:text-blue-400"
            >
              <span>🏷️</span>
              <span>{tag}</span>
              <button
                onClick={() => removeTag(tag)}
                className="hover:text-blue-700 dark:hover:text-blue-300"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
