export function slugify(text = '') {
  return String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Generates a slug from `source` that is unique within the model's collection. */
export async function uniqueSlug(Model, source, currentId) {
  const base = slugify(source) || 'item';
  let slug = base;
  for (let i = 2; await Model.exists({ slug, _id: { $ne: currentId } }); i++) slug = `${base}-${i}`;
  return slug;
}
