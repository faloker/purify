import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { Event, GetEventsDto } from '../types';
import { SET_EVENTS } from '../mutations';
import { FETCH_EVENTS } from '../actions';
import { getEvents } from '@/api/events.service';

@Module
export default class Events extends VuexModule {
  items: Event[] = [];

  @Mutation
  [SET_EVENTS](events: Event[]) {
    events.forEach(event => {
      event.body = JSON.parse(event.body);
    });
    this.items = events;
  }

  @Action
  async [FETCH_EVENTS](getEventsDto: GetEventsDto) {
    const { data } = await getEvents(getEventsDto.days);
    this.context.commit(SET_EVENTS, data);
  }
}
