import unidecode from 'unidecode';

/**
 * Clean and standardize column names
 * @param {Object[]} data - The input data array
 * @param {Object} options - Configuration options for cleaning
 * @returns {Object[]} - Transformed data with cleaned column names
 */
export function cleanColumnNames(data, options = {}) {
  // Default options
  const defaultOptions = {
    case: 'lower', // 'lower', 'upper', or 'proper'
    separator: '_',
    stripAccents: true,
    insertUnderscores: true,
    truncateLimit: null,
    skipPatterns: [],
    preserveSpecialWords: {}
  };

  // Merge default options with provided options
  const config = { ...defaultOptions, ...options };

  // Helper function to clean a single name
  const cleanName = (name) => {
    if (name == null) return '';
    
    // Convert to string
    let cleanedName = String(name);

    // Strip accents if configured
    if (config.stripAccents) {
      cleanedName = unidecode(cleanedName);
    }

    // Remove special characters and replace with separator
    cleanedName = cleanedName
      .replace(/[^\w\s]/g, config.separator)
      .replace(/\s+/g, config.separator);

    // Insert underscores between camelCase
    if (config.insertUnderscores) {
      cleanedName = cleanedName.replace(/([a-z0-9])([A-Z])/g, `$1${config.separator}$2`);
    }

    // Remove leading/trailing separators
    cleanedName = cleanedName.replace(new RegExp(`^${config.separator}+|${config.separator}+$`, 'g'), '');

    // Reduce multiple consecutive separators
    cleanedName = cleanedName.replace(new RegExp(`${config.separator}+`, 'g'), config.separator);

    // Apply case transformation
    switch (config.case) {
      case 'lower':
        cleanedName = cleanedName.toLowerCase();
        break;
      case 'upper':
        cleanedName = cleanedName.toUpperCase();
        break;
      case 'proper':
        cleanedName = cleanedName
          .split(config.separator)
          .map((word, index) => 
            // Capitalize first letter, keep rest lowercase
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          )
          .join(config.separator);
        break;
    }

    // Truncate if limit specified
    if (config.truncateLimit) {
      cleanedName = cleanedName.slice(0, config.truncateLimit);
    }

    // Skip cleaning for specified patterns
    if (config.skipPatterns.some(pattern => 
      new RegExp(pattern, 'i').test(cleanedName)
    )) {
      return name;
    }

    return cleanedName;
  };

  // If no data, return empty array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Clean column names
  const cleanedData = data.map(row => {
    const cleanedRow = {};
    Object.keys(row).forEach(key => {
      const newKey = cleanName(key);
      cleanedRow[newKey] = row[key];
    });
    return cleanedRow;
  });

  return cleanedData;
}

// Example usage
export function transformFinraData(data) {
  return cleanColumnNames(data, {
    case: 'lower',
    separator: '_',
    insertUnderscores: true,
    stripAccents: true
  });
}