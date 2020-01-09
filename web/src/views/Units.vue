<template>
  <v-card
    flat
    height="100%"
  >
    <v-layout
      wrap
      class="mb-5 pt-5"
    >
      <v-spacer />
      <v-flex
        xs4
        shrink
      >
        <v-text-field
          id="search"
          ref="search"
          v-model="search"
          clearable
          outlined
          @keydown.esc="onEsc"
        >
          <v-template slot="label">
            What about <strong>search</strong> here?
            <v-icon style="vertical-align: middle">
              search
            </v-icon>
          </v-template>
        </v-text-field>
      </v-flex>
      <v-flex shrink>
        <div>
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                icon
                class="mx-3 my-2"
                @click="dialog = true"
                v-on="on"
              >
                <v-icon>mdi-plus-thick</v-icon>
              </v-btn>
            </template>
            <span>Add new unit</span>
          </v-tooltip>
          <v-dialog
            v-model="dialog"
            persistent
            max-width="400px"
          >
            <v-card>
              <v-card-title>
                <span class="headline">New Unit</span>
              </v-card-title>
              <v-card-text>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field
                      v-model="unitName"
                      outlined
                      label="Unit name"
                      clearable
                      required
                    />
                  </v-flex>
                </v-layout>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="red darken-1"
                  rounded
                  text
                  @click="dialog = false"
                >
                  Close
                </v-btn>
                <v-btn
                  color="green darken-1"
                  rounded
                  text
                  outlined
                  @click="createUnit"
                >
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-flex>
      <v-spacer />
    </v-layout>
    <v-container>
      <v-skeleton-loader
        :loading="loading"
        transition="scale-transition"
        type="table-tbody"
      >
        <v-data-table
          :headers="headers"
          :items="filtredItems"
          :search="search"
          item-key="_id"
        >
          <template v-slot:item.name="{ item }">
            <v-btn
              text
              color="primary"
              rounded
              class="text-none"
              :to="{name: 'Issues', params: { slug: item.slug }}"
            >
              {{ item.name }}
            </v-btn>
          </template>

          <template
            v-slot:item.progress="{ item }"
            class="text-center"
          >
            <v-progress-linear
              background-color="blue-grey"
              height="14"
              color="lime"
              striped
              :value="calcProgress(item)"
            />
          </template>
          <template
            v-slot:item.reports="{ item }"
            class="subheading text-center"
          >
            <v-btn
              text
              rounded
              :to="{name: 'Reports', params: { slug: item.slug }}"
            >
              {{ item.reports }}
            </v-btn>
          </template>
        </v-data-table>
      </v-skeleton-loader>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import {
  FETCH_UNITS,
  CREATE_UNIT,
} from '@/store/actions';
import {
  SET_UNITS,
  SET_ACTIVE_PAGE,
} from '@/store/mutations';


export default {
  name: 'Units',
  data() {
    return {
      search: '',
      loading: true,
      dialog: false,
      unitName: '',
      headers: [
        {
          text: 'Name', width: '15%', align: 'center', value: 'name',
        },
        {
          text: 'Progress',
          width: '15%',
          align: 'center',
          value: 'progress',
          sortable: true,
        },
        {
          text: 'Reports', width: '10%', align: 'center', value: 'reports',
        },
        {
          text: 'Last Update', width: '10%', align: 'center', value: 'startDate',
        },
      ],
    };
  },
  computed: {
    ...mapGetters(['activeProject', 'unitsList']),
    filtredItems() {
      return this.unitsList.filter(
        (item) => _.toLower(item.name).includes(_.toLower(this.search)),
      );
    },

  },
  mounted() {
    this.$store.commit(SET_ACTIVE_PAGE, 'Units');
    this.$store.dispatch(FETCH_UNITS, this.$route.params.slug).then(() => { this.loading = false; });

    document.onkeydown = (e) => {
      e = e || window.event;
      if (
        e.keyCode === 191 // Forward Slash '/'
          && e.target !== this.$refs.search.$refs.input
      ) {
        e.preventDefault();
        this.$refs.search.focus();
      } else if (
        e.keyCode === 67 && e.target !== this.$refs.search.$refs.input
      ) { this.dialog = true; }
    };
  },
  methods: {
    selectUnit(item) {
      this.$router.push({ name: 'Issues', params: { slug: item.slug } });
    },

    createUnit() {
      const payload = {
        name: this.unitName,
        project: this.$route.params.slug,
      };

      this.$store.dispatch(CREATE_UNIT, payload);

      this.unitName = '';
      this.dialog = false;
    },
    onEsc() {
      this.$refs.search.blur();
    },
    calcProgress(item) {
      return (item.tickets_len / 100) * item.closed_tickets_len;
    },
  },
};
</script>
