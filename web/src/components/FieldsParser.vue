<template>
  <div>
    <template v-if="isPrintable(ivalue)">
      <div class="headline font-weight-bold">
        {{ parseKey(ikey.key) }}
      </div>
      <v-divider class="my-1" />
      <p v-if="ikey.type === 'text'" style="white-space: pre-line;">
        {{ ivalue }}
      </p>
      <div v-if="ikey.type === 'html'" style="white-space: pre-line;" v-html="ivalue">
        {{ ivalue }}
      </div>
      <div v-if="ikey.type === 'base64'" style="white-space: pre-line;">
        {{ decodeValue(ivalue) }}
      </div>
    </template>
    <template v-else-if="Array.isArray(ivalue)">
      <template v-if="isPrintable(ivalue[0])">
        <div class="headline font-weight-bold">
          {{ parseKey(ikey.key) }}
        </div>
        <v-divider class="my-1" />
        <ul :id="`list-${ikey.key}`" class="ml-2 my-3">
          <li v-for="(item, index) in ivalue" :key="`ai-${index}`" class="subheading">
            {{ item }}
          </li>
        </ul>
      </template>
      <template v-else-if="typeof ivalue[0] === 'object'">
        <div class="headline font-weight-bold">
          {{ parseKey(ikey.key) }}
        </div>
        <v-divider class="my-1" />
        <v-expansion-panel>
          <v-expansion-panel-content v-for="item in ivalue" :key="`${Math.random()}`">
            <template v-slot:header>
              <div class="title">
                Item
              </div>
            </template>
            <v-card v-for="k in Object.keys(item)" :key="`sk-${k}`">
              <v-card-text>
                <fields-parser :ikey="k" :ivalue="item[k]" />
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </template>
    </template>
    <template v-else-if="typeof ivalue === 'object'">
      <v-layout column>
        <v-flex v-for="k in Object.keys(ivalue)" :key="`${Math.random()}-${k}`">
          <fields-parser :ikey="k" :ivalue="ivalue[k]" />
        </v-flex>
      </v-layout>
    </template>
  </div>
</template>
<script>
export default {
  name: "FieldsParser",
  props: ["ikey", "ivalue", "level"],
  methods: {
    getValue(obj, key) {
      return _.get(this.issue.fields, key);
    },
    parseKey(key) {
      const res = key.includes(".") ? key.match(/\.[^.]+$/)[0].replace(".", "") : key;
      return _.capitalize(_.startCase(res));
    },
    isPrintable(obj) {
      return ["string", "boolean", "number"].includes(typeof obj);
    },
    decodeValue(str) {
      return atob(str);
    }
  }
};
</script>
