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
              v-if="systemConfig.registration"
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
                      v-if="systemConfig.saml"
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

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  ComputedRef,
} from '@vue/composition-api';
import { REGISTER, LOGIN } from '@/store/actions';
import { router } from '@/router';
import store from '@/store';
import { SystemConfig } from '@/store/types';

export default defineComponent({
  name: 'Welcome',

  setup() {
    const tabs = ref(null);
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const loading = ref(false);

    const systemConfig: ComputedRef<SystemConfig> = computed(
      () => store.state.system.config
    );

    function register() {
      loading.value = true;
      store
        .dispatch(REGISTER, {
          email: email.value,
          password: password.value,
          username: username.value,
        })
        .then(() => {
          router.push({ name: 'Projects' });
        })
        .catch(() => {
          loading.value = false;
        });
    }

    function login() {
      loading.value = true;
      store
        .dispatch(LOGIN, {
          username: username.value,
          password: password.value,
        })
        .then(() => {
          router.push({ name: 'Projects' });
        })
        .catch(() => {
          loading.value = false;
        });
    }

    return {
      tabs,
      email,
      login,
      loading,
      username,
      password,
      register,
      systemConfig,
    };
  },
});
</script>

<style scoped>
.grey-form {
  background-color: #fafafa;
}
</style>
