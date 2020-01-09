<template>
  <!-- <v-container fluid>
    <v-row>
      <v-col class="mt-3 text-center">
        <v-btn
          v-for="tab in tabs"
          :key="tab"
          outlined
          class="mx-2"
          @click="currentTab = tab"
        >
          {{ tab }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <transition
          name="fade"
          mode="out-in"
        >
          <keep-alive>
            <component
              :is="currentTabComponent"
            />
          </keep-alive>
        </transition>
      </v-col>
    </v-row>
  </v-container> -->
</template>
<script>
// import { mapGetters } from 'vuex';
// import TabIssues from '@/views/TabIssues.vue';
// import TabReports from '@/views/TabReports.vue';

// export default {
//   name: 'ReleasePage',
//   components: {
//     TabReports,
//     TabIssues,
//   },
//   props: [
//     'releaseId',
//   ],
//   data() {
//     return {
//       currentTab: 'Issues',
//       tabs: ['Issues', 'Reports'],
//     };
//   },
//   computed: {
//     ...mapGetters(['activeRelease']),
//     currentTabComponent() {
//       return `tab-${this.currentTab.toLowerCase()}`;
//     },
//   },
// };
</script>
