export const formatDate = (inputDateString: string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  try {
    const date: Date = new Date(inputDateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeString = date.toLocaleTimeString('en-US', { 
      hour: format === 'short' ? 'numeric' : 'numeric',
      minute: '2-digit',
      hour12: true 
    });

    if (date.toDateString() === today.toDateString()) {
      return format === 'long' ? `Today at ${timeString}` : timeString;
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return format === 'long' ? `Yesterday at ${timeString}` : timeString;
    }

    const dateFormatOptions: Intl.DateTimeFormatOptions = {
      month: format === 'short' ? 'numeric' : 'short',
      day: 'numeric',
      year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    };

    const formattedDate = date.toLocaleDateString('en-US', dateFormatOptions);
    return format === 'short' ? formattedDate : `${formattedDate} at ${timeString}`;
  } catch {
    return 'Invalid date';
  }
};

export const getResponsiveTimeFormat = (screenWidth: number): 'short' | 'medium' | 'long' => {
  if (screenWidth < 640) return 'short';
  if (screenWidth < 1024) return 'medium';
  return 'long';
}; 