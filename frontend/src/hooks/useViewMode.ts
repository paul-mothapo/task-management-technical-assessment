import { useState } from 'react';

export type ViewMode = 'list' | 'grid';

export const useViewMode = (defaultMode: ViewMode = 'list') => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return {
    viewMode,
    toggleViewMode,
  };
}; 