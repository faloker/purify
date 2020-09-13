<template>
  <v-container>
    <v-row>
      <v-col>
        <p class="text-h4 font-weight-bold">
          Overview
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-title class="font-weight-bold">
            <v-icon left>
              mdi-apps
            </v-icon>Recent Projects
          </v-card-title>
          <v-row>
            <template v-for="project in filteredProjects">
              <v-col :key="project._id">
                <v-skeleton-loader
                  type="card"
                  class="mx-auto"
                  :loading="projectsLoading"
                  width="250"
                  height="150"
                  transition="scale-transition"
                >
                  <project-card :project="project" />
                </v-skeleton-loader>
              </v-col>
            </template>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined max-height="600">
          <v-card-title class="font-weight-bold">
            <v-icon left>
              mdi-new-box
            </v-icon>New Issues
          </v-card-title>
          <v-card-subtitle>New issues created in the last 24 hours</v-card-subtitle>
          <v-skeleton-loader
            type="list"
            :types="{'list': 'list-item-avatar-two-line@5'}"
            :loading="issuesLoading"
            transition="slide-y-transition"
          >
            <v-list
              v-if="issues.length"
              max-height="500"
              style="overflow-y: scroll;"
            >
              <v-list-item
                v-for="issue in issues"
                :key="issue._id"
                :to="{ name: 'Issues', params: { projectName: issue.project, unitName: issue.unit, issueId: issue._id } }"
              >
                <v-list-item-avatar>
                  <v-icon large :color="getRiskColor(issue.risk)">
                    mdi-fire
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ issue.title }}</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-2">
                    {{ issue.subtitle }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(issue.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-text v-else>
              Nothing to see here
            </v-card-text>
          </v-skeleton-loader>
        </v-card>
      </v-col>
      <v-col>
        <v-card outlined max-height="600">
          <v-card-title class="font-weight-bold">
            <v-icon left>
              fa-newspaper
            </v-icon>Recent Activity
          </v-card-title>
          <v-card-subtitle>This is what happened in the last 24 hours</v-card-subtitle>
          <v-skeleton-loader
            type="list"
            :types="{'list': 'list-item-avatar-two-line@5'}"
            :loading="eventsLoading"
            transition="slide-y-transition"
          >
            <v-list
              v-if="events.length"
              max-height="500"
              style="overflow-y: scroll;"
            >
              <v-list-item
                v-for="item in events"
                :key="item._id"
                :to="eventLink(item)"
              >
                <v-list-item-avatar>
                  <img :src="item.byUser.image" alt="user_pic">
                </v-list-item-avatar>
                <v-list-item-content v-if="item.type === 'project_created'">
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ item.byUser.name }} created a project</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-2">
                    <v-icon small class="mr-1">
                      mdi-apps
                    </v-icon>
                    <span class="text-capitalize font-weight-bold">{{ item.body.displayName }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(item.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-if="item.type === 'project_deleted'">
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ item.byUser.name }} deleted a project</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-2">
                    <v-icon small class="mr-1">
                      mdi-apps
                    </v-icon>
                    <span class="text-capitalize font-weight-bold">{{ item.body.displayName }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(item.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-if="item.type === 'user_created'">
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ item.byUser.name }} created a user</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-2">
                    <v-icon small class="mr-1">
                      mdi-account
                    </v-icon>
                    <code>{{ item.body.email }}</code>
                    with the <code><span class="text-capitalize font-weight-bold">{{ item.body.role }}</span></code> role
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(item.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-if="item.type === 'user_deleted'">
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ item.byUser.name }} deleted a user</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-2">
                    <v-icon small class="mr-1">
                      mdi-account
                    </v-icon>
                    <code>{{ item.body.email }}</code>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(item.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-if="item.type === 'comment_created'">
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ item.byUser.name }} commented on an issue</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon small class="my-1 mr-1">
                      mdi-comment-text
                    </v-icon>
                    {{ item.body.text }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="mt-1 mb-2">
                    <v-icon
                      :color="getRiskColor(item.body.risk)"
                      small
                      class="mr-1"
                    >
                      mdi-fire
                    </v-icon>
                    {{ item.body.title }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(item.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-if="item.type === 'issue_resolved'">
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ item.byUser.name }} resolved an issue</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-2">
                    <v-icon
                      :color="getRiskColor(item.body.risk)"
                      small
                      class="mr-1"
                    >
                      mdi-fire
                    </v-icon>
                    {{ item.body.title }}
                    <v-chip class="ml-2" x-small>
                      <span class="text-capitalize">{{ item.body.resolution }}</span>
                    </v-chip>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(item.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-if="item.type === 'ticket_created'">
                  <v-list-item-title class="font-weight-bold">
                    <strong>{{ item.byUser.name }} created a ticket</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle class="my-1">
                    <v-icon small class="mr-1">
                      mdi-jira
                    </v-icon>
                    <a :href="item.body.link" class="text-decoration-none">{{ item.body.key }}</a>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="mt-1 mb-2">
                    <v-icon
                      :color="getRiskColor(item.body.risk)"
                      small
                      class="mr-1"
                    >
                      mdi-fire
                    </v-icon>
                    {{ item.body.title }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ formatDate(item.createdAt) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action v-if="item.audience === 'owners'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on">
                        mdi-eye-circle-outline
                      </v-icon>
                    </template>
                    <span>Only Owners can see this</span>
                  </v-tooltip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
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
} from '@vue/composition-api';
import store from '@/store';
import ProjectCard from '@/components/ProjectCard.vue';
import {
  FETCH_EVENTS,
  FETCH_PROJECTS,
  FETCH_RECENT_PROJECTS,
  ISSUES_FETCH,
  PROFILE_FETCH,
} from '@/store/actions';
import { formatDate, getRiskColor } from '@/utils/helpers';
import { Issue, Event, Project, User } from '@/store/types';
export default defineComponent({
  name: 'Overview',

  components: { ProjectCard },

  setup() {
    const events: ComputedRef<Event[]> = computed(
      () => store.state.events.items
    );
    const issues: ComputedRef<Issue[]> = computed(
      () => store.state.issues.items
    );
    const projects: ComputedRef<Project[]> = computed(
      () => store.state.projects.items
    );
    const user: ComputedRef<User> = computed(() => store.state.profile.user);
    const eventsLoading = ref(true);
    const issuesLoading = ref(true);
    const projectsLoading = ref(true);

    const filteredProjects = computed(() => {
      return projects.value.filter(project =>
        user.value.recentProjects.includes(project.name)
      );
    });

    onMounted(() => {
      store
        .dispatch(ISSUES_FETCH, { limit: 10, days: 1 })
        .then(() => {
          issuesLoading.value = false;
        })
        .catch(() => {});
      store
        .dispatch(FETCH_EVENTS, { days: 1 })
        .then(() => {
          eventsLoading.value = false;
        })
        .catch(() => {});
      store
        .dispatch(FETCH_RECENT_PROJECTS)
        .then(async () => {
          await store.dispatch(FETCH_PROJECTS, true).catch(() => {});
          projectsLoading.value = false;
        })
        .catch(() => {});
    });

    function eventLink(event: Event) {
      switch (event.type) {
        case 'project_created':
          return {
            name: 'ProjectPage',
            params: { projectName: event.body.name },
          };
        case 'project_deleted':
          return {
            name: 'Projects',
          };
        case 'ticket_created':
        case 'issue_resolved':
        case 'comment_created':
          return {
            name: 'Issues',
            params: {
              projectName: event.body.project,
              unitName: event.body.unit,
              issueId: event.body._id,
            },
          };
        case 'user_created':
        case 'user_deleted':
          return {
            name: 'Users',
          };
      }
    }

    return {
      events,
      filteredProjects,
      issues,
      projects,
      eventsLoading,
      issuesLoading,
      projectsLoading,
      formatDate,
      eventLink,
      getRiskColor,
    };
  },
});
</script>