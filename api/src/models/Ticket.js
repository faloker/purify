import mongoose from 'mongoose';
import uuid from 'node-uuid';

const TicketSchema = mongoose.Schema({
  _id: { type: String, default: uuid.v4 },
  type: { type: String, required: true },
  link: { type: String, required: true },
  key: { type: String, required: true },
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
