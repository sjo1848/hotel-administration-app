import { defineStore } from 'pinia';
import api from '../lib/api';
import { getErrorMessage } from '../lib/errors';

type User = {
  id: string;
  email: string;
  role: string;
  name: string;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null as User | null,
    loading: false,
    error: '',
  }),
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = '';
      try {
        const response = await api.post('/auth/login', { email, password });
        this.token = response.data.accessToken;
        this.user = response.data.user;
        // Access token stays in-memory. Refresh token is HttpOnly cookie.
      } catch (err: unknown) {
        this.error = getErrorMessage(err, 'Error de login');
      } finally {
        this.loading = false;
      }
    },
    async me() {
      if (!this.token) {
        const ok = await this.refresh();
        if (!ok) return;
      }
      try {
        const response = await api.get('/auth/me');
        this.user = response.data;
      } catch {
        this.logout();
      }
    },
    async refresh() {
      try {
        const response = await api.post('/auth/refresh');
        this.token = response.data.accessToken;
        this.user = response.data.user;
        return true;
      } catch {
        this.logout();
        return false;
      }
    },
    logout() {
      api.post('/auth/logout').catch(() => undefined);
      this.token = '';
      this.user = null;
    },
  },
});
