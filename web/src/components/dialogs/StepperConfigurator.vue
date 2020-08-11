<template>
  <div>
    <v-dialog v-model="stepperDialog" max-width="60%">
      <v-stepper
        v-model="stepperModel"
        non-linear
        vertical
      >
        <v-stepper-step
          :complete="stepperModel > 1 || report.type === 'oneshot'"
          step="1"
        >
          Select the array with the findings. You can view an example finding object in an array.
        </v-stepper-step>
        <v-stepper-content step="1">
          <v-btn
            class="mx-2"
            outlined
            @click="reportDialog = true"
          >
            View report
          </v-btn>
          <v-btn
            class="mx-2"
            :disabled="!path_to_issues"
            outlined
            color="primary"
            @click="stepperModel = 2"
          >
            Next
          </v-btn>
          <v-card-text>
            You have chosen the following:
            <b class="ml-3">{{ path_to_issues }}</b>
          </v-card-text>
        </v-stepper-content>
        <v-stepper-step
          :complete="stepperModel > 2"
          step="2"
        >
          Which fields will be in issue title and subtitle?
        </v-stepper-step>
        <v-stepper-content step="2">
          <vue-json-pretty
            v-model="title_fields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            class="mx-2 mt-3"
            outlined
            :disabled="!title_fields.length"
            color="primary"
            @click="stepperModel = 3"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click="stepperModel = 1"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="stepperModel > 3"
          step="3"
        >
          Which field represent the severity of the finding? (optional)
        </v-stepper-step>
        <v-stepper-content step="3">
          <vue-json-pretty
            v-model="risk_field"
            :deep="2"
            :path="'issue'"
            :selectable-type="'single'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            class="mx-2 mt-3"
            outlined
            color="primary"
            @click="stepperModel = 4"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click="stepperModel = 2"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step :complete="stepperModel > 4" step="4">
          Add patterns to display title and subtitle
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-combobox
            v-model="title_pattern"
            label="Pattern for a title"
            hint="For example, [issue.severity] -- issue.title"
            persistent-hint
            :items="title_fields.map(i => i.replace('issue.', ''))"
          />
          <v-combobox
            v-model="subtitle_pattern"
            class="pt-4"
            label="Pattern for a subtitle"
            hint="For example, issue.CVSS | issue.short_description"
            persistent-hint
            :items="title_fields.map(i => i.replace('issue.', ''))"
          />
          <v-btn
            :disabled="!title_fields.length"
            color="primary"
            class="mx-2 mt-3"
            outlined
            @click="stepperModel = 5"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click="stepperModel = 3"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step :complete="stepperModel > 5" step="5">
          Which fields will be in issue body?
        </v-stepper-step>
        <v-stepper-content step="5">
          <vue-json-pretty
            v-model="body_fields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            :disabled="!body_fields.length"
            color="primary"
            class="mx-2 mt-3"
            outlined
            @click="stepperModel = 6"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click="stepperModel = 4"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step :complete="stepperModel > 6" step="6">
          Select types of fields in issue body
        </v-stepper-step>
        <v-stepper-content step="6">
          <template v-for="item in body_fields">
            <div :key="item" class="my-2">
              <span class="subtitle-1">{{ item }}</span>
              <v-btn-toggle
                v-model="body_fields_types[item]"
                color="primary"
                group
              >
                <v-btn small value="text">
                  Text
                </v-btn>

                <v-btn small value="html">
                  Html
                </v-btn>

                <v-btn small value="base64">
                  Base64
                </v-btn>
              </v-btn-toggle>
            </div>
          </template>
          <v-btn
            :disabled="Object.keys(body_fields_types).length !== body_fields.length"
            color="primary"
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 7"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 5"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="stepperModel > 7"
          step="7"
        >
          Select field(s) to detect duplicates and merge candidates at the template level
        </v-stepper-step>
        <v-stepper-content step="7">
          <vue-json-pretty
            v-model="internal_comparison_fields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            :disabled="!internal_comparison_fields.length"
            color="primary"
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 8"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 6"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="stepperModel > 8"
          step="8"
        >
          Select field(s) to merge if issues look the same at the template level (optional)
        </v-stepper-step>
        <v-stepper-content step="8">
          <vue-json-pretty
            v-model="merge_fields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            color="primary"
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 9"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 7"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="stepperModel > 9"
          step="9"
        >
          Select field(s) to detect duplicates at the unit level
        </v-stepper-step>
        <v-stepper-content step="9">
          <vue-json-pretty
            v-model="external_comparison_fields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            :disabled="!external_comparison_fields.length"
            color="primary"
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 10"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 8"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step step="10">
          Give a name for this template
        </v-stepper-step>
        <v-stepper-content step="10">
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
            class="mr-2 mt-3"
            outlined
            :loading="loading"
            :disabled="loading"
            @click="createTemplate()"
          >
            Save
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click="stepperModel = 9"
          >
            Go back
          </v-btn>
        </v-stepper-content>
      </v-stepper>
    </v-dialog>
    <v-dialog
      v-model="reportDialog"
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
          <v-spacer />
          <v-btn
            color="green"
            outlined
            block
            @click="reportDialog = false"
          >
            Confirm
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  PropType,
  watch,
  SetupContext,
  Ref,
} from '@vue/composition-api';
// @ts-ignore
import VueJsonPretty from 'vue-json-pretty';
import { TEMPLATE_CREATE, FETCH_REPORTS } from '@/store/actions';
import { Report } from '@/store/types';
import store from '@/store';

