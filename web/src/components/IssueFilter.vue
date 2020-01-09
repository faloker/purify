<template>
  <v-card outlined>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            v-model="search_term"
            label="Issue text"
            clearable
            prepend-icon="short_text"
            @input="$emit('search_term', search_term)"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="risk_level"
            :items="severities"
            prepend-icon="fa-bug"
            label="Risk"
            clearable
            @input="$emit('risk_level', risk_level)"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="fp_status"
            :items="['Yes', 'No']"
            label="False Positive"
            prepend-icon="thumbs_up_down"
            clearable
            @input="$emit('fp_status', fp_status)"
          />
        </v-col><v-col>
          <v-select
            v-model="closed_status"
            :items="['Yes', 'No']"
            label="Closed"
            prepend-icon="fa-times"
            clearable
            @input="$emit('closed_status', closed_status)"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="ticket_status"
            :items="['Yes', 'No']"
            label="Ticket"
            prepend-icon="mdi-cards"
            clearable
            @input="$emit('ticket_status', ticket_status)"
          />
        </v-col>
        <!-- <v-flex xs3>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y

              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startDate"
                  label="Start date"
                  prepend-icon="event"
                  readonly
                  clearable
                  v-on="on"
                  @input="$emit('startDate', startDate)"
                />
              </template>
              <v-date-picker
                v-model="startDate"
                color="primary"
                @input="$emit('startDate', startDate)"
              />
            </v-menu>
          </v-flex> -->
        <!-- <v-flex xs3>
            <v-menu
              v-model="menu3"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y

              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="endDate"
                  label="End date"
                  prepend-icon="event"
                  readonly
                  clearable
                  @input="$emit('endDate', endDate)"
                  v-on="on"
                />
              </template>
              <v-date-picker
                v-model="endDate"
                color="primary"
                @input="$emit('endDate', endDate)"
              />
            </v-menu>
          </v-flex> -->
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="templates"
            :items="templatesNamesAndTags.names"
            label="Template"
            chips
            multiple
            clearable
            prepend-icon="fa-file"
            @input="$emit('templates', templates)"
          >
            <template v-slot:selection="data">
              <v-chip
                :input-value="data.selected"
                close
                class="chip--select-multi"
                @click:close="remove(data.item)"
              >
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model="tags"
            :items="templatesNamesAndTags.tags"
            label="Tags"
            chips
            multiple
            clearable
            prepend-icon="mdi-tag-multiple"
            @input="$emit('tags', tags)"
          >
            <template v-slot:selection="data">
              <v-chip
                :input-value="data.selected"
                close
                class="chip--select-multi"
                @click:close="remove(data.item)"
              >
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex';
import { FETCH_TEMPLATES_NAMES } from '@/store/actions';

export default {
  name: 'IssueFilter',
  data() {
    return {
      fp_status: 'No',
      search_term: '',
      ticket_status: '',
      closed_status: 'No',
      startDate: '',
      endDate: '',
      risk_level: '',
      model: null,
      menu2: false,
      menu3: false,
      templates: [],
      tags: [],
      severities: ['Info', 'Low', 'Medium', 'High', 'Critical'],
    };
  },
  computed: {
    ...mapGetters(['templatesNamesAndTags']),
  },
  mounted() {
    this.$store.dispatch(FETCH_TEMPLATES_NAMES);
  },
  methods: {
    remove(item) {
      const index = this.templates.indexOf(item);
      if (index >= 0) this.templates.splice(index, 1);
    },
  },
};
</script>
