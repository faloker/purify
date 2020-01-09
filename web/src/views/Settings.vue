<template>
  <v-card flat height="100%">
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-col>
          <v-list rounded>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-jira</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  Atlassian JIRA
                  <!-- <v-chip
              v-if="credsStatus"
              disabled
              dark
              small
              color="teal darken-1"
            >
              <v-avatar>
                <v-icon>check_circle</v-icon>
              </v-avatar>
              Already set
            </v-chip>
            <v-chip
              v-else
              disabled
              small
              color="red"
            >
              <v-avatar>
                <v-icon>info</v-icon>
              </v-avatar>
              Not set
            </v-chip> -->
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-text>
          <v-form>
            <v-text-field
              v-model="login"
              prepend-icon="person"
              name="login"
              label="E-mail"
              type="text"
            />
            <v-text-field
              id="password"
              v-model="password"
              prepend-icon="lock"
              name="password"
              label="Token"
              type="password"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            color="teal"
            @click="help_dialog = !help_dialog"
          >
            <v-icon>help_outline</v-icon>
            Help
          </v-btn>
          <v-btn
            flat
            color="green"
            @click.native="sendCredentials"
          >
            <v-icon>done</v-icon>
            Done
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
export default {
  name: 'Setting',
  data: () => ({
    dialog: false,
    help_dialog: false,
    login: null,
    password: null,
    credsStatus: false,
  }),
  mounted() {
    this.getCredentials();
  },
  methods: {
    sendCredentials() {
      const creds = {};
      creds.login = this.login;
      creds.password = this.password;
      const promise = JiraService.saveJiraCredentials(JSON.stringify(creds));

      promise.then(() => {
        this.dialog = false;
        Things.showAlert(this, 'JIRA credentials successfully added', 'success');
        this.getCredentials();
      }).catch((error) => {
        Things.showAlert(this, error, 'error');
        console.log(error);
      });
    },
    getCredentials() {
      const promise = JiraService.fetchJiraCredentials();

      promise.then((response) => {
        this.credsStatus = !!response.data.creds;
      }).catch((error) => {
        Things.showAlert(this, `Unable to fetch JIRA credentials ${error}`, 'error');
        console.log(error);
      });
    },
  },
};
</script>

<style scoped>
  #item {
    width: 700px;
  }
</style>
