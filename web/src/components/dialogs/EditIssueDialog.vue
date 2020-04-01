<template>
  <v-card>
    <v-card-title>
      <span class="title mb-2">Edit issue</span>
    </v-card-title>
    <v-card-text>
      <v-textarea
        id="raw-issue-text"
        v-model="rawIssue"
        filled
        label="Raw issue"
        auto-grow
      />
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="green darken-1"
        text
        @click="updateIssue()"
      >
        Confirm
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { ISSUE_UPDATE } from '@/store/actions';

export default {
  name: 'EditIssueDialog',
  props: {
    issue: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    rawIssue: null,
  }),
  mounted() {
    this.rawIssue = JSON.stringify({ fields: this.issue.fields }, null, 2);
  },
  methods: {
    updateIssue() {
      const change = JSON.parse(this.rawIssue);

      this.$store
        .dispatch(ISSUE_UPDATE, { ids: [this.issue._id], change })
        .then(() => {
          this.issue.fields = change.fields;
          this.$emit('update:issue', this.issue);
        });
    },
  },
};
</script>
