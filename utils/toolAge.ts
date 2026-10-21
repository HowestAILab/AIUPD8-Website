// A tool counts as "older than one year" when it has not been updated for over a year.
// Based on the last updated date (lastChanged); falls back to dateAdded when that is empty.
export function isToolNotUpdatedForOverOneYear(tool: {
  lastChanged?: string;
  dateAdded?: string;
}): boolean {
  const dateString = tool.lastChanged || tool.dateAdded;
  if (!dateString) return false;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return false;
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return date < oneYearAgo;
}
