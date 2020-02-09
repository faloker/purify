import mongoose from 'mongoose';
import uuid from 'node-uuid';
import slugify from '../plugins/db/schema';

const unitSchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  name: { type: String, required: true },
  slug: { type: String, lowercase: true, unique: true },
  project: { type: String, ref: 'Project' }
});

unitSchema.plugin(slugify);

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;
