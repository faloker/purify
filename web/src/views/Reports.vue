<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn
          v-permission="['owner', 'admin', 'user']"
          color="primary"
          @click.stop="uploadDialog = true"
        >
          <v-icon left>
            mdi-file-upload
          </v-icon>Upload report
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          transition="slide-y-transition"
          type="table-tbody"
        >
          <v-card outlined>
            <v-data-table
              :headers="headers"
              item-key="_id"
              :sort-by="['createdAt']"
              :sort-desc="[true]"
              :items="reports"
              :search="searchTerm"
              :items-per-page="5"
            >
              <template v-slot:item.createdAt="{ item }">
                <div class="subheading">
                  {{ formatDate(item.createdAt, 'dd MMM yyyy') }}
                </div>
              </template>
              <template v-slot:item.template="{ item }">
                <v-btn
                  v-if="!item.template"
                  class="mx-1"
                  outlined
                  label
                  small
                  @click.stop="openStepper(item)"
                >
                  <v-icon left>
                    mdi-new-box
                  </v-icon>
                  Create
                </v-btn>
                <v-btn
                  v-if="!item.template"
                  class="mx-1"
                  outlined
                  label
                  small
                  @click.stop="openTemplateSelector(item)"
                >
                  <v-icon left>
                    mdi-connection
                  </v-icon>
                  Apply
                </v-btn>
                <v-chip
                  v-else
                  outlined
                  color="primary"
                >
                  {{ item.template.name }}
                </v-chip>
              </template>
              <template v-slot:item.new="{ item }" class="text-center">
                <b v-if="!item.statistics">--</b>
                <b v-else>{{ item.statistics.new }}</b>
              </template>
              <template v-slot:item.old="{ item }" class="text-center">
                <b v-if="!item.statistics">--</b>
                <b v-else>{{ item.statistics.old }}</b>
              </template>
              <template v-slot:item.action="{ item }" class="text-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-permission="['owner', 'admin']"
                      text
                      icon
                      color="red darken-1"
                      v-bind="attrs"
                      v-on="on"
                      @click.stop="openConfirmationDialog(item)"
                    >
                      <v-icon>fa-times</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </template>
              <v-alert v-slot:no-results>
                Your search for "{{ searchTerm }}" found no results.
              </v-alert>
            </v-data-table>
            <stepper v-model="stepperDialog" :report="report" />
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <confirm-dialog
      v-model="confirmDialog"
      title="Delete this report?"
      message="All issues will be removed as well. Are you sure you want to continue?"
      @handle-click="deleteReport"
    />
    <v-dialog
      v-model="uploadDialog"
      max-width="430"
      @click:outside="uploadDialog = false"
      @keydown.esc="uploadDialog = false"
    >
      <v-card>
        <v-card-title>Upload Report</v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-file-input
                id="file-input"
                v-model="file"
                outlined
                dense
                show-size
                accept=".xml, .json"
                label="Report file"
              />
            </v-row>
            <v-row>
              <v-autocomplete
                id="template-name"
                v-model="templateName"
                :items="templates"
                :search-input.sync="templateSearch"
                item-text="displayName"
                item-value="name"
                label="Template to apply"
                dense
                clearable
                outlined
                prepend-icon="mdi-file"
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click.stop="uploadDialog = false"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            :disabled="!file"
            @click.stop="uploadReport"
          >
            Upload
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="applyTemplateDialog"
      max-width="430"
      @click:outside="applyTemplateDialog = false"
      @keydown.esc="applyTemplateDialog = false"
    >
      <v-card>
        <v-card-title>Select Template</v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-autocomplete
                id="apply-template-name"
                v-model="templateNameToApply"
                :search-input.sync="templateSearch"
                :items="templates"
                item-text="displayName"
                item-value="name"
                label="Template to apply"
                dense
                clearable
                outlined
                prepend-icon="mdi-file"
              />
            </v-row>
          </v-col>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click.stop="applyTemplateDialog = false"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            :disabled="!templateNameToApply"
            @click.stop="applyTemplate"
          >
            Apply
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  ComputedRef,
} from '@vue/composition-api';
import store from '@/store';
import Stepper from '@/components/dialogs/StepperConfigurator.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import {
  FETCH_REPORTS,
  REPORT_DELETE,
  FETCH_CONTENT,
  SHOW_SUCCESS_MSG,
  TEMPLATES_FETCH,
  UPLOAD_REPORT,
  APPLY_TEMPLATE,
} from '@/store/actions';
import { Report, TemplateWithStats } from '@/store/types';
import { formatDate } from '@/utils/helpers';

