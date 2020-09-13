<template>
  <div>
    <v-dialog
      v-model="stepperDialog"
      max-width="60%"
      @click:outside="resetDialog"
    >
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
            @click.stop="reportDialog = true"
          >
            View report
          </v-btn>
          <v-btn
            class="mx-2"
            :disabled="!pathToIssues"
            outlined
            color="primary"
            @click.stop="stepperModel = 2"
          >
            Next
          </v-btn>
          <v-card-text>
            You have chosen the following:
            <b class="ml-3">{{ pathToIssues }}</b>
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
            v-model="titleFields"
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
            :disabled="!titleFields.length"
            color="primary"
            @click.stop="stepperModel = 3"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click.stop="stepperModel = 1"
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
            v-model="riskField"
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
            color="primary"
            :disabled="riskField.length > 1"
            @click.stop="stepperModel = 4"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click.stop="stepperModel = 2"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step
          :complete="stepperModel > 4"
          step="4"
        >
          Add patterns to display title and subtitle
        </v-stepper-step>
        <v-stepper-content step="4">
          <v-combobox
            v-model="titlePattern"
            label="Pattern for a title"
            hint="For example, [issue.severity] -- issue.title"
            persistent-hint
            :items="titleFields.map(i => i.replace('issue.', ''))"
          />
          <v-combobox
            v-model="subtitlePattern"
            class="pt-4"
            label="Pattern for a subtitle"
            hint="For example, issue.CVSS | issue.short_description"
            persistent-hint
            :items="titleFields.map(i => i.replace('issue.', ''))"
          />
          <v-btn
            :disabled="!titleFields.length"
            color="primary"
            class="mx-2 mt-3"
            outlined
            @click.stop="stepperModel = 5"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click.stop="stepperModel = 3"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step :complete="stepperModel > 5" step="5">
          Which fields will be in issue body?
        </v-stepper-step>
        <v-stepper-content step="5">
          <vue-json-pretty
            v-model="bodyFields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            :disabled="!bodyFields.length"
            color="primary"
            class="mx-2 mt-3"
            outlined
            @click.stop="stepperModel = 6"
          >
            Next
          </v-btn>
          <v-btn
            class="mx-2 mt-3"
            outlined
            @click.stop="stepperModel = 4"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step :complete="stepperModel > 6" step="6">
          Select types of fields in issue body
        </v-stepper-step>
        <v-stepper-content step="6">
          <template v-for="item in bodyFields">
            <div :key="item" class="my-2">
              <span class="subtitle-1">{{ item }}</span>
              <v-btn-toggle
                v-model="bodyFieldsTypes[item]"
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
            :disabled="Object.keys(bodyFieldsTypes).length !== bodyFields.length"
            color="primary"
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 7"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 5"
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
            v-model="internalComparisonFields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            :disabled="!internalComparisonFields.length"
            color="primary"
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 8"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 6"
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
            v-model="mergeFields"
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
            @click.stop="stepperModel = 9"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 7"
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
            v-model="externalComparisonFields"
            :deep="2"
            :path="'issue'"
            :selectable-type="'multiple'"
            :path-selectable="(path, data) => path !== 'issue'"
            :data="exampleIssue"
            :show-select-controller="true"
            :highlight-selected-node="false"
          />
          <v-btn
            :disabled="!externalComparisonFields.length"
            color="primary"
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 10"
          >
            Next
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 8"
          >
            Go back
          </v-btn>
        </v-stepper-content>
        <v-stepper-step step="10">
          Give a name for this template
        </v-stepper-step>
        <v-stepper-content step="10">
          <v-text-field
            v-model="displayName"
            class="tname mt-1"
            :rules="[rules.min]"
            label="Template Name"
            prepend-icon="short_text"
            clearable
            dense
            outlined
            required
          />
          <v-text-field
            id="name"
            v-model="name"
            class="tname"
            label="Short name"
            hint="The short name is used as the unique ID within URLs."
            dense
            outlined
            persistent-hint
            prepend-icon="mdi-identifier"
            append-icon="mdi-auto-fix"
            @click:append="slugifyDisplayName"
          />
          <v-combobox
            v-model="tags"
            class="tname"
            label="Add some tags"
            prepend-icon="mdi-tag-multiple"
            chips
            small-chips
            multiple
            dense
            outlined
          />
          <v-btn
            color="primary"
            class="mr-2 mt-3"
            outlined
            :loading="loading"
            :disabled="loading"
            @click.stop="createTemplate()"
          >
            Save
          </v-btn>
          <v-btn
            class="mr-2 mt-3"
            outlined
            @click.stop="stepperModel = 9"
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
            v-model="pathToIssues"
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
            @click.stop="reportDialog = false"
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
import slug from 'slug';

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
    const loading = ref(false);
    const rules = ref({
      min: (v: string) => v.length >= 3 || 'Min 3 symbols',
    });

    const name = ref('');
    const displayName = ref('');
    const mergeFields: Ref<string[]> = ref([]);
    const internalComparisonFields: Ref<string[]> = ref([]);
    const externalComparisonFields: Ref<string[]> = ref([]);
    const titlePattern = ref('');
    const subtitlePattern = ref('');
    const tags: Ref<string[]> = ref([]);
    const pathToIssues = ref('');
    const titleFields: Ref<string[]> = ref([]);
    const bodyFields: Ref<BodyField[]> = ref([]);
    const riskField: Ref<string[]> = ref([]);
    const bodyFieldsTypes = ref({});

    const stepperDialog = computed({
      get: () => props.stepper,
      set: val => context.emit('update:stepper', val),
    });
    const reportContent = computed(() => store.state.reports.content);
    const exampleIssue = computed(() => {
      return props.report.type === 'file'
        ? reportContent.value[pathToIssues.value.replace('report.', '')]
        : reportContent.value;
    });

    function resetDialog() {
      stepperDialog.value = false;
      name.value = titlePattern.value = subtitlePattern.value = pathToIssues.value =
        '';
      bodyFieldsTypes.value = {};
      tags.value = internalComparisonFields.value = externalComparisonFields.value = [];
      mergeFields.value = riskField.value = titleFields.value = bodyFields.value = [];
    }

    function slugifyDisplayName() {
      name.value = slug(displayName.value);
    }

    function createTemplate() {
      loading.value = true;
      bodyFields.value = [];

      for (const key of Object.keys(bodyFieldsTypes.value)) {
        bodyFields.value.push({
          key: key.replace('issue.', ''),
          // @ts-ignore
          type: bodyFieldsTypes.value[key],
        });
      }

      store
        .dispatch(TEMPLATE_CREATE, {
          pathToIssues: pathToIssues.value
            .replace('report.root.', '')
            .replace('[0]', '')
            .replace('report.root', ''),
          report: props.report._id,
          name: name.value,
          displayName: displayName.value,
          titlePattern: titlePattern.value,
          subtitlePattern: subtitlePattern.value,
          tags: tags.value,
          bodyFields: bodyFields.value,
          riskField: riskField.value.map(i => i.replace('issue.', ''))[0],
          mergeFields: mergeFields.value.map(i => i.replace('issue.', '')),
          titleFields: titleFields.value.map(i => i.replace('issue.', '')),
          internalComparisonFields: internalComparisonFields.value.map(i =>
            i.replace('issue.', '')
          ),
          externalComparisonFields: externalComparisonFields.value.map(i =>
            i.replace('issue.', '')
          ),
        })
        .then(async () => {
          loading.value = false;
          await store.dispatch(FETCH_REPORTS).catch(() => {});
          stepperDialog.value = false;
        })
        .catch(() => {
          loading.value = false;
        });
    }

    watch(stepperDialog, () => {
      stepperModel.value = props.report.type === 'file' ? 1 : 2;
    });

    return {
      rules,
      stepperModel,
      reportDialog,
      name,
      displayName,
      reportContent,
      resetDialog,
      tags,
      exampleIssue,
      loading,
      slugifyDisplayName,
      riskField,
      bodyFields,
      mergeFields,
      titleFields,
      titlePattern,
      stepperDialog,
      pathToIssues,
      createTemplate,
      subtitlePattern,
      bodyFieldsTypes,
      externalComparisonFields,
      internalComparisonFields,
    };
  },
});
</script>

<style scoped>
.tname {
  width: 300px;
}
</style>
