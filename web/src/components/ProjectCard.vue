<template>
  <v-hover>
    <v-card
      :key="project._id"
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 3 : 0}`"
      class="mx-auto"
      outlined
      width="250"
      height="150"
      :to="{ name: 'ProjectPage', params: { projectName: project.name } }"
    >
      <v-card-title>
        <v-icon
          left
          :color="project.color"
        >
          mdi-square-rounded
        </v-icon>
        {{ project.displayName }}
      </v-card-title>
      <v-card-subtitle>
        {{ project.description }}
      </v-card-subtitle>
      <v-divider class="mx-2" />
      <v-card-text>
        <v-row no-gutters dense>
          <v-col>
            <v-icon
              small
              left
              class="mr-2 mb-1"
            >
              mdi-checkbox-multiple-blank
            </v-icon>
            <span class="subtitle-1 font-weight-bold">Units</span>
            <span class="title font-weight-bold ml-1">
              <countTo
                :start-val="0"
                :end-val="project.numUnits"
                :duration="2000"
              />
            </span>
          </v-col>
          <v-col>
            <v-icon
              small
              left
              class="mr-2 mb-1"
            >
              fa-bug
            </v-icon>
            <span class="subtitle-1 font-weight-bold">Issues</span>
            <span class="title font-weight-bold ml-1">
              <countTo
                :start-val="0"
                :end-val="project.numIssues"
                :duration="2000"
              />
            </span>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-hover>
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
