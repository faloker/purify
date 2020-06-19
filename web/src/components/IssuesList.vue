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
                @change="selectAll()"
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
        <group-action-btn :items="selected" />
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
            <v-list-item-group v-model="selected" multiple>
              <template v-for="(item, index) in items">
                <v-list-item
                  :key="`issue-${item._id}`"
                  :value="item._id"
                  active-class="primary--text"
                >
                  <template v-slot:default="{ active, toggle }">
                    <v-list-item-action>
                      <v-checkbox
                        :input-value="active"
                        :true-value="item._id"
                        class="my-3 ml-2"
                        color="primary"
                        on-icon="done"
                        @click="toggle"
                      />
                    </v-list-item-action>
                    <v-list-item-icon>
                      <v-icon
                        left
                        class="my-3 pr-4"
                        :color="genColor(item.risk)"
                      >
                        fa-bug
                      </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content @click="openIssue(item)">
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
                        @click="openComments(item)"
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
            :disabled="!(page - 1)"
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
            :disabled="page * pageSize >= rawItems.length"
            @click="nextPage"
          >
            <v-icon large>
              chevron_right
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog v-model="dialog" max-width="56%">
        <issue-details :issue="selectedIssue" />
      </v-dialog>
    </template>
    <template v-else>
      <v-row align="center" justify="center">
        <v-col cols="3">
          <span class="headline grey--text">No issues to display</span>
        </v-col>
      </v-row>
    </template>
    <comment-dialog
      :key="`ilcd-${selectedIssue._id}`"
      :issue-id="selectedIssue._id"
      :dialog.sync="commentDialog"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { GET_COMMENTS } from '@/store/actions';
import GroupActionBtn from '@/components/buttons/GroupActionButton.vue';
import IssueDetails from '@/components/dialogs/IssueDetails.vue';
import CommentDialog from '@/components/dialogs/CommentDialog.vue';
import { matchPattern } from '@//utils/helpers';

export default {
  name: 'IssuesList',

  components: {
    GroupActionBtn,
    IssueDetails,
    CommentDialog,
  },

  props: {
    rawItems: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      page: 1,
      commentDialog: false,
      search: '',
      pageSize: 5,
      sizes: [5, 10, 50],
      pageCount: this.rawItems / this.pageSize,
      selected: [],
      rating: 3,
      dialog: false,
      selectedIssue: {},
    };
  },

  computed: {
    ...mapGetters(['currentUser']),
    items() {
      return this.rawItems.filter(
        (item, index) =>
          index >= (this.page - 1) * this.pageSize && index < this.page * this.pageSize
      );
    },
    allSelected() {
      return this.selected.length === this.pageSize;
    },
  },

  watch: {
    rawItems(newItems, oldItems) {
      this.page = 1;
    },
    pageSize(newValue, oldValue) {
      this.page = 1;
    },
  },

  methods: {
    matchPattern,

    nextPage() {
      if (this.page * this.pageSize < this.rawItems.length) this.page += 1;
    },

    prevPage() {
      if (this.page > 1) this.page -= 1;
    },

    selectAll() {
      if (this.allSelected) {
        this.selected = [];
      } else {
        this.selected = this.items.map((i) => i._id);
      }
    },

    openIssue(item) {
      this.$store.dispatch(GET_COMMENTS, item._id).then(() => {
        this.dialog = true;
        this.selectedIssue = item;
      });
    },

    openComments(item) {
      this.$store.dispatch(GET_COMMENTS, item._id).then(() => {
        this.commentDialog = true;
        this.selectedIssue = item;
      });
    },

    genColor(risk) {
      switch (risk) {
        case 'info':
          return 'light-blue lighten-3';
        case 'low':
          return 'blue';
        case 'medium':
          return 'orange';
        case 'high':
          return 'red';
        case 'critical':
          return 'red darken-4';
        default:
          return 'grey';
      }
    },
  },
};
</script>
<style></style>
