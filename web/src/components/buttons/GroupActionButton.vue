<template>
  <div>
    <v-tooltip top transition="scale-transition">
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
<script lang="ts">
import {
  defineComponent,
  ref,
  Ref,
  computed,
  PropType,
  watch,
  onMounted,
} from '@vue/composition-api';
import { ISSUE_UPDATE, SHOW_SUCCESS_MSG } from '@/store/actions';
import store from '@/store';

export default defineComponent({
  name: 'GroupActionButton',

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  setup(props, context) {
    function updateIssues(items: string[], field: string, value: string) {
      const change: any = {};

      if (field === 'resolution') {
        change.status = 'closed';
      }

      change[field] = value;

      store
        .dispatch(ISSUE_UPDATE, {
          ids: items,
          change,
          unitId: context.root.$route.params.slug,
        })
        .then(async () => {
          await store.dispatch(
            SHOW_SUCCESS_MSG,
            'The issues have been updated'
          );
        })
        .catch(() => {});
    }

    return {
      updateIssues,
    };
  },
});
</script>
