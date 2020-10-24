<template>
  <v-card
    :key="project._id"
    class="mx-auto"
    outlined
    width="250"
    max-height="170"
  >
    <v-card-title>
      <span class="d-inline-block text-truncate" style="max-width: 220">
        <v-icon
          class="mb-1"
          left
          :color="project.color"
        >mdi-square-rounded</v-icon>
        <!-- {{ project.displayName }} -->
        <router-link
          :to="{ name: 'ProjectOverview', params: { projectName: project.name } }"
          class="text-decoration-none"
        >
          {{ project.displayName }}
        </router-link>
      </span>
    </v-card-title>
    <v-card-subtitle class="text-truncate">
      {{ project.description }}
    </v-card-subtitle>
    <v-divider class="mx-2" />
    <v-card-actions>
      <v-btn
        text
        class="text-none"
        :to="{ name: 'ProjectPage', params: { projectName: project.name } }"
      >
        <v-icon left>
          mdi-poll
        </v-icon>
      </v-btn>
      <v-btn
        text
        class="text-none"
        :to="{ name: 'Units', params: { projectName: project.name } }"
      >
        <v-icon left>
          mdi-checkbox-multiple-blank
        </v-icon>
        <span class="title font-weight-bold ml-1">
          <countTo
            :start-val="0"
            :end-val="project.numUnits"
            :duration="2000"
          />
        </span>
      </v-btn>
      <v-btn text class="text-none">
        <v-icon left>
          mdi-fire
        </v-icon>
        <span class="title font-weight-bold ml-1">
          <countTo
            :start-val="0"
            :end-val="project.numIssues"
            :duration="2000"
          />
        </span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import { defineComponent, PropType } from '@vue/composition-api';
import ProjectDialog from '@/components/dialogs/ProjectDialog.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { Project } from '@/store/types';
// @ts-ignore
import countTo from 'vue-count-to';

export default defineComponent({
  name: 'ProjectCard',

  components: {
    countTo,
    ConfirmDialog,
    ProjectDialog,
  },

  props: {
    project: {
      type: Object as PropType<Project>,
      required: true,
    },
  },

  setup(props) {
    return {};
  },
});
</script>
