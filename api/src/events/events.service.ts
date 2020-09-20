import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventType, Event, Audience } from './interfaces/event.interface';
import { sub, eachDayOfInterval } from 'date-fns';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event>
  ) {}

  async add(
    type: EventType,
    body: any,
    byUser: string,
    audience?: Audience,
    projectId?: string
  ) {
    return new this.eventModel({
      type,
      body: JSON.stringify(body),
      byUser,
      project: projectId ? projectId : undefined,
      audience: audience ? audience : 'all',
    }).save();
  }

  async getAll(days: number, isOwner: boolean, allowedProjects?: string[]) {
    const startDate = sub(new Date(), { days });
    const conditions: any = { createdAt: { $gte: startDate } };

    if (allowedProjects) {
      conditions.project = { $in: allowedProjects };
    }

    if (!isOwner) {
      conditions.audience = { $eq: 'all' };
    }

    return this.eventModel
      .find(conditions, null, { sort: { createdAt: -1 } })
      .lean()
      .populate('byUser', 'name image email _id');
  }
}
