<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-col>
        <v-autocomplete
          id="projectSearch"
          v-model="selectedProject"
          :items="projects"
          item-text="displayName"
          item-value="name"
          clearable
          dense
          outlined
          label="Select project"
          @input="fetchStats()"
        />
      </v-col>
      <v-col>
        <v-autocomplete
          id="unitSearch"
          v-model="selectedUnit"
          :items="unitsNames"
          :disabled="!selectedProject"
          :search-input.sync="unitSearch"
          clearable
          dense
          outlined
          label="Select unit"
          @input="updateStats()"
        />
      </v-col>
      <v-spacer />
    </v-row>
    <v-row>
      <v-col>
        <apexchart
          width="550"
          type="line"
          style="position:relative; z-index:0;"
          :options="issuesLineChartOptions"
          :series="issuesLineChartSeries"
        />
      </v-col>
      <v-spacer />
      <v-col>
        <apexchart
          width="500"
          type="donut"
          style="position:relative; z-index:0;"
          :options="riskDonutChartOptions"
          :series="riskDonutChartSeries"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div>
          <apexchart
            width="550"
            type="line"
            :options="reportsLineChartOptions"
            :series="reportsLineChartSeries"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  Ref,
  ComputedRef,
  computed,
  onMounted,
} from '@vue/composition-api';
import store from '@/store';
import { FETCH_PROJECTS, FETCH_STATS } from '@/store/actions';

export default defineComponent({
  name: 'Dashboard',

  setup() {
    const unitSearch = ref('');
    const unitsNames = ref([]);
    const selectedUnit = ref('');
    const selectedProject = ref('');
    const months = ref([
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
    ]);
    const issuesLineChartOptions = ref({
      chart: {
        id: 'read-vs-closed',
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: months.value,
      },
      colors: ['#FF6859', '#1EB980'],
      title: {
        text: 'Open vs Closed',
        align: 'left',
      },
    });

    const issuesLineChartSeries = ref([
      {
        name: 'Open',
        data: [],
      },
      {
        name: 'Resolved',
        data: [],
      },
    ]);

    const reportsLineChartOptions = ref({
      chart: {
        id: 'reports-volume',
      },
      title: {
        text: 'Reports Volume',
        align: 'left',
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: months.value,
      },
    });
    const reportsLineChartSeries = ref([
      {
        name: 'Reports Volume',
        data: [],
      },
    ]);
    const riskDonutChartOptions = ref({
      chart: {
        id: 'risks-chart',
      },
      title: {
        text: 'Risks',
        align: 'left',
      },
      noData: { text: 'Waiting for input...' },
      labels: ['Info', 'Low', 'Medium', 'High', 'Critical'],
      colors: ['#72DEFF', '#1EB980', '#FFCF44', '#FF6859', '#D50000'],
    });
    const riskDonutChartSeries = ref([]);

    const projects = computed(() => store.state.projects.items);
    const stats = computed(() => store.state.projects.stats);

    onMounted(async () => await store.dispatch(FETCH_PROJECTS).catch(() => {}));

    function fetchStats() {
      if (selectedProject.value) {
        store
          .dispatch(FETCH_STATS, selectedProject.value)
          .then(() => {
            unitSearch.value = '';
            unitsNames.value = stats.value.units.map((unit: any) => unit.name);
            setStats(stats.value.project);
          })
          .catch(() => {});
      }
    }

    function setStats(entity: any) {
      issuesLineChartSeries.value = [
        {
          name: 'Open',
          data: entity.open,
        },
        {
          name: 'Resolved',
          data: entity.closed,
        },
      ];

      riskDonutChartSeries.value = entity.risks;

      reportsLineChartSeries.value = [
        {
          name: 'Reports Volume',
          data: entity.reports,
        },
      ];
    }

    function updateStats() {
      if (selectedUnit.value) {
        setStats(
          stats.value.units.find((u: any) => u.name === selectedUnit.value).data
        );
      } else {
        setStats(stats.value.project);
      }
    }

    return {
      projects,
      updateStats,
      fetchStats,
      unitSearch,
      selectedProject,
      selectedUnit,
      unitsNames,
      issuesLineChartOptions,
      issuesLineChartSeries,
      reportsLineChartOptions,
      reportsLineChartSeries,
      riskDonutChartOptions,
      riskDonutChartSeries,
    };
  },
});
</script>
