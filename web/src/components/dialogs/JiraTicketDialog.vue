<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        color="primary"
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
          <b>Ticket Editor</b>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn text @click="openFinisher">
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
                    <v-flex xs12>
                      <v-text-field
                        v-model="summary"
                        required
                        dense
                        label="Summary"
                        outlined
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-select
                        v-model="selectedIssueType"
                        :items="issuesTypes"
                        dense
                        label="Issue type"
                        outlined
                        required
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedProject"
                        dense
                        label="Project key"
                        outlined
                        required
                      />
                    </v-flex>
                    <!-- <v-flex
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
                    </v-flex>-->
                    <v-flex xs12>
                      <v-combobox
                        v-model="labels"
                        label="Labels"
                        chips
                        outlined
                        dense
                        small-chips
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
import j2md from 'jira2md';
import { mapGetters } from 'vuex';
import VueSimpleMDE from 'vue-simplemde';
import { CREATE_TICKET } from '@/store/actions';
import { matchPattern, prepareMarkdown } from '@//utils/helpers';

export default {
  name: 'JiraTicketDialog',

  components: {
    'vue-simplemde': VueSimpleMDE,
  },

  props: {
    issue: {
      required: true,
      type: Object,
    },
    dialog: {
      required: true,
      type: Boolean,
    },
  },

  data: () => ({
    content: '',
    finisher: false,
    configs: {
      spellChecker: false, // disable spell check
    },
    summary: '',
    issuesTypes: ['Bug', 'Task'],
    projects: [{ key: 'DEV' }],
    components: [{ name: 'kek' }],
    assignee: [{ name: 'DDDDD' }, { name: 'Jon Doe' }],
    selectedIssueType: '',
    selectedProject: '',
    selectedAssignee: { name: 'Jon Doe' },
    selectedComponents: [],
    labels: [],
  }),

  computed: {
    ...mapGetters(['findTemplateByName']),

    issueTemplate() {
      return this.findTemplateByName(this.issue.template).template;
    },

    preparedMarkdown() {
      return this.prepareMarkdown(this.issue, this.issueTemplate);
    },
  },

  methods: {
    matchPattern,

    prepareMarkdown,

    async createTicket() {
      const payload = {};
      payload.project = { key: this.selectedProject };
      payload.assignee = { name: null };
      payload.issuetype = { name: this.selectedIssueType };
      payload.labels = this.labels;
      payload.summary = this.summary;
      payload.description = j2md.to_jira(this.preparedMarkdown);
      // payload.components = this.components;

      const ticket = await this.$store.dispatch(CREATE_TICKET, {
        id: this.issue._id,
        fields: payload,
      });

      if (ticket) {
        this.$showMessage('success', 'Jira ticket created successfully');
        this.issue.ticket = ticket;
        this.$emit('update:dialog', false);
      }
    },

    openFinisher() {
      this.summary = this.issue.title;
      this.finisher = true;
    },
  },
};
</script>

<style>
@import '~simplemde/dist/simplemde.min.css';
</style>
