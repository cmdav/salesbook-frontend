// stores/network.js
import { defineStore } from 'pinia';
import { isOnline, listenForNetworkStatusChanges } from '@/isOnline';

export const useNetworkStore = defineStore('network', {
  state: () => ({
    isOnline: true, // Initial network status
  }),
  actions: {
    async checkNetworkStatus() {
      this.isOnline = await isOnline(); // Check if we are online
    },
    listenForChanges() {
      // Listen for network changes and update the state
      listenForNetworkStatusChanges((online) => {
        this.isOnline = online;
      });
    },
  },
});
