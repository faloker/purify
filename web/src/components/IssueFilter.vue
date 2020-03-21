<template>
  <v-card outlined color="#fafafa">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            v-model="search_term"
            label="Issue text"
            clearable
            dense
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
            dense
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
            dense
            @input="$emit('fp_status', fp_status)"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="closed_status"
            :items="['Yes', 'No']"
            label="Resolved"
            prepend-icon="fa-check"
            clearable
            dense
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
            dense
            @input="$emit('ticket_status', ticket_status)"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="timeback"
            :items="dates"
            item-text="text"
            item-value="value"
            label="Date"
            prepend-icon="mdi-clock-outline"
            clearable
            dense
            @input="$emit('timeback', timeback)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="templates"
            :items="templatesNamesAndTags.names"
            label="Template"
            chips
            dense
            multiple
            clearable
            prepend-icon="mdi-file"
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
            dense
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
      timeback: '',
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
