<template>
  <v-container>
    <template v-if="rawItems.length">
      <v-row
        v-permission="['owner', 'admin', 'user']"
        no-gutters
        align="center"
        justify="center"
      >
        <v-col cols="10">
          <v-row
            no-gutters
            align="center"
            justify="center"
          >
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
            <v-divider
              light
              class="ma-3"
              vertical
            />
            <group-action-btn :items="selectedIssues" />
            <v-spacer />
            <v-col cols="2">
              <v-select
                v-model="pageSize"
                dense
                outlined
                :items="sizes"
                label="Issues per page"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="10">
          <v-list
            flat
            three-line
            class="elevation-1"
          >
            <v-list-item-group v-model="selectedIssues" multiple>
              <v-slide-y-transition group hide-on-leave>
                <template v-for="(item, index) in items">
                  <v-list-item
                    :key="`issue-${item._id}`"
                    :value="item._id"
                    active-class="primary--text"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-action>
                        <div class="mt-5 ml-2">
                          <v-checkbox
                            :input-value="active"
                            color="primary"
                            on-icon="done"
                          />
                        </div>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title class="subtitle-1 font-weight-bold" @click.stop="openDialog('issue', item)">
                          {{ item.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle class="subtitle-2 my-2" @click.stop="openDialog('issue', item)">
                          {{ item.subtitle }}
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="mt-2">
                          <v-chip
                            outlined
                            label
                            class="mr-2"
                          >
                            <v-icon
                              left
                              :color="getRiskColor(item.risk)"
                            >
                              mdi-fire
                            </v-icon>
                            <span class="text-capitalize">
                              {{ item.risk }}
                            </span>
                          </v-chip>
                          <v-chip
                            v-if="item.status === 'closed'"
                            outlined
                            label
                            class="mr-2"
                          >
                            <v-icon
                              left
                              color="tertiary"
                            >
                              mdi-checkbox-marked-circle
                            </v-icon>
                            <span class="text-capitalize">{{ item.resolution }}</span>
                          </v-chip>
                          <v-chip
                            v-if="item.ticket"
                            class="mr-2"
                            outlined
                            label
                            :href="item.ticket.link"
                            target="_blank"
                          >
                            <v-icon
                              left
                              small
                              color="quinary"
                            >
                              mdi-jira
                            </v-icon>
                            {{ item.ticket.key }}
                          </v-chip>
                          <v-chip
                            v-if="item.totalComments"
                            class="mr-2"
                            outlined
                            label
                            @click.stop="openDialog('comment', item)"
                          >
                            <v-icon left small>
                              mdi-comment-text-multiple
                            </v-icon>
                            <span>{{ item.totalComments }}</span>
                          </v-chip>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                  <v-divider
                    v-if="index + 1 < items.length"
                    :key="`dvr-${index}`"
                    :inset="true"
                  />
                </template>
              </v-slide-y-transition>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-row>
      <v-row class="text-center mt-3">
        <v-col>
          <v-btn
            icon
            :disabled="!(currentPage - 1)"
            @click.stop="prevPage"
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
            @click.stop="nextPage"
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

  setup(props, context) {
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

    watch(
      () => [props.rawItems, pageSize.value],
      () => {
        if (currentPage.value > totalPages.value) {
          currentPage.value = 1;
        }
      }
    );

    const {
      commentDialog,
      issueDialog,
      selectedIssue,
      openDialog,
    } = useIssueDetails();

    onMounted(() => {
      if (context.root.$route.params.issueId) {
        openDialog(
          'issue',
          props.rawItems.find(
            (issue) => issue._id === context.root.$route.params.issueId
          )!
        );
      }
    });

    watch(allSelected, (newValue) => {
      if (newValue) {
        selectedIssues.value = items.value.map((i) => i._id);
      } else {
        selectedIssues.value = [];
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
