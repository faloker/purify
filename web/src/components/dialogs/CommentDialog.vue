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
                <img :src="currentUser.image" />
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
                <v-avatar v-if="event.author.username === 'purify'">
                  <img src="@/assets/logo_trans.png" />
                </v-avatar>
                <v-avatar v-else>
                  <img :src="event.author.image" />
                </v-avatar>
              </template>
              <v-row justify="space-between">
                <v-col cols="7" v-text="event.text" />
                <v-col
                  class="text-right"
                  cols="5"
                  v-text="new Date(event.created_at).toDateString()"
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
import { mapGetters } from 'vuex';
import { POST_COMMENT, ISSUES_FETCH } from '@/store/actions';

export default {
  name: 'CommentDialog',
  props: {
    issue: {
      type: Object,
      required: true,
      default: () => {},
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
    timeline() {
      return this.issue.comments ? this.issue.comments.slice().reverse() : [];
    },
  },
  methods: {
    postComment() {
      if (this.input) {
        const comment = {
          author: this.currentUser._id,
          text: this.input,
        };

        this.$store
          .dispatch(POST_COMMENT, { id: this.issue._id, comment })
          .then((doc) => {
            this.issue.comments.push(doc);
            this.input = null;
            this.$store.dispatch(ISSUES_FETCH, this.$route.params.slug);
          });
      }
    },
  },
};
</script>
