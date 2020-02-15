<template>
  <v-container fluid>
    <template v-if="rawItems.length">
      <v-row
        no-gutters
        align="center"
        justify="start"
      >
        <v-col cols="1">
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
        </v-col>
        <v-divider
          light
          class="my-3"
          vertical
        />
        <v-col cols="3">
          <group-action-btn class="px-3" :items="selected" />
        </v-col>
        <v-spacer></v-spacer>

        <v-col cols="1">
          <v-select
            v-model="pageSize"
            :items="sizes"
            label="Issues per page"
          ></v-select>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-list flat three-line>
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
                        {{ applyPattern(item.fields, item.template.title_pattern) }}
                        <!-- </div> -->
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <!-- <div class="text-truncate"> -->
                        {{ applyPattern(item.fields, item.template.subtitle_pattern) }}
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
                        v-if="item.comments.length"
                        text
                        class="mt-2 mr-3"
                        color="quaternary"
                        @click="openComments(item)"
                      >
                        <v-icon left small>
                          mdi-comment-text-multiple
                        </v-icon>
                        <span>{{ item.comments.length }}</span>
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
      <v-row>
        <v-col cols="12">
          <span class="headline grey--text mx-5">No issues to display</span>
        </v-col>
      </v-row>
    </template>
    <comment-dialog
      :key="`ilcd-${selectedIssue._id}`"
      :issue.sync="selectedIssue"
      :dialog.sync="commentDialog"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import GroupActionBtn from '@/components/buttons/GroupActionButton.vue';
import IssueDetails from '@/components/dialogs/IssueDetails.vue';
import CommentDialog from '@/components/dialogs/CommentDialog.vue';
import { matchPattern, dateDiffInDays } from '@/common/utils.servive';

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
    ...mapGetters(['activePage', 'currentUser']),
    items() {
      return this.rawItems.filter(
        (item, index) => index >= (this.page - 1) * this.pageSize
            && index < this.page * this.pageSize,
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
    applyPattern(obj, template) {
      return matchPattern(obj, template);
    },
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
        this.selected = this.items.map(i => i._id);
      }
    },
    openIssue(item) {
      this.dialog = true;
      this.selectedIssue = item;
    },
    openComments(item) {
      this.commentDialog = true;
      this.selectedIssue = item;
    },
    genColor(risk) {
      switch (risk) {
        case 'Info':
          return 'light-blue lighten-3';
        case 'Low':
          return 'blue';
        case 'Medium':
          return 'orange';
        case 'High':
          return 'red darken-2';
        case 'Critical':
          return 'red darken-4';
        default:
          return 'grey';
      }
    },
  },
};
</script>
<style></style>
