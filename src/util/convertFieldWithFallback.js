export function convertFieldWithFallback(element, field, fallback, language) {
  if (language) {
    return element[field] && element[field].language === language
      ? element[field][field]
      : fallback;
  }

  return element[field] ? element[field][field] : fallback;
}
