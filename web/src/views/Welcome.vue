<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="3" class="mt-12">
        <v-row justify="center">
          <v-img
            src="@/assets/logo_trans.png"
            max-width="200"
            max-height="150"
          ></v-img>
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
            <v-tab id="tab-register" class="title text-none">
              Register
            </v-tab>
            <v-tabs-items v-model="tabs" class="mt-7">
              <v-tab-item>
                <v-form>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-text-field
                      id="username"
                      v-model="username"
                      label="Username"
                      prepend-icon="accessibility_new"
                      required
                    />
                    <v-spacer></v-spacer>
                  </v-row>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-text-field
                      id="password"
                      v-model="password"
                      label="Password"
                      required
                      type="password"
                      prepend-icon="lock"
                    />
                    <v-spacer></v-spacer>
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      class="mt-3"
                      outlined
                      type="submit"
                      color="primary"
                      @click.prevent="login"
                    >
                      Sign In
                    </v-btn>
                  </v-row>
                </v-form>
              </v-tab-item>
              <v-tab-item>
                <v-form>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-text-field
                      id="user"
                      v-model="username"
                      label="Username"
                      prepend-icon="accessibility_new"
                      required
                    />
                    <v-spacer></v-spacer>
                  </v-row>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-text-field
                      id="email"
                      v-model="email"
                      label="Email"
                      required
                      prepend-icon="alternate_email"
                    />
                    <v-spacer></v-spacer>
                  </v-row>
                  <v-row>
                    <v-spacer></v-spacer>
                    <v-text-field
                      id="pass"
                      v-model="password"
                      label="Password"
                      required
                      type="password"
                      prepend-icon="lock"
                    />
                    <v-spacer></v-spacer>
                  </v-row>
                  <v-row justify="center">
                    <v-btn
                      class="mt-3"
                      outlined
                      type="submit"
                      color="primary"
                      @click.prevent="register"
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
