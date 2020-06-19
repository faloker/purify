<template>
  <v-container fluid style="width: 90%">
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
    <v-row justify="center" align="center">
      <v-col cols="10">
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="paragraph@5"
        >
          <issues-list :raw-items="filtredIssues" />
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import { groupBy } from 'lodash';
import IssuesList from '@/components/IssuesList.vue';
import { compareDesc, sub } from 'date-fns';
import IssueFilter from '@/components/IssueFilter.vue';
import { ISSUES_FETCH } from '@/store/actions';
import { SET_ACTIVE_UNIT } from '@/store/mutations';

export default {
  name: 'Issues',
  components: {
    IssuesList,
    IssueFilter,
  },
  data() {
    return {
      resolutionStatus: '',
      ticket: '',
      closed: false,
      search: '',
      templates: [],
      timeback: '',
      loading: true,
      risk: [],
      filterOptions: [
        {
          name: 'status',
          value: 'open',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      issues: (state) => state.issues.issues,
    }),

    filtredIssues() {
      let issuesToDisplay = this.issues;

      const searchFilter = this.filterOptions.filter((f) => f.name === 'search');
      issuesToDisplay = searchFilter.length
        ? this.issues.filter((i) =>
            JSON.stringify(Object.values(i.fields))
              .toLowerCase()
              .includes(searchFilter[0].value.toLowerCase())
          )
        : issuesToDisplay;

      this.filterOptions
        .filter((option) => !['search', 'ticket'].includes(option.name))
        .forEach((option) => {
          issuesToDisplay = this.applyFilter(issuesToDisplay, option.name);
        });

      const ticketFilter = this.filterOptions
        .filter((f) => f.name === 'ticket')
        .map((f) => (f.value === 'no ticket' ? false : true));

      issuesToDisplay = ticketFilter.length
        ? issuesToDisplay.filter((issue) => ticketFilter.includes(!!issue.ticket))
        : issuesToDisplay;

      return issuesToDisplay;
    },

    keywordsList() {
      let result = [];

      this.filtredIssues.forEach((issue) => {
        const list = Object.values(issue.fields)
          .toString()
          .match(/[a-zA-Z0-9\._-]{3,}/gm);
        result = result.concat([...new Set(list)]);
      });

      return [...new Set(result)];
    },
  },

  // watch: {
  //   filterOptions(newValue, oldValue) {
  //     this.$router.replace({
  //       path: 'Issues',
  //       params: { slug: this.$route.params.slug },
  //       query: { filter: JSON.stringify(groupBy(newValue, 'name')) },
  //     });
  //   },
  // },

  mounted() {
    this.$store.commit(SET_ACTIVE_UNIT, this.$route.params.slug);

    // if (this.$route.query.filter) {
    //   this.filterOptions = this.$route.query.filter;
    // } else {
    //   this.filterOptions.push({
    //     name: 'status',
    //     value: 'open',
    //   });
    // }

    this.$store.dispatch(ISSUES_FETCH, this.$route.params.slug).then(() => {
      this.loading = false;
    });
  },

  methods: {
    valuesForFilter(option) {
      const optionValues = [...new Set(this.issues.map((issue) => issue[option]))];
      const result = [];

      optionValues.forEach((value) => {
        const total = this.filtredIssues.filter((issue) => issue[option] === value).length;
        result.push({
          title: value,
          total: total,
          value: (total / this.filtredIssues.length) * 100,
        });
      });

      return result.sort((a, b) => b.total - a.total);
    },

    applyFilter(issues, filterName) {
      const options = this.filterOptions.filter((o) => o.name === filterName);

      return options.length
        ? issues.filter((issue) =>
            options.map((o) => o.value.toLowerCase()).includes(issue[filterName.toLowerCase()])
          )
        : issues;
    },

    ticketValuesForFilter() {
      const result = [];

      const totalTickets = this.filtredIssues.filter((issue) => issue['ticket']).length;
      result.push(
        {
          title: 'ticket assigned',
          total: totalTickets,
          value: (totalTickets / this.filtredIssues.length) * 100,
        },
        {
          title: 'no ticket',
          total: this.filtredIssues.length - totalTickets,
          value: ((this.filtredIssues.length - totalTickets) / this.filtredIssues.length) * 100,
        }
      );

      return result.sort((a, b) => b.total - a.total);
    },
  },
};
</script>
