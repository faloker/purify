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
                    <v-fade-transition group leave-absolute>
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
                        >{{ getFilterIcon(item.name) }}</v-icon>
                        <strong class="text-capitalize">{{ item.value }}</strong>
                      </v-chip>
                    </v-fade-transition>
                  </v-row>
                </span>
              </v-fade-transition>
            </v-col>
          </v-row>
        </template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-card outlined>
          <v-row
            class="ma-1"
            justify="start"
            align="start"
          >
            <v-col cols="2">
              <strong class="text--secondary pl-1">Text search</strong>
              <v-autocomplete
                id="search"
                v-model="searchTerm"
                class="pt-2"
                :items="keywords"
                :search-input.sync="search"
                outlined
                dense
                hide-no-data
                clearable
              >
                <template slot="label">
                  <v-icon style="vertical-align: middle">
                    search
                  </v-icon>
                </template>
              </v-autocomplete>
            </v-col>
            <v-divider class="mx-2" vertical />
            <filter-option-selector
              :items="statusFilterItems"
              name="Status"
              :selection.sync="selectedStatuses"
            />
            <v-divider class="mx-2" vertical />
            <filter-option-selector
              :items="riskFilterItems"
              name="Risk"
              :selection.sync="selectedRisks"
            />
            <v-divider class="mx-2" vertical />
            <filter-option-selector
              :items="templateFilterItems"
              name="Template"
              :selection.sync="selectedTemplates"
            />
            <v-divider class="mx-2" vertical />
            <filter-option-selector
              :items="resolutionFilterItems"
              name="Resolution"
              :selection.sync="selectedResolutions"
            />
            <v-divider class="mx-2" vertical />
            <filter-option-selector
              :items="ticketFilterItems"
              name="Ticket"
              :selection.sync="selectedTicketStatus"
            />
          </v-row>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  PropType,
  watch,
  Ref,
} from '@vue/composition-api';
import FilterOptionSelector from '@/components/FilterOptionSelector.vue';
import { getFilterIcon } from '@/utils/helpers';
import { FilterOption, FilterValue } from '@/store/types';

export default defineComponent({
  name: 'IssueFilter',

  components: { FilterOptionSelector },

  props: {
    keywords: {
      type: Array as PropType<string[]>,
      required: true,
    },
    riskFilterItems: {
      type: Array as PropType<FilterValue[]>,
      required: true,
    },
    templateFilterItems: {
      type: Array as PropType<FilterValue[]>,
      required: true,
    },
    statusFilterItems: {
      type: Array as PropType<FilterValue[]>,
      required: true,
    },
    resolutionFilterItems: {
      type: Array as PropType<FilterValue[]>,
      required: true,
    },
    ticketFilterItems: {
      type: Array as PropType<FilterValue[]>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const searchTerm = ref('');
    const search = ref('');
    const selectedRisks: Ref<string[]> = ref([]);
    const selectedTemplates: Ref<string[]> = ref([]);
    const selectedStatuses: Ref<string[]> = ref(['open']);
    const selectedResolutions: Ref<string[]> = ref([]);
    const selectedTicketStatus: Ref<string[]> = ref([]);
    const dates = ref([
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
    ]);

    const appliedFilters = computed(() => {
      const result: FilterOption[] = [];

      if (selectedStatuses.value.length > 0) {
        selectedStatuses.value.forEach((s) =>
          result.push({
            name: 'status',
            value: s,
          })
        );
      }

      if (selectedTemplates.value.length > 0) {
        selectedTemplates.value.forEach((t) =>
          result.push({
            name: 'template',
            value: t,
          })
        );
      }

      if (selectedTicketStatus.value.length > 0) {
        selectedTicketStatus.value.forEach((t) =>
          result.push({
            name: 'ticket',
            value: t,
          })
        );
      }

      if (selectedResolutions.value.length > 0) {
        selectedResolutions.value.forEach((r) =>
          result.push({
            name: 'resolution',
            value: r,
          })
        );
      }

      if (selectedRisks.value.length > 0) {
        selectedRisks.value.forEach((r) =>
          result.push({
            name: 'risk',
            value: r,
          })
        );
      }

      return result;
    });

    watch(appliedFilters, (value) => {
      emit('filter_update', value);
    });

    watch(search, (value) => {
      emit('search_term', value);
    });

    function clearSelection(item: FilterOption) {
      switch (item.name) {
        case 'risk':
          selectedRisks.value = selectedRisks.value.filter(
            (r) => r !== item.value
          );
          break;
        case 'template':
          selectedTemplates.value = selectedTemplates.value.filter(
            (t) => t !== item.value
          );
          break;
        case 'status':
          selectedStatuses.value = selectedStatuses.value.filter(
            (s) => s !== item.value
          );
          break;
        case 'resolution':
          selectedResolutions.value = selectedResolutions.value.filter(
            (r) => r !== item.value
          );
          break;
        case 'ticket':
          selectedTicketStatus.value = selectedTicketStatus.value.filter(
            (s) => s !== item.value
          );
          break;
      }
    }

    return {
      searchTerm,
      search,
      appliedFilters,
      selectedResolutions,
      selectedTicketStatus,
      selectedStatuses,
      selectedTemplates,
      selectedRisks,
      clearSelection,
      getFilterIcon,
      dates,
    };
  },
});
</script>
<style scoped>
.sheet-class {
  width: 800px;
  overflow-x: auto;
}
</style>