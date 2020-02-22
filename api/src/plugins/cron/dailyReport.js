import cron from 'node-cron';
import { sub } from 'date-fns';

import Issue from '../../models/Issue';

export default fastify => {
  cron.schedule('55 23 * * *', async () => {
    fastify.log.info('[SMTP] Send daily report');

    const issues = await Issue.find({
      is_closed: false,
      created_at: { $gt: sub(new Date(), { hours: 24 }) },
    });

    fastify.sendMail(
      ['your@ma.il'],
      'pur@pur.com',
      'Heads Up | Purify Report',
      `You have ${issues.length || 0} new issues.`
    );
  });
};
