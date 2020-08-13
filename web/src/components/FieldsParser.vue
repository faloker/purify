<template>
  <div>
    <template v-if="isPrintable(ivalue)">
      <div class="headline font-weight-bold">
        {{ parseKey(fieldKey) }}
      </div>
      <v-divider class="my-1" />
      <p v-if="fieldType === 'text'" style="white-space: pre-line;">
        {{ ivalue }}
      </p>
      <div
        v-if="fieldType === 'html'"
        style="white-space: pre-line;"
        v-html="ivalue"
      >
        {{ ivalue }}
      </div>
      <div v-if="fieldType === 'base64'" style="white-space: pre-line;">
        {{ decodeValue(ivalue) }}
      </div>
    </template>
    <template v-else-if="Array.isArray(ivalue)">
      <template v-if="isPrintable(ivalue[0])">
        <div class="headline font-weight-bold">
          {{ parseKey(fieldKey) }}
        </div>
        <v-divider class="my-1" />
        <ul :id="`list-${fieldKey}`" class="ml-2 my-3">
          <li
            v-for="(item, index) in ivalue"
            :key="`ai-${index}`"
            class="subheading"
          >
            {{ item }}
          </li>
        </ul>
      </template>
      <template v-else-if="typeof ivalue[0] === 'object'">
        <div class="headline font-weight-bold">
          {{ parseKey(fieldKey) }}
        </div>
        <v-divider class="my-1" />
        <v-expansion-panels
          multiple
          focusable
          hover
        >
          <!-- eslint-disable-next-line vue/valid-v-for -->
          <v-expansion-panel v-for="(item, index) in ivalue" :key="`${Math.random()}`">
            <v-expansion-panel-header class="title font-weight-bold">
              # {{ index }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-for="k in Object.keys(item)" :key="`sk-${k}`">
                <fields-parser :ikey="k" :ivalue="item[k]" />
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </template>
    </template>
    <template v-else-if="typeof ivalue === 'object'">
      <v-layout column>
        <v-flex v-for="k in Object.keys(ivalue || {})" :key="`${Math.random()}-${k}`">
          <fields-parser :ikey="k" :ivalue="ivalue[k]" />
        </v-flex>
      </v-layout>
    </template>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import { parseKey } from '@/utils/helpers';

export default defineComponent({
  name: 'FieldsParser',
  props: {
    ikey: {
      type: [Object, String],
    },
    ivalue: {
      type: [Object, String],
    },
  },

  setup(props) {
    const fieldKey = computed(() => props.ikey.key || props.ikey);
    const fieldType = computed(() => props.ikey.type || 'text');

    function isPrintable(obj: any) {
      return ['string', 'boolean', 'number'].includes(typeof obj);
    }

    function decodeValue(str: string) {
      return atob(str);
    }

    return {
      fieldKey,
      fieldType,
      isPrintable,
      decodeValue,
      parseKey,
    };
  },
});
</script>
