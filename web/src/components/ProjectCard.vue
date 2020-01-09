<template>
  <v-hover>
    <v-card
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 20 : 2}`"
      class="mx-auto my-4"
      width="400"
      :to="{name: 'Units', params: { slug: project.slug }}"
    >
      <!-- <v-sheet
          v-if="!project.chart"
          class="mb-2 mx-auto"
          max-width="calc(100% - 32px)"
        >
          <span class="subheading font-weight-light grey--text">
            Not enough data for chart
          </span>
        </v-sheet> -->
      <v-sheet
        class="v-sheet--offset mx-auto"
        color="primary"
        elevation="12"
        max-width="calc(100% - 32px)"
      >
        <v-sparkline
          :labels="labels"
          :value="values"
          color="white"
          line-width="2"
          padding="16"
        />
      </v-sheet>

      <v-card-text class="text-center">
        <div class="title font-weight-light mb-2">
          {{ project.title }}
        </div>
        <div class="subheading font-weight-light grey--text">
          {{ project.subtitle }}
        </div>
        <v-divider class="mt-2" />
        <v-container>
          <v-row>
            <v-col>
              <p class="display-1 font-weight-black">
                {{ project.units }}
              </p>
              <span class="subheading font-weight-medium">Units</span>
            </v-col>
            <v-col>
              <p class="display-1 font-weight-black">
                {{ project.issues }}
              </p>
              <span class="subheading font-weight-medium">Issues</span>
            </v-col>
            <v-col>
              <p class="display-1 font-weight-black">
                {{ project.tickets }}
              </p>
              <span class="subheading font-weight-medium">Tickets</span>
            </v-col>
          </v-row>
          <v-divider />
          <v-row no-gutters>
            <v-col>
              <span class="caption grey--text font-weight-light ">last update 26 minutes ago</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-hover>
</template>
<script>
import {
  SET_ACTIVE_PROJECT,
} from '@/store/mutations';

export default {
  name: 'ProjectCard',
  props: {
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      labels: [
        '12am',
        '3am',
        '6am',
        '9am',
        '12pm',
        '3pm',
        '6pm',
        '9pm',
      ],
      values: [
        200,
        675,
        410,
        390,
        310,
        460,
        250,
        240,
      ],
    };
  },
  methods: {
    // viewProject() {
    //   this.$store.commit(SET_ACTIVE_PROJECT, this.project);
    //   this.$router.push({ name: 'Releases' });
    // },
  },
};
</script>
<style>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
</style>
