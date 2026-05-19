export const slugify = (text) => {
  if (!text) return "";
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\u0000-\u007F]/g, (char) => char) // Preserve Unicode (Bangla, etc.)
    .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/g, '') // Remove special punctuation but keep letters
    .replace(/--+/g, '-')       // Replace multiple - with single -
    .replace(/-+$/, '')         // Trim - from end
    .replace(/^-+/, '');        // Trim - from start
};

