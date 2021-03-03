<template>
  <v-dialog
    v-model="value"
    max-width="56%"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <v-row
        class="ml-2"
        no-gutters
        dense
      >
        <v-breadcrumbs :items="items" />
      </v-row>
      <v-row no-gutters dense>
        <v-col cols="9">
          <v-card-title class="mx-4">
            <v-row>
              <v-col class="ml-2" cols="8">
                <v-row class="headline font-weight-bold">
                  {{ matchPattern(issue.fields, issueTemplate.titlePattern) }}
                </v-row>
                <v-row
                  class="title grey--text my-2"
                >
                  {{ matchPattern(issue.fields, issueTemplate.subtitlePattern) }}
                </v-row>
                <v-row>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        small
                        class="mr-2"
                        color="grey"
                        elevation="0"
                        @click.stop="editDialog = true"
                        v-on="on"
                      >
                        <v-icon small color="white">
                          mdi-file-document-edit-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Edit fields</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-if="!issue.ticket"
                        small
                        :disabled="!systemConfig.jira"
                        class="mr-2"
                        elevation="0"
                        color="grey"
                        @click.stop="ticketDialog = true"
                        v-on="on"
                      >
                        <v-icon small color="white">
                          mdi-jira
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Create JIRA ticket</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        id="commentBtn"
                        small
                        class="mr-2"
                        elevation="0"
                        color="grey"
                        @click.stop="commentDialog = true"
                        v-on="on"
                      >
                        <v-icon
                          small
                          :left="!!comments.length"
                          color="white"
                        >
                          mdi-comment-text-multiple
                        </v-icon>
                        <span v-if="comments.length" class="white--text">{{ comments.length }}</span>
                      </v-btn>
                    </template>
                    <span>Add comment</span>
                  </v-tooltip>
                </v-row>
              </v-col>
            </v-row>
          </v-card-title>
          <v-container>
            <v-col v-for="field in issueTemplate.bodyFields" :key="`${Math.random()}-${field.key}`">
              <fields-parser :ikey="field" :ivalue="getValue(issue.fields, field.key)" />
            </v-col>
          </v-container>
        </v-col>
        <v-col>
          <v-row dense no-gutters>
            <v-col>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="subtitle-1 font-weight-bold">
                      <v-icon
                        left
                        class="mb-1"
                        :color="issue.resolution !== 'none' ? 'tertiary' : ''"
                      >
                        {{ issue.resolution !== 'none' ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle' }}
                      </v-icon>
                      Resolution
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-menu
                      transition="slide-y-transition"
                      :close-on-content-click="true"
                      bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-chip
                          id="issue-resolution"
                          small
                          class="ml-1 text-capitalize"
                          v-on="on"
                        >
                          {{ issue.resolution }}
                        </v-chip>
                      </template>
                      <v-list dense>
                        <v-list-item
                          key="switch-resolution"
                          @click="updateIssue(issue, 'resolution', 'resolved')"
                        >
                          <v-list-item-title>Resolved</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          key="switch-as-fp"
                          @click="updateIssue(issue, 'resolution', 'false positive')"
                        >
                          <v-list-item-title>False Positive</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          key="switch-risk-accepted"
                          @click="updateIssue(issue, 'resolution', 'accepted risk')"
                        >
                          <v-list-item-title>Accepted Risk</v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          key="switch-none"
                          @click="updateIssue(issue, 'status', 'open')"
                        >
                          <v-list-item-title>None</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="subtitle-1 font-weight-bold">
                      <v-icon
                        left
                        class="mb-1"
                        :color="getRiskColor(issue.risk)"
                      >
                        mdi-fire
                      </v-icon>Risk
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-menu
                      transition="slide-y-transition"
                      :close-on-content-click="true"
                      bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-chip
                          id="issue-risk"
                          small
                          class="ml-1 text-capitalize"
                          v-on="on"
                        >
                          {{ issue.risk }}
                        </v-chip>
                      </template>
                      <v-list dense>
                        <v-list-item
                          v-for="severity in severities"
                          :key="`switch-${severity}`"
                          @click="updateIssue(issue, 'risk', severity)"
                        >
                          <v-list-item-title class="text-capitalize">
                            {{ severity }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="issue.ticket" two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="subtitle-1 font-weight-bold">
                      <v-icon
                        left
                        class="mb-1"
                        color="quinary"
                      >
                        mdi-jira
                      </v-icon>
                      Ticket
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip
                      id="issue-ticket"
                      small
                      class="ml-1"
                      :href="issue.ticket.link"
                      target="_blank"
                    >
                      {{ issue.ticket.key }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="subtitle-1 font-weight-bold">
                      <v-icon
                        left
                        class="mb-1"
                        color="quinary"
                      >
                        mdi-calendar
                      </v-icon>
                      Created
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip id="issue-date" small>
                      {{ formatDate(issue.createdAt, 'dd MMM yyyy') }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="issue.closedAt" two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="subtitle-1 font-weight-bold">
                      <v-icon
                        left
                        color="quinary"
                      >
                        mdi-calendar-check
                      </v-icon>Resolved
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip small>
                      {{ issue.closedAt ? formatDate(issue.closedAt, 'dd MMM yyyy') : 'Not yet' }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
    <edit-issue-dialog
      :key="`edit-dialog-${issue._id}`"
      v-model="editDialog"
      :issue.sync="issue"
    />
    <jira-ticket-dialog
      :key="`ticket-dialog-${issue._id}`"
      v-model="ticketDialog"
      :issue.sync="issue"
    />
    <comment-dialog
      :key="`idcd-${issue._id}`"
      v-model="commentDialog"
      :issue-id.sync="issue._id"
    />
  </v-dialog>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
  PropType,
} from '@vue/composition-api';
import store from '@/store';
import FieldsParser from '@/components/FieldsParser.vue';
import JiraTicketDialog from '@/components/dialogs/JiraTicketDialog.vue';
import EditIssueDialog from '@/components/dialogs/EditIssueDialog.vue';
import CommentDialog from '@/components/dialogs/CommentDialog.vue';
import { getRiskColor, formatDate } from '@/utils/helpers';
import { ISSUE_UPDATE, SHOW_SUCCESS_MSG } from '@/store/actions';
import { parseKey, getValue, matchPattern, isPrintable } from '@/utils/helpers';
import {
  Issue,
  SystemConfig,
  Comment,
  Template,
  TemplateWithStats,
} from '@/store/types';

export default defineComponent({
  name: 'IssueDetailsDialog',

  components: {
    JiraTicketDialog,
    FieldsParser,
    CommentDialog,
    EditIssueDialog,
  },

  props: {
    issue: {
      type: Object as PropType<Issue>,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const ticketDialog = ref(false);
    const editDialog = ref(false);
    const severities = ref(['info', 'low', 'medium', 'high', 'critical']);
    const riskDialog = ref(false);
    const commentDialog = ref(false);
    const risk = ref('');

    const systemConfig: ComputedRef<SystemConfig> = computed(
      () => store.state.system.config
    );

    const comments: ComputedRef<Comment[]> = computed(
      () => store.state.issues.comments
    );

    const issueTemplate: ComputedRef<Template> = computed(() => {
      const doc = store.state.templates.items.find(
        (item: TemplateWithStats) => item.displayName === props.issue.template
      );
      return doc ? doc : {};
    });

    const projectName = computed(() => store.state.system.projectName);
    const unitName = props.issue.unit as string;
    const items = computed(() => {
      return [
        {
          text: projectName.value,
          disabled: false,
          to: {
            name: 'ProjectOverview',
            params: { projectName: projectName.value },
          },
        },
        {
          text: unitName.replace(projectName.value + '.', ''),
          disabled: false,
          to: {
            name: 'Issues',
            params: {
              projectName: projectName.value,
              unitName: unitName,
            },
          },
        },
        {
          text: props.issue._id,
          disabled: true,
        },
      ];
    });

    const preparedMarkdown = computed(() => {
      let result = '';
      for (const field of issueTemplate.value.bodyFields) {
        result += `## ${parseKey(field.key)}\n`;
        result += `${getValue(props.issue.fields, field.key)}\n\n`;
      }
      return result;
    });

    function updateIssue(item: Issue, field: string, value: string) {
      const change: any = {};
      if (field === 'resolution') {
        change.status = 'closed';
      } else if (field === 'status') {
        change.resolution = 'none';
      }

      change[field] = value;

      store
        .dispatch(ISSUE_UPDATE, {
          ids: [item._id],
          change,
        })
        .then(async () => {
          if (field === 'resolution') {
            props.issue.status = 'closed';
          } else if (field === 'status') {
            props.issue.resolution = 'none';
            // @ts-ignore
            props.issue.closedAt = undefined;
          }
          // @ts-ignore
          props.issue[field] = value;

          if (field === 'risk') {
            riskDialog.value = false;
          }
          await store.dispatch(SHOW_SUCCESS_MSG, 'The issue has been updated');
        })
        .catch(() => {});
    }
    return {
      items,
      updateIssue,
      isPrintable,
      preparedMarkdown,
      issueTemplate,
      ticketDialog,
      editDialog,
      severities,
      riskDialog,
      matchPattern,
      commentDialog,
      risk,
      formatDate,
      getValue,
      systemConfig,
      getRiskColor,
      comments,
    };
  },
});
</script>
