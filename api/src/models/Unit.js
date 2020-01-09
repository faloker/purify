import mongoose from 'mongoose';
import uuid from 'node-uuid';
import slug from 'slug';

const UnitSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid.v4 },
    name: { type: String, required: true, unique: true },
    slug: { type: String, lowercase: true, unique: true },
    project: { type: String, ref: 'Project' },
  },
  { versionKey: false },
);

UnitSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

UnitSchema.methods.slugify = function () {
  this.slug = slug(this.name);
};

const Unit = mongoose.model('Unit', UnitSchema);

export default Unit;
