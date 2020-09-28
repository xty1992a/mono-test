import Vue from "vue";
import vuex from "vuex";
import * as API from "./api.js";
Vue.use(vuex);

export default new vuex.Store({
  state: {
    users: [],
  },
  mutations: {
    SET_USERS: (state, users) => (state.users = users),
  },
  actions: {
    async getUsers({ commit }) {
      const result = await API.getUser();
      if (result.success) {
        commit("SET_USERS", result.data);
      }
      return result;
    },
  },
});
