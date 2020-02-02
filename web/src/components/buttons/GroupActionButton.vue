<template>
  <div>
    <v-tooltip
      top
      transition="scale-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="red"
          :disabled="!items.length"
          v-on="on"
          @click="updateIssues(items, 'is_fp', true)"
        >
          <v-icon>thumb_down</v-icon>
        </v-btn>
      </template>
      <span>Mark issues as false positive</span>
    </v-tooltip>
    <!-- <v-tooltip
      top
      transition="scale-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="indigo"
          :disabled="!items.length"
          v-on="on"
        >
          <v-icon> merge_type</v-icon>
        </v-btn>
      </template>
      <span> Merge selected issues</span>
    </v-tooltip>
    <v-tooltip
      top
      transition="scale-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="red"
          :disabled="!items.length"
          v-on="on"
        >
          <v-icon>fa-times</v-icon>
        </v-btn>
        <confirm-dialog :disabled="!items.length" />
      </template>
      <span> Close selected issues</span>
    </v-tooltip> -->
  </div>
</template>
<script>
import {
  ISSUE_UPDATE, ISSUES_FETCH,
} from '@/store/actions';

export default {
  name: 'GroupActionButton',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      fab: false,
    };
  },
  methods: {
    updateIssues(items, field, value) {
      const change = {};
      if (field === 'is_fp') { change.is_closed = true; }
      change[field] = value;
      this.$store.dispatch(ISSUE_UPDATE, { ids: items, change }).then(() => {
        this.$store.dispatch(ISSUES_FETCH, this.$route.params.slug);
      });
    },
  },
};
</script>
