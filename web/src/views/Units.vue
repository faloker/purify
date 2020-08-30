<template>
  <v-container>
    <v-row>
      <v-spacer />
      <v-col>
        <v-text-field
          id="search"
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
          v-permission="['owner', 'admin']"
          color="primary"
          text
          @click="createDialog = true"
        >
          <v-icon>mdi-pencil</v-icon>Create unit
        </v-btn>
        <unit-dialog
          v-model="createDialog"
          heading="New Unit"
          :display-name.sync="displayName"
          ok-button-text="Create"
          @handle-click="createUnit"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="table-tbody"
        >
          <v-card outlined>
            <v-data-table
              :headers="headers"
              :items="units"
              :items-per-page="5"
              :search="searchTerm"
              item-key="_id"
            >
              <template v-slot:item.name="{ item }">
                <v-btn
                  text
                  color="primary"
                  rounded
                  class="text-none mr-5"
                  :to="{ name: 'Issues', params: { unitName: item.name } }"
                >
                  <span
                    class="d-inline-block text-truncate"
                    style="max-width: 130px;"
                  >{{ item.displayName }}</span>
                </v-btn>
              </template>

              <template v-slot:item.progress="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-progress-linear
                      background-color="blue lighten-4"
                      height="14"
                      color="primary"
                      rounded
                      :value="item.progress"
                      v-on="on"
                    />
                  </template>
                  <span>{{ item.numClosedIssues }} / {{ item.numIssues }}</span>
                </v-tooltip>
              </template>
              <template v-slot:item.numReports="{ item }">
                <v-btn
                  text
                  rounded
                  class="mr-5"
                  :to="{ name: 'Reports', params: { unitName: item.name } }"
                >
                  {{ item.numReports }}
                </v-btn>
              </template>
              <template v-slot:item.action="{ item }" class="text-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-permission="['owner', 'admin']"
                      text
                      icon
                      v-bind="attrs"
                      color="secondary"
                      v-on="on"
                      @click="openEditDialog(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-permission="['owner', 'admin']"
                      text
                      icon
                      color="red darken-1"
                      v-bind="attrs"
                      v-on="on"
                      @click="openConfirmationDialog(item)"
                    >
                      <v-icon>fa-times</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-card>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <confirm-dialog
      v-model="confirmDialog"
      title="Delete this unit?"
      message="All issues will be removed as well. Are you sure you want to continue?"
      @handle-click="deleteUnit()"
    />
    <unit-dialog
      v-model="editDialog"
      heading="Edit Unit"
      :display-name.sync="newDisplayName"
      @handle-click="editUnit"
    />
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
import store from '@/store';
import {
  FETCH_UNITS,
  CREATE_UNIT,
  DELETE_UNIT,
  EDIT_UNIT,
  SHOW_SUCCESS_MSG,
} from '@/store/actions';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import UnitDialog from '@/components/dialogs/UnitDialog.vue';
import { Unit } from '@/store/types';

export default defineComponent({
  name: 'Units',

  components: { ConfirmDialog, UnitDialog },

  setup(props, context) {
    const searchTerm = ref('');
    const loading = ref(true);
    const headers = ref([
      {
        text: 'Name',
        width: '30%',
        align: 'center',
        value: 'name',
      },
      {
        text: 'Progress',
        width: '40%',
        align: 'center',
        value: 'progress',
      },
      {
        text: 'Reports',
        width: '15%',
        align: 'center',
        value: 'numReports',
      },
      {
        text: 'Actions',
        width: '15%',
        align: 'center',
        value: 'action',
        sortable: false,
      },
    ]);

    const units: ComputedRef<Unit[]> = computed(() => store.state.units.items);
    onMounted(() => {
      store
        .dispatch(FETCH_UNITS)
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
    });

    function selectUnit(item: Unit) {
      context.root.$router.push({
        name: 'Issues',
        params: { unitName: item.name },
      });
    }

    return {
      selectUnit,
      units,
      searchTerm,
      loading,
      headers,
      ...useEditUnit(),
      ...useDeleteUnit(),
      ...useCreateUnit(),
    };
  },
});

function useDeleteUnit() {
  const confirmDialog = ref(false);
  const unitName = ref('');

  async function deleteUnit() {
    store
      .dispatch(DELETE_UNIT, unitName.value)
      .then(async () => {
        confirmDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The unit has been deleted');
      })
      .catch(() => {});
  }

  function openConfirmationDialog(item: Unit) {
    confirmDialog.value = true;
    unitName.value = item.name;
  }

  return {
    confirmDialog,
    deleteUnit,
    openConfirmationDialog,
  };
}
function useEditUnit() {
  const editDialog = ref(false);
  const newDisplayName = ref('');
  const name = ref('');

  async function editUnit() {
    store
      .dispatch(EDIT_UNIT, {
        name: name.value,
        displayName: newDisplayName.value,
      })
      .then(async () => {
        editDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The unit has been updated');
      })
      .catch(() => {});
  }

  function openEditDialog(item: Unit) {
    editDialog.value = true;
    name.value = item.name;
    newDisplayName.value = item.displayName;
  }

  return {
    editDialog,
    newDisplayName,
    editUnit,
    openEditDialog,
  };
}

function useCreateUnit() {
  const displayName = ref('');
  const createDialog = ref(false);

  async function createUnit() {
    store
      .dispatch(CREATE_UNIT, {
        displayName: displayName.value,
      })
      .then(() => {
        displayName.value = '';
        createDialog.value = false;
      })
      .catch(() => {});
  }

  return {
    displayName,
    createDialog,
    createUnit,
  };
}
</script>
