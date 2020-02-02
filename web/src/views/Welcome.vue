<template>
  <v-card
    flat
    class="mt-12"
  >
    <v-container class="fill-height">
      <v-row
        align="center"
        justify="center"
        class="mt-12"
      >
        <v-col cols="12">
          <v-row justify="center">
            <img
              src="@/assets/purify-logo.png"
              height="70px"
            >
          </v-row>
          <v-row justify="center">
            <span class="headline mt-4">Welcome to Purify!</span>
          </v-row>
        </v-col>
        <v-col cols="3">
          <v-row
            align="center"
            justify="center"
          >
            <v-tabs
              v-model="tabs"
              fixed-tabs
              slider-color="primary"
            >
              <v-tab
                id="tab-login"
                class="title text-none"
              >
                Login
              </v-tab>
              <v-tab
                id="tab-register"
                class="title text-none"
              >
                Register
              </v-tab>
              <v-tabs-items
                v-model="tabs"
                class="mt-7"
              >
                <v-tab-item>
                  <v-form>
                    <v-layout
                      column
                    >
                      <v-flex>
                        <v-text-field
                          id="username"
                          v-model="username"
                          label="Username"
                          prepend-icon="accessibility_new"
                          required
                        />
                      </v-flex>
                      <v-flex>
                        <v-text-field
                          id="password"
                          v-model="password"
                          label="Password"
                          required
                          type="password"
                          prepend-icon="lock"
                        />
                      </v-flex>
                      <v-flex align-self-center>
                        <v-btn
                          class="mt-3"
                          outlined
                          type="submit"
                          color="primary"
                          @click.prevent="login"
                        >
                          Sign In
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-tab-item>
                <v-tab-item>
                  <v-form>
                    <v-layout
                      column
                    >
                      <v-flex>
                        <v-text-field
                          id="user"
                          v-model="username"
                          label="Username"
                          prepend-icon="accessibility_new"
                          required
                        />
                      </v-flex>
                      <v-flex>
                        <v-text-field
                          id="email"
                          v-model="email"
                          label="Email"
                          required
                          prepend-icon="alternate_email"
                        />
                      </v-flex>
                      <v-flex>
                        <v-text-field
                          id="pass"
                          v-model="password"
                          label="Password"
                          required
                          type="password"
                          prepend-icon="lock"
                        />
                      </v-flex>
                      <v-flex align-self-center>
                        <v-btn
                          class="mt-3"
                          outlined
                          type="submit"
                          color="primary"
                          @click.prevent="register"
                        >
                          Sign Up
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { REGISTER, LOGIN } from '@/store/actions';

export default {
  name: 'Welcome',
  data() {
    return {
      tabs: null,
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    register() {
      this.$store
        .dispatch(REGISTER, {
          email: this.email,
          password: this.password,
          username: this.username,
        })
        .then(() => this.$router.push({ name: 'Projects' }));
    },
    login() {
      this.$store
        .dispatch(LOGIN, {
          username: this.username,
          password: this.password,
        })
        .then(() => this.$router.push({ name: 'Projects' }));
    },
  },
};
</script>

<style scoped>

</style>
