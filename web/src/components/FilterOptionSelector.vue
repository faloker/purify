<template>
  <v-item-group
    v-model="selectionModel"
    multiple
  >
    <v-sheet
      class="px-2"
      height="150"
      width="160"
    >
      <v-container>
        <v-row align="start">
          <strong class="text--secondary pl-1">{{ name }}</strong>
          <v-spacer />
        </v-row>
        <v-row>
          <v-sheet
            height="100"
            width="250"
            style="overflow-y: scroll;"
            tile
          >
            <template v-for="item in items">
              <v-item
                v-slot:default="{ active, toggle }"
                :key="item.title"
                :value="`${item.title}`"
              >
                <v-progress-linear
                  :value="item.value"
                  :color="active ? 'grey lighten-3' : 'grey lighten-3'"
                  background-color="white"
                  height="25"
                  @click.stop="toggle"
                >
                  <span v-if="!active" class="text--disabled pl-1 text-capitalize">{{ item.title }}</span>
                  <strong v-else class="primary--text pl-1 text-capitalize">{{ item.title }}</strong>
                  <v-spacer />
                  <strong v-if="item.total && active" class="primary--text pr-1">{{ item.total }}</strong>
                  <span
                    v-else-if="item.total && !active"
                    class="text--disabled pr-1"
                  >{{ item.total }}</span>
                </v-progress-linear>
              </v-item>
            </template>
          </v-sheet>
        </v-row>
      </v-container>
    </v-sheet>
  </v-item-group>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
export default defineComponent({
  name: 'FilterOptionSelector',
  props: {
    items: {
      type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    selection: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectionModel = computed({
      get: () => props.selection,
      set: (val) => emit('update:selection', val),
    });

    return { selectionModel };
  },
});
</script>