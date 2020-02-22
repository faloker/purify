import dailyReport from './dailyReport';
import syncTickets from './syncTickets';

export default fastify => {
  dailyReport(fastify);
  syncTickets(fastify);
};
