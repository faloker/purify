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
            </v-icon>Search for unit
          </template>
        </v-text-field>
      </v-col>
      <v-col>
        <v-btn
          color="primary"
          text
          @click="dialog = true"
        >
          <v-icon>mdi-pencil</v-icon>Create unit
        </v-btn>
        <v-dialog v-model="dialog" max-width="400px">
          <v-card>
            <v-card-title>
              <span class="title">New Unit</span>
            </v-card-title>
            <v-card-text>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    id="unit-name-input"
                    v-model="unitName"
                    outlined
                    dense
                    label="Unit name"
                    clearable
                    required
                    @keydown.enter="createUnit"
                  />
                </v-flex>
              </v-layout>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="tertiary"
                text
                @click="dialog = false"
              >
                Close
              </v-btn>
              <v-btn
                color="primary"
                text
                :disabled="unitName.length < 3"
                @click="createUnit"
              >
                Create
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
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
            class="elevation-1"
            item-key="_id"
          >
            <template v-slot:item.name="{ item }">
              <v-btn
                text
                color="primary"
                rounded
                class="text-none mr-5"
                :to="{ name: 'Issues', params: { slug: item.slug } }"
              >
                {{ item.name }}
              </v-btn>
            </template>

            <template v-slot:item.progress="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-progress-linear
                    background-color="blue lighten-4"
                    height="14"
                    color="primary"
                    striped
                    :value="calcProgress(item)"
                    v-on="on"
                  />
                </template>
                <span>{{ item.closed_tickets_len }} / {{ item.tickets_len }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.reports="{ item }">
              <v-btn
                text
                rounded
                class="mr-5"
                :to="{ name: 'Reports', params: { slug: item.slug } }"
              >
                {{ item.reports }}
              </v-btn>
            </template>
            <template v-slot:item.action="{ item }" class="text-center">
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
          <span class="title">
            Delete unit
            <b>{{ unitToDelete.name }}</b>?
          </span>
        </v-card-title>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="tertiary"
            text
            @click="deleteUnit(unitToDelete._id)"
          >
            Delete
          </v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import { mapState } from 'vuex';
import { toLower } from 'lodash';
import { FETCH_UNITS, CREATE_UNIT, DELETE_UNIT } from '@/store/actions';
import { SET_ACTIVE_PROJECT } from '@/store/mutations';

export default {
  name: 'Units',
  data() {
    return {
      search: '',
      loading: true,
      confirmDialog: false,
      dialog: false,
      unitToDelete: '',
      unitName: '',
      headers: [
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
          sortable: false,
        },
        {
          text: 'Reports',
          width: '15%',
          align: 'center',
          value: 'reports',
        },
        {
          text: 'Actions',
          width: '15%',
          align: 'center',
          value: 'action',
          sortable: false,
        },
      ],
    };
  },
  computed: {
    ...mapState({
      units: (state) => state.units.units,
    }),
    filtredItems() {
      return this.units.filter((item) => toLower(item.name).includes(toLower(this.search)));
    },
  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PROJECT, this.$route.params.slug);
    this.$store.dispatch(FETCH_UNITS).then(() => {
      this.loading = false;
    });

    document.onkeydown = (e) => {
      // eslint-disable-next-line no-param-reassign
      e = e || window.event;
      if (
        e.keyCode === 191 && // Forward Slash '/'
        e.target !== this.$refs.search.$refs.input &&
        !this.dialog &&
        !this.confirmDialog
      ) {
        e.preventDefault();
        this.$refs.search.focus();
      } else if (
        e.keyCode === 67 &&
        !this.dialog &&
        !this.confirmDialog &&
        e.target !== this.$refs.search.$refs.input
      ) {
        this.dialog = true;
      }
    };
  },
  methods: {
    selectUnit(item) {
      this.$router.push({ name: 'Issues', params: { slug: item.slug } });
    },

    createUnit() {
      this.$store.dispatch(CREATE_UNIT, this.unitName).then(() => {
        this.unitName = '';
        this.dialog = false;
      });
    },
    onEsc() {
      this.$refs.search.blur();
    },
    calcProgress(item) {
      return (item.closed_tickets_len / item.tickets_len) * 100;
    },

    openConfirmationDialog(item) {
      this.confirmDialog = true;
      this.unitToDelete = item;
    },

    deleteUnit(id) {
      this.$store.dispatch(DELETE_UNIT, id).then(() => {
        this.confirmDialog = false;
        this.$toasted.global.api_success({
          msg: 'Removed successfully',
        });
        this.unitToDelete = '';
      });
    },
  },
};
</script>
