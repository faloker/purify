import slug from 'slug';

export default function slugify(schema, options) {
  schema.pre('validate', function(next) {
    if (!this.slug) {
      this.slug = slug(this.title);
    }

    next();
  });

  schema.pre('findOneAndUpdate', function() {
    const change = this.getUpdate();
    if (change.$set.title) {
      this.set({ slug: slug(change.$set.title) });
    }
  });
}
