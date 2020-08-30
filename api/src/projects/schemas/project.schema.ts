import { Schema, model } from 'mongoose';
import { nanoid } from 'nanoid';
import { UnitSchema } from 'src/units/schemas/unit.schema';

export const ProjectSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    description: String,
    displayName: String,
    name: { type: String, unique: true },
  },
  { timestamps: true }
);
