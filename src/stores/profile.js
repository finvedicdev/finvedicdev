import { defineStore } from 'pinia';
import axios from 'axios'
const baseUrl = (process.env.VUE_APP_CORE_URL || '').replace(/\/$/g, '') + '/';
export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
  }),
  getters: {

  },
  actions: {
    fetchProfile() {
      axios.get(baseUrl + 'api/accounts/2').then(response => {
        this.profile = response.data.data;
      })
    },
  },
});
