import JiraClient from 'jira-connector';
import dotenv from 'dotenv';

dotenv.config();

export default new JiraClient({
  host: process.env.JIRA_URL || 'lel' ,
  basic_auth: {
    // eslint-disable-next-line no-use-before-define
    base64: Buffer.from(`${process.env.JIRA_USER || '123'}:${process.env.JIRA_API_KEY || '123'}`).toString('base64'),
  },
});