export default defineComponent({
  name: 'Reports',

  components: {
    Stepper,
    ConfirmDialog,
  },

  setup() {
    const searchTerm = ref('');
    const templates: ComputedRef<TemplateWithStats[]> = computed(
      () => store.state.templates.items
    );
    const loading = ref(true);
    const headers = ref([
      { text: 'Date', value: 'createdAt', width: '21%' },
      {
        text: 'Template',
        align: 'center',
        value: 'template',
        width: '21%',
      },
      {
        text: 'New',
        align: 'center',
        value: 'new',
        width: '21%',
      },
      {
        text: 'Duplicate',
        align: 'center',
        value: 'old',
        width: '21%',
      },
      {
        text: 'Actions',
        align: 'center',
        value: 'action',
        sortable: false,
        width: '16%',
      },
    ]);

    const reports = computed(() => store.state.reports.items);

    onMounted(async () => {
      store
        .dispatch(FETCH_REPORTS)
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
      await store.dispatch(TEMPLATES_FETCH).catch(() => {});
    });

    const { stepperDialog, report, openStepper } = useStepper();
    const {
      deleteReport,
      confirmDialog,
      openConfirmationDialog,
    } = useDeleteReport();

    return {
      report,
      formatDate,
      reports,
      loading,
      headers,
      searchTerm,
      openStepper,
      deleteReport,
      confirmDialog,
      templates,
      stepperDialog,
      openConfirmationDialog,
      ...useUploadReport(),
      ...useApplyTemplate(),
    };
  },
});

function useDeleteReport() {
  const confirmDialog = ref(false);
  const reportId = ref('');

  function deleteReport() {
    store
      .dispatch(REPORT_DELETE, reportId.value)
      .then(async () => {
        confirmDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The report has been deleted');
      })
      .catch(() => {});
  }

  function openConfirmationDialog(item: Report) {
    confirmDialog.value = true;
    reportId.value = item._id;
  }

  return {
    confirmDialog,
    deleteReport,
    openConfirmationDialog,
  };
}

function useStepper() {
  const stepperDialog = ref(false);
  const report = ref({});

  function openStepper(item: Report) {
    store
      .dispatch(FETCH_CONTENT, item._id)
      .then(() => {
        report.value = item;
        stepperDialog.value = true;
      })
      .catch(() => {});
  }

  return {
    stepperDialog,
    report,
    openStepper,
  };
}

function useUploadReport() {
  const uploadDialog = ref(false);
  const file = ref(null);
  const templateName = ref('');

  function uploadReport() {
    const formData = new FormData();
    formData.append('file', file.value!);
    formData.append('template', templateName.value);

    store
      .dispatch(UPLOAD_REPORT, formData)
      .then(async () => {
        uploadDialog.value = false;
        file.value = null;
        templateName.value = '';
        await store.dispatch(SHOW_SUCCESS_MSG, 'The report has been uploaded');
      })
      .catch(() => {});
  }

  return { uploadDialog, file, templateName, uploadReport };
}

function useApplyTemplate() {
  const applyTemplateDialog = ref(false);
  const templateNameToApply = ref('');
  const reportId = ref('');
  const templateSearch = ref('');

  function openTemplateSelector(report: Report) {
    reportId.value = report._id;
    applyTemplateDialog.value = true;
  }

  function applyTemplate() {
    store
      .dispatch(APPLY_TEMPLATE, {
        reportId: reportId.value,
        templateName: templateNameToApply.value,
      })
      .then(async () => {
        applyTemplateDialog.value = false;
        reportId.value = '';
        templateNameToApply.value = '';
        await store.dispatch(SHOW_SUCCESS_MSG, 'The template has been applied');
      })
      .catch(() => {});
  }

  return {
    applyTemplateDialog,
    openTemplateSelector,
    templateNameToApply,
    applyTemplate,
    templateSearch,
  };
}
</script>
