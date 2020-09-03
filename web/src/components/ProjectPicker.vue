<template>
  <v-menu
    v-model="menu"
    offset-y
    :close-on-content-click="false"
    nudge-bottom="5"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        text
        class="text-none"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-apps</v-icon>
        <v-icon right>
          mdi-chevron-down
        </v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-subheader class="mb-1">
        PROJECTS
        <v-spacer /> 
        <v-chip
          small
          label
          color="primary"
          @click.stop="openProjects"
        >
          <v-icon small left>
            mdi-cogs
          </v-icon>
          <strong>Manage Projects</strong>
        </v-chip>
      </v-subheader>
      <v-text-field
        v-model="searchTerm"
        label="Filter by project..."
        prepend-inner-icon="search"
        class="mx-1"
        dense
        solo
        single-line
      />
      <v-slide-y-transition group>
        <v-list-item
          v-for="project in filteredProjects"
          :key="project._id"
          @click.stop="selectProject(project)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="project.displayName" />
          </v-list-item-content>
        </v-list-item>
      </v-slide-y-transition>
    </v-list>
  </v-menu>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
  watch,
} from '@vue/composition-api';
import store from '@/store';
import { Project } from '@/store/types';
import { toLower } from 'lodash';
import { router } from '@/router';
export default defineComponent({
  name: 'ProjectPicker',
  setup() {
    const menu = ref(false);
    const searchTerm = ref('');
    const selectedProject = ref('');
    const projects: ComputedRef<Project[]> = computed(
      () => store.state.projects.items
    );
    const filteredProjects = computed(() => {
      return projects.value.filter(item =>
        toLower(item.displayName).includes(toLower(searchTerm.value))
      );
    });

    watch(menu, newValue => {
      if (newValue === false) {
        searchTerm.value = '';
      }
    });

    function selectProject(item: Project) {
      menu.value = false;
      router.push({ name: 'Units', params: { projectName: item.name } });
    }

    function openProjects() {
      menu.value = false;
      router.push({ name: 'Projects' });
    }

    return {
      filteredProjects,
      selectedProject,
      searchTerm,
      menu,
      selectProject,
      openProjects,
    };
  },
});
</script>
<style scoped></style>