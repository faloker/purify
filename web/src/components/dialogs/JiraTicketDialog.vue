<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        color="#33333d"
        dark
        dense
      >
        <v-btn
          icon
          dark
          @click="$emit('update:dialog', false)"
        >
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="title">
          Ticket editor
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            color="primary"
            text
            @click="finisher = !finisher"
          >
            next
            <v-icon class="ml-2">
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-dialog
            v-model="finisher"
            persistent
            max-width="600px"
          >
            <v-card>
              <v-card-title>
                <span class="title">Complete Ticket</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex
                      xs12
                    >
                      <v-text-field
                        v-model="summary"
                        required
                        dense
                        label="Summary"
                        outlined
                      />
                    </v-flex>
                    <v-flex
                      xs6
                    >
                      <v-select
                        v-model="selectedIssuesType"
                        :items="issuesTypes"
                        dense
                        item-text="name"
                        label="Issue type"
                        outlined
                        required
                      />
                    </v-flex>
                    <v-flex
                      xs6
                    >
                      <v-select
                        v-model="selectedProject"
                        :items="projects"
                        dense
                        item-text="key"
                        label="Project key"
                        outlined
                        required
                      />
                    </v-flex>
                    <v-flex
                      xs12
                    >
                      <v-select
                        v-model="selectedAssignee"
                        :items="assignee"
                        dense
                        item-text="name"
                        label="Assignee"
                        outlined
                        required
                      />
                    </v-flex>
                    <v-flex
                      xs12
                    >
                      <v-select
                        v-model="selectedComponents"
                        :items="components"
                        dense
                        item-text="name"
                        label="Components"
                        outlined
                        chips
                        multiple
                      />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="red darken-1"
                  text
                  @click="finisher = !finisher"
                >
                  Close
                </v-btn>
                <v-btn
                  color="green darken-1"
                  text
                  @click="createTicket()"
                >
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar-items>
      </v-toolbar>
      <vue-simplemde
        ref="markdownEditor"
        v-model="preparedMarkdown"
        :configs="configs"
      />
    </v-card>
  </v-dialog>
</template>

<script>
import VueSimplemde from 'vue-simplemde';
import j2md from 'jira2md';
import {
  CREATE_TICKET, ISSUES_FETCH,
} from '@/store/actions';
import { matchPattern } from '@/common/utils.servive';

export default {
  name: 'JiraTicketDialog',
  components: {
    VueSimplemde,
  },
  props: {
    // issueText: {
    //   required: true,
    //   type: String,
    // },
    issue: {
      required: true,
      type: Object,
    },
    dialog: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      content: '',
      finisher: false,
      configs: {
        spellChecker: false, // disable spell check
      },
      // summary: this.applyPattern(this.issue.fields, this.issue.template.title_pattern),
      issuesTypes: [{ name: 'Bug' }],
      projects: [{ key: 'DEV' }],
      components: [{ name: 'kek' }],
      assignee: [{ name: 'DDDDD' }, { name: 'Jon Doe' }],
      selectedIssuesType: { name: 'Bug' },
      selectedProject: { key: 'd' },
      selectedAssignee: { name: 'Jon Doe' },
      selectedComponents: [],
    };
  },
  computed: {
    preparedMarkdown() {
      let result = '';
      for (const field of this.issue.template.body_fields) {
        result += `## ${this.parseKey(field.key)}\n`;
        result += `${this.getValue(field.key)}\n\n`;
      }
      return result;
    },
    summary() {
      return this.applyPattern(this.issue.fields, this.issue.template.title_pattern);
    },
  },
  methods: {
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
    async createTicket() {
      const payload = {};
      payload.project = { key: 'DEV' };
      // payload.project = this.selectedProject;
      payload.assignee = { name: null };
      payload.issuetype = this.selectedIssuesType;
      payload.summary = this.summary;
      payload.description = j2md.to_jira(this.preparedMarkdown);
      payload.components = this.selectedComponents;

      const ticket = await this.$store.dispatch(CREATE_TICKET, {
        id: this.issue._id,
        fields: payload,
      });


      if (ticket) {
        await this.$store.dispatch(ISSUES_FETCH, this.$route.params.slug);
        // const updatedIssue = this.issue;
        // updatedIssue.ticket = ticket;
        this.$emit('update:issue', { ...this.issue, ticket });
        this.$emit('update:dialog', false);
      }
    },
  },
};
</script>

<style>
  @import '~simplemde-theme-dark/dist/simplemde-theme-dark.min.css';
</style>
