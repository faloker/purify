<template>
  <v-container>
    <v-skeleton-loader
      :loading="loading"
      transition="scale-transition"
      type="table-tbody"
    >
      <v-card flat>
        <!-- <v-flex
        xs3
        xl2
      >
        <v-card-title>
          <v-text-field
            v-model="search"
            solo
          >
            <v-template slot="label">
              <v-icon style="vertical-align: middle">
                search
              </v-icon>
              Search for report
            </v-template>
          </v-text-field>
        </v-card-title>
      </v-flex> -->
        <v-data-table
          :headers="headers"
          item-key="_id"
          :items="allReports"
          :search="search"
          :pagination.sync="pagination"
        >
          <template v-slot:item.date="{ item }">
            <div class="subheading">
              {{ new Date(item.date).toLocaleDateString() }}
            </div>
          </template>
          <template
            v-slot:item.template="{ item }"
            class="text-center"
          >
            <v-btn
              v-if="!item.template"
              outlined
              rounded
              class="text-none"
              @click="openStepper(item._id)"
            >
              <v-icon>add</v-icon>
              Apply template
            </v-btn>
            <v-chip
              v-else
              outlined
              color="primary"
            >
              {{ item.template.name }}
            </v-chip>
          </template>
          <template
            v-slot:item.new="{ item }"
            class="text-center"
          >
            <b v-if="!item.statistics">--</b>
            <b v-else>{{ item.statistics.new }}</b>
          </template>
          <template
            v-slot:item.old="{ item }"
            class="text-center"
          >
            <b v-if="!item.statistics">--</b>
            <b v-else>{{ item.statistics.old }}</b>
          </template>
          <template
            v-slot:item.action="{ item }"
            class="text-center"
          >
            <v-btn
              text
              icon
              color="red darken-1"
              @click="deleteReport(item._id)"
            >
              <v-icon>
                fa-times
              </v-icon>
            </v-btn>
          </template>
          <v-alert v-slot:no-results>
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
        <stepper
          :stepper.sync="stepperDialog"
          :report-id="reportId"
        />
      </v-card>
    </v-skeleton-loader>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import Stepper from '@/components/dialogs/StepperConfigurator.vue';
import {
  FETCH_REPORTS,
  REPORT_DELETE,
} from '@/store/actions';
import { SET_ACTIVE_PAGE } from '@/store/mutations';

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
      reportId: '',
      pagination: {
        sortBy: 'date',
        descending: true,
      },
      headers: [
        { text: 'Date', value: 'date', width: '21%' },
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
    ...mapGetters(['allReports', 'activeRelease']),
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PAGE, 'Reports');
    this.$store.dispatch(FETCH_REPORTS, this.$route.params.slug).then(() => {
      this.loading = false;
    });
  },
  methods: {
    openStepper(id) {
      this.stepperDialog = !this.stepperDialog;
      this.reportId = id;
    },
    deleteReport(id) {
      this.$store.dispatch(REPORT_DELETE, id);
      this.$store.dispatch(FETCH_REPORTS, this.$route.params.slug);
    },
  },
};
</script>
<style scoped>
</style>
