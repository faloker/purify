<template>
  <v-dialog
    v-model="dialog"
    max-width="650"
    @click:outside="$emit('update:dialog', false)"
  >
    <v-card>
      <v-container style="max-width: 600px;">
        <v-timeline dense clipped>
          <v-timeline-item class="mb-7" large>
            <template v-slot:icon>
              <v-avatar>
                <img :src="currentUser.image">
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
<script>
import { mapGetters, mapState } from 'vuex';
import { POST_COMMENT } from '@/store/actions';
import { formatDate } from '@/utils/helpers';

export default {
  name: 'CommentDialog',
  props: {
    issueId: {
      type: String,
      required: true,
      default: () => '',
    },
    dialog: {
      required: true,
      type: Boolean,
    },
  },

  data() {
    return {
      commentDialog: false,
      input: null,
    };
  },

  computed: {
    ...mapGetters(['currentUser']),

    ...mapState({
      issueComments: state => state.issues.comments,
    }),

    timeline() {
      return this.issueComments ? this.issueComments.slice().reverse() : [];
    },
  },

  methods: {
    postComment() {
      if (this.input) {
        const comment = {
          author: this.currentUser.id,
          text: this.input,
        };

        this.$store
          .dispatch(POST_COMMENT, { issueId: this.issueId, comment })
          .then(() => {
            this.input = null;
          });
      }
    },

    formatDate,
  },
};
</script>
