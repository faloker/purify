<template>
  <div>
    <v-dialog
      v-model="stepper"
      max-width="60%"
      persistent
    >
      <v-stepper
        v-model="e6"
        non-linear
        vertical
      >
        <v-stepper-step
          :complete="e6 > 1"
          step="1"
        >
          Select an array with issues
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-card
            class="fill-height"
            flat
          >
            <v-btn
              class="mx-2"
              outlined
              @click="getContent(reportId)"
            >
              View report
            </v-btn>
            <v-btn
              class="mx-2"
              :disabled="!path_to_issues"
              outlined
              color="primary"
              @click="e6 = 2"
            >
              Next
            </v-btn>
            <v-card-text>
              You have chosen the following:
              <b class="ml-3">{{ path_to_issues }}</b>
            </v-card-text>
          </v-card>
        </v-stepper-content>
        <v-stepper-step
          :complete="e6 > 2"
          step="2"
        >
          Which fields will be in issue title and subtitle?
        </v-stepper-step>
        <v-stepper-content step="2">
          <v-card
            class="fill-height"
            flat
          >
            <v-card-text>
              <vue-json-pretty
                v-model="title_fields"
                :deep="2"
                :path="'issue'"
                :selectable-type="'multiple'"
                :path-selectable="((path, data) => path !== 'issue')"
                :data="exampleIssue"
                :show-select-controller="true"
                :highlight-selected-node="false"
              />
            </v-card-text>
            <v-btn
              class="mx-2"
              outlined
              :disabled="!title_fields.length"
              color="primary"
              @click="e6 = 3"
            >
              Next
            </v-btn>
            <v-btn

              class="mx-2"
              outlined
              @click="e6 = 1"
            >
              Go back
            </v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-step
          :complete="e6 > 3"
          step="3"
        >
          Add patterns to display title and subtitle
        </v-stepper-step>
        <v-stepper-content step="3">
          <v-card
            class="fill-height"
            flat
          >
            <v-card-text>
              <v-combobox
                v-model="title_pattern"
                label="Pattern for a title"
                hint="For example, [{issue.severity}] -- {issue.title}"
                persistent-hint
                :items="title_fields.map(i => i.replace('issue.', ''))"
              />
              <v-combobox
                v-model="subtitle_pattern"
                class="pt-4"
                label="Pattern for a subtitle"
                hint="For example, {issue.CVSS} | {issue.short_description}"
                persistent-hint
                :items="title_fields.map(i => i.replace('issue.', ''))"
              />
            </v-card-text>
            <v-btn
              :disabled="!title_fields.length"
              color="primary"
              class="mx-2"
              outlined
              @click="e6 = 4"
            >
              Next
            </v-btn>
            <v-btn
              class="mx-2"
              outlined
              @click="e6 = 2"
            >
              Go back
            </v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-step
          :complete="e6 > 4"
          step="4"
        >
          Which fields will be in issue body?
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-card
            class="fill-height"
            flat
          >
            <v-card-text>
              <vue-json-pretty
                v-model="body_fields"
                :deep="2"
                :path="'issue'"
                :selectable-type="'multiple'"
                :path-selectable="((path, data) => path !== 'issue')"
                :data="exampleIssue"
                :show-select-controller="true"
                :highlight-selected-node="false"
              />
            </v-card-text>
            <v-btn
              :disabled="!body_fields.length"
              color="primary"
              class="mx-2"
              outlined
              @click="e6 = 5"
            >
              Next
            </v-btn>
            <v-btn
              class="mx-2"
              outlined
              @click="e6 = 3"
            >
              Go back
            </v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-step
          :complete="e6 > 5"
          step="5"
        >
          Select field(s) that will be used to detect duplicates
        </v-stepper-step>
        <v-stepper-content step="5">
          <v-card
            class="fill-height"
            flat
          >
            <vue-json-pretty
              v-model="compare_fields"
              :deep="2"
              :path="'issue'"
              :selectable-type="'multiple'"
              :path-selectable="((path, data) => path !== 'issue')"
              :data="exampleIssue"
              :show-select-controller="true"
              :highlight-selected-node="false"
            />
            <v-btn
              :disabled="!compare_fields.length"
              color="primary"
              class="mx-2"
              outlined
              @click="e6 = 6"
            >
              Next
            </v-btn>
            <v-btn
              class="mx-2"
              outlined
              @click="e6 = 4"
            >
              Go back
            </v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-step
          :complete="e6 > 6"
          step="6"
        >
          Select field(s) that will be merged if the issues look the same (based on duplication score)
        </v-stepper-step>
        <v-stepper-content step="6">
          <v-card
            class="fill-height"
            flat
          >
            <vue-json-pretty
              v-model="merge_fields"
              :deep="2"
              :path="'issue'"
              :selectable-type="'multiple'"
              :path-selectable="((path, data) => path !== 'issue')"
              :data="exampleIssue"
              :show-select-controller="true"
              :highlight-selected-node="false"
            />
            <v-btn
              :disabled="!merge_fields.length"
              color="primary"
              class="mx-2"
              outlined
              @click="e6 = 7"
            >
              Next
            </v-btn>
            <v-btn
              class="mx-2"
              outlined
              @click="e6 = 5"
            >
              Go back
            </v-btn>
          </v-card>
        </v-stepper-content>
        <v-stepper-step step="7">
          Give a name for this template
        </v-stepper-step>
        <v-stepper-content step="7">
          <v-card
            class="fill-height"
            flat
          >
            <v-text-field
              v-model="name"
              class="tname"
              :rules="[rules.min]"
              label="Template Name"
              prepend-icon="short_text"
              clearable
              required
            />
            <v-combobox
              v-model="tags"
              class="tname"
              label="Add some tags"
              prepend-icon="mdi-tag-multiple"
              chips
              small-chips
              multiple
            />
            <v-btn
              color="primary"
              class="mx-2"
              outlined
              :loading="loading"
              :disabled="loading"
              @click="saveTemplate()"
            >
              Save
            </v-btn>
            <v-btn
              class="mx-2"
              outlined
              @click="e6 = 6"
            >
              Go back
            </v-btn>
          </v-card>
        </v-stepper-content>
      </v-stepper>
    </v-dialog>
    <v-dialog
      v-model="report"
      persistent
      scrollable
      max-width="60%"
    >
      <v-card class="fill-height">
        <div class="my-5 ml-5">
          <vue-json-pretty
            v-model="path_to_issues"
            :deep="1"
            path="report"
            show-length
            :selectable-type="'single'"
            :data="reportContent"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
        </div>
        <v-card-actions>
          <v-btn
            color="green text-none"
            dark
            @click="report = false"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import VueJsonPretty from 'vue-json-pretty';
