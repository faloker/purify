<template>
  <v-container>
    <v-skeleton-loader
      :loading="loading"
      transition="scale-transition"
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
              {{ new Date(item.createdAt).toLocaleDateString() }}
            </div>
          </template>
          <template v-slot:item.template="{ item }" class="text-center">
            <v-btn
              v-if="!item.template"
              outlined
              rounded
              class="text-none"
              @click="openStepper(item)"
            >
              <v-icon>add</v-icon>Create template
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
                  text
                  icon
                  color="red darken-1"
                  v-bind="attrs"
                  v-on="on"
                  @click="openConfirmationDialog(item)"
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
        <stepper :stepper.sync="stepperDialog" :report="report" />
      </v-card>
    </v-skeleton-loader>
    <confirm-dialog
      v-model="confirmDialog"
      title="Delete this report?"
      message="All issues will be removed as well. Are you sure you want to continue?"
      @handle-click="deleteReport"
    />
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  SetupContext,
} from '@vue/composition-api';
import store from '@/store';
import Stepper from '@/components/dialogs/StepperConfigurator.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import {
  FETCH_REPORTS,
  REPORT_DELETE,
  FETCH_CONTENT,
  SHOW_SUCCESS_MSG,
} from '@/store/actions';
import { Report } from '@/store/types';

export default defineComponent({
  name: 'Reports',

  components: {
    Stepper,
    ConfirmDialog,
  },

  setup(props, context) {
    const searchTerm = ref('');
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

    onMounted(() => {
      store
        .dispatch(FETCH_REPORTS)
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
    });

    const { stepperDialog, report, openStepper } = useStepper();
    const {
      deleteReport,
      confirmDialog,
      openConfirmationDialog,
    } = useDeleteReport();

    return {
      report,
      reports,
      loading,
      headers,
      searchTerm,
      openStepper,
      deleteReport,
      confirmDialog,
      stepperDialog,
      openConfirmationDialog,
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
</script>
