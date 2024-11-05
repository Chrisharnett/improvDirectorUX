export const generatePerformanceToken = (performanceId) => {
  // Example: Generate a simple token (this should be more secure in production)
  return btoa(performanceId + ":" + new Date().toISOString());
};
