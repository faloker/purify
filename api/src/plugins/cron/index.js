import cron from 'node-cron';
import jira from '../jira';
import Issue from '../../models/Issue';
import Comment from '../../models/Comment';
import User from '../../models/User';

export default ((fastify) => {
  cron.schedule('30 * * * *', async () => {
    fastify.log.info('Sync resolved tickets with Jira');

    const issues = await Issue.find({ ticket: { $exists: true } }).populate('ticket');

    for (const issue of issues) {
      try {
        const { fields } = await jira.issue.getIssue({ issueKey: issue.ticket.key });

        if (fields.resolution && fields.resolution.name === 'Done' && !issue.is_closed) {
          const user = await User.findOne({ username: 'purify' });

          const comment = await new Comment({
            author: user._id,
            text: 'Resolved in Jira with resolution Done',
            date: Date.now(),
          }).save();

          await Issue.updateOne({
            _id: issue._id,
          }, {
            $push: { comments: comment._id },
            is_closed: true,
          });

          fastify.log.info(`Issue ${issue._id} is updated based on ${issue.ticket.link}`);
        }
      } catch (err) {
        fastify.log.error(`Unable to update issue ${issue._id} with ticket ${issue.ticket.link}`);
      }
    }
  });
});
