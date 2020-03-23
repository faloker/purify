<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-col>
        <v-autocomplete
          id="projectSearch"
          v-model="selectedProject"
          :items="projects"
          item-text="title"
          item-value="slug"
          clearable
          dense
          outlined
          label="Select a project"
          @input="fetchStats()"
        />
      </v-col>
      <v-col>
        <v-autocomplete
          id="unitSearch"
          v-model="selectedUnit"
          :items="units"
          :disabled="!selectedProject"
          :search-input.sync="unitSearch"
          clearable
          dense
          outlined
          label="Select a unit"
          @input="updateStats()"
        />
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col>
        <template>
          <p class="text-center headline">
            Open vs Closed
          </p>
          <line-chart :chart-data="issuesLineChartData" />
        </template>
      </v-col>
      <v-col>
        <template>
          <p class="text-center headline">
            Risks
          </p>
          <doughnut-chart id="doughnut-chart" :chart-data="DoughnutChartData" />
        </template>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <template>
          <p class="text-center headline">
            Incoming reports
          </p>
          <line-chart :chart-data="reportsLineChartData" />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import LineChart from '@/components/charts/LineChart.vue';
import DoughnutChart from '@/components/charts/DoughnutChart.vue';
import { SET_ACTIVE_PAGE } from '@/store/mutations';
import { FETCH_PROJECTS, FETCH_STATS } from '@/store/actions';

export default {
  name: 'Dashboard',
  components: { LineChart, DoughnutChart },
  data: () => ({
    loaded: false,
    unitSearch: null,
    units: null,
    selectedUnit: null,
    selectedProject: null,
    issuesLineChartData: {},
    DoughnutChartData: {},
    reportsLineChartData: {},
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
    ...mapState({
      projects: state => state.projects.projects,
      stats: state => state.projects.stats,
    }),
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PAGE, 'Dashboard');
    this.issuesLineChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Open',
          borderColor: '#FF6859',
          fill: false,
          data: new Array(12).fill(0),
        },
        {
          label: 'Closed',
          borderColor: '#1EB980',
          fill: false,
          data: new Array(12).fill(0),
        },
      ],
    };
    this.DoughnutChartData = {
      labels: ['Info', 'Low', 'Medium', 'High', 'Critical'],
      datasets: [
        {
          backgroundColor: [
            '#72DEFF',
            '#1EB980',
            '#FFCF44',
            '#FF6859',
            '#B15DFF',
          ],
          data: new Array(5).fill(0),
        },
      ],
    };

    this.reportsLineChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Reports',
          borderColor: '#1EB980',
          fill: false,
          data: new Array(12).fill(0),
        },
      ],
    };
    this.$store.dispatch(FETCH_PROJECTS);
  },
  methods: {
    fetchStats() {
      if (this.selectedProject) {
        this.$store.dispatch(FETCH_STATS, this.selectedProject).then(() => {
          this.unitSearch = null;
          this.units = Object.keys(this.stats.units);
          this.setStats(this.stats.project);
        });
      }
    },

    setStats(entity) {
      this.issuesLineChartData = {
        datasets: [
          {
            label: 'Open',
            borderColor: '#FF6859',
            fill: false,
            data: entity.open,
          },
          {
            label: 'Closed',
            borderColor: '#1EB980',
            fill: false,
            data: entity.closed,
          },
        ],
      };

      this.DoughnutChartData = {
        datasets: [
          {
            backgroundColor: [
              '#72DEFF',
              '#1EB980',
              '#FFCF44',
              '#FF6859',
              '#B15DFF',
            ],
            data: entity.risks,
          },
        ],
      };

      this.reportsLineChartData = {
        datasets: [
          {
            label: 'Reports',
            borderColor: '#1EB980',
            fill: false,
            data: entity.reports,
          },
        ],
      };
    },

    updateStats() {
      this.loaded = false;
      if (this.selectedUnit) {
        this.setStats(this.stats.units[this.selectedUnit]);
      } else {
        this.setStats(this.stats.project);
      }
      this.loaded = true;
    },
  },
};
</script>
