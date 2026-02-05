
/**
 * Safely parses a date string in YYYY-MM-DD format as a local date
 * to avoid timezone shift issues that occur with new Date(dateString)
 */
export const parseLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
};
