import slugify from 'slugify';

export function toSlug(value = '') {
  return slugify(String(value), { lower: true, strict: true, trim: true });
}

export async function uniqueSlug(Model, value, excludeId) {
  const base = toSlug(value) || 'item';
  let candidate = base;
  let counter = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await Model.exists({ slug: candidate, _id: { $ne: excludeId } })) {
    counter += 1;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}
