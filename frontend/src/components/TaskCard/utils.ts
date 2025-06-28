export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeString = date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    if (date.toDateString() === today.toDateString()) {
      return `${timeString}`;
    }

    if (date.toDateString() === yesterday.toDateString()) {
      return `${timeString}`;
    }

    return `${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: today.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    })} at ${timeString}`;
  } catch (error) {
    return 'Invalid date';
  }
}; 