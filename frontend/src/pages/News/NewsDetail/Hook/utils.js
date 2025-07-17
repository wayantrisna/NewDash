// utils.js
export const estimateReadTime = (text = "") => {
  const wordsPerMinute = 1;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};
