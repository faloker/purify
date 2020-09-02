<template>
  <v-row justify="center">
    <v-dialog
      v-model="value"
      max-width="500"
      @input="$emit('input', $event.target.value)"
      @click:outside="$emit('input', false)"
      @keydown.esc="$emit('input', false)"
    >
      <v-card>
        <v-card-title>
          Manage Users
          <v-spacer />
          <v-btn color="primary">
            <v-icon left>
              add
            </v-icon>Create User
          </v-btn>
        </v-card-title>
        <v-card-subtitle>
          Manage user permissions in this project. You can also invite new members to the project.
        </v-card-subtitle>
        <v-text-field
          id="search"
          v-model="searchTerm"
          class="mx-2"
          prepend-inner-icon="search"
          label="Filter by name, email or role"
          solo
          dense
          clearable
        />
        <v-skeleton-loader
          :loading="loading"
          transition-group="scale-transition"
          type="list-item-avatar-two-line@3"
        >
          <v-list>
            <v-slide-y-transition
              group
              hide-on-leave
            >
              <v-list-item
                v-for="user in filteredUsers"
                :key="user._id"
              >
                <v-list-item-avatar>
                  <img :src="user.image" alt="ava">
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ user.name }}
                    <v-chip
                      class="mx-2 text-capitalize"
                      :color="getRoleColor(user.role)"
                      x-small
                      dark
                      label
                    >
                      {{ user.role }}
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    v-if="user.memberships.some(m => m.displayName === project.displayName)"
                    outlined
                    color="tertiary"
                    small
                    @click="revokeMembership(user)"
                  >
                    <v-icon left>
                      mdi-account-off-outline
                    </v-icon>Remove
                  </v-btn>
                  <v-btn
                    v-else-if="user.role !== 'owner'"
                    outlined
                    color="secondary"
                    small
                    @click="addMembership(user)"
                  >
                    <v-icon left>
                      add
                    </v-icon>Add
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-slide-y-transition>
          </v-list>
        </v-skeleton-loader>
        <v-divider />
        <v-card-actions>
          <v-btn
            color="quinary"
            text
            @click="$emit('input', false)"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  ComputedRef,
  PropType,
} from '@vue/composition-api';
import { toLower } from 'lodash';
import { getRoleColor } from '@/utils/helpers';
import store from '@/store';
import {
  FETCH_USERS,
  REMOVE_USER,
  SHOW_SUCCESS_MSG,
  ADD_USER,
} from '@/store/actions';
import { User, Project } from '@/store/types';
export default defineComponent({
  name: 'ManageUsersDialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    project: {
      type: Object as PropType<Project>,
      default: () => {},
    },
  },

  setup(props) {
    const searchTerm = ref('');
    const loading = ref(false);
    const roles = ref(['Admin', 'User', 'Observer']);
    const users: ComputedRef<User[]> = computed(() => store.state.users.items);
    const filteredUsers = computed(() =>
      users.value.filter(user => {
        return (
          toLower(user.name).includes(toLower(searchTerm.value)) ||
          toLower(user.role).includes(toLower(searchTerm.value)) ||
          toLower(user.email).includes(toLower(searchTerm.value))
        );
      })
    );

    watch(
      () => props.value,
      newValue => {
        if (newValue === true) {
          store
            .dispatch(FETCH_USERS)
            .then(() => {
              loading.value = false;
            })
            .catch(() => {});
        }
      }
    );

    function revokeMembership(user: User) {
      store
        .dispatch(REMOVE_USER, {
          userId: user._id,
          projectName: (props.project as Project).name,
        })
        .then(async () => {
          await store.dispatch(SHOW_SUCCESS_MSG, 'Membership has been updated');
        })
        .catch(() => {});
    }

    function addMembership(user: User) {
      store
        .dispatch(ADD_USER, {
          userId: user._id,
          projectName: (props.project as Project).name,
        })
        .then(async () => {
          await store.dispatch(SHOW_SUCCESS_MSG, 'Membership has been updated');
        })
        .catch(() => {});
    }

    return {
      searchTerm,
      loading,
      filteredUsers,
      roles,
      getRoleColor,
      revokeMembership,
      addMembership,
    };
  },
});
</script>