<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-col>
        <v-text-field
          id="search"
          ref="search"
          v-model="search"
          clearable
          dense
          outlined
          @keydown.esc="onEsc"
        >
          <template slot="label">
            <v-icon style="vertical-align: middle">
              search
            </v-icon>Search for project
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-btn
          color="primary"
          text
          @click="dialog = true"
        >
          <v-icon>mdi-pencil</v-icon>Create project
        </v-btn>
        <v-dialog v-model="dialog" max-width="400px">
          <v-card>
            <v-card-title>
              <span class="title">New project</span>
            </v-card-title>
            <v-card-text>
              <v-col>
                <v-row>
                  <v-text-field
                    v-model="projectTitle"
                    label="Project title"
                    outlined
                    dense
                    clearable
                    required
                  />
                </v-row>
                <v-row>
                  <v-text-field
                    v-model="projectSubtitle"
                    label="Project short description"
                    clearable
                    dense
                    outlined
                    hint="For example, a tech stack: django, react, e.t.c"
                    required
                  />
                </v-row>
              </v-col>
            </v-card-text>
            <v-divider light></v-divider>
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
                :disabled="projectTitle.length < 3"
                text
                @click="createProject"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row align="center" justify="space-around">
      <template v-for="project in filtredItems">
        <v-col :key="project._id">
          <v-skeleton-loader
            :loading="loading"
            transition="scale-transition"
            type="card"
            width="400"
          >
            <project-card :project="project" />
          </v-skeleton-loader>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';
import ProjectCard from '@/components/ProjectCard.vue';
import { FETCH_PROJECTS, CREATE_PROJECT } from '@/store/actions';
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
        item => _.toLower(item.title + item.subtitle).includes(_.toLower(this.search)),
      );
    },
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PAGE, 'Projects');
    this.$store.dispatch(FETCH_PROJECTS).then(() => {
      this.loading = false;
    });

    document.onkeydown = e => {
      // eslint-disable-next-line no-param-reassign
      e = e || window.event;
      if (
        e.keyCode === 191 // Forward Slash '/'
        && e.target !== this.$refs.search.$refs.input
      ) {
        e.preventDefault();
        this.$refs.search.focus();
      } else if (
        e.keyCode === 67
        && e.target !== this.$refs.search.$refs.input
      ) {
        this.dialog = true;
      }
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
