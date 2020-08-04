<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      max-width="400px"
      persistent
      @input="$emit('input', $event.target.value)"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ heading }}</span>
        </v-card-title>
        <v-card-text>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                id="unit-name-input"
                v-model="name"
                outlined
                dense
                label="Unit name"
                clearable
                required
                @input="$emit('update:name', name)"
                @keydown.enter="$emit('handle-click')"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click="$emit('input', false)"
          >
            Close
          </v-btn>
          <v-spacer />
          <v-btn
            color="quinary"
            text
            :disabled="!name || name.length < 3"
            @click="$emit('handle-click')"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  name: 'UnitDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    heading: {
      type: String,
      default: 'New Unit',
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
  },
});
</script>