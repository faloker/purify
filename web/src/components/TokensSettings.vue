<template>
  <v-container
    justify-start
    fill-height
  >
    <v-layout
      column
      class="mt-5"
    >
      <v-flex>
        <v-layout
          row
        >
          <v-flex xs3>
            <div class="headline font-weight-bold">
              JIRA Credentials
            </div>
            <div class="subheading">
              To create tickets in JIRA you need to set credentials
            </div>
          </v-flex>
          <v-flex
            xs4
            class="pl-5"
          >
            <v-layout
              column
            >
              <v-text-field
                label="Email"
                box
                persistent-hint
                hint="Email which you use to login into your JIRA account"
              />
              <v-text-field
                label="API token"
                box
                hint="https://id.atlassian.com/manage/api-tokens"
                persistent-hint
              />
              <v-text-field
                label="User id"
                box
                hint="https://example.jira.com/people/{id}"
                persistent-hint
              />
            </v-layout>
            <v-btn
              class="text-none"
              color="primary"
              dark
            >
              Update profile
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TokensSettings',
  computed: {
    ...mapGetters(['profile']),
  },
};
</script>