interface BodyField {
  key: string;
  type: string;
}

export default defineComponent({
  name: 'StepperConfigurator',

  components: {
    VueJsonPretty,
  },

  props: {
    stepper: {
      required: true,
      type: Boolean,
    },
    report: {
      type: Object as PropType<Report>,
      required: true,
    },
  },

  setup(props, context) {
    const stepperModel = ref(1);
    const reportDialog = ref(false);
    const rules = ref({
      min: (v: string) => v.length >= 3 || 'Min 3 symbols',
    });

    const reportContent = computed(() => store.state.reports.content);

    const {
      name,
      tags,
      loading,
      risk_field,
      body_fields,
      merge_fields,
      title_fields,
      title_pattern,
      stepperDialog,
      path_to_issues,
      createTemplate,
      subtitle_pattern,
      body_fields_types,
      external_comparison_fields,
      internal_comparison_fields,
    } = useCreateTemplate(props, context);

    const exampleIssue = computed(() => {
      return props.report.type === 'file'
        ? reportContent.value[path_to_issues.value.replace('report.', '')]
        : reportContent.value;
    });

    watch(props, () => {
      stepperModel.value = props.report.type === 'file' ? 1 : 2;
      name.value = title_pattern.value = subtitle_pattern.value = path_to_issues.value =
        '';
      body_fields_types.value = {};
      tags.value = internal_comparison_fields.value = external_comparison_fields.value = [];
      merge_fields.value = title_fields.value = body_fields.value = [];
    });

    return {
      name,
      tags,
      rules,
      loading,
      risk_field,
      body_fields,
      merge_fields,
      exampleIssue,
      title_fields,
      stepperModel,
      reportDialog,
      title_pattern,
      reportContent,
      stepperDialog,
      path_to_issues,
      createTemplate,
      subtitle_pattern,
      body_fields_types,
      external_comparison_fields,
      internal_comparison_fields,
    };
  },
});

function useCreateTemplate(props: any, context: SetupContext) {
  const loading = ref(false);
  const name = ref('');
  const merge_fields: Ref<string[]> = ref([]);
  const internal_comparison_fields: Ref<string[]> = ref([]);
  const external_comparison_fields: Ref<string[]> = ref([]);
  const title_pattern = ref('');
  const subtitle_pattern = ref('');
  const tags: Ref<string[]> = ref([]);
  const path_to_issues = ref('');
  const title_fields: Ref<string[]> = ref([]);
  const body_fields: Ref<BodyField[]> = ref([]);
  const risk_field = ref('');
  const body_fields_types = ref({});
  const stepperDialog = computed({
    get: () => props.stepper,
    set: val => context.emit('update:stepper', val),
  });

  function createTemplate() {
    loading.value = true;
    body_fields.value = [];

    for (const key of Object.keys(body_fields_types.value)) {
      body_fields.value.push({
        key: key.replace('issue.', ''),
        // @ts-ignore
        type: body_fields_types.value[key],
      });
    }

    store
      .dispatch(TEMPLATE_CREATE, {
        path_to_issues: path_to_issues.value
          .replace('report.root.', '')
          .replace('[0]', '')
          .replace('report.root', ''),
        report: props.report._id,
        name: name.value,
        title_pattern: title_pattern.value,
        subtitle_pattern: subtitle_pattern.value,
        tags: tags.value,
        body_fields: body_fields.value,
        risk_field: risk_field.value.replace('issue.', ''),
        merge_fields: merge_fields.value.map(i => i.replace('issue.', '')),
        title_fields: title_fields.value.map(i => i.replace('issue.', '')),
        internal_comparison_fields: internal_comparison_fields.value.map(i =>
          i.replace('issue.', '')
        ),
        external_comparison_fields: external_comparison_fields.value.map(i =>
          i.replace('issue.', '')
        ),
      })
      .then(async () => {
        loading.value = false;
        await store.dispatch(FETCH_REPORTS, context.root.$route.params.slug);
        stepperDialog.value = false;
      })
      .catch(() => {
        loading.value = false;
      });
  }

  return {
    name,
    tags,
    loading,
    risk_field,
    body_fields,
    merge_fields,
    title_fields,
    title_pattern,
    stepperDialog,
    path_to_issues,
    createTemplate,
    subtitle_pattern,
    body_fields_types,
    external_comparison_fields,
    internal_comparison_fields,
  };
}
</script>

<style scoped>
.tname {
  width: 300px;
}
</style>
