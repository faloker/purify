<template>
  <v-dialog
    v-model="value"
    max-width="800"
    @click:outside="$emit('input', false)"
  >
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
  </v-dialog>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  PropType,
  onMounted,
} from '@vue/composition-api';
import { ISSUE_UPDATE } from '@/store/actions';
import { Issue } from '@/store/types';
import store from '@/store';

export default defineComponent({
  name: 'EditIssueDialog',

  props: {
    issue: {
      type: Object as PropType<Issue>,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const rawIssue = ref('');

    onMounted(() => {
      rawIssue.value = JSON.stringify(props.issue.fields, null, 2);
    });

    function updateIssue() {
      const change = { fields: rawIssue.value };

      store
        .dispatch(ISSUE_UPDATE, {
          ids: [props.issue._id],
          change,
          unitId: context.root.$route.params.slug,
        })
        .then(() => {
          const updatedIssue = props.issue;
          updatedIssue.fields = JSON.parse(change.fields);
          context.emit('update:issue', updatedIssue);
          context.emit('input', false);
        });
    }

    return {
      rawIssue,
      updateIssue,
    };
  },
});
</script>
