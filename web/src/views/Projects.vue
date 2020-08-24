<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-col>
        <v-text-field
          id="search"
          ref="search"
          v-model="searchTerm"
          clearable
          dense
          outlined
        >
          <template slot="label">
            <v-icon class="mx-1" style="vertical-align: middle">
              search
            </v-icon>Search
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
        <project-dialog
          v-model="dialog"
          :name.sync="name"
          :display-name.sync="displayName"
          :description.sync="description"
          ok-button-text="Create"
          @handle-click="createProject"
        />
      </v-col>
    </v-row>
    <v-row>
      <template v-for="project in filtredItems">
        <v-col :key="project._id">
          <v-skeleton-loader
            :loading="loading"
            transition="scale-transition"
            type="card"
            width="400"
          >
            <v-fade-transition>
              <project-card :project="project" />
            </v-fade-transition>
          </v-skeleton-loader>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  ComputedRef,
} from '@vue/composition-api';
import { toLower } from 'lodash';
import store from '@/store';
import ProjectCard from '@/components/ProjectCard.vue';
import ProjectDialog from '@/components/dialogs/ProjectDialog.vue';
import { FETCH_PROJECTS, CREATE_PROJECT } from '@/store/actions';
import { Project } from '@/store/types';

export default defineComponent({
  name: 'Projects',

  components: { ProjectCard, ProjectDialog },

  setup() {
    const search = ref(null);
    const searchTerm = ref('');
    const loading = ref(true);

    const projects: ComputedRef<Project[]> = computed(
      () => store.state.projects.items
    );
    const filtredItems = computed(() => {
      return projects.value.filter(item =>
        toLower(item.displayName + item.description).includes(
          toLower(searchTerm.value)
        )
      );
    });

    onMounted(() => {
      store.dispatch(FETCH_PROJECTS, true).then(() => {
        loading.value = false;
      });
    });

    const createProject = useCreateProject();

    return {
      ...createProject,
      filtredItems,
      searchTerm,
      loading,
      search,
    };
  },
});

function useCreateProject() {
  const description = ref('');
  const name = ref('');
  const displayName = ref('');
  const dialog = ref(false);

  async function createProject() {
    store
      .dispatch(CREATE_PROJECT, {
        displayName: displayName.value,
        description: description.value,
        name: name.value,
      })
      .then(() => {
        displayName.value = '';
        description.value = '';
        name.value = '';
        dialog.value = false;
      })
      .catch(() => {});
  }

  return {
    displayName,
    description,
    dialog,
    name,
    createProject,
  };
}
</script>
