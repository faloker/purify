<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      max-width="400px"
      @input="$emit('input', $event.target.value)"
      @click:outside="$emit('input', false)"
    >
      <v-card>
        <v-card-title>
          <span>{{ heading }}</span>
        </v-card-title>
        <v-card-text>
          <v-col>
            <v-row>
              <v-text-field
                id="unit-name-input"
                v-model="nameModel"
                label="Unit name"
                clearable
                required
                @keydown.enter="$emit('handle-click')"
              />
            </v-row>
          </v-col>
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
            :disabled="!nameModel || nameModel.length < 3"
            @click="$emit('handle-click')"
          >
            {{ okButtonText }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
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
    okButtonText: {
      type: String,
      default: 'Save',
    },
  },

  setup(props, { emit }) {
    const nameModel = computed({
      get: () => props.name,
      set: val => emit('update:name', val),
    });

    return { nameModel };
  },
});
</script>