import { mapGetters } from 'vuex';
import {
  SAVE_TEMPLATE,
  FETCH_REPORTS,
  ISSUES_FETCH,
  FETCH_CONTENT,
} from '@/store/actions';
import { SET_CONTENT } from '@/store/mutations';

export default {
  name: 'StepperConfigurator',
  components: {
    VueJsonPretty,
  },
  props: {
    stepper: {
      required: true,
      type: Boolean,
    },
    reportId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      e6: 1,
      arrs: {},
      name: '',
      loading: false,
      merge_fields: [],
      compare_fields: [],
      title_pattern: '',
      subtitle_pattern: '',
      tags: [],
      path_to_issues: '',
      title_fields: [],
      body_fields: [],
      report: false,
      rules: {
        min: (v) => v.length >= 1 || 'Min 1 symbol',
      },
    };
  },
  computed: {
    ...mapGetters(['app', 'activeRelease', 'reportContent']),
    exampleIssue() {
      return this.reportContent[this.path_to_issues.replace('report.', '')];
    },
  },
  methods: {
    saveTemplate() {
      this.loading = true;
      this.$store.dispatch(SAVE_TEMPLATE, {
        path_to_issues: this.path_to_issues.replace('report.root.', '').replace('[0]', '').replace('report.root', ''),
        report: this.reportId,
        name: this.name,
        title_pattern: this.title_pattern,
        subtitle_pattern: this.subtitle_pattern,
        tags: this.tags,
        merge_fields: this.merge_fields.map((i) => i.replace('issue.', '')),
        title_fields: this.title_fields.map((i) => i.replace('issue.', '')),
        body_fields: this.body_fields.map((i) => i.replace('issue.', '')),
        compare_fields: this.compare_fields.map((i) => i.replace('issue.', '')),
      }).then(() => {
        this.loading = false;
        this.$store.dispatch(FETCH_REPORTS);
        this.$store.dispatch(ISSUES_FETCH);

        this.$emit('update:stepper', false);

        this.e6 = 1;
        this.name = this.title_pattern = this.subtitle_pattern = this.path_to_issues = '';
        this.tags = this.compare_fields = this.merge_fields = this.title_fields = this.body_fields = [];
      });
    },

    async getContent(reportId) {
      await this.$store.dispatch(FETCH_CONTENT, reportId);
      this.report = true;
    },
  },
};
</script>

<style scoped>
.tname {
  width: 300px;
}
</style>
