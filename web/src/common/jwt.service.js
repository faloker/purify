const TOKEN_KEY = 'token';

export default {
  getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  },

  saveToken(token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  },

  destroyToken() {
    window.localStorage.removeItem(TOKEN_KEY);
  },
};
