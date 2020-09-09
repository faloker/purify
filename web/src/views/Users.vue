<template>
  <v-container>
    <v-row justify="space-between" align="center">
      <v-col>
        <p class="text-h5 font-weight-bold">
          Users
        </p>
        <p>All the people in your Purify installation.</p>
      </v-col>
      <v-spacer />
      <v-col>
        <v-row class="mx-1">
          <user-dialog
            v-model="createDialog"
            :roles="['Owner', 'Admin', 'User', 'Observer']"
            :projects="projects"
            :email.sync="email"
            :role.sync="role"
            :memberships.sync="memberships"
            :sso-bypass.sync="ssoBypass"
            @handle-click="createUser"
          />
          <v-btn
            v-permission="['owner']"
            color="primary"
            @click.stop="createDialog = true"
          >
            <v-icon left>
              add
            </v-icon>Create user
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-divider />
    <v-row>
      <v-col>
        <v-text-field
          id="search"
          v-model="searchTerm"
          prepend-inner-icon="search"
          label="Filter by name, email or role..."
          solo
          dense
          clearable
        />
        <v-skeleton-loader
          :loading="loading"
          transition="slide-y-transition"
          type="table-tbody"
        >
          <v-card outlined>
            <v-data-table
              :headers="headers"
              item-key="_id"
              :items="users"
              :search="searchTerm"
              :items-per-page="10"
            >
              <template v-slot:item.name="{ item }">
                <v-avatar size="36">
                  <img :src="item.image" alt="ava">
                </v-avatar>
                <span class="ml-3">{{ item.name }}</span>
              </template>
              <template v-slot:item.role="{ item }">
                <v-chip
                  :color="getRoleColor(item.role)"
                  class="text-capitalize"
                  dark
                >
                  {{ item.role }}
                </v-chip>
              </template>
              <template v-slot:item.memberships="{ item }">
                <template v-if="item.role === 'owner'">
                  <v-chip
                    small
                    label
                    class="mx-1"
                  >
                    <span>All Projects</span>
                  </v-chip>
                </template>
                <template v-for="(i, index) in item.memberships" v-else>
                  <v-chip
                    v-if="index < 3"
                    :key="index"
                    small
                    label
                    class="mx-1"
                  >
                    <span>{{ i.displayName }}</span>
                  </v-chip>
                  <span
                    v-if="index === 3"
                    :key="index"
                    small
                    class="grey--text caption mx-1"
                  >(+{{ item.memberships.length - 3 }} others)</span>
                </template>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-menu
                  bottom
                  right
                  transition="slide-x-transition"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-permission="['owner']"
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click.stop="openEditDialog(item)">
                      <v-list-item-title>Edit User</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="resetPassword(item)">
                      <v-list-item-title>Reset Password</v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item @click.stop="openConfirmationDialog(item)">
                      <strong class="red--text text--lighten-1">Delete User</strong>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
          </v-card>
        </v-skeleton-loader>
        <confirm-dialog
          v-model="confirmDialog"
          title="Delete this user?"
          message="Are you sure you want to continue?"
          @handle-click="deleteUser()"
        />
        <invite-link-dialog
          v-model="linkDialog"
          :link="inviteLink"
          :is-password-reset="isPasswordReset"
        />
        <user-dialog
          v-model="editDialog"
          heading="Edit User"
          ok-button-text="Save"
          :roles="['Owner', 'Admin', 'User', 'Observer']"
          :projects="projects"
          :name.sync="newName"
          :email.sync="newEmail"
          :role.sync="newRole"
          :memberships.sync="newMemberships"
          :sso-bypass.sync="newSsoBypass"
          @handle-click="editUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  ComputedRef,
  Ref,
} from '@vue/composition-api';
import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue';
import UserDialog from '@/components/dialogs/UserDialog.vue';
import InviteLinkDialog from '@/components/dialogs/InviteLinkDialog.vue';
import { getRoleColor } from '@/utils/helpers';
import { capitalize } from 'lodash';
import store from '@/store';
import {
  SHOW_SUCCESS_MSG,
  FETCH_USERS,
  FETCH_PROJECTS,
  CREATE_USER,
  DELETE_USER,
  EDIT_USER,
  RESET_USER_PASSWORD,
} from '@/store/actions';
import { User, SystemConfig } from '@/store/types';
export default defineComponent({
  name: 'Users',

  components: {
    ConfirmDialog,
    UserDialog,
    InviteLinkDialog,
  },

  setup(props, context) {
    const searchTerm = ref('');
    const loading = ref(true);
    const headers = ref([
      { text: 'Name', value: 'name' },
      {
        text: 'Email',
        value: 'email',
      },
      {
        text: 'Role',
        value: 'role',
        align: 'center',
      },
      {
        text: 'Projects',
        value: 'memberships',
        align: 'center',
        sortable: false,
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false,
      },
    ]);

    const users = computed(() => store.state.users.items);
    const projects = computed(() => store.state.projects.items);
    const systemConfig: ComputedRef<SystemConfig> = computed(
      () => store.state.system.config
    );

    onMounted(async () => {
      store
        .dispatch(FETCH_USERS)
        .then(() => {
          loading.value = false;
        })
        .catch(() => {});
      await store.dispatch(FETCH_PROJECTS).catch(() => {});
    });

    return {
      ...useCreateUser(),
      ...useEditUser(),
      ...useDeleteUser(),
      systemConfig,
      getRoleColor,
      loading,
      headers,
      searchTerm,
      users,
      projects,
    };
  },
});

