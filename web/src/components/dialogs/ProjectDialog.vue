<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      max-width="430px"
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
                id="displayName"
                v-model="displayNameModel"
                label="Display name"
                dense
                outlined
              />
            </v-row>
            <v-row>
              <v-text-field
                id="name"
                v-model="nameModel"
                label="Short name"
                hint="The short name is used as the unique ID within URLs."
                dense
                outlined
                persistent-hint
                append-icon="mdi-auto-fix"
                @click:append="slugifyDisplayName"
              />
            </v-row>
            <v-row class="mt-2">
              <v-text-field
                id="description"
                v-model="descriptionModel"
                label="Description"
                hint="For example a tech stack or something meaningful."
                dense
                outlined
                persistent-hint
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
            :disabled="!displayName || displayName.length < 3"
            text
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
import { defineComponent, computed, ref } from '@vue/composition-api';
import slug from 'slug';
export default defineComponent({
  name: 'ProjectDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    heading: {
      type: String,
      default: 'New Project',
    },
    displayName: {
      type: String,
      default: '',
      required: true,
    },
    name: {
      type: String,
      default: '',
      required: true,
    },
    description: {
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
    const descriptionModel = computed({
      get: () => props.description,
      set: val => emit('update:description', val),
    });
    const displayNameModel = computed({
      get: () => props.displayName,
      set: val => emit('update:displayName', val),
    });
    const nameModel = computed({
      get: () => props.name,
      set: val => emit('update:name', val),
    });

    function slugifyDisplayName() {
      nameModel.value = slug(displayNameModel.value);
    }

    return {
      descriptionModel,
      displayNameModel,
      nameModel,
      slugifyDisplayName,
    };
  },
});
</script>