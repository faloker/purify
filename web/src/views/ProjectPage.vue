<template>
  <v-container>
    <v-row
      justify="center"
      align="center"
      dense
      no-gutters
    >
      <v-col cols="12">
        <v-icon
          class="mb-1"
          left
          :color="project.color"
        >
          mdi-square-rounded
        </v-icon>
        <v-fade-transition group hide-on-leave>
          <span
            v-if="unit"
            key="unitName"
            class="text-h6 font-weight-black mr-3"
          >
            {{ unit.displayName }}
          </span>        
          <span
            v-else
            key="projectName"
            class="text-h6 font-weight-black mr-3"
          >
            {{ project.displayName }}
          </span>
          <v-btn
            key="overview"
            class="mx-2 mb-2"
            text
            :to="{ name: 'ProjectOverview' }"
            color="primary"
          >
            <v-icon left>
              mdi-poll
            </v-icon>Overview
          </v-btn>
          <v-btn
            key="units"
            class="mr-2 mb-2"
            text
            :to="{ name: 'Units' }"
            color="quinary"
          >
            <v-icon left>
              mdi-checkbox-multiple-blank
            </v-icon>Units
          </v-btn>
          <v-btn
            v-if="unit"
            key="issues"
            class="mr-2 mb-2"
            text
            :to="{ name: 'Issues' }"
            color="secondary"
          >
            <v-icon left>
              mdi-bug
            </v-icon>Issues
          </v-btn>
          <v-btn
            v-if="unit"
            key="reports"
            class="mr-2 mb-2"
            text
            :to="{ name: 'Reports' }"
            color="senary"
          >
            <v-icon left>
              mdi-file-document
            </v-icon>Reports
          </v-btn>
        </v-fade-transition>
      </v-col>
    </v-row>
    <v-divider />
    <router-view />
  </v-container>
</template>
<script lang="ts">
import { router } from '@/router';
import store from '@/store';
import { FETCH_PROJECTS } from '@/store/actions';
import { Project, Unit } from '@/store/types';
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
  watch,
  onMounted,
} from '@vue/composition-api';
export default defineComponent({
  name: 'ProjectPage',
  setup() {
    const projectName = computed(() => store.state.system.projectName);
    const unitName = computed(() => store.state.system.unitName);
    const projects: ComputedRef<Project[]> = computed(
      () => store.state.projects.items
    );
    const units: ComputedRef<Unit[]> = computed(() => store.state.units.items);
    const project = computed(() =>
      projects.value.find(p => p.name === projectName.value)
    );
    const unit = computed(() =>
      units.value.find(u => u.name === unitName.value)
    );

    onMounted(() => {
      store
        .dispatch(FETCH_PROJECTS)
        .then(() => {
          router.replace({
            name: 'ProjectOverview',
          });
        })
        .catch(() => {});
    });

    watch(projectName, () => {
      router.replace({
        name: 'ProjectOverview',
      });
    });

    return {
      // currentProject,
      projectName,
      project,
      unit,
    };
  },
});
</script>