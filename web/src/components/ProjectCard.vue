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
              :to="{name: 'Units', params: { projectName: project.name }}"
            >
              <span
                class="d-inline-block text-truncate"
                style="max-width: 300px;"
              >{{ project.displayName }}</span>
            </v-btn>
          </div>
          <div
            class="text-center subheading font-weight-light grey--text text-truncate"
          >
            {{ project.description }}
          </div>
          <v-divider class="mt-2" />
          <v-container fluid>
            <v-row dense class="text-center">
              <v-col>
                <p class="display-1 font-weight-black">
                  <countTo
                    :start-val="0"
                    :end-val="project.numIssues"
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
                    :end-val="project.numTickets"
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
                    :end-val="project.numUnits"
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
            v-permission="['owner', 'admin']"
            class="edit-btn"
            color="primary"
            text
            @click.stop="dialog = true"
          >
            Edit
          </v-btn>
          <v-btn
            v-permission="['owner']"
            class="delete-btn"
            color="tertiary"
            text
            @click.stop="confirmDialog = true"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
    <project-dialog
      v-model="dialog"
      heading="Edit Project"
      :name.sync="name"
      :display-name.sync="displayName"
      :description.sync="description"
      @handle-click="editProject"
    />
    <confirm-dialog
      v-model="confirmDialog"
      title="Delete this project?"
      message="All issues and units will be removed as well. Are you sure you want to continue?"
      @handle-click="deleteProject"
    />
  </div>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import { defineComponent, ref, PropType } from '@vue/composition-api';
import {
  DELETE_PROJECT,
  EDIT_PROJECT,
  SHOW_SUCCESS_MSG,
} from '@/store/actions';
import ProjectDialog from '@/components/dialogs/ProjectDialog.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import { Project } from '@/store/types';
// @ts-ignore
import countTo from 'vue-count-to';
import store from '@/store';

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
    return {
      ...useEditProject(props.project),
      ...useDeleteProject(props.project),
    };
  },
});

function useEditProject(project: Project) {
  const dialog = ref(false);
  const displayName = ref(project.displayName);
  const name = ref(project.name);
  const description = ref(project.description || '');

  async function editProject() {
    store
      .dispatch(EDIT_PROJECT, {
        name: project.name,
        change: {
          name: name.value,
          displayName: displayName.value,
          description: description.value,
        },
      })
      .then(async () => {
        dialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The project has been updated');
      })
      .catch(() => {});
  }

  return {
    dialog,
    name,
    displayName,
    description,
    editProject,
  };
}

function useDeleteProject(project: Project) {
  const confirmDialog = ref(false);

  async function deleteProject() {
    store
      .dispatch(DELETE_PROJECT, project.name)
      .then(async () => {
        confirmDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The project has been deleted');
      })
      .catch(() => {});
  }

  return {
    confirmDialog,
    deleteProject,
  };
}
</script>
