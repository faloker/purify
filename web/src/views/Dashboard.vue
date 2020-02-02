<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-col>
        <v-autocomplete
          id="search"
          v-model="selectedProject"
          :items="projectsList"
          item-text="title"
          clearable
          dense
          outlined
          label="Select a project"
          @input="fetchStats()"
        />
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col>
        <template v-if="loaded">
          <p class="text-center headline">
            Open vs Closed
          </p>
          <line-chart
            :chart-data="lineChartData"
          />
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <template v-if="loaded">
          <p class="text-center headline">
            Risks
          </p>
          <doughnut-chart
            id="doughnut-chart"
            :chart-data="DoughnutChartData"
          />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import LineChart from '@/components/charts/LineChart.vue';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import { SET_ACTIVE_PAGE } from '@/store/mutations';
import {
  FETCH_PROJECTS,
  FETCH_STATS,
} from '@/store/actions';

export default {
  name: 'Dashboard',
  components: { LineChart, DoughnutChart },
  data: () => ({
    loaded: false,
    selectedProject: null,
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  }),
  computed: {
    ...mapGetters(['projectsList', 'projectStats']),
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PAGE, 'Dashboard');
    this.$store.dispatch(FETCH_PROJECTS);
  },
  methods: {
    fetchStats() {
      this.loaded = false;
      this.$store.dispatch(FETCH_STATS, this.selectedProject).then(() => {
        this.lineChartData = {
          labels: this.labels,
          datasets: [
            {
              label: 'Open',
              borderColor: '#F44336',
              fill: false,
              data: this.projectStats.project.open,
            },
            {
              label: 'Closed',
              borderColor: '#009688',
              fill: false,
              data: this.projectStats.project.closed,
            },
          ],
        };

        this.DoughnutChartData = {
          labels: ['Info', 'Low', 'Medium', 'High', 'Critical'],
          datasets: [
            {
              backgroundColor: [
                '#81D4FA',
                '#2196F3',
                '#FFD54F',
                '#F44336',
                '#D50000',
              ],
              data: this.projectStats.project.risks,
            },
          ],
        };


        this.loaded = true;
      });
    },
  },
};
</script>
