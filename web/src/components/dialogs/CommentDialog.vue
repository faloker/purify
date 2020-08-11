<template>
  <v-dialog
    v-model="value"
    max-width="650"
    @input="$emit('input', $event.target.value)"
    @click:outside="$emit('input', false)"
  >
    <v-card>
      <v-container style="max-width: 600px;">
        <v-timeline dense clipped>
          <v-timeline-item class="mb-7" large>
            <template v-slot:icon>
              <v-avatar>
                <img :src="user.image">
              </v-avatar>
            </template>
            <v-text-field
              v-model="input"
              hide-details
              flat
              label="Leave a comment..."
              solo
              @keydown.enter="postComment"
            >
              <template v-slot:append>
                <v-btn
                  :disabled="!input"
                  outlined
                  color="primary"
                  @click="postComment"
                >
                  Post
                </v-btn>
              </template>
            </v-text-field>
          </v-timeline-item>

          <v-slide-x-transition group>
            <v-timeline-item
              v-for="event in timeline"
              :key="event.created_at"
              class="mb-4"
              small
            >
              <template v-slot:icon>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-avatar v-if="event.author.username === 'purify'" v-on="on">
                      <img src="@/assets/logo_trans.png">
                    </v-avatar>
                    <v-avatar v-else v-on="on">
                      <img :src="event.author.image">
                    </v-avatar>
                  </template>
                  <span>{{ event.author.username }}</span>
                </v-tooltip>
              </template>
              <v-row justify="space-between">
                <v-col cols="7" v-text="event.text" />
                <v-col
                  class="text-right"
                  cols="5"
                  v-text="formatDate(event.created_at)"
                />
              </v-row>
            </v-timeline-item>
          </v-slide-x-transition>
        </v-timeline>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
} from '@vue/composition-api';
import store from '@/store';
import { POST_COMMENT } from '@/store/actions';
import { formatDate, formatDateTooltip } from '@/utils/helpers';
import { User, Comment } from '@/store/types';

export default defineComponent({
  name: 'CommentDialog',

  props: {
    issueId: {
      type: String,
      required: true,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const input = ref('');
    const user: ComputedRef<User> = computed(() => store.state.profile.user);
    const comments: ComputedRef<Comment[]> = computed(
      () => store.state.issues.comments
    );
    const timeline = computed(() =>
      comments.value ? comments.value.slice().reverse() : []
    );

    function postComment() {
      if (input.value) {
        const comment = {
          author: user.value._id,
          text: input.value,
        };

        store
          .dispatch(POST_COMMENT, { issueId: props.issueId, comment })
          .then(() => {
            input.value = '';
          });
      }
    }

    return {
      input,
      user,
      comments,
      timeline,
      formatDate,
      postComment,
    };
  },
});
</script>
