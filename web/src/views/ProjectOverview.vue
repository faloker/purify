<template>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-autocomplete
          id="unitSearch"
          v-model="selectedUnit"
          :items="unitsNames"
          :search-input.sync="unitSearch"
          clearable
          dense
          outlined
          label="Unit"
          @input="updateMetrics()"
        />
      </v-col>
      <v-col cols="2">
        <v-select
          v-model="selectedDays"
          dense
          outlined
          :items="days"
          item-text="label"
          item-value="value"
          label="Time range"
          @input="fetchMetrics()"
        />
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          type="card"
          width="500"
          transition="slide-y-transition"
        >
          <v-card outlined>
            <v-card-text>
              <apexchart
                width="500"
                type="area"
                :options="issuesLineChartOptions"
                :series="issuesLineChartSeries"
              />
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          type="card"
          width="500"
          transition="slide-y-transition"
        >
          <v-card outlined>
            <v-card-text>
              <apexchart
                width="500"
                type="area"
                :options="reportsLineChartOptions"
                :series="reportsLineChartSeries"
              />
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          type="card"
          width="500"
          transition="slide-y-transition"
        >
          <v-card outlined>
            <v-card-text>
              <apexchart
                height="325"
                width="500"
                type="donut"
                :options="riskDonutChartOptions"
                :series="riskDonutChartSeries"
              />
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col> 
      <v-col>
        <v-skeleton-loader
          :loading="loading"
          type="card"
          width="500"
          transition="slide-y-transition"
        >
          <v-card outlined>
            <v-card-text>
              <apexchart
                height="325"
                width="500"
                type="donut"
                :options="templatesDonutChartOptions"
                :series="templatesDonutChartSeries"
              />
            </v-card-text>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  onMounted,
} from '@vue/composition-api';
import store from '@/store';
import { FETCH_METRICS } from '@/store/actions';

export default defineComponent({
  name: 'ProjectOverview',

  setup() {
    const days = ref([
      { label: '-1w', value: 7 },
      { label: '-1m', value: 30 },
      { label: '-3m', value: 90 },
      { label: '-1y', value: 365 },
    ]);
    const unitSearch = ref('');
    const unitsNames = ref([]);
    const selectedUnit = ref('');
    const selectedDays = ref(7);
    const issuesLineChartOptions = ref({
      chart: {
        id: 'created-vs-closed',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
      },
      title: {
        text: 'Created vs Resolved',
        align: 'left',
      },
    });

    const issuesLineChartSeries = ref([
      {
        name: 'Created',
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
      dataLabels: {
        enabled: false,
      },
      title: {
        text: 'Reports Volume',
        align: 'left',
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
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
        id: 'risks',
      },
      title: {
        text: 'Risks',
        align: 'left',
      },
      noData: { text: 'Waiting for data...' },
      labels: ['Info', 'Low', 'Medium', 'High', 'Critical'],
    });
    const riskDonutChartSeries = ref([]);
    const templatesDonutChartOptions = ref({});
    const templatesDonutChartSeries = ref([]);
    const loading = ref(true);
    const stats = computed(() => store.state.projects.stats);

    onMounted(() =>
      store
        .dispatch(FETCH_METRICS, { days: 7 })
        .then(() => {
          loading.value = false;
          unitSearch.value = '';
          unitsNames.value = stats.value.units.map((unit: any) => unit.name);
          setStats(stats.value.project);
        })
        .catch(() => {})
    );

    function setStats(entity: any) {
      issuesLineChartSeries.value = [
        {
          name: 'Created',
          data: entity.created,
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
          data: entity.reportsVolume,
        },
      ];

      templatesDonutChartOptions.value = {
        chart: {
          id: 'templates',
        },
        title: {
          text: 'Templates',
          align: 'left',
        },
        noData: { text: 'Waiting for input...' },
        labels: entity.templates.labels,
      };
      templatesDonutChartSeries.value = entity.templates.series;
    }

    function updateMetrics() {
      if (selectedUnit.value) {
        setStats(
          stats.value.units.find((u: any) => u.name === selectedUnit.value)
        );
      } else {
        setStats(stats.value.project);
      }
    }

    async function fetchMetrics() {
      await store
        .dispatch(FETCH_METRICS, { days: selectedDays.value })
        .catch(() => {});
      updateMetrics();
    }

    return {
      days,
      loading,
      updateMetrics,
      selectedDays,
      fetchMetrics,
      unitSearch,
      selectedUnit,
      unitsNames,
      issuesLineChartOptions,
      issuesLineChartSeries,
      reportsLineChartOptions,
      reportsLineChartSeries,
      riskDonutChartOptions,
      riskDonutChartSeries,
      templatesDonutChartOptions,
      templatesDonutChartSeries,
    };
  },
});
</script>
