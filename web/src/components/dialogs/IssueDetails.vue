<template>
  <v-card class="fill-height">
    <v-card-title>
      <v-container>
        <v-row>
          <v-col cols="1" class="ml-2">
            <v-row justify="center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    large
                    :color="genColor()"
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
              <span>{{ issue.risk }}</span>
            </v-row>
            <v-dialog v-model="riskDialog" max-width="300">
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
              {{ matchPattern(issue.fields, issue.template.title_pattern) }}
            </v-row>
            <v-row
              class="title grey--text font-weight-light my-2"
            >
              {{ matchPattern(issue.fields, issue.template.subtitle_pattern) }}
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-menu
              v-if="!issue.is_closed"
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
                <!-- eslint-disable-next-line max-len -->
                <v-list-item key="switch-resolution" @click="updateIssue(issue, 'is_closed', true)">
                  <v-list-item-title>Resolved</v-list-item-title>
                </v-list-item>
                <v-list-item key="switch-as-fp" @click="updateIssue(issue, 'is_fp', true)">
                  <v-list-item-title>False Positive</v-list-item-title>
                </v-list-item>
                <!-- eslint-disable-next-line max-len -->
                <v-list-item
                  key="switch-risk-accepted"
                  @click="updateIssue(issue, 'is_risk_accepted', true)"
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
              @click="updateIssue(issue, 'is_closed', false)"
            >
              Reopen
            </v-btn>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <span v-on="on">
                  <v-btn
                    v-if="!issue.ticket"
                    outlined
                    :disabled="!systemSetup.jira"
                    class="mr-2"
                    color="senary"
                    @click="ticketDialog = !ticketDialog"
                  >
                    <v-icon color="senary" left>mdi-jira</v-icon>
                    Create Ticket
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
              <v-icon :left="!!issue.comments.length" small>
                mdi-comment-text-multiple
              </v-icon>
              <span v-if="issue.comments.length">{{ issue.comments.length }}</span>
            </v-btn>
            <v-dialog
              :key="`edit-dialog-${issue._id}`"
              v-model="editDialog"
              max-width="800"
            >
              <edit-issue-dialog :issue.sync="issue" />
            </v-dialog>
            <jira-ticket-dialog
              :key="`ticket-dialog-${issue._id}`"
              :issue.sync="issue"
              :dialog.sync="ticketDialog"
            />
            <comment-dialog
              :key="`idcd-${issue._id}`"
              :issue.sync="issue"
              :dialog.sync="commentDialog"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-container>
      <v-col v-for="field in issue.template.body_fields" :key="`id-${field.key}`">
        <fields-parser :ikey="field" :ivalue="getValue(issue.fields, field.key)" />
      </v-col>
    </v-container>
  </v-card>
</template>
<script>
/* eslint-disable no-restricted-syntax */
import { mapState } from 'vuex';
import FieldsParser from '@/components/FieldsParser.vue';
import JiraTicketDialog from '@/components/dialogs/JiraTicketDialog.vue';
import EditIssueDialog from '@/components/dialogs/EditIssueDialog.vue';
import CommentDialog from '@/components/dialogs/CommentDialog.vue';
import { ISSUE_UPDATE } from '@/store/actions';
import { matchPattern, parseKey, getValue } from '@//utils/helpers';

export default {
  name: 'IssueDetails',
  components: {
    JiraTicketDialog,
    FieldsParser,
    CommentDialog,
    EditIssueDialog,
  },
  props: {
    issue: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      ticketDialog: false,
      editDialog: false,
      severities: ['Info', 'Low', 'Medium', 'High', 'Critical'],
      riskDialog: false,
      commentDialog: false,
      risk: 'Medium',
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ],
    };
  },
  computed: {
    ...mapState({
      systemSetup: (state) => state.app.setup,
    }),
    preparedMarkdown() {
      let result = '';
      for (const field of this.issue.template.body_fields) {
        result += `## ${this.parseKey(field.key)}\n`;
        result += `${this.getValue(this.issue.fields, field.key)}\n\n`;
      }
      return result;
    },
  },
  methods: {
    matchPattern,
    parseKey,
    getValue,
    isPrintable(obj) {
      return ['string', 'boolean', 'number'].includes(typeof obj);
    },
    updateIssue(item, field, value) {
      const change = {};
      if (field !== 'is_closed') {
        change.is_closed = true;
      } else if (value === false) {
        change.is_fp = false;
        change.is_risk_accepted = false;
      }

      change[field] = value;

      this.$store.dispatch(ISSUE_UPDATE, { ids: [item._id], change }).then(() => {
        if (field !== 'is_closed') {
          this.issue.is_closed = true;
        } else if (value === false) {
          this.issue.is_fp = false;
          this.issue.is_risk_accepted = false;
        }
        this.issue[field] = value;
      });
    },
    genColor() {
      switch (this.issue.risk) {
        case 'Info':
          return 'light-blue lighten-3';
        case 'Low':
          return 'blue';
        case 'Medium':
          return 'orange';
        case 'High':
          return 'red darken-2';
        case 'Critical':
          return 'red darken-4';
        default:
          return 'grey';
      }
    },
  },
};
</script>
<style></style>
