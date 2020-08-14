<template>
  <v-dialog
    v-model="value"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        color="primary"
        dark
        dense
      >
        <v-btn
          icon
          dark
          @click="$emit('input', false)"
        >
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="title">
          <b>Issue Editor</b>
        </v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn text @click="updateIssue()">
            save
            <v-icon right>
              save
            </v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <editor
        ref="IssueEditor"
        v-model="rawIssue"
        mode="application/json"
      />
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
import { ISSUE_UPDATE, SHOW_SUCCESS_MSG } from '@/store/actions';
import Editor from '@/components/Editor.vue';
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

  components: {
    Editor,
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
        .then(async () => {
          const updatedIssue = props.issue;
          updatedIssue.fields = JSON.parse(change.fields);

          await store.dispatch(SHOW_SUCCESS_MSG, 'The issue has been updated');
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
