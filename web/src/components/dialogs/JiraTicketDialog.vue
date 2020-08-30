<template>
  <v-dialog
    v-model="value"
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
          @click="$emit('input', false)"
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
      <v-row>
        <v-col cols="6">
          <editor
            ref="JiraTicketEditor"
            v-model="markdown"
            mode="text/x-markdown"
          />
        </v-col>
        <v-divider vertical />
        <v-col cols="5">
          <div class="ma-3 preview-html" v-html="compiledMarkdown" />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ComputedRef,
  PropType,
  ref,
  onMounted,
} from '@vue/composition-api';
// @ts-ignore
import j2md from 'jira2md';
import marked from 'marked';
import Editor from '@/components/Editor.vue';
import { CREATE_TICKET, SHOW_SUCCESS_MSG } from '@/store/actions';
import { prepareMarkdown } from '@/utils/helpers';
import { Template, TemplateWithStats, Issue } from '@/store/types';
import store from '@/store';

export default defineComponent({
  name: 'JiraTicketDialog',

  components: {
    Editor,
  },

  props: {
    issue: {
      required: true,
      type: Object as PropType<Issue>,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const finisher = ref(false);
    const summary = ref('');
    const configs = ref({ spellChecker: false });
    const issuesTypes = ref(['Bug', 'Task', 'Epic']);
    const components = ref([{ name: 'kek' }]);
    const selectedIssueType = ref('');
    const selectedProject = ref('');
    // const selectedAssignee
    const selectedComponents = ref([]);
    const labels = ref([]);
    const markdown = ref('');

    const issueTemplate: ComputedRef<Template> = computed(() => {
      const doc = store.state.templates.items.find(
        (item: TemplateWithStats) => item.displayName === props.issue.template
      );
      return doc ? doc : {};
    });

    const compiledMarkdown = computed(() => marked(markdown.value));

    onMounted(() => {
      markdown.value = prepareMarkdown(props.issue, issueTemplate.value);
    });

    async function createTicket() {
      const payload: any = {};
      payload.project = { key: selectedProject.value };
      payload.assignee = { name: null };
      payload.issuetype = { name: selectedIssueType.value };
      payload.labels = labels.value;
      payload.summary = summary.value;
      payload.description = j2md.to_jira(markdown.value);
      // payload.components = this.components;

      const ticket = await store.dispatch(CREATE_TICKET, {
        issueId: props.issue._id,
        fields: payload,
      });

      if (ticket) {
        const updatedIssue = props.issue;
        updatedIssue.ticket = ticket;
        context.emit('update:issue', updatedIssue);
        context.emit('input', false);
        await store.dispatch(SHOW_SUCCESS_MSG, 'Jira ticket has been created');
      }
    }

    function openFinisher() {
      summary.value = props.issue.title;
      finisher.value = true;
    }

    return {
      openFinisher,
      compiledMarkdown,
      createTicket,
      markdown,
      finisher,
      configs,
      summary,
      issuesTypes,
      components,
      selectedIssueType,
      selectedProject,
      selectedComponents,
      labels,
    };
  },
});
</script>
<style>
.preview-html {
  font-size: 14px;
}
</style>
