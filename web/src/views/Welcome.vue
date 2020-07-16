<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="3" class="mt-12">
        <v-row class="my-4" justify="center">
          <v-img
            src="@/assets/logo_trans.png"
            max-width="110"
            max-height="110"
          />
        </v-row>
        <v-row>
          <v-tabs
            v-model="tabs"
            fixed-tabs
            slider-color="primary"
          >
            <v-tab id="tab-login" class="title text-none">
              Login
            </v-tab>
            <v-tab
              v-if="systemSetup.registration"
              id="tab-register"
              class="title text-none"
            >
              Register
            </v-tab>
            <v-tabs-items v-model="tabs" class="mt-7">
              <v-tab-item>
                <v-form class="grey-form">
                  <v-row>
                    <v-spacer />
                    <v-text-field
                      id="username"
                      v-model="username"
                      label="Username"
                      prepend-icon="accessibility_new"
                      required
                    />
                    <v-spacer />
                  </v-row>
                  <v-row>
                    <v-spacer />
                    <v-text-field
                      id="password"
                      v-model="password"
                      label="Password"
                      required
                      type="password"
                      prepend-icon="lock"
                    />
                    <v-spacer />
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      class="mt-3"
                      outlined
                      type="submit"
                      color="primary"
                      :loading="loading"
                      :disabled="!password || !username"
                      @click.prevent="login()"
                    >
                      Sign In
                    </v-btn>
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      v-if="systemSetup.saml"
                      class="mt-3"
                      outlined
                      type="submit"
                      color="quinary"
                      :href="`${API_URL}/auth/saml`"
                    >
                      Or Login with SSO
                    </v-btn>
                  </v-row>
                </v-form>
              </v-tab-item>
              <v-tab-item>
                <v-form class="grey-form">
                  <v-row>
                    <v-spacer />
                    <v-text-field
                      id="user"
                      v-model="username"
                      label="Username"
                      prepend-icon="accessibility_new"
                      required
                    />
                    <v-spacer />
                  </v-row>
                  <v-row>
                    <v-spacer />
                    <v-text-field
                      id="email"
                      v-model="email"
                      label="Email"
                      required
                      prepend-icon="alternate_email"
                    />
                    <v-spacer />
                  </v-row>
                  <v-row>
                    <v-spacer />
                    <v-text-field
                      id="pass"
                      v-model="password"
                      label="Password"
                      required
                      type="password"
                      prepend-icon="lock"
                    />
                    <v-spacer />
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      class="mt-3"
                      outlined
                      type="submit"
                      color="primary"
                      :loading="loading"
                      :disabled="!email || !password || !username"
                      @click.prevent="register()"
                    >
                      Sign Up
                    </v-btn>
                  </v-row>
                </v-form>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { REGISTER, LOGIN } from '@/store/actions';
import { initSAML } from '@/api/auth.service';

export default {
  name: 'Welcome',
  data() {
    return {
      tabs: null,
      username: '',
      email: '',
      password: '',
      loading: false,
    };
  },
  computed: {
    ...mapState({
      systemSetup: (state) => state.app.setup,
    }),
  },
  methods: {
    register() {
      this.loading = true;
      this.$store
        .dispatch(REGISTER, {
          email: this.email,
          password: this.password,
          username: this.username,
        })
        .then(() => {
          this.$router.push({ name: 'Projects' });
        })
        .catch(() => {
          this.loading = false;
        });
    },

    login() {
      this.loading = true;
      this.$store
        .dispatch(LOGIN, {
          username: this.username,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: 'Projects' });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.grey-form {
  background-color: #fafafa;
}
</style>
