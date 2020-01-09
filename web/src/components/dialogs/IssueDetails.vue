<template>
  <v-card class="fill-height">
    <v-card-title>
      <v-container>
        <v-row>
          <v-col
            cols="1"
            class="ml-2"
          >
            <v-row justify="center">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    large
                    :color="genColor()"
                    @click="riskDialog = !riskDialog"
                    v-on="on"
                  >
                    <v-icon>
                      fa-bug
                    </v-icon>
                  </v-btn>
                </template>
                <span>Change Risk</span>
              </v-tooltip>
            </v-row>
            <v-row justify="center">
              <span>{{ issue.risk }}</span>
            </v-row>
            <v-dialog
              v-model="riskDialog"
              max-width="300"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">Change risk</span>
                </v-card-title>
                <v-card-text>
                  <v-select
                    v-model="risk"
                    :items="severities"
                    label="How bad is it?"
                    outlined
                  />
                </v-card-text>
                <v-divider />
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    color="green darken-1"
                    rounded
                    text
                    outlined
                    @click="updateIssue(issue, 'risk', risk)"
                  >
                    Confirm
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
          <v-divider
            class="my-3 mx-3"
            vertical
          />
          <v-col
            class="ml-2"
            cols="9"
          >
            <v-row class="headline">
              {{ applyPattern(issue.fields, issue.template.title_pattern) }}
            </v-row>
            <v-row class="title grey--text font-weight-light my-2">
              {{ applyPattern(issue.fields, issue.template.subtitle_pattern) }}
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col>
            <v-btn
              v-if="!issue.is_closed"
              class="mr-2"
              outlined
              @click="updateIssue(issue, 'is_fp', !issue.is_fp)"
            >
              Mark as false
            </v-btn>
            <v-btn
              outlined
              class="mr-2"
              :color="issue.is_closed ? 'green' : 'red darken-3'"
              @click="updateIssue(issue, 'is_closed', !issue.is_closed)"
            >
              {{ issue.is_closed ? 'Open' : 'Close' }}
            </v-btn>
            <v-btn
              v-if="!issue.ticket"
              outlined
              class="mr-2"
              color="blue darken-3"
              @click="ticketDialog = !ticketDialog"
            >
              Create Ticket
              <v-icon
                color="blue darken-3"
                right
              >
                mdi-jira
              </v-icon>
            </v-btn>
            <v-btn
              v-else
              outlined
              class="mx-2"
              color="blue darken-3"
              :href="issue.ticket.link"
              target="_blank"
            >
              <v-icon
                v-if="issue.ticket.type == 'jira'"
                color="blue darken-3"
                left
              >
                mdi-jira
              </v-icon>
              {{ issue.ticket.key }}
            </v-btn>
            <jira-ticket-dialog
              :issue.sync="issue"
              :issue-text="preparedMarkdown(issue.template.body_fields)"
              :dialog.sync="ticketDialog"
            />
          </v-col>
        </v-row>
        <v-row class="ml-2">
          <!-- <v-row>
              <span>Duplication scope</span>
              <span
                class="display-1 font-weight-bold ml-3"
              >
                {{ issue.dup_score }}
              </span>
            </v-row>
          </v-col>  -->
        </v-row>
      </v-container>
    </v-card-title>
    <v-container>
      <v-col
        v-for="key in issue.template.body_fields"
        :key="`id-${key}`"
      >
        <fields-parser
          :ikey="key"
          :ivalue="getValue(key)"
        />
      </v-col>
    </v-container>
  </v-card>
</template>
<script>
/* eslint-disable no-restricted-syntax */
import FieldsParser from '@/components/FieldsParser.vue';
import JiraTicketDialog from '@/components/dialogs/JiraTicketDialog.vue';
import { matchPattern } from '@/common/utils.servive';
import {
  ISSUE_UPDATE, ISSUES_FETCH,
} from '@/store/actions';

export default {
  name: 'IssueDetails',
  components: {
    JiraTicketDialog,
    FieldsParser,
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
      severities: ['Info', 'Low', 'Medium', 'High', 'Critical'],
      riskDialog: false,
      risk: 'Medium',
    };
  },
  computed: {
  },
  methods: {
    preparedMarkdown(body) {
      let result = '';
      for (const key of body) {
        result += `## ${this.parseKey(key)}\n`;
        result += `${this.getValue(key)}\n\n`;
      }
      return result;
    },
    isPrintable(obj) {
      return ['string', 'boolean', 'number'].includes(typeof obj);
    },
    applyPattern(obj, template) {
      return matchPattern(obj, template);
    },
    parseKey(key) {
      const res = key.includes('.') ? key.match(/\.[^.]+$/)[0].replace('.', '') : key;
      return _.capitalize(_.startCase(res));
    },
    getValue(key) {
      return _.get(this.issue.fields, key);
    },
    updateIssue(item, field, value) {
      const change = {};
      if (field === 'is_fp') { change.is_closed = true; this.issue.is_closed = true; }
      change[field] = value;
      this.issue[field] = value;
      this.$store.dispatch(ISSUE_UPDATE, { ids: [item._id], change }).then(() => {
        this.$store.dispatch(ISSUES_FETCH, this.$route.params.slug);
      });
    },
    genColor() {
      switch (this.issue.risk) {
        case 'Info': return 'light-blue lighten-3';
        case 'Low': return 'blue';
        case 'Medium': return 'orange';
        case 'High': return 'red darken-2';
        case 'Critical': return 'red darken-4';
        default:
          return 'grey';
      }
    },
  },
};
</script>
<style>
.section-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

</style>
