import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { slugify } from '../db/plugins';
import { UnitSchema } from './schemas/unit.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: 'Unit',
        useFactory: () => {
          const schema = UnitSchema;
          schema.plugin(slugify);
          return schema;
        },
      },
    ]),
  ],
})
export class UnitsModule {}
