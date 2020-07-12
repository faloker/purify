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
            </v-icon>Search for template
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
            :search="search"
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
    <v-dialog v-model="confirmDialog" max-width="300">
      <v-card>
        <v-card-title>
          <span>Delete template 
            <v-chip
              label
            >
              <span
                class="d-inline-block text-truncate"
                style="max-width: 100px;"
              >
                {{ selectedTemplate.name }}
              </span>
            </v-chip>
            ?
          </span>
        </v-card-title>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="tertiary"
            text
            @click="deleteTemplate()"
          >
            Confirm
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
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
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <template-editor ref="templateEditor" v-model="editedTemplate" />
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import { toLower } from 'lodash';
import { TEMPLATES_FETCH, TEMPLATES_EDIT, TEMPLATES_DELETE } from '@/store/actions';
import TemplateEditor from '@/components/TemplateEditor.vue';
import { formatDate } from '@/utils/helpers';

export default {
  name: 'Templates',
  components: {
    TemplateEditor,
  },
  data() {
    return {
      search: '',
      loading: true,
      confirmDialog: false,
      editorDialog: false,
      selectedTemplate: {},
      editedTemplate: {},
      headers: [
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
      ],
    };
  },
  computed: {
    ...mapState({
      templates: (state) => state.templates.templates,
    }),

    filtredItems() {
      // eslint-disable-next-line max-len
      return this.templates.filter((item) =>
        toLower(item.template.name).includes(toLower(this.search))
      );
    },
  },
  mounted() {
    this.$store.dispatch(TEMPLATES_FETCH).then(() => {
      this.loading = false;
    });
  },
  methods: {
    saveChanges() {
      const rawTemplate = JSON.parse(this.editedTemplate);

      const template = {
        name: rawTemplate.name,
        path_to_issues: rawTemplate.path_to_issues,
        title_fields: rawTemplate.title_fields,
        title_pattern: rawTemplate.title_pattern,
        subtitle_pattern: rawTemplate.subtitle_pattern,
        tags: rawTemplate.tags,
        body_fields: rawTemplate.body_fields,
        internal_comparison_fields: rawTemplate.internal_comparison_fields,
        external_comparison_fields: rawTemplate.external_comparison_fields,
      };

      this.$store
        .dispatch(TEMPLATES_EDIT, { slug: this.selectedTemplate.slug, change: template })
        .then(() => {
          this.editorDialog = false;
          this.selectedTemplate = {};

          this.$toasted.global.api_success({
            msg: 'Update successfull',
          });
        });
    },

    openEditor(item) {
      this.editorDialog = true;
      this.selectedTemplate = item.template;
      this.editedTemplate = JSON.stringify(item.template, null, 2);
    },

    closeEditor() {
      this.editorDialog = false;
      this.selectedTemplate = {};
    },

    openConfirmationDialog(item) {
      this.confirmDialog = true;
      this.selectedTemplate = item.template;
    },

    deleteTemplate() {
      this.$store.dispatch(TEMPLATES_DELETE, this.selectedTemplate.slug).then(() => {
        this.confirmDialog = false;
        this.selectedTemplate = {};

        this.$toasted.global.api_success({
          msg: 'Delete successfull',
        });
      });
    },

    formatDate,
  },
};
</script>