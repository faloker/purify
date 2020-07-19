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
          @click="updateIssues(items, 'resolution', 'false positive')"
        >
          <v-icon>thumb_down</v-icon>
        </v-btn>
      </template>
      <span>Mark issues as false positive</span>
    </v-tooltip>
  </div>
</template>
<script>
import { ISSUE_UPDATE } from '@/store/actions';

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
      if (field === 'resolution') {
        change.status = 'closed';
      }
      change[field] = value;
      this.$store.dispatch(ISSUE_UPDATE, { ids: items, change }).then(() => {
        this.$showSuccessMessage('The issue(s) has been updated');
      });
    },
  },
};
</script>