function useDeleteUser() {
  const confirmDialog = ref(false);
  const userId = ref('');

  function deleteUser() {
    store
      .dispatch(DELETE_USER, userId.value)
      .then(async () => {
        confirmDialog.value = false;
        await store.dispatch(SHOW_SUCCESS_MSG, 'The user has been deleted');
      })
      .catch(() => {});
  }

  function openConfirmationDialog(item: User) {
    confirmDialog.value = true;
    userId.value = item._id;
  }

  return {
    confirmDialog,
    userId,
    openConfirmationDialog,
    deleteUser,
  };
}

function useCreateUser() {
  const createDialog = ref(false);
  const linkDialog = ref(false);
  const email = ref('');
  const role = ref('');
  const ssoBypass = ref(false);
  const memberships = ref([]);
  const inviteLink = ref('');
  const isPasswordReset = ref(false);

  function createUser() {
    store
      .dispatch(CREATE_USER, {
        email: email.value,
        role: role.value.toLowerCase(),
        memberships: memberships.value,
        ssoBypass: ssoBypass.value,
      })
      .then(async (link: string) => {
        await store.dispatch(SHOW_SUCCESS_MSG, 'The user has been created');
        createDialog.value = false;
        role.value = email.value = '';
        memberships.value = [];

        inviteLink.value = link;
        linkDialog.value = true;
      })
      .catch(() => {});
  }

  function resetPassword(item: User) {
    store
      .dispatch(RESET_USER_PASSWORD, item._id)
      .then(async (link: string) => {
        inviteLink.value = link;
        isPasswordReset.value = true;
        linkDialog.value = true;
      })
      .catch(() => {});
  }

  return {
    createDialog,
    linkDialog,
    email,
    role,
    ssoBypass,
    inviteLink,
    memberships,
    createUser,
    isPasswordReset,
    resetPassword,
  };
}

function useEditUser() {
  const editDialog = ref(false);
  const userId = ref('');
  const newEmail = ref('');
  const newRole = ref('');
  const newName = ref('');
  const newSsoBypass = ref(false);
  const newMemberships: Ref<string[]> = ref([]);

  async function editUser() {
    store
      .dispatch(EDIT_USER, {
        userId: userId.value,
        email: newEmail.value,
        name: newName.value,
        role: newRole.value.toLowerCase(),
        memberships: newMemberships.value,
        ssoBypass: newSsoBypass.value,
      })
      .then(async () => {
        await store.dispatch(SHOW_SUCCESS_MSG, 'The user has been updated');
        editDialog.value = false;
        newRole.value = newName.value = newEmail.value = '';
        newMemberships.value = [];
      })
      .catch(() => {});
  }

  function openEditDialog(item: User) {
    userId.value = item._id;
    editDialog.value = true;
    newEmail.value = item.email;
    newName.value = item.name;
    newRole.value = capitalize(item.role);
    newSsoBypass.value = item.ssoBypass;
    newMemberships.value = item.memberships;
  }

  return {
    editDialog,
    openEditDialog,
    newEmail,
    newRole,
    newName,
    newSsoBypass,
    newMemberships,
    editUser,
  };
}
</script>