<template>
  <v-container>
    <v-skeleton-loader
      :loading="loading"
      transition="slide-y-transition"
      type="table-thead"
    >
      <v-row justify="center" align="center">
        <issue-filter
          :keywords="keywordsList"
          :risk-filter-items="valuesForFilter('risk')"
          :template-filter-items="valuesForFilter('template')"
          :status-filter-items="valuesForFilter('status')"
          :resolution-filter-items="valuesForFilter('resolution')"
          :ticket-filter-items="ticketValuesForFilter()"
          @filter_update="filterOptions = $event"
        />
      </v-row>
    </v-skeleton-loader>
    <v-skeleton-loader
      class="my-3"
      :loading="loading"
      transition="slide-y-transition"
      type="list"
      :types="{'list': 'table-heading, list-item-avatar-three-line@5'}"
    >
      <issues-list :raw-items="filtredIssues" />
    </v-skeleton-loader>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  Ref,
  onMounted,
  ComputedRef,
  computed,
} from '@vue/composition-api';
import store from '@/store';
import IssuesList from '@/components/IssuesList.vue';
import { compareDesc, sub } from 'date-fns';
import IssueFilter from '@/components/IssueFilter.vue';
import { ISSUES_FETCH } from '@/store/actions';
import { Issue, FilterValue, FilterOption } from '@/store/types';

export default defineComponent({
  name: 'Issues',

  components: {
    IssuesList,
    IssueFilter,
  },

  setup(props, context) {
    const loading = ref(true);
    const {
      filterOptions,
      filtredIssues,
      valuesForFilter,
      ticketValuesForFilter,
    } = useFiltres();

    const keywordsList = computed(() => {
      let result: string[] = [];

      filtredIssues.value.forEach(issue => {
        const list = Object.values(issue.fields)
          .toString()
          .match(/[a-zA-Z0-9\._-]{3,}/gm);
        result = result.concat([...new Set(list)]);
      });

      return [...new Set(result)];
    });
    const unitName = computed(() => store.state.system.unitName);

    onMounted(() => {
      store
        .dispatch(ISSUES_FETCH, { unitName: unitName.value })
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
    });

    return {
      loading,
      keywordsList,
      filterOptions,
      filtredIssues,
      valuesForFilter,
      ticketValuesForFilter,
    };
  },
});

function useFiltres() {
  const issues: ComputedRef<Issue[]> = computed(() => store.state.issues.items);
  const filterOptions: Ref<FilterOption[]> = ref([
    { name: 'status', value: 'open' },
  ]);
  const filtredIssues = computed(() => {
    const searchFilter = filterOptions.value.filter(f => f.name === 'search');
    let issuesToDisplay = issues.value;

    issuesToDisplay = searchFilter.length
      ? issues.value.filter(i =>
          JSON.stringify(Object.values(i.fields))
            .toLowerCase()
            .includes(searchFilter[0].value.toLowerCase())
        )
      : issuesToDisplay;

    filterOptions.value
      .filter(option => !['search', 'ticket'].includes(option.name))
      .forEach(option => {
        issuesToDisplay = applyFilter(issuesToDisplay, option.name);
      });

    const ticketFilter = filterOptions.value
      .filter(f => f.name === 'ticket')
      .map(f => (f.value === 'no ticket' ? false : true));

    issuesToDisplay = ticketFilter.length
      ? issuesToDisplay.filter(issue => ticketFilter.includes(!!issue.ticket))
      : issuesToDisplay;

    return issuesToDisplay;
  });

  function applyFilter(issues: Issue[], filterName: string) {
    const options = filterOptions.value.filter(o => o.name === filterName);

    return options.length
      ? issues.filter(issue =>
          options
            .map(o => o.value.toLowerCase())
            // @ts-ignore
            .includes(issue[filterName.toLowerCase()])
        )
      : issues;
  }

  function valuesForFilter(option: string) {
    // @ts-ignore
    const optionValues = [...new Set(issues.value.map(issue => issue[option]))];
    const result: FilterValue[] = [];

    optionValues.forEach(value => {
      // @ts-ignore
      const total = filtredIssues.value.filter(issue => issue[option] === value)
        .length;
      result.push({
        title: value,
        total: total,
        value: (total / filtredIssues.value.length) * 100,
      });
    });

    return result.sort((a, b) => b.total - a.total);
  }

  function ticketValuesForFilter() {
    const result: FilterValue[] = [];

    const totalTickets = filtredIssues.value.filter(issue => issue['ticket'])
      .length;
    result.push(
      {
        title: 'ticket assigned',
        total: totalTickets,
        value: (totalTickets / filtredIssues.value.length) * 100,
      },
      {
        title: 'no ticket',
        total: filtredIssues.value.length - totalTickets,
        value:
          ((filtredIssues.value.length - totalTickets) /
            filtredIssues.value.length) *
          100,
      }
    );

    return result.sort((a, b) => b.total - a.total);
  }

  return {
    filterOptions,
    filtredIssues,
    valuesForFilter,
    ticketValuesForFilter,
  };
}
</script>
