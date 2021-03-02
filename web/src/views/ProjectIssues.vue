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
          :risk-filter-items="valuesForFilter('risk', ['low', 'info', 'medium', 'high', 'critical'])"
          :status-filter-items="valuesForFilter('status', ['open', 'closed'])"
          :resolution-filter-items="valuesForFilter('resolution', ['false positive', 'accepted risk', 'resolved', 'none'])"
          :template-filter-items="templatesValuesForFilter()"
          :ticket-filter-items="ticketValuesForFilter()"
          @search_term="searchTerm = $event"
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
  watch,
} from '@vue/composition-api';
import store from '@/store';
import IssuesList from '@/components/IssuesList.vue';
import { compareDesc, sub } from 'date-fns';
import IssueFilter from '@/components/IssueFilter.vue';
import { ISSUES_FETCH, TEMPLATES_FETCH } from '@/store/actions';
import {
  Issue,
  FilterValue,
  FilterOption,
  TemplateWithStats,
} from '@/store/types';
import { SET_ISSUES_QUERY } from '@/store/mutations';

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
      searchTerm,
      filtredIssues,
      valuesForFilter,
      templatesValuesForFilter,
      ticketValuesForFilter,
    } = useFiltres();

    const keywordsList = computed(() => {
      let result: string[] = [];

      filtredIssues.value.forEach((issue) => {
        const list = Object.values(issue.fields)
          .toString()
          .match(/[a-zA-Z0-9\._-]{3,}/gm);
        result = result.concat([...new Set(list)]);
      });

      return [...new Set(result)];
    });
    const unitName = computed(() => store.state.system.unitName);
    const projectName = computed(() => store.state.system.projectName);

    const queryParams = computed(() => {
      return filterOptions.value.reduce(function (r, a) {
        // @ts-ignore
        r[a.name] = r[a.name] || '';
        // @ts-ignore
        if (r[a.name] === '') {
          // @ts-ignore
          r[a.name] = a.value;
        } else {
          // @ts-ignore
          const ops = r[a.name].split(',');
          ops.push(a.value);
          // @ts-ignore
          r[a.name] = ops.toString();
        }
        return r;
      }, {});
    });

    onMounted(() => {
      store.dispatch(TEMPLATES_FETCH).catch(() => {});
      store.commit(SET_ISSUES_QUERY, queryParams.value);
      store
        .dispatch(ISSUES_FETCH, {
          projectName: projectName.value,
          ...queryParams.value,
        })
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
    });

    watch(queryParams, async () => {
      // if (newValue.value !== oldValue.value) {
      store.commit(SET_ISSUES_QUERY, queryParams.value);
      await store
        .dispatch(ISSUES_FETCH, {
          unitName: unitName.value,
          ...queryParams.value,
        })
        .catch(() => {});
      // }
    });

    return {
      loading,
      searchTerm,
      queryParams,
      keywordsList,
      filterOptions,
      filtredIssues,
      templatesValuesForFilter,
      valuesForFilter,
      ticketValuesForFilter,
    };
  },
});

function useFiltres() {
  const searchTerm = ref('');
  const issues: ComputedRef<Issue[]> = computed(() => store.state.issues.items);
  const templates: ComputedRef<TemplateWithStats[]> = computed(
    () => store.state.templates.items
  );
  const filterOptions: Ref<FilterOption[]> = ref([
    { name: 'status', value: 'open' },
  ]);
  const filtredIssues = computed(() => {
    let issuesToDisplay = issues.value;

    issuesToDisplay = searchTerm.value
      ? issues.value.filter((i) =>
          JSON.stringify(Object.values(i.fields))
            .toLowerCase()
            .includes(searchTerm.value.toLowerCase())
        )
      : issuesToDisplay;

    return issuesToDisplay;
  });

  function valuesForFilter(fieldName: string, values: string[]) {
    const result: FilterValue[] = [];

    values.forEach((value) => {
      const total = filtredIssues.value.filter(
        // @ts-ignore
        (issue) => issue[fieldName] === value
      ).length;
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

    const totalTickets = filtredIssues.value.filter((issue) => issue['ticket'])
      .length;
    result.push(
      {
        title: 'true',
        total: totalTickets,
        value: (totalTickets / filtredIssues.value.length) * 100,
      },
      {
        title: 'false',
        total: filtredIssues.value.length - totalTickets,
        value:
          ((filtredIssues.value.length - totalTickets) /
            filtredIssues.value.length) *
          100,
      }
    );

    return result.sort((a, b) => b.total - a.total);
  }

  function templatesValuesForFilter() {
    const result: FilterValue[] = [];

    templates.value
      .map((template) => template.displayName)
      .forEach((templateName) => {
        const total = filtredIssues.value.filter(
          (issue) => issue.template === templateName
        ).length;
        result.push({
          title: templateName,
          total: total,
          value: (total / filtredIssues.value.length) * 100,
        });
      });

    return result.sort((a, b) => b.total - a.total);
  }

  return {
    filterOptions,
    searchTerm,
    filtredIssues,
    valuesForFilter,
    templatesValuesForFilter,
    ticketValuesForFilter,
  };
}
</script>
