<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col>
        <p class="text-h4 font-weight-black">
          Overview
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title>Recent Projects</v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title>New Issues</v-card-title>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined max-height="600">
          <v-card-title class="font-weight-bold">
            Recent Activity
          </v-card-title>
          <v-skeleton-loader
            type="list"
            :types="{'list': 'list-item-avatar-two-line@5'}"
            :loading="loading"
            transition="slide-y-transition"
          >
            <v-virtual-scroll
              v-if="events.length"
              :items="events"
              :item-height="85"
              height="500"
            >
              <template v-slot="{ item }">
                <v-list-item :key="item._id">
                  <v-list-item-avatar>
                    <img :src="item.byUser.image" alt="user_pic">
                  </v-list-item-avatar>
                  <v-list-item-content v-if="item.type === 'project_created'">
                    <v-list-item-title class="font-weight-bold">
                      <strong>{{ item.byUser.name }} created a project</strong>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon class="mr-1">
                        mdi-apps
                      </v-icon>
                      <router-link :to="{name: 'ProjectPage', params: { projectName: item.body.name }}">
                        {{ item.body.displayName }}
                      </router-link>
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="font-weight-bold">
                      {{ formatDate(item.createdAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content v-if="item.type === 'project_deleted'">
                    <v-list-item-title class="font-weight-bold">
                      <strong>{{ item.byUser.name }} deleted a project</strong>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon class="mr-1">
                        mdi-apps
                      </v-icon>
                      {{ item.body.displayName }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="font-weight-bold">
                      {{ formatDate(item.createdAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content v-if="item.type === 'user_created'">
                    <v-list-item-title class="font-weight-bold">
                      <strong>{{ item.byUser.name }} created a user</strong>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon class="mr-1">
                        mdi-account
                      </v-icon>
                      {{ item.body.email }}
                      with the {{ item.body.role }} role
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="font-weight-bold">
                      {{ formatDate(item.createdAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content v-if="item.type === 'user_deleted'">
                    <v-list-item-title class="font-weight-bold">
                      <strong>{{ item.byUser.name }} deleted a user</strong>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <v-icon class="mr-1">
                        mdi-account
                      </v-icon>
                      {{ item.body.email }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="font-weight-bold">
                      {{ formatDate(item.createdAt) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action v-if="item.audience === 'owners'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          small
                          v-bind="attrs"
                          v-on="on"
                        >
                          fa-user-secret
                        </v-icon>
                      </template>
                      <span>Only Owners can see this</span>
                    </v-tooltip>
                  </v-list-item-action>
                </v-list-item>
                <!-- <v-divider :inset="true" /> -->
              </template>
            </v-virtual-scroll>
            <v-card-text v-else>
              Nothing to see here
            </v-card-text>
          </v-skeleton-loader>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  ComputedRef,
  Ref,
} from '@vue/composition-api';
import store from '@/store';
import { FETCH_EVENTS } from '@/store/actions';
import { formatDate, parseEvent } from '@/utils/helpers';
export default defineComponent({
  name: 'Overview',

  setup() {
    const events = computed(() => store.state.events.items);
    const loading = ref(true);

    onMounted(() => {
      store
        .dispatch(FETCH_EVENTS, { days: 1 })
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
    });

    return {
      events,
      loading,
      formatDate,
    };
  },
});
</script>