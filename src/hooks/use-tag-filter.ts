import { useState, useMemo } from "react";
import type { Task } from "@/types/task";

export function useTagFilter(tasks: Task[]) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    if (selectedTags.length === 0) return tasks;

    return tasks.filter((task) =>
      selectedTags.some((tag) => task.tags?.includes(tag))
    );
  }, [tasks, selectedTags]);

  const allAvailableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((task) => {
      task.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  return {
    filteredTasks,
    selectedTags,
    toggleTag,
    clearFilters,
    allAvailableTags,
  };
}
