<template>
  <v-expansion-panels popout>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <template v-slot:default>
          <v-row no-gutters>
            <v-col>
              <v-fade-transition leave-absolute>
                <span
                  v-if="appliedFilters.length === 0"
                  key="0"
                  class="text--secondary"
                >
                  <i>Apply filters</i>
                </span>
                <span v-else key="1">
                  <v-row no-gutters justify="start">
                    <v-chip
                      v-for="(item, index) in appliedFilters"
                      :key="index"
                      class="mx-2"
                      label
                      close
                      @click:close="clearSelection(item)"
                    >
                      <v-icon
                        color="primary"
                        left
                        small
                      >{{ getIcon(item.name) }}</v-icon>
                      <strong class="text-capitalize">{{ item.value }}</strong>
                    </v-chip>
                  </v-row>
                </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card outlined>
          <v-container class="mb-1">
            <v-row justify="start" align="start">
              <v-col cols="2">
                <strong class="text--secondary pl-1">Text search</strong>
                <v-autocomplete
                  id="search"
                  ref="search"
                  v-model="search_term"
                  class="pt-2"
                  :items="keywords"
                  :search-input.sync="search"
                  outlined
                  dense
                  hide-no-data
                  clearable
                  @keydown.esc="onEsc"
                >
                  <template slot="label">
                    <v-icon style="vertical-align: middle">
                      search
                    </v-icon>Press &quot;/&quot; to focus
                  </template>
                </v-autocomplete>
              </v-col>
              <v-divider class="mx-3" vertical />
              <filter-option
                :items="statusFilterItems"
                name="Status"
                :selection.sync="selectedStatuses"
              />
              <v-divider class="mx-3" vertical />
              <filter-option
                :items="riskFilterItems"
                name="Risk"
                :selection.sync="selectedRisks"
              />
              <v-divider class="mx-3" vertical />
              <filter-option
                :items="templateFilterItems"
                name="Template"
                :selection.sync="selectedTemplates"
              />
              <v-divider class="mx-3" vertical />
              <filter-option
                :items="resolutionFilterItems"
                name="Resolution"
                :selection.sync="selectedResolutions"
              />
              <v-divider class="mx-3" vertical />
              <filter-option
                :items="ticketFilterItems"
                name="Ticket"
                :selection.sync="selectedTicketStatus"
              />
            </v-row>
          </v-container>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import { mapGetters } from 'vuex';
import { TEMPLATES_FETCH } from '@/store/actions';
import FilterOption from '@/components/FilterOption.vue';
import { capitalize } from 'lodash';

export default {
  name: 'IssueFilter',
  components: { FilterOption },
  props: {
    keywords: {
      type: Array,
      required: true,
    },
    riskFilterItems: {
      type: Array,
      required: true,
    },
    templateFilterItems: {
      type: Array,
      required: true,
    },
    statusFilterItems: {
      type: Array,
      required: true,
    },
    resolutionFilterItems: {
      type: Array,
      required: true,
    },
    ticketFilterItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      search_term: '',
      search: null,
      timeback: '',
      selectedRisks: [],
      selectedTemplates: [],
      selectedStatuses: ['open'],
      selectedResolutions: [],
      selectedTicketStatus: [],
      dates: [
        {
          text: 'last day',
          value: '1',
        },
        {
          text: 'last 3 days',
          value: '3',
        },
        {
          text: 'last 7 days',
          value: '7',
        },
      ],
    };
  },

  computed: {
    ...mapGetters(['templatesNames', 'templatesTags']),

    appliedFilters() {
      const result = [];

      if (this.search) {
        result.push({ name: 'search', icon: 'short_text', value: this.search });
      }

      if (this.selectedStatuses.length > 0) {
        this.selectedStatuses.forEach((s) =>
          result.push({
            name: 'status',
            value: s,
          })
        );
      }

      if (this.selectedTemplates.length > 0) {
        this.selectedTemplates.forEach((t) =>
          result.push({
            name: 'template',
            value: t,
          })
        );
      }

      if (this.selectedTicketStatus.length > 0) {
        this.selectedTicketStatus.forEach((t) =>
          result.push({
            name: 'ticket',
            value: t,
          })
        );
      }

      if (this.selectedResolutions.length > 0) {
        this.selectedResolutions.forEach((r) =>
          result.push({
            name: 'resolution',
            value: r,
          })
        );
      }

      if (this.selectedRisks.length > 0) {
        this.selectedRisks.forEach((r) =>
          result.push({
            name: 'risk',
            value: r,
          })
        );
      }

      return result;
    },
  },

  watch: {
    // eslint-disable-next-line no-unused-vars
    appliedFilters(newValue, oldValue) {
      this.$emit('filter_update', newValue);
    },
  },

  mounted() {
    this.$store.dispatch(TEMPLATES_FETCH);

    document.onkeydown = (e) => {
      // eslint-disable-next-line no-param-reassign
      e = e || window.event;
      if (
        e.keyCode === 191 && // Forward Slash '/'
        e.target !== this.$refs.search.$refs.input
      ) {
        e.preventDefault();
        this.$refs.search.focus();
      }
    };
  },

  methods: {
    onEsc() {
      this.$refs.search.blur();
    },

    getIcon(name) {
      switch (name) {
        case 'risk':
          return 'fa-bug';
          break;
        case 'resolution':
          return 'mdi-thumbs-up-down';
          break;
        case 'ticket':
          return 'mdi-cards';
          break;
        case 'status':
          return 'mdi-checkbox-marked-circle-outline';
          break;
        case 'template':
          return 'mdi-file';
          break;
        case 'search':
          return 'short_text';
          break;
      }
    },

    clearSelection(item) {
      switch (item.name) {
        case 'risk':
          this.selectedRisks = this.selectedRisks.filter((r) => r !== item.value);
          break;
        case 'template':
          this.selectedTemplates = this.selectedTemplates.filter((t) => t !== item.value);
          break;
        case 'status':
          this.selectedStatuses = this.selectedStatuses.filter((s) => s !== item.value);
          break;
        case 'resolution':
          this.selectedResolutions = this.selectedResolutions.filter((r) => r !== item.value);
          break;
        case 'ticket':
          this.selectedTicketStatus = this.selectedTicketStatus.filter((s) => s !== item.value);
          break;
        case 'search':
          this.search_term = '';
          this.search = '';
          break;
      }
    },
  },
};
</script>
