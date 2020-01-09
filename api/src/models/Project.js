import { Schema, model } from 'mongoose';
import slug from 'slug';
import uuid from 'node-uuid';

const ProjectsSchema = new Schema(
  {
    _id: { type: String, default: uuid.v4 },
    title: String,
    subtitle: String,
    slug: { type: String, lowercase: true, unique: true },
  },
  { versionKey: false },
);

ProjectsSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

ProjectsSchema.methods.slugify = function () {
  this.slug = slug(this.title);
};

const Projects = model('Project', ProjectsSchema);

export default Projects;
