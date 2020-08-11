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
      <v-spacer />
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-skeleton-loader
          :loading="loading"
          transition="scale-transition"
          type="table-tbody"
        >
          <v-data-table
            :headers="headers"
            :items="filtredItems"
            :items-per-page="5"
            :search="searchTerm"
            item-key="_id"
          >
            <template v-slot:item.template.name="{ item }">
              <span
                class="d-inline-block text-truncate"
                style="max-width: 130px;"
              >
                {{ item.template.name }}
              </span>
            </template>
            <template v-slot:item.created_at="{ item }">
              <span class="text-none mr-5">{{ formatDate(item.template.created_at) }}</span>
            </template>
            <template v-slot:item.updated_at="{ item }">
              <span class="text-none mr-5">{{ formatDate(item.template.updated_at) }}</span>
            </template>
            <template v-slot:item.action="{ item }" class="text-center">
              <v-btn
                text
                icon
                color="secondary"
                @click="openEditor(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                text
                icon
                color="red darken-1"
                @click="openConfirmationDialog(item)"
              >
                <v-icon>fa-times</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <v-dialog
      v-model="editorDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          color="primary"
          dark
          dense
        >
          <v-btn
            icon
            dark
            @click="closeEditor"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title class="title">
            <b>Template Editor</b>
          </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn text @click="saveChanges()">
              save
              <v-icon right>
                save
              </v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <editor ref="TemplateEditor" v-model="editedTemplate" />
      </v-card>
    </v-dialog>
    <confirm-dialog
      v-model="confirmDialog"
      title="Delete this template?"
      message="Template will be deattached from reports and issues. You will need to apply a new template. Are you sure you want to continue?"
      @handle-click="deleteTemplate()"
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
  Ref,
} from '@vue/composition-api';
import {
  TEMPLATES_FETCH,
  TEMPLATES_EDIT,
  TEMPLATES_DELETE,
  SHOW_SUCCESS_MSG,
} from '@/store/actions';
import { toLower } from 'lodash';
import { formatDate } from '@/utils/helpers';
import Editor from '@/components/Editor.vue';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import store from '@/store';
import { Template, TemplateWithStats } from '@/store/types';

export default defineComponent({
  name: 'Templates',

  components: {
    Editor,
    ConfirmDialog,
  },

  setup() {
    const searchTerm = ref('');
    const loading = ref(false);
    const headers = ref([
      {
        text: 'Name',
        width: '20%',
        align: 'center',
        value: 'template.name',
      },
      {
        text: 'Issues',
        width: '15%',
        align: 'center',
        value: 'issues',
      },
      {
        text: 'Reports',
        width: '15%',
        align: 'center',
        value: 'reports',
      },
      {
        text: 'Created',
        width: '15%',
        align: 'center',
        value: 'created_at',
        sortable: false,
      },
      {
        text: 'Updated',
        width: '15%',
        align: 'center',
        value: 'updated_at',
        sortable: false,
      },
      {
        text: 'Actions',
        width: '25%',
        align: 'center',
        value: 'action',
        sortable: false,
      },
    ]);

    const templates: ComputedRef<TemplateWithStats[]> = computed(
      () => store.state.templates.items
    );

    const filtredItems = computed(() =>
      templates.value.filter(item =>
        toLower(item.template.name).includes(toLower(searchTerm.value))
      )
    );

    onMounted(() => {
      store.dispatch(TEMPLATES_FETCH).then(() => {
        loading.value = false;
      });
    });

    const {
      editorDialog,
      editedTemplate,
      saveChanges,
      openEditor,
      closeEditor,
    } = useEditTemplate();

    const {
      confirmDialog,
      templateToDelete,
      openConfirmationDialog,
      deleteTemplate,
    } = useDeleteTemplate();

    return {
      editorDialog,
      loading,
      filtredItems,
      headers,
      searchTerm,
      editedTemplate,
      saveChanges,
      openEditor,
      closeEditor,
      confirmDialog,
      templateToDelete,
      openConfirmationDialog,
      deleteTemplate,
      formatDate,
    };
  },
});

function useEditTemplate() {
  const editorDialog = ref(false);
  const editedTemplate = ref('');
  const templateToEdit: Ref<Template> | Ref<{}> = ref({});

  function saveChanges() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updated_at, created_at, _id, __v, ...fields } = JSON.parse(
      editedTemplate.value
    );

    store
      .dispatch(TEMPLATES_EDIT, {
        slug: (templateToEdit.value as Template).slug,
        change: fields,
      })
      .then(async () => {
        editorDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The template has been updated');
      });
  }

  function openEditor(item: TemplateWithStats) {
    editorDialog.value = true;
    templateToEdit.value = item.template;
    editedTemplate.value = JSON.stringify(item.template, null, 2);
  }

  function closeEditor() {
    editorDialog.value = false;
  }

  return {
    editorDialog,
    editedTemplate,
    saveChanges,
    openEditor,
    closeEditor,
  };
}

function useDeleteTemplate() {
  const confirmDialog = ref(false);
  const templateToDelete: Ref<Template> | Ref<{}> = ref({});

  function openConfirmationDialog(item: TemplateWithStats) {
    confirmDialog.value = true;
    templateToDelete.value = item.template;
  }

  function deleteTemplate() {
    store
      .dispatch(TEMPLATES_DELETE, (templateToDelete.value as Template).slug)
      .then(async () => {
        confirmDialog.value = false;
        templateToDelete.value = {};

        await store.dispatch(SHOW_SUCCESS_MSG, 'The template has been deleted');
      });
  }

  return {
    confirmDialog,
    templateToDelete,
    openConfirmationDialog,
    deleteTemplate,
  };
}
</script>