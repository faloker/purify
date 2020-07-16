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
          :sort-by="['created_at']"
          :sort-desc="[true]"
          :items="reports"
          :search="search"
          :items-per-page="5"
        >
          <template v-slot:item.created_at="{ item }">
            <div class="subheading">
              {{ new Date(item.created_at).toLocaleDateString() }}
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
            <v-btn
              text
              icon
              color="red darken-1"
              @click="deleteReport(item._id)"
            >
              <v-icon>fa-times</v-icon>
            </v-btn>
          </template>
          <v-alert v-slot:no-results>
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
        <stepper :stepper.sync="stepperDialog" :report="report" />
      </v-card>
    </v-skeleton-loader>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import Stepper from '@/components/dialogs/StepperConfigurator.vue';
import { FETCH_REPORTS, REPORT_DELETE, FETCH_CONTENT } from '@/store/actions';
import { SET_ACTIVE_UNIT } from '@/store/mutations';

export default {
  components: {
    Stepper,
  },
  data() {
    return {
      search: '',
      loading: true,
      stepperDialog: false,
      reportContent: {},
      report: {},
      headers: [
        { text: 'Date', value: 'created_at', width: '21%' },
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
      ],
    };
  },
  computed: {
    ...mapState({
      reports: (state) => state.reports.reports,
    }),
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_UNIT, this.$route.params.slug);
    this.$store.dispatch(FETCH_REPORTS, this.$route.params.slug).then(() => {
      this.loading = false;
    });
  },
  methods: {
    openStepper(item) {
      this.$store.dispatch(FETCH_CONTENT, item._id).then(() => {
        this.report = item;
        this.stepperDialog = true;
      });
    },

    deleteReport(id) {
      this.$store.dispatch(REPORT_DELETE, id).then(() => {
        this.$showMessage('success', 'Deleted successfully');
      });
    },
  },
};
</script>
<style scoped>
</style>
