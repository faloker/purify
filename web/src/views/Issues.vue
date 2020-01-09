<template>
  <v-card
    flat
    height="100%"
  >
    <v-container>
      <v-row>
        <issue-filter
          @fp_status="updateFPStatus"
          @risk_level="updateRiskLevel"
          @ticket_status="updateTicketStatus"
          @search_term="updateSearchTerm"
          @closed_status="updateClosedStatus"
          @templates="templates = $event"
          @endDate="endDate = $event"
          @startDate="startDate = $event"
        />
      </v-row>
      <v-row
        justify="center"
        align="center"
      >
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
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import IssuesList from '@/components/IssuesList.vue';
import IssueFilter from '@/components/IssueFilter.vue';
import { ISSUES_FETCH } from '@/store/actions';
import { SET_ACTIVE_PAGE } from '@/store/mutations';

export default {
  name: 'Issues',
  components: {
    IssuesList,
    IssueFilter,
  },
  data() {
    return {
      fp: false,
      ticket: '',
      closed: false,
      text: '',
      templates: [],
      endDate: '',
      startDate: '',
      loading: true,
      risk_level: '',
    };
  },
  computed: {
    ...mapGetters(['allIssues', 'isSelected', 'activeRelease']),
    filtredIssues() {
      let issuesToDisplay = this.allIssues;

      issuesToDisplay = this.fp !== '' ? issuesToDisplay
        .filter((i) => i.is_fp === this.fp) : issuesToDisplay;

      issuesToDisplay = this.closed !== '' ? issuesToDisplay
        .filter((i) => i.is_closed === this.closed) : issuesToDisplay;

      issuesToDisplay = this.risk_level !== '' ? issuesToDisplay
        .filter((i) => i.risk === this.risk_level) : issuesToDisplay;

      issuesToDisplay = this.ticket !== '' ? issuesToDisplay
        .filter((i) => !!i.ticket === this.ticket) : issuesToDisplay;

      issuesToDisplay = this.text !== '' ? issuesToDisplay
        .filter((i) => JSON.stringify(i.fields).toLowerCase().includes(this.text)) : issuesToDisplay;

      issuesToDisplay = this.templates.length ? issuesToDisplay
        .filter((i) => this.templates.includes(i.template.name)) : issuesToDisplay;

      // issuesToDisplay = this.startDate ? issuesToDisplay
      //   .filter((i) => new Date(i.date) >= new Date(this.startDate)) : issuesToDisplay;

      // issuesToDisplay = this.endDate ? issuesToDisplay
      //   .filter((i) => new Date(i.date) <= new Date(this.endDate)) : issuesToDisplay;

      return issuesToDisplay;
    },
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PAGE, 'Issues');
    this.$store.dispatch(ISSUES_FETCH, this.$route.params.slug).then(() => {
      this.loading = false;
    });
  },
  methods: {
    updateFPStatus(textStatus) {
      this.fp = textStatus ? textStatus === 'Yes' : '';
    },
    updateTicketStatus(textStatus) {
      this.ticket = textStatus ? textStatus === 'Yes' : '';
    },
    updateSearchTerm(searchTerm) {
      this.text = searchTerm ? searchTerm.toLowerCase() : '';
    },
    updateRiskLevel(risk) {
      this.risk_level = risk || '';
    },
    updateClosedStatus(textStatus) {
      this.closed = textStatus ? textStatus === 'Yes' : '';
    },
  },
};
</script>
