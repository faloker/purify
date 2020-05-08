<template>
  <v-container>
    <v-row>
      <issue-filter
        @resolution="resolutionStatus = $event"
        @risk_level="risk = $event"
        @ticket_status="updateTicketStatus"
        @search_term="search = $event"
        @closed_status="updateClosedStatus"
        @templates="templates = $event"
        @timeback="timeback = $event"
      />
    </v-row>
    <v-row justify="center" align="center">
      <v-col cols="12">
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
      risk: '',
    };
  },
  computed: {
    ...mapState({
      issues: (state) => state.issues.issues,
    }),
    filtredIssues() {
      let issuesToDisplay = this.issues;

      issuesToDisplay =
        this.timeback || ''
          ? issuesToDisplay.filter(
              (i) => new Date(i.created_at) > sub(new Date(), { days: this.timeback })
            )
          : issuesToDisplay.sort((a, b) =>
              compareDesc(Date.parse(a.created_at), Date.parse(b.created_at))
            );

      if (this.resolutionStatus === 'Resolved') {
        issuesToDisplay = issuesToDisplay.filter(
          (i) => i.is_risk_accepted === false && i.is_fp === false
        );
      } else if (this.resolutionStatus === 'Accepted Risk') {
        issuesToDisplay = issuesToDisplay.filter((i) => i.is_risk_accepted === true);
      } else if (this.resolutionStatus === 'False Positive') {
        issuesToDisplay = issuesToDisplay.filter((i) => i.is_fp === true);
      }

      issuesToDisplay =
        this.closed !== ''
          ? issuesToDisplay.filter((i) => i.is_closed === this.closed)
          : issuesToDisplay;

      issuesToDisplay =
        this.risk || '' ? issuesToDisplay.filter((i) => i.risk === this.risk) : issuesToDisplay;

      issuesToDisplay =
        this.ticket !== ''
          ? issuesToDisplay.filter((i) => !!i.ticket === this.ticket)
          : issuesToDisplay;

      issuesToDisplay =
        this.search || ''
          ? issuesToDisplay.filter((i) =>
              JSON.stringify(i.fields).toLowerCase().includes(this.search.toLowerCase())
            )
          : issuesToDisplay;

      issuesToDisplay = this.templates.length
        ? issuesToDisplay.filter((i) => this.templates.includes(i.template.name))
        : issuesToDisplay;

      return issuesToDisplay;
    },
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_UNIT, this.$route.params.slug);

    this.$store.dispatch(ISSUES_FETCH, this.$route.params.slug).then(() => {
      this.loading = false;
    });
  },
  methods: {
    updateTicketStatus(textStatus) {
      this.ticket = textStatus ? textStatus === 'Yes' : '';
    },

    updateClosedStatus(textStatus) {
      this.closed = textStatus ? textStatus === 'Yes' : '';
    },
  },
};
</script>
