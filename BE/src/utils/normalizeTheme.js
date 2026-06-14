function removeVietnameseTones(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

function normalizeThemeName(name = '') {
  return String(name).trim().replace(/^#/, '').replace(/\s+/g, ' ').toLowerCase();
}

function toThemeSlug(name = '') {
  return removeVietnameseTones(normalizeThemeName(name))
    .replace(/[^a-z0-9\s_-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');
}

function normalizeThemes(themes = []) {
  const seen = new Set();

  return themes
    .map((theme) => ({
      name: normalizeThemeName(theme),
      slug: toThemeSlug(theme)
    }))
    .filter((theme) => theme.name && theme.slug)
    .filter((theme) => {
      if (seen.has(theme.slug)) return false;
      seen.add(theme.slug);
      return true;
    });
}

module.exports = {
  normalizeThemeName,
  normalizeThemes,
  toThemeSlug
};
