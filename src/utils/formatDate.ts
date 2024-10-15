// src/utils/formatDate.ts
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  // Format the date as YYYY-MM-DD
  };
  