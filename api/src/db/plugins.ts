import * as slug from 'slug';

export function slugify(schema) {
  schema.pre('validate', function(next) {
    this.slug = slug(this.title);
    next();
  });
}
