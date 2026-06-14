import { create } from "zustand";
import { api } from "../api/client.js";
import { todayIsoDate } from "../utils/text.js";

function readSavedAuth() {
  if (typeof window === "undefined" || typeof window.localStorage?.getItem !== "function") {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem("truenote-auth") || "null");
  } catch (_error) {
    return null;
  }
}

function saveAuth(auth) {
  if (typeof window !== "undefined" && typeof window.localStorage?.setItem === "function") {
    window.localStorage.setItem("truenote-auth", JSON.stringify(auth));
  }
}

function clearAuth() {
  if (typeof window !== "undefined" && typeof window.localStorage?.removeItem === "function") {
    window.localStorage.removeItem("truenote-auth");
  }
}

const savedAuth = readSavedAuth();

export const useJournalStore = create((set, get) => ({
  token: savedAuth?.token || "",
  user: savedAuth?.user || null,
  dailyEntry: null,
  realityCheck: null,
  verification: null,
  awarenessTrace: null,
  map: { themes: [], timeline: [] },
  loading: false,
  error: "",

  setError: (error) => set({ error }),

  authenticate: async (mode, payload) => {
    set({ loading: true, error: "" });
    try {
      const result = mode === "register" ? await api.register(payload) : await api.login(payload);
      saveAuth(result);
      set({ token: result.token, user: result.user, loading: false });
      return result;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logout: () => {
    clearAuth();
    set({
      token: "",
      user: null,
      dailyEntry: null,
      realityCheck: null,
      verification: null,
      awarenessTrace: null,
      map: { themes: [], timeline: [] }
    });
  },

  loadToday: async () => {
    const { token } = get();
    if (!token) return null;

    set({ loading: true, error: "" });
    try {
      const result = await api.getToday(token);
      set({ dailyEntry: result.dailyEntry, loading: false });
      return result.dailyEntry;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  saveDailyDraft: async (rawContent, status = "writing") => {
    const { token, dailyEntry } = get();
    set({ loading: true, error: "" });
    try {
      const payload = {
        date: dailyEntry?.date || todayIsoDate(),
        rawContent,
        status
      };
      const result = dailyEntry
        ? await api.updateDaily(token, dailyEntry.id, payload)
        : await api.saveDaily(token, payload);
      set({ dailyEntry: result.dailyEntry, loading: false });
      return result.dailyEntry;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  saveReality: async (facts) => {
    const { token, dailyEntry } = get();
    const result = await api.saveReality(token, dailyEntry.id, { facts });
    set({ realityCheck: result.realityCheck });
    return result.realityCheck;
  },

  loadReality: async () => {
    const { token, dailyEntry } = get();
    if (!dailyEntry) return null;
    try {
      const result = await api.getReality(token, dailyEntry.id);
      set({ realityCheck: result.realityCheck });
      return result.realityCheck;
    } catch (_error) {
      return null;
    }
  },

  saveVerification: async (payload) => {
    const { token, dailyEntry } = get();
    const result = await api.saveVerification(token, dailyEntry.id, payload);
    set({ verification: result.verification });
    return result.verification;
  },

  loadVerification: async () => {
    const { token, dailyEntry } = get();
    if (!dailyEntry) return null;
    try {
      const result = await api.getVerification(token, dailyEntry.id);
      set({ verification: result.verification });
      return result.verification;
    } catch (_error) {
      return null;
    }
  },

  saveTrace: async (payload) => {
    const { token, dailyEntry } = get();
    const result = await api.saveAwarenessTrace(token, dailyEntry.id, payload);
    set({ awarenessTrace: result.awarenessTrace });
    return result.awarenessTrace;
  },

  loadMap: async () => {
    const { token } = get();
    const result = await api.getMap(token);
    set({ map: result });
    return result;
  }
}));
