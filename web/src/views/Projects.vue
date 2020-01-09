<template>
  <v-card
    flat
    height="100%"
  >
    <v-layout
      wrap
      class="pt-5 mb-5"
    >
      <v-spacer />
      <v-flex
        xs4
        shrink
      >
        <v-text-field
          id="search"
          ref="search"
          v-model="search"
          clearable
          outlined
          @keydown.esc="onEsc"
        >
          <v-template slot="label">
            What about <strong>search</strong> here?
            <v-icon style="vertical-align: middle">
              search
            </v-icon>
          </v-template>
        </v-text-field>
      </v-flex>
      <v-flex shrink>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-btn
              color="primary"
              icon
              class="mx-3 my-2"
              @click="dialog = true"
              v-on="on"
            >
              <v-icon>mdi-plus-thick</v-icon>
            </v-btn>
          </template>
          <span>Add new project</span>
        </v-tooltip>
        <v-dialog
          v-model="dialog"
          max-width="400px"
        >
          <v-card>
            <v-card-title>
              <span class="mb-3 headline">New project</span>
            </v-card-title>
            <v-spacer />
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    v-model="projectTitle"
                    label="Project title"
                    clearable
                    required
                  />
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="projectSubtitle"
                    label="Project short description"
                    clearable
                    hint="For example, list of technologies: django, react, e.t.c"
                    required
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="red darken-1"
                rounded
                text
                @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn
                color="green darken-1"
                rounded
                text
                outlined
                @click="createProject"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-spacer />
    </v-layout>
    <v-container fluid>
      <v-row
        align="center"
        justify="space-around"
      >
        <v-template
          v-for="project in filtredItems"
          :key="project._id"
        >
          <v-col>
            <v-skeleton-loader
              :loading="loading"
              transition="scale-transition"
              type="card"
              width="400"
            >
              <project-card
                :project="project"
              />
            </v-skeleton-loader>
          </v-col>
        </v-template>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import ProjectCard from '@/components/ProjectCard.vue';
import {
  FETCH_PROJECTS,
  CREATE_PROJECT,
} from '@/store/actions';
import { SET_ACTIVE_PAGE } from '@/store/mutations';

export default {
  components: {
    ProjectCard,
  },
  data() {
    return {
      search: '',
      loading: true,
      dialog: false,
      projectSubtitle: '',
      projectTitle: '',
    };
  },
  computed: {
    ...mapGetters(['projectsList']),
    filtredItems() {
      return this.projectsList.filter(
        (item) => _.toLower(item.title + item.subtitle).includes(_.toLower(this.search)),
      );
    },
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PAGE, 'Projects');
    this.$store.dispatch(FETCH_PROJECTS).then(() => { this.loading = false; });

    document.onkeydown = (e) => {
      e = e || window.event;
      if (
        e.keyCode === 191 // Forward Slash '/'
          && e.target !== this.$refs.search.$refs.input
      ) {
        e.preventDefault();
        this.$refs.search.focus();
      } else if (e.keyCode === 67
          && e.target !== this.$refs.search.$refs.input) { this.dialog = true; }
    };
  },
  methods: {
    createProject() {
      const payload = {
        title: this.projectTitle,
        subtitle: this.projectSubtitle,
      };
      this.$store.dispatch(CREATE_PROJECT, payload);

      this.projectTitle = '';
      this.projectSubtitle = '';
      this.dialog = false;
    },
    onEsc() {
      this.$refs.search.blur();
    },
  },
};
</script>
