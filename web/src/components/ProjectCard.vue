<template>
  <div>
    <v-hover>
      <v-card
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
              {{ project.title }}
            </v-btn>
          </div>
          <div class="text-center subheading font-weight-light grey--text text-truncate">
            {{ project.subtitle }}
          </div>
          <v-divider class="mt-2" light></v-divider>
          <v-container fluid>
            <v-row dense class="text-center">
              <v-col>
                <p class="display-1 font-weight-black">
                  <countTo
                    :start-val="0"
                    :end-val="project.issues"
                    :duration="2000"
                  ></countTo>
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
                  ></countTo>
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
                  ></countTo>
                </p>
                <span class="subheading font-weight-medium">
                  <v-icon class="mx-1" small>mdi-folder</v-icon>Units
                </span>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-divider light></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialog = true"
          >
            Edit
          </v-btn>
          <v-btn
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
                v-model="title"
                label="Project title"
                outlined
                dense
                clearable
                required
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                v-model="subtitle"
                label="Project short description"
                clearable
                dense
                outlined
                hint="For example, a tech stack: django, react, e.t.c"
                required
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider dark></v-divider>
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
    <v-dialog v-model="confirmDialog" max-width="300">
      <v-card>
        <v-card-title>
          <span class="title">Delete project <b>{{ project.title }}</b>?</span>
        </v-card-title>
        <v-divider dark></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="tertiary"
            text
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
  },
  data() {
    return {
      title: this.project.title || '',
      subtitle: this.project.subtitle || '',
      dialog: false,
      confirmDialog: false,
    };
  },
  methods: {
    deleteProject() {
      this.$store.dispatch(DELETE_PROJECT, this.project._id).then(() => {
        this.confirmDialog = false;
        this.$toasted.global.api_success({
          msg: `Project ${this.project.title} removed`,
        });
      });
    },
    editProject() {
      this.$store
        .dispatch(EDIT_PROJECT, {
          id: this.project._id,
          change: { title: this.title, subtitle: this.subtitle },
        })
        .then(() => {
          this.dialog = false;
        });
    },
  },
};
</script>
