<template>
  <div>
    <v-hover>
      <v-card
        :key="project._id"
        slot-scope="{ hover }"
        :class="`elevation-${hover ? 12 : 3}`"
        shaped
        class="mx-auto my-3"
        width="400"
      >
        <div class="px-3 pt-3">
          <div class="text-center font-weight-light mb-2 text-truncate">
            <v-btn
              text
              color="primary"
              rounded
              class="text-none title"
              :to="{name: 'Units', params: { slug: project.slug }}"
            >
              <span
                class="d-inline-block text-truncate"
                style="max-width: 300px;"
              >
                {{ project.title }}
              </span>
            </v-btn>
          </div>
          <div
            class="text-center subheading font-weight-light grey--text text-truncate"
          >
            {{ project.subtitle }}
          </div>
          <v-divider class="mt-2" />
          <v-container fluid>
            <v-row dense class="text-center">
              <v-col>
                <p class="display-1 font-weight-black">
                  <countTo
                    :start-val="0"
                    :end-val="project.issues"
                    :duration="2000"
                  />
                </p>
                <span class="subheading">
                  <v-icon class="mx-1" small>fa-bug</v-icon>Issues
                </span>
              </v-col>
              <v-col>
                <p class="display-1 font-weight-black">
                  <countTo
                    :start-val="0"
                    :end-val="project.tickets"
                    :duration="2000"
                  />
                </p>
                <span class="subheading">
                  <v-icon class="mx-1" small>mdi-cards</v-icon>Tickets
                </span>
              </v-col>
              <v-col>
                <p class="display-1 font-weight-black">
                  <countTo
                    :start-val="0"
                    :end-val="project.units"
                    :duration="2000"
                  />
                </p>
                <span class="subheading font-weight-medium">
                  <v-icon class="mx-1" small>mdi-folder</v-icon>Units
                </span>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="edit-btn"
            color="primary"
            text
            @click="dialog = true"
          >
            Edit
          </v-btn>
          <v-btn
            class="delete-btn"
            color="tertiary"
            text
            @click="confirmDialog = true"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title>
          <span class="title">Edit project</span>
        </v-card-title>
        <v-spacer />
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                id="project-title-edit-input"
                v-model="title"
                label="Project title"
                outlined
                dense
                clearable
                required
                @keydown.enter="editProject"
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                id="project-subtitle-edit-input"
                v-model="subtitle"
                label="Project short description"
                clearable
                dense
                outlined
                hint="For example, a tech stack: django, react, e.t.c"
                required
                @keydown.enter="editProject"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="tertiary"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
          <v-btn
            color="primary"
            :disabled="title.length < 3"
            text
            @click="editProject"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" max-width="350">
      <v-card>
        <v-card-title>
          Delete project
          <v-chip
            label
            class="mx-1"
          >
            <span
              class="d-inline-block text-truncate"
              style="max-width: 150px;"
            >
              <b>{{ project.title }}</b>
            </span>
          </v-chip>
          ?
        </v-card-title>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            class="confirm-delete-btn"
            color="tertiary"
            text
            block
            @click="deleteProject"
          >
            Delete
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { DELETE_PROJECT, EDIT_PROJECT } from '@/store/actions';
import countTo from 'vue-count-to';

export default {
  name: 'ProjectCard',
  components: {
    countTo,
  },
  props: {
    project: {
      type: Object,
      required: true,
    },
    dialogs: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: this.project.title || '',
      subtitle: this.project.subtitle || '',
      dialog: false,
      confirmDialog: false,
    };
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    confirmDialog(newValue, oldValue) {
      this.$emit('update:dialogs', newValue);
    },

    // eslint-disable-next-line no-unused-vars
    dialog(newValue, oldValue) {
      this.$emit('update:dialogs', newValue);
    },
  },
  methods: {
    deleteProject() {
      this.$store.dispatch(DELETE_PROJECT, this.project.slug).then(() => {
        this.confirmDialog = false;
        this.$toasted.global.api_success({
          msg: 'Deleted successfully',
        });
      });
    },

    editProject() {
      this.$store
        .dispatch(EDIT_PROJECT, {
          slug: this.project.slug,
          change: { title: this.title, subtitle: this.subtitle },
        })
        .then(() => {
          this.dialog = false;
          this.$toasted.global.api_success({
            msg: 'Edited successfully',
          });
        });
    },
  },
};
</script>
