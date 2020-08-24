<template>
  <v-container>
    <v-row justify="space-between" align="center">
      <v-col>
        <p class="text-h4 font-weight-black">
          Users
        </p>
        <p>All the people in your Purify installation.</p>
      </v-col>
      <v-spacer />
      <v-col>
        <v-row class="mx-1">
          <user-dialog
            v-model="createDialog"
            :projects="projects"
            :email.sync="email"
            :role.sync="role"
            :membership.sync="membership"
            :sso-bypass.sync="ssoBypass"
            @handle-click="createUser"
          />
          <v-btn color="primary" @click="createDialog = true">
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
          transition="scale-transition"
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
              <template v-slot:item.role="{ item }">
                <v-chip
                  :color="getColor(item.role)"
                  class="text-capitalize"
                  dark
                >
                  {{ item.role }}
                </v-chip>
              </template>
              <template v-slot:item.membership="{ item }">
                <template v-for="(i, index) in item.membership">
                  <v-chip
                    v-if="index < 3"
                    :key="index"
                    small
                    label
                    class="mx-1"
                  >
                    <span>{{ i }}</span>
                  </v-chip>
                  <span
                    v-if="index === 3"
                    :key="index"
                    small
                    class="grey--text caption mx-1"
                  >(+{{ item.membership.length - 3 }} others)</span>
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
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list>
                    <v-list-item @click="openEditDialog(item)">
                      <v-list-item-title>Edit User</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="resetPassword(item)">
                      <v-list-item-title>Reset Password</v-list-item-title>
                    </v-list-item>
                    <v-divider />
                    <v-list-item @click="openConfirmationDialog(item)">
                      <v-list-item-title>Delete User</v-list-item-title>
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
        <v-dialog v-model="linkDialog" max-width="500">
          <v-card>
            <template v-if="!systemConfig.saml || isPasswordReset">
              <v-card-title>Share login link</v-card-title>
              <v-card-subtitle>To log in, the user will need to follow the link and set a password.</v-card-subtitle>
              <v-card-text>
                <v-text-field
                  id="textToCopy"
                  :value="isPasswordReset ? inviteLink : inviteLink"
                  filled
                  readonly
                  :append-outer-icon="ttcIcon"
                  @click:append-outer="copyText"
                />
              </v-card-text>
            </template>
            <v-template v-else>
              <v-card-title>User has been created</v-card-title>
              <v-card-subtitle>SSO is enabled in your installation, so users have to sign in with your identity provider.</v-card-subtitle>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="quinary"
                  text
                  @click="linkDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-template>
          </v-card>
        </v-dialog>
        <user-dialog
          v-model="editDialog"
          heading="Edit User"
          ok-button-text="Save"
          :projects="projects"
          :name.sync="newName"
          :email.sync="newEmail"
          :role.sync="newRole"
          :membership.sync="newMembership"
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
  },

  setup(props, context) {
    const searchTerm = ref('');
    const loading = ref(true);
    const ttcIcon = ref('mdi-content-copy');
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
        value: 'membership',
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

    onMounted(() => {
      store.dispatch(FETCH_USERS).then(() => {
        loading.value = false;
      });
      store.dispatch(FETCH_PROJECTS);
    });

    function getColor(role: string) {
      switch (role) {
        case 'owner':
          return 'senary';
        case 'admin':
          return 'quaternary';
        case 'user':
          return 'secondary';
        case 'observer':
          return 'quinary';
      }
    }

    function copyText() {
      const ttc = document.querySelector('#textToCopy') as HTMLInputElement;
      ttc!.select();
      document.execCommand('copy');
      ttcIcon.value = 'mdi-check';
    }

    return {
      ...useCreateUser(),
      ...useEditUser(),
      ...useDeleteUser(),
      ttcIcon,
      systemConfig,
      getColor,
      copyText,
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
  const membership = ref([]);
  const inviteLink = ref('');
  const isPasswordReset = ref(false);

  async function createUser() {
    store
      .dispatch(CREATE_USER, {
        email: email.value,
        role: role.value.toLowerCase(),
        membership: membership.value,
        ssoBypass: ssoBypass.value,
      })
      .then(async (link: string) => {
        await store.dispatch(SHOW_SUCCESS_MSG, 'The user has been created');
        createDialog.value = false;
        role.value = email.value = '';
        membership.value = [];

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
    membership,
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
  const newMembership: Ref<string[]> = ref([]);

  async function editUser() {
    store
      .dispatch(EDIT_USER, {
        userId: userId.value,
        email: newEmail.value,
        name: newName.value,
        role: newRole.value.toLowerCase(),
        membership: newMembership.value,
        ssoBypass: newSsoBypass.value,
      })
      .then(async () => {
        await store.dispatch(SHOW_SUCCESS_MSG, 'The user has been updated');
        editDialog.value = false;
        newRole.value = newName.value = newEmail.value = '';
        newMembership.value = [];
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
    newMembership.value = item.membership;
  }

  return {
    editDialog,
    openEditDialog,
    newEmail,
    newRole,
    newName,
    newSsoBypass,
    newMembership,
    editUser,
  };
}
</script>