module.exports = {
  async up(db, client) {
    await db.collection('templates').dropIndex('slug_1');
    await db.collection('templates').dropIndex('name_1');
    await db
      .collection('templates')
      .find()
      .forEach(async template => {
        await db.collection('templates').updateOne(
          { _id: template._id },
          {
            $set: {
              displayName: template.name,
            },
            $unset: { name: '' },
            $rename: {
              path_to_issues: 'pathToIssues',
              risk_field: 'riskField',
              title_fields: 'titleFields',
              internal_comparison_fields: 'internalComparisonFields',
              external_comparison_fields: 'externalComparisonFields',
              body_fields: 'bodyFields',
              merge_fields: 'mergeFields',
              title_pattern: 'titlePattern',
              subtitle_pattern: 'subtitlePattern',
            },
          }
        );
        await db.collection('templates').updateOne(
          { _id: template._id },
          {
            $set: {
              name: template.slug,
            },
            $unset: { slug: '' },
          }
        );
      });
    await db.collection('templates').createIndex({ name: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection('templates').dropIndex('name_1');
    await db
      .collection('templates')
      .find()
      .forEach(async template => {
        await db.collection('templates').updateOne(
          { _id: template._id },
          {
            $set: {
              slug: template.name,
            },
            $unset: { name: '' },
          }
        );
        await db.collection('templates').updateOne(
          { _id: template._id },
          {
            $set: {
              name: template.displayName,
            },
            $unset: { displayName: '' },
            $rename: {
              pathToIssues: 'path_to_issues',
              riskField: 'risk_field',
              titleFields: 'title_fields',
              internalComparisonFields: 'internal_comparison_fields',
              externalComparisonFields: 'external_comparison_fields',
              bodyFields: 'body_fields',
              mergeFields: 'merge_fields',
              titlePattern: 'title_pattern',
              subtitlePattern: 'subtitle_pattern',
            },
          }
        );
      });
    await db.collection('templates').createIndex({ slug: 1 }, { unique: true });
    await db.collection('templates').createIndex({ name: 1 }, { unique: true });
  },
};
