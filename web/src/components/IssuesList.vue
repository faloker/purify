<template>
  <v-container fluid>
    <template v-if="rawItems.length">
      <v-row
        no-gutters
        align="center"
        justify="center"
      >
        <div>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-checkbox
                v-model="allSelected"
                color="primary"
                on-icon="done_all"
                class="pl-6"
                v-on="on"
              />
            </template>
            <span v-if="!allSelected">Select All</span>
            <span v-else>Select None</span>
          </v-tooltip>
        </div>
        <v-divider
          light
          class="ma-3"
          vertical
        />
        <group-action-btn :items="selectedIssues" />
        <v-spacer />

        <v-col cols="1">
          <v-select
            v-model="pageSize"
            :items="sizes"
            label="Issues per page"
          />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-list
            flat
            three-line
            class="elevation-1"
          >
            <v-list-item-group v-model="selectedIssues" multiple>
              <template v-for="(item, index) in items">
                <v-list-item
                  :key="`issue-${item._id}`"
                  :value="item._id"
                  active-class="primary--text"
                >
                  <template v-slot:default="{ active }">
                    <v-list-item-action>
                      <div class="my-3 ml-2">
                        <v-checkbox
                          :input-value="active"
                          color="primary"
                          on-icon="done"
                        />
                      </div>
                    </v-list-item-action>
                    <v-list-item-icon>
                      <v-icon
                        left
                        class="my-3 pr-4"
                        :color="getRiskColor(item.risk)"
                      >
                        fa-bug
                      </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content @click="openDialog('issue', item)">
                      <v-list-item-title>
                        <!-- <div class="text-truncate"> -->
                        {{ item.title }}
                        <v-chip
                          v-if="item.status === 'closed'"
                          class="ml-2"
                          small
                        >
                          <span class="text-capitalize">{{ item.resolution }}</span>
                        </v-chip>
                        <!-- </div> -->
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <!-- <div class="text-truncate"> -->
                        {{ item.subtitle }}
                        <!-- </div> -->
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn
                        v-if="item.ticket"
                        outlined
                        class="mt-2 mr-3"
                        rounded
                        color="senary"
                        :href="item.ticket.link"
                        target="_blank"
                      >
                        <v-icon
                          v-if="item.ticket.type == 'jira'"
                          color="senary"
                          left
                        >
                          mdi-jira
                        </v-icon>
                        {{ item.ticket.key }}
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-action>
                      <v-btn
                        v-if="item.totalComments"
                        text
                        class="mt-2 mr-3"
                        color="secondary"
                        @click.stop="openDialog('comment', item)"
                      >
                        <v-icon left small>
                          mdi-comment-text-multiple
                        </v-icon>
                        <span>{{ item.totalComments }}</span>
                      </v-btn>
                    </v-list-item-action>
                  </template>
                </v-list-item>
                <v-divider
                  v-if="index + 1 < items.length"
                  :key="`dvr-${index}`"
                  class="mx-10"
                />
              </template>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
      <v-row class="text-center mt-3">
        <v-col>
          <v-btn
            icon
            :disabled="!(currentPage - 1)"
            @click="prevPage"
          >
            <v-icon large>
              chevron_left
            </v-icon>
          </v-btn>
          <v-chip disabled>
            {{ rawItems.indexOf(items[0]) + 1 }} -
            {{ rawItems.indexOf(items[items.length - 1]) + 1 }} of {{ rawItems.length }}
          </v-chip>
          <v-btn
            icon
            :disabled="currentPage * pageSize >= rawItems.length"
            @click="nextPage"
          >
            <v-icon large>
              chevron_right
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row align="center" justify="center">
        <v-col cols="3">
          <span class="headline grey--text">No issues to display</span>
        </v-col>
      </v-row>
    </template>
    <issue-details-dialog
      :key="`idd-${selectedIssue._id}`"
      v-model="issueDialog"
      :issue="selectedIssue"
    />
    <comment-dialog
      :key="`ilcd-${selectedIssue._id}`"
      v-model="commentDialog"
      :issue-id="selectedIssue._id"
    />
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  Ref,
  computed,
  PropType,
  watch,
  onMounted,
} from '@vue/composition-api';
import store from '@/store';
import { GET_COMMENTS, TEMPLATES_FETCH } from '@/store/actions';
import GroupActionBtn from '@/components/buttons/GroupActionButton.vue';
import IssueDetailsDialog from '@/components/dialogs/IssueDetailsDialog.vue';
import CommentDialog from '@/components/dialogs/CommentDialog.vue';
import { getRiskColor } from '@/utils/helpers';
import { Issue } from '@/store/types';

export default defineComponent({
  name: 'IssuesList',

  components: {
    GroupActionBtn,
    IssueDetailsDialog,
    CommentDialog,
  },

  props: {
    rawItems: {
      type: Array as PropType<Issue[]>,
      required: true,
      default: () => [],
    },
  },

  setup(props) {
    const allSelected = ref(false);
    const selectedIssues: Ref<string[]> = ref([]);
    const { currentPage, pageSize, nextPage, prevPage, sizes } = usePagination(
      props.rawItems
    );

    const items = computed(() => {
      return props.rawItems.filter(
        (item, index) =>
          index >= (currentPage.value - 1) * pageSize.value &&
          index < currentPage.value * pageSize.value
      );
    });

    const totalPages = computed(() =>
      Math.ceil(props.rawItems.length / pageSize.value)
    );

    onMounted(async () => {
      await store.dispatch(TEMPLATES_FETCH);
    });

    watch([ref(props.rawItems), pageSize], () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = 1;
      }
    });

    const {
      commentDialog,
      issueDialog,
      selectedIssue,
      openDialog,
    } = useIssueDetails();

    watch(allSelected, newValue => {
      if (newValue) {
        selectedIssues.value = items.value.map(i => i._id);
      } else {
        selectedIssues.value = [];
      }
    });

    watch(selectedIssues, () => {
      if (!selectedIssues.value.length && allSelected) {
        allSelected.value = false;
      }
    });

    return {
      commentDialog,
      issueDialog,
      selectedIssue,
      openDialog,
      allSelected,
      selectedIssues,
      currentPage,
      totalPages,
      pageSize,
      nextPage,
      prevPage,
      items,
      sizes,
      getRiskColor,
    };
  },
});

function usePagination(items: Issue[]) {
  const currentPage = ref(1);
  const pageSize = ref(5);
  const sizes = ref([5, 10, 50]);

  function nextPage() {
    if (currentPage.value * pageSize.value < items.length) {
      currentPage.value += 1;
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value -= 1;
    }
  }

  return {
    currentPage,
    pageSize,
    nextPage,
    prevPage,
    sizes,
  };
}

function useIssueDetails() {
  const commentDialog = ref(false);
  const issueDialog = ref(false);
  const selectedIssue = ref({});

  async function openDialog(dialogType: string, item: Issue) {
    await store.dispatch(GET_COMMENTS, item._id);
    if (dialogType === 'comment') {
      commentDialog.value = true;
    } else {
      issueDialog.value = true;
    }
    selectedIssue.value = item;
  }

  return {
    commentDialog,
    issueDialog,
    selectedIssue,
    openDialog,
  };
}
</script>
