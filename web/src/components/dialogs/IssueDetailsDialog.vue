<template>
  <v-dialog
    v-model="value"
    max-width="56%"
    @click:outside="$emit('input', false)"
  >
    <v-card class="fill-height">
      <v-card-title>
        <v-container>
          <v-row align="center">
            <v-col cols="1" class="ml-2">
              <v-row justify="center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      large
                      :color="getRiskColor(issue.risk)"
                      @click="riskDialog = !riskDialog"
                      v-on="on"
                    >
                      <v-icon>fa-bug</v-icon>
                    </v-btn>
                  </template>
                  <span>Change Risk</span>
                </v-tooltip>
              </v-row>
              <v-row justify="center">
                <span class="text-capitalize">{{ issue.risk }}</span>
              </v-row>
              <v-dialog
                v-model="riskDialog"
                max-width="300"
              >
                <v-card>
                  <v-card-title>
                    <span class="title mb-2">Change risk</span>
                  </v-card-title>
                  <v-card-text>
                    <v-select
                      v-model="risk"
                      :items="severities"
                      label="How bad is it?"
                      outlined
                      dense
                    />
                  </v-card-text>
                  <v-divider />
                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="green darken-1"
                      text
                      @click="updateIssue(issue, 'risk', risk)"
                    >
                      Confirm
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-divider class="my-3 mx-3" vertical />
            <v-col class="ml-2" cols="9">
              <v-row class="headline">
                {{ matchPattern(issue.fields, issueTemplate.titlePattern) }}
              </v-row>
              <v-row
                class="title grey--text font-weight-light my-2"
              >
                {{ matchPattern(issue.fields, issueTemplate.subtitlePattern) }}
              </v-row>
            </v-col>
          </v-row>
          <v-row v-permission="['owner', 'admin', 'user']" justify="center">
            <v-col>
              <v-menu
                v-if="issue.status === 'open'"
                transition="slide-y-transition"
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mr-2"
                    color="tertiary"
                    outlined
                    v-on="on"
                  >
                    Resolution
                    <v-icon right>
                      mdi-chevron-down
                    </v-icon>
                  </v-btn>
                </template>
                <v-list>
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
                </v-list>
              </v-menu>
              <v-btn
                v-else
                outlined
                class="mr-2"
                color="primary"
                @click="updateIssue(issue, 'status', 'open')"
              >
                Reopen
              </v-btn>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-btn
                      v-if="!issue.ticket"
                      outlined
                      :disabled="!systemConfig.jira"
                      class="mr-2"
                      color="senary"
                      @click="ticketDialog = !ticketDialog"
                    >
                      <v-icon color="senary" left>mdi-jira</v-icon>Create Ticket
                    </v-btn>
                  </span>
                </template>
                <span>Set up Jira to create a ticket</span>
              </v-tooltip>
              <v-btn
                v-if="issue.ticket"
                outlined
                class="mx-2"
                color="senary"
                :href="issue.ticket.link"
                target="_blank"
              >
                <v-icon
                  v-if="issue.ticket.type == 'jira'"
                  color="senary"
                  left
                >
                  mdi-jira
                </v-icon>
                {{ issue.ticket.key }}
              </v-btn>
              <v-btn
                outlined
                class="mr-2"
                color="quaternary"
                @click="editDialog = true"
              >
                <v-icon left>
                  mdi-pencil
                </v-icon>Edit
              </v-btn>
              <v-btn
                outlined
                class="mr-2"
                color="secondary"
                @click="commentDialog = true"
              >
                <v-icon :left="!!comments.length" small>
                  mdi-comment-text-multiple
                </v-icon>
                <span v-if="comments.length">{{ comments.length }}</span>
              </v-btn>
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
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>
      <v-container>
        <v-col v-for="field in issueTemplate.bodyFields" :key="`${Math.random()}-${field.key}`">
          <fields-parser :ikey="field" :ivalue="getValue(issue.fields, field.key)" />
        </v-col>
      </v-container>
    </v-card>
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
import { getRiskColor } from '@/utils/helpers';
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
      getValue,
      systemConfig,
      getRiskColor,
      comments,
    };
  },
});
</script>
