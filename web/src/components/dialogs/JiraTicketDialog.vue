<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        color="green darken-2"
        dark
      >
        <v-btn
          icon
          dark
          @click="$emit('update:dialog', false)"
        >
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="headline">
          Ticket editor
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="finisher = !finisher"
          >
            finish
            <v-icon class="ml-2">
              mdi-arrow-right-box
            </v-icon>
          </v-btn>
          <v-dialog
            v-model="finisher"
            persistent
            max-width="600px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">Complete Ticket</span>
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
                  rounded
                  text
                  @click="finisher = !finisher"
                >
                  Close
                </v-btn>
                <v-btn
                  color="green darken-1"
                  rounded
                  text
                  outlined
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
        v-model="issueText"
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
    issueText: {
      required: true,
      type: String,
    },
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
      summary: this.applyPattern(this.issue.fields, this.issue.template.title_pattern),
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
  methods: {
    applyPattern(obj, template) {
      return matchPattern(obj, template);
    },
    async createTicket() {
      const payload = {};
      payload.project = { key: 'DEV' };
      // payload.project = this.selectedProject;
      payload.assignee = { name: null };
      payload.issuetype = this.selectedIssuesType;
      payload.summary = this.summary;
      payload.description = j2md.to_jira(this.issueText);
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
  @import '~simplemde/dist/simplemde.min.css';
</style>
