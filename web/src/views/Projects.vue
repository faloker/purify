<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-col>
        <p class="text-h4 font-weight-black">
          Projects
        </p>
        <p>All projects in your Purify installation.</p>
      </v-col>
      <v-spacer />
      <v-col class="mr-3">
        <v-row align="center" justify="end">
          <v-btn
            v-permission="['owner']"
            color="primary"
            @click.stop="dialog = true"
          >
            <v-icon left>
              add
            </v-icon>Create project
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col>
        <v-text-field
          id="search"
          v-model="searchTerm"
          prepend-inner-icon="search"
          label="Filter by name or description"
          solo
          dense
          clearable
        />
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="table-tbody"
        >
          <v-card outlined>
            <v-data-table
              :headers="headers"
              item-key="_id"
              :items="projects"
              :search="searchTerm"
              :items-per-page="10"
            >
              <template v-slot:item.displayName="{ item }">
                <v-icon
                  class="mb-1"
                  left
                  :color="item.color"
                >
                  mdi-square-rounded
                </v-icon>
                <span>{{ item.displayName }}</span>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu
                  bottom
                  right
                  transition="slide-x-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item @click.stop="openEditDialog(item)">
                      <v-list-item-title>Edit Project</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="openManageDialog(item)">
                      <v-list-item-title>Manage Users</v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item @click.stop="openConfirmationDialog(item)">
                      <v-list-item-title>
                        <strong class="red--text text--lighten-1">Delete Project</strong>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <project-dialog
      v-model="dialog"
      :name.sync="name"
      :display-name.sync="displayName"
      :description.sync="description"
      ok-button-text="Create"
      @handle-click="createProject"
    />
    <project-dialog
      v-model="editDialog"
      heading="Edit Project"
      :name.sync="newName"
      :display-name.sync="newDisplayName"
      :description.sync="newDescription"
      @handle-click="editProject"
    />
    <confirm-dialog
      v-model="confirmDialog"
      title="Delete this project?"
      message="All issues and units will be removed as well. Are you sure you want to continue?"
      @handle-click="deleteProject"
    />
    <manage-users-dialog v-model="manageUsersDialog" :project="projectToManage" />
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
  Ref,
} from '@vue/composition-api';
import store from '@/store';
import ProjectDialog from '@/components/dialogs/ProjectDialog.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import ManageUsersDialog from '@/components/dialogs/ManageUsersDialog.vue';
import {
  FETCH_PROJECTS,
  CREATE_PROJECT,
  EDIT_PROJECT,
  SHOW_SUCCESS_MSG,
  DELETE_PROJECT,
} from '@/store/actions';
import { Project } from '@/store/types';

export default defineComponent({
  name: 'Projects',

  components: { ProjectDialog, ConfirmDialog, ManageUsersDialog },

  setup() {
    const search = ref(null);
    const searchTerm = ref('');
    const loading = ref(true);
    const manageUsersDialog = ref(false);
    const projectToManage: Ref<Project | {}> = ref({});
    const headers = ref([
      {
        text: 'Display Name',
        value: 'displayName',
      },
      { text: 'Name', value: 'name' },
      { text: 'Description', value: 'description' },
      { text: 'Units', value: 'numUnits' },
      { text: 'Users', value: 'numUsers' },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false,
      },
    ]);

    const projects: ComputedRef<Project[]> = computed(
      () => store.state.projects.items
    );

    onMounted(async () => {
      await store
        .dispatch(FETCH_PROJECTS, true)
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
    });

    function openManageDialog(project: Project) {
      manageUsersDialog.value = true;
      projectToManage.value = project;
    }

    return {
      ...useCreateProject(),
      ...useEditProject(),
      ...useDeleteProject(),
      searchTerm,
      openManageDialog,
      manageUsersDialog,
      projectToManage,
      headers,
      projects,
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
      .then(async () => {
        await store.dispatch(SHOW_SUCCESS_MSG, 'The project has been created');
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

function useEditProject() {
  const editDialog = ref(false);
  const newDisplayName = ref('');
  const newName = ref('');
  const newDescription = ref('');
  const projectName = ref('');

  async function editProject() {
    store
      .dispatch(EDIT_PROJECT, {
        name: projectName.value,
        change: {
          name: newName.value,
          displayName: newDisplayName.value,
          description: newDescription.value,
        },
      })
      .then(async () => {
        editDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The project has been updated');
      })
      .catch(() => {});
  }

  function openEditDialog(project: Project) {
    editDialog.value = true;
    projectName.value = project.name;
    newDisplayName.value = project.displayName;
    newName.value = project.name;
    newDescription.value = project.description || '';
  }

  return {
    newDisplayName,
    newDescription,
    editProject,
    editDialog,
    newName,
    openEditDialog,
  };
}

function useDeleteProject() {
  const confirmDialog = ref(false);
  const projectName = ref('');

  function deleteProject() {
    store
      .dispatch(DELETE_PROJECT, projectName.value)
      .then(async () => {
        confirmDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The project has been deleted');
      })
      .catch(() => {});
  }

  function openConfirmationDialog(project: Project) {
    confirmDialog.value = true;
    projectName.value = project.name;
  }

  return {
    confirmDialog,
    openConfirmationDialog,
    deleteProject,
  };
}
</script>
